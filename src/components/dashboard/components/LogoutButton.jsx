import React from "react";
import MenuButton from "./MenuButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { logout } from "../../../lib/api";

export default function LogoutButton() {
  return (
    <MenuButton
      aria-label="Open menu"
      onClick={logout}
      sx={{ borderColor: "transparent" }}
    >
      <LogoutRoundedIcon fontSize="small" />
    </MenuButton>
  );
}
