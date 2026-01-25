import { Link } from "react-router";
import { routes } from "../routes";
import { useStyles } from "../hooks/styles";

export function Home() {
  const style = useStyles();

  return (
    <div>
      <h1>
        Hey, my name is{" "}
        <span style={{ color: style.colors.blue }}>Pim Pieters</span>.
      </h1>
      <h1>GitHub Pages - Home</h1>
      <p>Hello!</p>
      <Link to={"/test"}>
        <p>Go to the test page.</p>
      </Link>
      <Link to={routes.blog.dnd.builds.trueStrikeRogue}>True Strike Rogue</Link>
    </div>
  );
}
