import React from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import { getUser } from "../../lib/client";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { setUserData } from "../../reduxjs@toolkit/global";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  React.useEffect(() => {
    (async function () {
      try {
        const result = await getUser();
        const { id, name, stationCodes } = result.data;
        dispatch(setUserData({ id, name, stationCodes }));
      } catch (e) {
        navigate("/signin");
      }
    })();
  }, [dispatch, navigate]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        {/* <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        > */}
        {/* <Header /> */}
        <Outlet />
        {/* </Box> */}
      </Box>
    </AppTheme>
  );
}
