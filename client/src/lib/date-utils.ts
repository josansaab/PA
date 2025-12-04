import { format, parseISO } from "date-fns";

export function formatDisplayDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MMM/yyyy");
  } catch {
    return dateString;
  }
}
