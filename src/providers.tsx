import { HeroUIProvider } from "@heroui/react";
import { ChildrenProps } from "./interfaces/children-props";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./stores";
import { Suspense } from "react";
import LazyLoadingPage from "./components/lazy-loading-page";
import { ToastContainer } from "react-toastify";
import ModalControl from "./components/modal-control";

function Providers({ children }: ChildrenProps) {
  return (
    <ReduxProvider store={store}>
      <HeroUIProvider locale="en-GB">
        <Suspense fallback={<LazyLoadingPage />}>
          {children}

          <ModalControl />

          <ToastContainer
            theme="colored"
            autoClose={3000}
            pauseOnHover={false}
            style={{ minWidth: "350px", maxWidth: "500px", width: "max-content" }}
          />
        </Suspense>
      </HeroUIProvider>
    </ReduxProvider>
  );
}

export default Providers;
