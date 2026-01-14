import { createRoot } from "react-dom/client";
import "./index.css";

import { Home } from "./pages/Home.tsx";
import { PageNotFound } from "./pages/404.tsx";
import { HashRouter, Route, Routes } from "react-router";
import { Test } from "./pages/Test.tsx";

createRoot(document.getElementById("root")!).render(
  <HashRouter basename={import.meta.env.BASE_URL}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </HashRouter>
);
