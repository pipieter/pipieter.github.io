import type { JSX } from "react";
import { Link } from "react-router";
import { useStyles } from "../hooks/styles";

export function LinkButton(props: {
  to: string;
  icon?: JSX.Element;
  color?: string;
  width?: string;
  children?: any;
}) {
  const style = useStyles();

  return (
    <Link
      to={props.to}
      className="link-button"
      style={{
        width: props.width ?? "fit-content",
        borderColor: props.color ?? style.colors.blue,
        fontSize: "20px",
      }}
    >
      {props.icon ? <>{props.icon} </> : <></>}
      <span style={{ color: props.color ?? style.colors.blue }}>
        {props.children}
      </span>
    </Link>
  );
}
