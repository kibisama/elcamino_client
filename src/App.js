// import logo from './logo.svg';
// import './App.css';

import AppTheme from "./components/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import SignIn from "./components/sign-in/SignIn";
import { SnackbarProvider } from "notistack";
const App = () => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme>
        <SnackbarProvider>
          <SignIn />
        </SnackbarProvider>
      </CssBaseline>
    </AppTheme>
  );
};

export default App;
