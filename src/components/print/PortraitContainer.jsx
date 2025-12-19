import { Box } from "@mui/material";

export default function PortraitContainer({ children }) {
  return (
    <Box
      sx={{
        p: 2,
        // width: "100%",
        width: "816px",
        // height: "1054px",
        "@media print": {
          p: 2,
          m: 0,
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
