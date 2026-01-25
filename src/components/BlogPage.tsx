import type { JSX } from "react";

export function BlogPage(props: {
  title: string;
  uploaded: Date;
  updated: Date;
  children: JSX.Element | JSX.Element[];
}) {
  const { title, uploaded, updated, children } = props;

  return (
    <div className="blog-content">
      <h1>{title}</h1>
      <p>
        Original upload: {uploaded.toLocaleDateString("en-gb")}
        <br />
        Last updated: {updated.toLocaleDateString("en-gb")}
      </p>
      <div>{children}</div>
    </div>
  );
}
