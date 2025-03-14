import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import Providers from "./providers";
import "./global.css";
import "react-toastify/dist/ReactToastify.css";
import { FingerprintJSPro, FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import IpGuard from "./authentication/IpGuard.guard";
import SocketIoGuard from "./authentication/Socket_IO.guard";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <FpjsProvider
      loadOptions={{
        apiKey: "efO4LIUiJdrASg8KGgfW",
        region: "ap",
        endpoint: ["https://metrics.okvipcloud.com", FingerprintJSPro.defaultEndpoint],
        scriptUrlPattern:
          "https://metrics.okvipcloud.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js",
      }}
    >
      <Providers>
        <SocketIoGuard>
          <IpGuard>
            <RouterProvider router={routes} />
          </IpGuard>
        </SocketIoGuard>
      </Providers>
    </FpjsProvider>,
  );
} else {
  console.error("Root element not found");
}
