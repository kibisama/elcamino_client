import React from "react";
import Box from "@mui/material/Box";
import AppNavbar from "./components/AppNavbar";
import SideMenu from "./components/SideMenu";
import { get } from "../../lib/api";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { setUserData } from "../../reduxjs@toolkit/global";
import useSWR from "swr";

export default function Dashboard(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, error } = useSWR("user/info", get);
  if (!data || error) {
    return navigate("/signin");
  }

  const { id, name, stationCodes } = data;
  dispatch(setUserData({ id, name, stationCodes }));

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
