import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import './theme.css';
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./components/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { NotificationsProvider } from './components/context/NotificationsContext';
import { registerAppWorker } from './lib/push';
import './lib/install';
import { ThemeProvider } from './components/context/ThemeContext';

registerAppWorker().catch(()=>{});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider><HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationsProvider>
          <App />
          <Toaster />
          </NotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider></ThemeProvider>
  </StrictMode>,
);
