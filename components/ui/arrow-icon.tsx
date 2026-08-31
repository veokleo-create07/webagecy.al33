import type { SVGProps } from "react";
import styles from "./arrow-icon.module.css";

type ArrowIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  direction?: "up-right" | "down-right" | "right" | "down";
  /** Scale with the miniature website typography inside project previews. */
  inline?: boolean;
};

const paths = {
  "up-right": "M7 17 17 7M7 7h10v10",
  "down-right": "M7 7 17 17M7 17h10V7",
  right: "M5 12h14m-7-7 7 7-7 7",
  down: "M12 5v14m-7-7 7 7 7-7",
} as const;

export function ArrowIcon({ direction = "up-right", inline = false, className = "", ...props }: ArrowIconProps) {
  return (
    <svg
      {...props}
      className={`${styles.icon}${inline ? ` ${styles.inline}` : ""} ${className}`.trim()}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[direction]} />
    </svg>
  );
}
