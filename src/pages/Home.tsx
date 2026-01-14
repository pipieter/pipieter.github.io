import { Link } from "react-router";

export function Home() {
  return (
    <div>
      <h1>GitHub Pages - Home</h1>
      <p>Hello!</p>
      <Link to={"/test"}>
        <p>Go to the test page.</p>
      </Link>
    </div>
  );
}
