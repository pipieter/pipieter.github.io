import { createRoot } from "react-dom/client";
import "./index.css";

import { Home } from "./pages/Home.tsx";
import { PageNotFound } from "./pages/404.tsx";
import { HashRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </HashRouter>
);
