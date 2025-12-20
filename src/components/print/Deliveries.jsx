import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PortraitContainer from "./PortraitContainer";
dayjs.extend(customParseFormat);

const TableCellHeader = ({ children, sx, ...props }) => (
  <TableCell
    sx={{ p: 0, border: "1px solid", ...sx }}
    align="center"
    {...props}
  >
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0,
      }}
    >
      {children}
    </Typography>
  </TableCell>
);
const TableCellBody = ({ children, sx, ...props }) => (
  <TableCell
    sx={{ py: "1px", px: "4px", border: "none", overflow: "hidden", ...sx }}
    align="right"
    {...props}
  >
    <Typography
      sx={{
        fontSize: 11,
        letterSpacing: 0,
      }}
    >
      {children}
    </Typography>
  </TableCell>
);

export default function DeliveryReceipt({ date, station, data }) {
  const day = dayjs(date, "MMDDYYYY");

  return (
    <PortraitContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Roboto",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 0,
          }}
        >
          {day.format("MM/DD/YYYY") + " "}
          {station} Med List
        </Typography>
      </div>
      <TableContainer component="div">
        <Table>
          <TableHead>
            <TableRow>
              <TableCellHeader sx={{ width: "8%" }}>Time</TableCellHeader>
              <TableCellHeader sx={{ width: "10%" }}>Rx Date</TableCellHeader>
              <TableCellHeader sx={{ width: "8%" }}>Rx Number</TableCellHeader>
              <TableCellHeader sx={{ width: "30%" }}>Patient</TableCellHeader>
              <TableCellHeader sx={{ width: "36%" }}>
                Description
              </TableCellHeader>
              <TableCellHeader sx={{ width: "8%" }}>Qty</TableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((v) => (
              <TableRow key={v.id}>
                <TableCellBody>{dayjs(v.time).format("hh:mm")}</TableCellBody>
                <TableCellBody>
                  {dayjs(v.rxDate).format("M/D/YYYY")}
                </TableCellBody>
                <TableCellBody>{v.rxNumber}</TableCellBody>
                <TableCellBody align="left">{v.patient}</TableCellBody>
                <TableCellBody align="left">{v.drugName}</TableCellBody>
                <TableCellBody>{v.rxQty}</TableCellBody>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PortraitContainer>
  );
}
