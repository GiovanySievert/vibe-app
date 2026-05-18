import { i18n } from "@src/shared/i18n";

const localeByLanguage: Record<string, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const currentLocale = () => localeByLanguage[i18n.language] ?? "pt-BR";

function parseEventDate(date: string): {
  day: number;
  month: number;
  year: number;
} {
  if (date.includes("-")) {
    const [y, m, d] = date.split("-").map(Number);
    return { day: d, month: m, year: y };
  }
  const [d, m, y] = date.split("/").map(Number);
  return { day: d, month: m, year: y };
}

export function formatEventDateTime(date: string, time: string): string {
  const { day, month, year } = parseEventDate(date);
  const [hour, minute] = time.substring(0, 5).split(":").map(Number);
  return new Intl.DateTimeFormat(currentLocale(), {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(year, month - 1, day, hour, minute));
}

export function formatShortEventDateTime(date: string, time: string): string {
  const { day, month, year } = parseEventDate(date);
  const monthName = new Intl.DateTimeFormat(currentLocale(), { month: "short" })
    .format(new Date(year, month - 1, day))
    .replace(".", "");
  return `${day} ${monthName} · ${time.substring(0, 5)}`;
}

export const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return i18n.t("notifications.relative.now");
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};
