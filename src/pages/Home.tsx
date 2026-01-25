import { Link } from "react-router";
import { routes } from "../routes";

export function Home() {
  return (
    <div>
      <h1>GitHub Pages - Home</h1>
      <p>Hello!</p>
      <Link to={"/test"}>
        <p>Go to the test page.</p>
      </Link>
      <Link to={routes.blog.dnd.builds.trueStrikeRogue}>True Strike Rogue</Link>
    </div>
  );
}
