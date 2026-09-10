import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";

type SharedProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "navigation" | "solid" | "text";
};

const resolveVariant = (variant: SharedProps["variant"]) => {
  if (variant === "text") return { system: "secondary", legacy: "text" } as const;
  if (variant === "secondary") return { system: "secondary", legacy: "text" } as const;
  if (variant === "navigation") return { system: "navigation", legacy: "solid" } as const;
  return { system: "primary", legacy: "solid" } as const;
};

type LinkButtonProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  if ("href" in props && props.href) {
    const {
      children,
      className = "",
      variant = "solid",
      ...linkProps
    } = props as LinkButtonProps;
    const resolved = resolveVariant(variant);
    const classes = `button button--${resolved.legacy} ${className}`.trim();

    return (
      <a className={classes} data-button-variant={resolved.system} {...linkProps}>
        <span>{children}</span>
        <span aria-hidden="true" className="button__arrow">
          <ArrowIcon />
        </span>
      </a>
    );
  }

  const {
    children,
    className = "",
    variant = "solid",
    ...buttonProps
  } = props as NativeButtonProps;
  const resolved = resolveVariant(variant);
  const classes = `button button--${resolved.legacy} ${className}`.trim();

  return (
    <button className={classes} data-button-variant={resolved.system} {...buttonProps}>
      <span>{children}</span>
      <span aria-hidden="true" className="button__arrow">
        <ArrowIcon />
      </span>
    </button>
  );
}
