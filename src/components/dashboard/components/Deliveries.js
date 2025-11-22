import * as React from "react";
import dayjs from "dayjs";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, useGridApiRef } from "@mui/x-data-grid";
import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageContainer from "./PageContainer";
import AppButton from "../AppButton";
// import {
//   getDeliveryLogItems,
//   getDeliverySessions,
//   postDeliveryQR,
//   postDeliveryLog,
//   unsetDeliveryStation,
//   reverseDelivery,
// } from "../../../../../lib/api/client";
import { enqueueSnackbar } from "notistack";
// import DatePickerSm from "../../../../inputs/DatePickerSm";

const rowHeight = 52;

export default function Deliveries({ section }) {
  const apiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [date, setDate] = React.useState(dayjs());
  const [sessions, setSessions] = React.useState([]);
  const [session, setSession] = React.useState("0");
  const [isLoading, setIsLoading] = React.useState(false);
  const handlePrint = React.useCallback(
    (section, date, session) =>
      window.open(
        `/print/deliveries/${section}/${date.format("MMDDYYYY")}/${session}`,
        "_blank"
      ),
    []
  );

  const getLogs = React.useCallback(
    (date, session) => {
      setIsLoading(true);
      (async () => {
        try {
          const { data } = await getDeliveryLogItems(
            section,
            date.format("MMDDYYYY"),
            session
          );
          setRows(data.data);
          setIsLoading(false);
        } catch (e) {
          console.error(e);
          setRows([]);
          setIsLoading(false);
        }
      })();
    },
    [section]
  );
  const getSessions = React.useCallback(() => {
    (async () => {
      try {
        const { data } = await getDeliverySessions(
          section,
          date.format("MMDDYYYY")
        );
        setSessions(data.data);
      } catch (e) {
        console.error(e);
        setSessions([]);
      }
    })();
  }, [date, section]);
  const focusRef = React.useRef(null);
  React.useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, [section]);
  React.useEffect(() => {
    getSessions();
    getLogs(date, session === "0" ? "0" : session.session);
  }, [date, session, getLogs, getSessions]);
  React.useEffect(() => {
    setSession("0");
  }, [section]);

  const handleRefresh = React.useCallback(
    () => getLogs(date, session === "0" ? "0" : session.session),
    [getLogs, date, session]
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
        field: "plan",
        headerName: "Plan",
        width: 80,
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
  const handleChangeDate = React.useCallback(
    (date, context) => {
      if (!context.validationError) {
        if (date) {
          const day = dayjs(date);
          setDate(day);
          getLogs(day, session === "0" ? "0" : session.session);
        } else {
          setDate(null);
        }
      }
    },
    [getLogs, session]
  );

  return (
    <PageContainer
      breadcrumbs={[{ title: "Deliveries" }, { title: "" }]}
      title={section}
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            disabled={isLoading || session === "0"}
            size="small"
            aria-label="print"
            onClick={() =>
              handlePrint(
                section,
                date,
                session === "0" ? "0" : session.session
              )
            }
          >
            <PrintIcon />
          </IconButton>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton
                disabled={isLoading}
                size="small"
                aria-label="refresh"
                onClick={handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <AppButton children={<NoteAddIcon />} onClick={postLog} />
        </Stack>
      }
      extraActions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <DatePickerSm value={date} onChange={handleChangeDate} />
          {sessions.map((v, i) => (
            <Button
              onClick={() => setSession(v)}
              size="small"
              sx={{
                width: 120,
                color: session === v ? "primary.main" : "text.secondary",
              }}
              children={v.session}
              key={i}
            />
          ))}
          <Button
            onClick={() => setSession("0")}
            size="small"
            sx={{
              width: 120,
              color: session === "0" ? "primary.main" : "text.secondary",
            }}
            children={
              date.isSame(dayjs(), "d") ? "New Session" : "Not Delivered"
            }
          />
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
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
            "& .returned": { textDecoration: "line-through" },
          }}
          getRowClassName={(params) =>
            session !== "0" &&
            params.row.logHistory?.includes(session.logId) &&
            "returned"
          }
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
      <div tabIndex="-1" ref={focusRef} />
    </PageContainer>
  );
}
