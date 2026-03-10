import { Link } from "react-router";
import { useStyles } from "../hooks/styles";
import { LinkButton } from "../components/LinkButton";
import { Mail, Notebook } from "lucide-react";

export function Home() {
  const style = useStyles();

  return (
    <div>
      <div className="home">
        {/* About me section */}
        <div className="home-column">
          {/* Introduction */}
          <div>
            <div style={{ textAlign: "center" }}>
              <img src="/img/me.png" className="profile-picture" width={"200px"} />
            </div>
            <h1>
              Hey, I'm <span style={{ color: style.colors.main }}>Pim Pieters</span>.
            </h1>
            <p style={{ marginLeft: "10px", marginRight: "10px" }}>
              I'm a software developer from Belgium with a Master's Degree in Informatica at the{" "}
              <Link to={"https://www.ugent.be/en"} target="_blank">
                University of Ghent
              </Link>
              . I have a passion for software, with a strong interest in back-end development,
              databases, and performance optimizations. Aside from programming, my hobbies include
              playing video games (particularly with friends), playing tabletops, listening to
              music, and reading.
            </p>
          </div>
          {/* Contact details */}
          <hr style={{ marginTop: "32px", marginBottom: "32px" }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              rowGap: "20px",
              justifyContent: "space-around",
            }}
          >
            <LinkButton to={"https://pipieterblog.wordpress.com/"} width="200px">
              <Notebook size="24px" /> Personal Blog
            </LinkButton>
            <LinkButton to={"mailto:pim@pieters.tv"} width="200px">
              <Mail size={"24px"} />
              Mail
            </LinkButton>

            {/* Social media */}
            <LinkButton
              to={"https://www.linkedin.com/in/pim-pieters-79866014a"}
              color="#007ebb"
              width="200px"
            >
              <i className={"devicon-linkedin-plain"} />
              LinkedIn
            </LinkButton>
            <LinkButton to={"https://github.com/pipieter/"} width="200px">
              <i className={"devicon-github-plain"} />
              GitHub
            </LinkButton>
          </div>
        </div>
        {/* Projects and tech */}
        <div className="home-column">
          {/* Tech stack */}
          <div>
            <h2>Preferred technology</h2>
            <hr />
            <br />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "32px",
                justifyContent: "space-evenly",
              }}
            >
              <i className={`devicon-cplusplus-plain tool-icon`} />
              <i className={`devicon-csharp-plain tool-icon`} />
              <i className={`devicon-java-plain tool-icon`} />
              <i className={`devicon-python-plain tool-icon`} />
              <i className={`devicon-typescript-plain tool-icon`} />
              <i className={`devicon-linux-plain tool-icon`} />
              <i className={`devicon-windows11-plain tool-icon`} />
              <i className={`devicon-docker-plain tool-icon`} />
              <i className={`devicon-vscode-plain tool-icon`} />
              <i className={`devicon-github-plain tool-icon`} />
            </div>
            <br />
          </div>
          {/* Personal projects */}
          <h2>Projects</h2>
          <hr />
          <br />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px auto",
              rowGap: "8px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <Link to="https://github.com/DaFrankort/lenny-dnd-bot" target="_blank">
              Lenny D&D bot
            </Link>
            <span>
              Discord bot to help play tabletop games, and in specific D&D, written in Python.
            </span>

            <Link to="https://github.com/pipieter/neat-headers" target="_blank">
              neat headers
            </Link>
            <span>Collection of single header C++20 libraries.</span>

            <Link to="https://github.com/pipieter/d20distribution" target="_blank">
              d20distribution
            </Link>
            <span>Python library to calculate the distribution of dice rolls.</span>

            <Link to="https://github.com/pipieter/d20js" target="_blank">
              d20js
            </Link>
            <span>
              JavaScript library to simulate and calculate the distribution of dice rolls.
            </span>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}
