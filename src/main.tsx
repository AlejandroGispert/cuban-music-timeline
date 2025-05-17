import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/ads.css";
import "react-datepicker/dist/react-datepicker.css";

createRoot(document.getElementById("root")!).render(<App />);
