import { format, parseISO } from "date-fns";

const dateFormat = (input: any): string => {
  if (!input) return "No Date";

  let date: Date;

  if (typeof input === "string") {
    const trimmed = input.trim();
    const iso = parseISO(trimmed);
    if (!isNaN(iso.getTime())) return format(iso, "dd MMM yyyy");

    date = new Date(trimmed);
  } else {
    date = new Date(input);
  }

  return isNaN(date.getTime()) ? "Invalid Date" : format(date, "dd MMM yyyy");
};

export default dateFormat;