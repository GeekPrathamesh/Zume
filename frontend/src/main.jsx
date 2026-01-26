import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Authprovider } from "./context/Authcontext.jsx";
import { MessageProvider } from "./context/Messagecontext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Authprovider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </Authprovider>
  </BrowserRouter>
);
