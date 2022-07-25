import { React } from "react";
import { DefaultFilterForColumn } from "./Filters";
import { useTable, useFilters, useGlobalFilter, useSortBy } from "react-table";

export default function Table({ columns, data, sortBy }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    visibleColumns,
    setSortBy,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultFilterForColumn },
      disableSortRemove: true,
      defaultCanSort: true,
      initialState: { sortBy },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const handleMultiSort = (column) => {
    //set sort desc, aesc or none?
    const desc =
      column.isSortedDesc === true
        ? undefined
        : column.isSortedDesc === false
        ? true
        : false;
    setSortBy([{ id: column.id, desc }, ...sortBy]);
  };

  return (
    <table {...getTableProps()}>
      <thead>
        <tr>
          <th
            colSpan={visibleColumns.length}
            style={{
              textAlign: "center",
            }}
          />
        </tr>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                onClick={() => handleMultiSort(column)}
              >
                {column.render("Header")}
                <div>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  {column.canFilter ? column.render("Filter") : null}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
