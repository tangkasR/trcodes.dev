const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function monthName(date: Date): string {
  return MONTHS[date.getUTCMonth()] ?? "";
}

export function formatPeriod(startDate: Date, endDate: Date | null): string {
  const startMonth = monthName(startDate);
  const startYear = startDate.getUTCFullYear();

  if (!endDate) return `${startMonth} ${startYear} sampai sekarang`;

  const endMonth = monthName(endDate);
  const endYear = endDate.getUTCFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startMonth} sampai ${endMonth} ${endYear}`;
  }

  return `${startMonth} ${startYear} sampai ${endMonth} ${endYear}`;
}
