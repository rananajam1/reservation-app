import moment from "moment";

export const TIME_AM_PM_FORMAT = "hh:mm A";

export const DATE_FORMAT = "DD.MM.YYYY";

export const SECONDARY_DATE_FORMAT = "DD-MM-YYYY";

export function isValidDate(d) {
  return moment(d).isValid();
}
