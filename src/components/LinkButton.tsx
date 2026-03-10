import type { JSX } from "react";
import { Link } from "react-router";
import { useStyles } from "../hooks/styles";

export function LinkButton(props: {
  to: string;
  color?: string;
  width?: string;
  children?: (JSX.Element | JSX.Element[] | string)[];
}) {
  const style = useStyles();

  return (
    <Link
      to={props.to}
      className="link-button"
      style={{
        width: props.width ?? "fit-content",
        borderColor: props.color ?? style.colors.main,
        fontSize: "20px",
      }}
      target="_blank"
    >
      <span
        style={{
          color: props.color ?? style.colors.main,
          display: "flex",
          gap: "4px",
          alignItems: "center",
        }}
      >
        {props.children}
      </span>
    </Link>
  );
}
