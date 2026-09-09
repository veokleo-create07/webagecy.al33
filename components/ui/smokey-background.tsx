"use client";

import { useEffect, useRef } from "react";
import styles from "./smokey-background.module.css";

const vertexSource = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentSource = `
  precision mediump float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;
  uniform vec3 uColor;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec2 mouse = iMouse * 2.0 - 1.0;
    float time = iTime * 0.12;
    vec2 flow = p;

    for (float i = 1.0; i < 7.0; i++) {
      flow.x += 0.22 / i * cos(i * 1.65 * flow.y + time + mouse.x * 0.34);
      flow.y += 0.18 / i * sin(i * 1.7 * flow.x - time + mouse.y * 0.28);
    }

    float folds = abs(sin(flow.x * 0.72 + flow.y * 0.56 + time));
    float smoke = smoothstep(0.92, 0.12, folds);
    float lowerField = smoothstep(0.08, 0.96, 1.0 - uv.y);
    float focus = 1.0 - smoothstep(0.0, 1.15, distance(uv, vec2(0.52, 0.42)));
    float intensity = smoke * (0.18 + lowerField * 0.64) + focus * 0.1;
    vec3 ink = vec3(0.028, 0.025, 0.038);
    vec3 color = mix(ink, uColor, clamp(intensity, 0.0, 0.72));
    color *= 0.68 + lowerField * 0.36;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function rgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [0, 2, 4].map(index => Number.parseInt(value.slice(index, index + 2), 16) / 255) as [number, number, number];
}

export function SmokeyBackground({ color = "#c2b6ec" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "iResolution");
    const time = gl.getUniformLocation(program, "iTime");
    const mouse = gl.getUniformLocation(program, "iMouse");
    const tint = gl.getUniformLocation(program, "uColor");
    const [r, g, b] = rgb(color);
    gl.uniform3f(tint, r, g, b);

    const pointer = { x: .5, y: .5, targetX: .5, targetY: .5 };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let frame = 0;
    let start = performance.now();

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
    };

    const draw = (now: number) => {
      resize();
      pointer.x += (pointer.targetX - pointer.x) * .035;
      pointer.y += (pointer.targetY - pointer.y) * .035;
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, reduced ? 4 : (now - start) / 1000);
      gl.uniform2f(mouse, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (visible && !reduced) frame = requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
      pointer.targetY = 1 - Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1);
    };
    const resetPointer = () => { pointer.targetX = .5; pointer.targetY = .5; };
    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting;
      if (nextVisible && !visible && !reduced) { start = performance.now(); frame = requestAnimationFrame(draw); }
      visible = nextVisible;
      if (!visible) cancelAnimationFrame(frame);
    });

    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetPointer);
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [color]);

  return <div className={styles.background} aria-hidden="true"><canvas ref={canvasRef} className={styles.canvas} /><div className={styles.veil} /></div>;
}
