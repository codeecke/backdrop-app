import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { MQTTProvider } from "./components/MQTTProvider.tsx";
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    console.log("🆕 Neue Version verfügbar");
  },
  onOfflineReady() {
    console.log("✅ Offline ready");
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <MQTTProvider>
      <App />
    </MQTTProvider>
  </Provider>
);
