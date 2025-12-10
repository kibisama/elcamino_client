import React from "react";
import AppTheme from "./components/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignIn from "./components/sign-in/SignIn";
import Dashboard from "./components/dashboard/Dashboard";
import { SnackbarProvider } from "notistack";
import { refreshToken } from "./lib/client";
import Deliveries from "./components/dashboard/components/Deliveries";

const App = () => {
  document.title = "Elcamino Pharmacy";
  const navigate = useNavigate();
  React.useEffect(() => {
    const refresh_token = localStorage.getItem("elcamino_client_refresh_token");
    if (refresh_token) {
      (async function () {
        try {
          const result = await refreshToken({ refresh_token });
          const { refresh_token: new_refresh_token, access_token } =
            result.data;
          localStorage.setItem("elcamino_client_access_token", access_token);
          localStorage.setItem(
            "elcamino_client_refresh_token",
            new_refresh_token
          );
          navigate("/dashboard");
        } catch (e) {
          navigate("/signin");
        }
      })();
    } else {
      navigate("/signin");
    }
  }, [navigate]);
  return (
    <AppTheme>
      <CssBaseline enableColorScheme>
        <SnackbarProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="/dashboard/deliveries" element={<Deliveries />} />
            </Route>
          </Routes>
        </SnackbarProvider>
      </CssBaseline>
    </AppTheme>
  );
};

export default App;
