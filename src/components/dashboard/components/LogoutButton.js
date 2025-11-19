import React from "react";
import MenuButton from "./MenuButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export default function LogoutButton() {
  const handleClick = React.useCallback(() => {}, []);
  return (
    <MenuButton
      aria-label="Open menu"
      onClick={handleClick}
      sx={{ borderColor: "transparent" }}
    >
      {" "}
      <LogoutRoundedIcon fontSize="small" />
    </MenuButton>
  );
}
