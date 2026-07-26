import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createHashHistory } from "@tanstack/react-router";
import { getRouter } from "./router";

import "./styles.css";

const router = getRouter({
  history: createHashHistory(),
});

function App() {
  return <RouterProvider router={router} />;
}

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

const rootEl = document.getElementById("root")!;
rootEl.innerHTML = "";
import { createRoot } from "react-dom/client";
createRoot(rootEl).render(<Root />);
