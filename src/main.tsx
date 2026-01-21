import "@fontsource/silkscreen";
import "@fontsource/dosis/200.css";
import "@fontsource/dosis/400.css";
import "@fontsource/dosis/700.css";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "@/index.css";

// Root element is guaranteed to exist in index.html
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(<App />);
