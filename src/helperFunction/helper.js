import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const IST_TIMEZONE = "Asia/Kolkata";

// Date + Time format in IST
export const dateAndTimeFormat = (str) => {
  if (!str) return "";
  const utcDate = new Date(str); // backend UTC date
  const istDate = toZonedTime(utcDate, IST_TIMEZONE); // convert to IST
  return format(istDate, "dd MMM yyyy HH:mm:ss");
};

// Only Date format in IST
export const dateFormat = (str) => {
  if (!str) return "";
  const utcDate = new Date(str);
  const istDate = toZonedTime(utcDate, IST_TIMEZONE);
  return format(istDate, "dd MMM yyyy");
};
