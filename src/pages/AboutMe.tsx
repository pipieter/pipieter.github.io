import { ToolIcon } from "../components/ToolIcon";

export function AboutMe() {
  return (
    <div className="blog-content">
      <h1>About me</h1>
      <h2>Languages</h2>
      <p>
        I speak fluent Dutch and English, and I can handle myself in a simple
        conversation in French.
      </p>
      <h2>Technology</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          justifyContent: "space-evenly",
        }}
      >
        <ToolIcon name="C" icon="devicon-c-original colored" />
        <ToolIcon name="C++" icon="devicon-cplusplus-plain colored" />
        <ToolIcon name="C#" icon="devicon-csharp-plain colored" />
        <ToolIcon name="Python" icon="devicon-python-plain colored" />
        <ToolIcon name="Java" icon="devicon-java-plain colored" />
        <ToolIcon name="Rust" icon="devicon-rust-line" />
        <ToolIcon name="Lua" icon="devicon-lua-plain colored" />
        <ToolIcon name="JavaScript" icon="devicon-javascript-plain colored" />
        <ToolIcon name="TypeScript" icon="devicon-typescript-plain colored" />
        <ToolIcon name="HTML5" icon="devicon-html5-plain colored" />
        <ToolIcon name="React" icon="devicon-react-plain colored" />
        <ToolIcon name="Postgres" icon="devicon-postgresql-plain colored" />
        <ToolIcon name="MongoDB" icon="devicon-mongodb-plain colored" />
        <ToolIcon name="Docker" icon="devicon-docker-plain colored" />
        <ToolIcon name="Monogame" icon="devicon-monogame-plain colored" />
      </div>
      <h2>Tools</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          justifyContent: "space-evenly",
        }}
      >
        <ToolIcon name="Debian" icon="devicon-debian-plain colored" />
        <ToolIcon name="Windows 11" icon="devicon-windows11-plain colored" />
        <ToolIcon name="Firefox" icon="devicon-firefox-plain colored" />
        <ToolIcon name="VS Code" icon="devicon-vscode-plain colored" />
        <ToolIcon name="Photoshop" icon="devicon-photoshop-plain colored" />
      </div>
    </div>
  );
}
