import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type SharedProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "text";
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
    const classes = `button button--${variant} ${className}`.trim();

    return (
      <a className={classes} {...linkProps}>
        <span>{children}</span>
        <span aria-hidden="true" className="button__arrow">
          ↗
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
  const classes = `button button--${variant} ${className}`.trim();

  return (
    <button className={classes} {...buttonProps}>
      <span>{children}</span>
      <span aria-hidden="true" className="button__arrow">
        ↗
      </span>
    </button>
  );
}
