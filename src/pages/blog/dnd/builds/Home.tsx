import { Link } from "react-router";
import { routes } from "../../../../routes";

export function Blog_DND_Home() {
  return (
    <div>
      <Link to={routes.blog.dnd.builds.trueStrikeRogue}>True Strike Rogue</Link>
    </div>
  );
}
