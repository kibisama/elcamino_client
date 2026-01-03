import React from "react";
import AppTheme from "./components/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignIn from "./components/sign-in/SignIn";
import Dashboard from "./components/dashboard/Dashboard";
import { SnackbarProvider } from "notistack";
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

  React.useEffect(function checkRefreshToken() {
    const refresh_token = localStorage.getItem("elcamino_client_refresh_token");
    if (refresh_token) {
      navigate("/dashboard/deliveries");
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
