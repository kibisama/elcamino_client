import * as React from "react";
import dayjs from "dayjs";
import { Box, Stack, Select, MenuItem, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PageContainer from "./PageContainer";
import { getDeliveries } from "../../../lib/client";
import { enqueueSnackbar } from "notistack";
import CustomDatePicker from "./CustomDatePicker";
import { useSelector } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";

const rowHeight = 52;

export default function Deliveries() {
  const [rows, setRows] = React.useState([]);
  const [date, setDate] = React.useState(dayjs());
  const [stations, setStations] = React.useState([]);
  const [station, setStation] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { stationCodes } = useSelector((s) => s.global);
  React.useEffect(() => {
    if (stationCodes.length > 0) {
      setStations(stationCodes);
      setStation(stationCodes[0]);
    }
  }, [stationCodes]);

  const getRows = React.useCallback(() => {
    if (date && station) {
      setIsLoading(true);
      (async () => {
        try {
          const { data } = await getDeliveries({
            invoiceCode: station,
            date: date.format("MMDDYYYY"),
          });
          setRows(data);
          console.log(data);
          setIsLoading(false);
        } catch (e) {
          if (e.status !== 404) {
            console.error(e);
            enqueueSnackbar(e.message, { variant: "error" });
          }
          setRows([]);
          setIsLoading(false);
        }
      })();
    }
  }, [date, station]);
  React.useEffect(() => {
    getRows();
  }, [getRows]);

  const columns = React.useMemo(
    () => [
      {
        field: "time",
        headerName: "",
        type: "date",
        headerAlign: "center",
        align: "center",
        valueGetter: (v) => v && new Date(v),
        valueFormatter: (v) => v && dayjs(v).format("hh:mm A"),
        width: 84,
      },
      {
        field: "rxNumber",
        headerName: "Rx #",
        type: "number",
        width: 84,
      },
      {
        field: "rxDate",
        headerName: "Rx Date",
        type: "date",
        valueGetter: (v) => v && new Date(v),
        valueFormatter: (v) => v && dayjs(v).format("M. DD. YY"),
        width: 84,
      },
      {
        field: "patient",
        headerName: "Patient",
        width: 180,
      },
      {
        field: "doctorName",
        headerName: "Prescriber",
        width: 180,
      },
      {
        field: "drugName",
        headerName: "Drug Name",
        flex: 1,
      },
      {
        field: "rxQty",
        headerName: "Qty",
        type: "number",
        width: 60,
      },
      {
        field: "patPay",
        headerName: "Copay",
        type: "number",
        width: 80,
      },
    ],
    []
  );
  const handleChangeDate = React.useCallback((date, context) => {
    if (!context.validationError) {
      if (date) {
        const day = dayjs(date);
        setDate(day);
      } else {
        setDate(null);
      }
    }
  }, []);
  const handleChangeStation = React.useCallback((e) => {
    setStation(e.target.value);
  }, []);

  return (
    <PageContainer
      title="Deliveries"
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            disabled={isLoading}
            size="small"
            aria-label="refresh"
            onClick={getRows}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>
      }
      extraActions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <CustomDatePicker value={date} onChange={handleChangeDate} />
          <Select
            size="small"
            value={station}
            onChange={handleChangeStation}
            name="station"
            sx={{ width: "22ch" }}
          >
            {stations.map((v) => (
              <MenuItem value={v}>{v}</MenuItem>
            ))}
          </Select>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        <DataGrid
          autoPageSize
          columns={columns}
          rows={rows}
          showCellVerticalBorder
          disableColumnMenu
          disableRowSelectionOnClick
          loading={isLoading}
          pageSizeOptions={[]}
          sx={{
            maxHeight: rowHeight * 100,
          }}
          slotProps={{
            loadingOverlay: {
              variant: "circular-progress",
              noRowsVariant: "circular-progress",
            },
            baseIconButton: {
              size: "small",
            },
          }}
        />
      </Box>
    </PageContainer>
  );
}
