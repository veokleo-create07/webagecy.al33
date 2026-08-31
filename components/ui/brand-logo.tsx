import styles from "./brand-logo.module.css";

/** Use the approved chrome KW emblem for brand marks, not a text wordmark. */
export function BrandLogo({ className = "", size = "default", decorative = false }: {
  className?: string;
  size?: "default" | "footer";
  decorative?: boolean;
}) {
  return (
    <span className={`${styles.logo} ${size === "footer" ? styles.footer : ""} ${className}`} aria-hidden={decorative || undefined}>
      <img src="/brand/kreu-chrome-mark.png" alt={decorative ? "" : "Kreu Web"} width={500} height={500} decoding="async" draggable={false} />
    </span>
  );
}
