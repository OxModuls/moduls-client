import "./index.css";
import { Routes, Route } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import RootLayout from "./components/root-layout";
import Home from "./pages/home";
import Token from "./pages/token";
import CreateAgent from "./pages/create-agent";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/agent" element={<Token />} />
          <Route path="/create" element={<CreateAgent />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
