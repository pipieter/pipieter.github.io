import { createRoot } from "react-dom/client";
import "./index.css";

import { Home } from "./pages/Home.tsx";
import { PageNotFound } from "./pages/404.tsx";
import { HashRouter, Route, Routes } from "react-router";
import { routes } from "./routes.ts";
import { Blog_DND_Builds_TrueStrikeRogue } from "./pages/blog/dnd/builds/TrueStrikeRogue.tsx";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Sidebar from "./components/Sidebar.tsx";
import { Blog_DND_Home } from "./pages/blog/dnd/builds/Home.tsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <HashRouter basename={import.meta.env.BASE_URL}>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={routes.blog.dnd.home} element={<Blog_DND_Home />} />
          <Route
            path={routes.blog.dnd.builds.trueStrikeRogue}
            element={<Blog_DND_Builds_TrueStrikeRogue />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Sidebar>
    </HashRouter>
  </ThemeProvider>,
);
