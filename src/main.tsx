import { createRoot } from "react-dom/client";
import "./index.css";

import { Home } from "./pages/Home.tsx";
import { PageNotFound } from "./pages/404.tsx";
import { HashRouter, Route, Routes } from "react-router";
import { routes } from "./routes.ts";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Blog_2026_TrueStrikeRogue } from "./pages/blog/2026/TrueStrikeRogue.tsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <HashRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route
          path={routes.blog.y2026.trueStrikeRogue}
          element={<Blog_2026_TrueStrikeRogue />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </HashRouter>
  </ThemeProvider>,
);
