import { Box } from "@mui/material";

export default function PortraitContainer({ children }) {
  return (
    <Box
      sx={{
        display: "none",
        "@media print": {
          p: 2,
          m: 0,
          display: "block",
          width: "816px",
          overflow: "hidden",
          // height: "1054px",
          "@page": {
            size: "letter portrait",
          },
        },
      }}
    >
      {children}
    </Box>
  );
}
