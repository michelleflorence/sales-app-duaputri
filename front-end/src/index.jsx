import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ContextProvider } from "./contexts/ContextProvider.jsx";
import "./index.css";
import { registerLicense } from "@syncfusion/ej2-base";

// Registering Syncfusion license key
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NHaF1cWWhIYVJwWmFZfVpgd19FZ1ZSQ2YuP1ZhSXxQd0diXn9bdHNXTmJaV0w="
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>
);
