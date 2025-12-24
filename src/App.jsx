import React from "react";
import AppTheme from "./components/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignIn from "./components/sign-in/SignIn";
import Dashboard from "./components/dashboard/Dashboard";
import { SnackbarProvider } from "notistack";
import { post } from "./lib/api";
import useSWRMutation from "swr/mutation";
import Deliveries from "./components/dashboard/components/Deliveries";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./components/dashboard/theme/customizations";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const App = () => {
  document.title = "Elcamino Pharmacy";
  const navigate = useNavigate();
  const { trigger } = useSWRMutation("auth", post);
  React.useEffect(function checkRefreshToken() {
    const refresh_token = localStorage.getItem("elcamino_client_refresh_token");
    if (refresh_token) {
      trigger(
        { refresh_token },
        {
          onSuccess: (data) => {
            const { refresh_token: new_refresh_token, access_token } = data;
            localStorage.setItem("elcamino_client_access_token", access_token);
            localStorage.setItem(
              "elcamino_client_refresh_token",
              new_refresh_token
            );
            navigate("/dashboard/deliveries");
          },
          onError: () => {
            localStorage.removeItem("elcamino_client_access_token");
            localStorage.removeItem("elcamino_client_refresh_token");
            navigate("/signin");
          },
          throwOnError: false,
        }
      );
    } else {
      navigate("/signin");
    }
  }, []);

  return (
    <AppTheme themeComponents={xThemeComponents}>
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
