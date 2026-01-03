import * as React from "react";
import dayjs from "dayjs";
import { Box, Stack, Select, MenuItem, IconButton } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import PageContainer from "./PageContainer";
import { get } from "../../../lib/api";
import useSWR from "swr";
import { enqueueSnackbar } from "notistack";
import CustomDatePicker from "./CustomDatePicker";
import { useSelector } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import PrintIcon from "@mui/icons-material/Print";
import PrintDeliveries from "../../print/Deliveries";
import { useReactToPrint } from "react-to-print";

const rowHeight = 52;

export default function Deliveries() {
  const apiRef = useGridApiRef();
  const { stationCodes: stations } = useSelector((s) => s.global);
  const [rows, setRows] = React.useState([]);
  const [date, setDate] = React.useState(dayjs());
  const [station, setStation] = React.useState(stations[0] || "");
  const [disabledPrint, setDisabledPrint] = React.useState(true);
  const [print, setPrint] = React.useState(false);

  const contentRef = React.useRef(null);
  const reactToPrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => setPrint(false),
  });

  React.useEffect(
    function setDefaultStation() {
      stations.length > 0 && setStation(stations[0]);
    },
    [stations]
  );

  React.useEffect(
    function handlePrint() {
      print && reactToPrint();
    },
    [print]
  );

  const { data, isLoading, error, mutate } = useSWR(
    station && date instanceof dayjs
      ? `user/deliveries/${station}/${date.format("MMDDYYYY")}`
      : null,
    get
  );
  React.useEffect(
    function handleData() {
      if (error) {
        if (error.status !== 404) {
          enqueueSnackbar(error.message, { variant: "error" });
        }
        setRows([]);
      } else if (data) {
        setRows(data);
      }
    },
    [data, error]
  );

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
  const handleChangeSelectionModel = React.useCallback(
    (selectionModel, details) => {
      if (selectionModel.ids.size === 0) {
        setDisabledPrint(true);
      } else {
        setDisabledPrint(false);
      }
    },
    []
  );

  return (
    <PageContainer
      title="Deliveries"
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            disabled={disabledPrint}
            size="small"
            aria-label="print"
            onClick={() => setPrint(true)}
          >
            <PrintIcon />
          </IconButton>
          <IconButton
            disabled={isLoading}
            size="small"
            aria-label="refresh"
            onClick={() => mutate()}
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
            onChange={(e) => setStation(e.target.value)}
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
          apiRef={apiRef}
          checkboxSelection
          onRowSelectionModelChange={handleChangeSelectionModel}
          disableRowSelectionExcludeModel
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
      {print && (
        <div ref={contentRef}>
          <PrintDeliveries
            station={station}
            date={date}
            data={rows.filter((row) => apiRef.current?.isRowSelected(row.id))}
          />
        </div>
      )}
    </PageContainer>
  );
}
