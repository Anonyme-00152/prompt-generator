import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GeneratorPage from "./pages/GeneratorPage";
import TechniquesPage from "./pages/TechniquesPage";
import ImprovePromptPage from "./pages/ImprovePromptPage";

function Router() {
  return (
    <Switch>
      <Route path={"\x2F"} component={Home} />
      <Route path={"\x2Fgenerator"} component={GeneratorPage} />
      <Route path={"\x2Ftechniques"} component={TechniquesPage} />
      <Route path={"\x2Fimprove"} component={ImprovePromptPage} />
      <Route path={"\x2F404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: 'oklch(0.16 0.026 240)',
                border: '1px solid oklch(0.28 0.035 240)',
                color: 'oklch(0.92 0.005 240)',
              }
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
