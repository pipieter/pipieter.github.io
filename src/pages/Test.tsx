import { Link } from "react-router";

export function Test() {
  return (
    <div>
      <p>This is a test page!</p>
      <Link to={"/"}>
        <p>Go to the home page.</p>
      </Link>
    </div>
  );
}
