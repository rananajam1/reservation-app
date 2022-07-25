import moment from "moment";
import { React, useMemo, useState } from "react";
import { useAsyncDebounce } from "react-table";
import { Label, Input } from "reactstrap";
import {
  DATE_FORMAT,
  isValidDate,
  SECONDARY_DATE_FORMAT,
} from "../helpers/datetime";

export function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div>
      <Label>Search Table: </Label>
      <Input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder=" Enter value "
        className="w-25"
        style={{
          fontSize: "1.1rem",
          margin: "15px",
          display: "inline",
        }}
      />
    </div>
  );
}

export function DefaultFilterForColumn({
  column: {
    filterValue,
    preFilteredRows: { length },
    setFilter,
  },
}) {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${length} records..`}
      style={{ marginTop: "10px" }}
    />
  );
}

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function DateRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = useMemo(() => {
    let min = moment(preFilteredRows[0].values[id]).format(
      SECONDARY_DATE_FORMAT
    );
    let max = moment(preFilteredRows[0].values[id]).format(
      SECONDARY_DATE_FORMAT
    );

    preFilteredRows.forEach((row) => {
      min = moment(row.values[id]).isBefore(min)
        ? moment(row.values[id]).format(SECONDARY_DATE_FORMAT)
        : min;
      max = moment(row.values[id]).isAfter(max)
        ? moment(row.values[id]).format(SECONDARY_DATE_FORMAT)
        : max;
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <input
        value={filterValue[0] || ""}
        type="date"
        min={min}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [val ? val : undefined, old[1]]);
        }}
        style={{
          width: "170px",
          marginRight: "0.5rem",
        }}
      />
      to
      <input
        value={filterValue[1] || ""}
        type="date"
        max={max}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [old[0], val ? val : undefined]);
        }}
        style={{
          width: "170px",
          marginLeft: "0.5rem",
        }}
      />
    </div>
  );
}

function dateBetweenFilterFn(rows, id, filterValues) {
  let minFilter = moment(filterValues[0]);
  let maxFilter = moment(filterValues[1]);

  if (!isValidDate(filterValues[0]) || !isValidDate(filterValues[1])) {
    return rows;
  }

  return rows.filter((r) => {
    var time = moment(r.values[id], DATE_FORMAT);

    if (filterValues.length === 0) {
      return rows;
    }

    return time.isBetween(minFilter, maxFilter);
  });
}

dateBetweenFilterFn.autoRemove = (val) => !val;

export default dateBetweenFilterFn;
