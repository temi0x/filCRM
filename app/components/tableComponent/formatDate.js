import { useCallback } from "react";
import converter from "number-to-words";

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const shortenMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const useFormatDate = () => {
  return useCallback((dateString, time = false, shorten = false) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    if (time) {
      // For the hours
      const hours = date.getHours() % 12 || 12;
      const minutes = date.getMinutes();

      const ampm = date.getHours() >= 12 ? "pm" : "am";

      return `${hours}:${minutes > 10 ? minutes : "0" + minutes} ${ampm}`;
    }

    return `${converter.toOrdinal(day)}, ${
      shorten ? shortenMonthNames[monthIndex] : monthNames[monthIndex]
    } ${year}`;
  }, []);
};

export default useFormatDate;
