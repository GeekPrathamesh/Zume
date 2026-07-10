import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/Authcontext.tsx";
import { MessageProvider } from "./context/Messagecontext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </AuthProvider>
  </BrowserRouter>,
);
