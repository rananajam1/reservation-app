import React from "react";
import moment from "moment";
import Table from "./components/TableContainer";
import dateBetweenFilterFn, {
  SelectColumnFilter,
  DateRangeColumnFilter,
} from "./components/Filters";
import reservationData from "./utils/serverResponse.json";
import { TIME_AM_PM_FORMAT } from "./helpers/datetime";
import "./App.css";

function App() {
  const columns = [
    {
      Header: "Id",
      accessor: "id",
      disableFilters: true,
    },
    {
      Header: "First Name",
      accessor: "customer.firstName",
    },
    {
      Header: "Last Name",
      accessor: "customer.lastName",
    },
    {
      Header: "Date",
      accessor: "businessDate",
      Filter: DateRangeColumnFilter,
      filter: dateBetweenFilterFn,
    },
    {
      Header: "Start",
      accessor: "start",
      Cell: ({ cell: { value } }) =>
        moment(value).isValid() ? moment(value).format(TIME_AM_PM_FORMAT) : "-",
      disableFilters: true,
    },
    {
      Header: "End",
      accessor: "end",
      Cell: ({ cell: { value } }) =>
        moment(value).isValid() ? moment(value).format(TIME_AM_PM_FORMAT) : "-",
      disableFilters: true,
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      disableFilters: true,
    },
    {
      Header: "Shift",
      accessor: "shift",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
    {
      Header: "Area",
      accessor: "area",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
    {
      Header: "Status",
      accessor: "status",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
    {
      Header: "Notes",
      accessor: "guestNotes",
      disableFilters: true,
    },
  ];

  const sortBy = columns.map(({ accessor }) => ({
    id: accessor,
  }));

  return (
    <div className="App">
      <h1>
        <center>Reservations</center>
      </h1>
      <Table
        columns={columns}
        data={reservationData.reservations}
        sortBy={sortBy}
      />
    </div>
  );
}

export default App;
