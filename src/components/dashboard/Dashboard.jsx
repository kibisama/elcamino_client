import React from "react";
import Box from "@mui/material/Box";
import AppNavbar from "./components/AppNavbar";
import SideMenu from "./components/SideMenu";
import { get } from "../../lib/api";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { setUserData } from "../../reduxjs@toolkit/global";
import useSWR from "swr";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refresh_token = localStorage.getItem("elcamino_client_refresh_token");
  const { data, error } = useSWR(refresh_token ? "user/info" : null, get);
  React.useEffect(
    function setUser() {
      if (data) {
        const { id, name, stationCodes } = data;
        dispatch(setUserData({ id, name, stationCodes }));
      } else if (error) {
        localStorage.removeItem("elcamino_client_access_token");
        localStorage.removeItem("elcamino_client_refresh_token");
        navigate("/signin");
      }
    },
    [data, error]
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: { md: "row", xs: "column" },
      }}
    >
      <SideMenu />
      <AppNavbar />
      <Outlet />
    </Box>
  );
}
