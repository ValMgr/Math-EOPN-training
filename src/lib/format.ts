/** French number / duration formatting helpers */

export function formatNumber(
  value: number,
  decimals = 0,
  options?: { trimZeros?: boolean }
): string {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  if (!decPart || (options?.trimZeros && Number(decPart) === 0)) {
    return withSpaces;
  }
  const trimmed = options?.trimZeros ? decPart.replace(/0+$/, "") : decPart;
  return trimmed ? `${withSpaces},${trimmed}` : withSpaces;
}

export function formatLiters(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} L`;
}

export function formatKg(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} kg`;
}

export function formatTonnes(value: number, decimals = 2): string {
  return `${formatNumber(value, decimals)} t`;
}

export function formatKm(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals, { trimZeros: true })} km`;
}

export function formatKmH(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals, { trimZeros: true })} km/h`;
}

export function formatHoursDecimal(hours: number, decimals = 2): string {
  return `${formatNumber(hours, decimals)} h`;
}

/** Convert decimal hours to "Xh YYm" or "X h YY min" */
export function formatDurationHM(hours: number): string {
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  return `${h} h ${String(m).padStart(2, "0")} min`;
}

/** "2 h 27 min 33 s" style from decimal hours */
export function formatDurationHMS(hours: number): string {
  const totalSec = Math.round(hours * 3600);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h === 0) {
    return `${m} min ${String(s).padStart(2, "0")} s`;
  }
  return `${h} h ${String(m).padStart(2, "0")} min ${String(s).padStart(2, "0")} s`;
}

/** Clock time like 10h24m */
export function formatClock(hours: number, minutes: number): string {
  const total = hours * 60 + minutes;
  const h = Math.floor(((total % (24 * 60)) + 24 * 60) % (24 * 60) / 60);
  const m = ((total % 60) + 60) % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}m`;
}

export function addMinutesToClock(
  startH: number,
  startM: number,
  addMin: number
): { h: number; m: number; label: string } {
  const total = startH * 60 + startM + Math.round(addMin);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return { h, m, label: formatClock(h, m) };
}

export function formatTimer(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatPercent(pct: number): string {
  return `${formatNumber(pct * 100, 0)} %`;
}

export function roundTo(value: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
