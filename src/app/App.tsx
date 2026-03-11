import { RouterProvider } from "react-router";
import { ThemeProvider } from "./hooks/useTheme";
import { router } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
