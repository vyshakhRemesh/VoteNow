import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { StudentProvider } from "./context/StudentContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StudentProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StudentProvider>
  </StrictMode>
);
