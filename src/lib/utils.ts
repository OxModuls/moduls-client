import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, parseISO } from "date-fns";
import { enGB } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ellipsizeAddress(
  address: string,
  charsToKeep: number = 6,
  ellipsis: string = "...",
): string {
  if (address.length <= charsToKeep * 2 + ellipsis.length) {
    return address;
  }

  const start = address.substring(0, charsToKeep);
  const end = address.substring(address.length - charsToKeep);

  return `${start}${ellipsis}${end}`;
}

export function formatISODate(isoString: string): string {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

export function getHumanReadableTimeAgo(
  isoString: string,
  locale = enGB,
): string {
  const date = parseISO(isoString);

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale,
  });
}
