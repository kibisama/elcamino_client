import React from "react";
import AppTheme from "./components/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import SignIn from "./components/sign-in/SignIn";
import Dashboard from "./components/dashboard/Dashboard";
import { SnackbarProvider } from "notistack";
import { useSelector } from "react-redux";

const App = () => {
  const { user } = useSelector((s) => s.global);
  React.useEffect(() => {
    const refresh_token = localStorage.getItem("elcamino_client_refresh_token");
    refresh_token &&
      (async function () {
        //
      })();
  }, []);
  return (
    <AppTheme>
      <CssBaseline enableColorScheme>
        <SnackbarProvider>
          {user ? <Dashboard user={user} /> : <SignIn />}
        </SnackbarProvider>
      </CssBaseline>
    </AppTheme>
  );
};

export default App;
