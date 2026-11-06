import dayjs from "dayjs";

/** "03:00 PM to 04:00 PM IST" from an ISO start and end, or null when the start carries no time of day. */
export const timeRange = (startIso?: string, endIso?: string) => {
  const start = dayjs(startIso);
  if (!startIso || !start.isValid() || (start.hour() === 0 && start.minute() === 0)) return null;
  const end = dayjs(endIso);
  const zone = start.utcOffset() === 330 ? " IST" : "";
  const from = start.format("hh:mm A");
  return end.isValid() && endIso ? `${from} to ${end.format("hh:mm A")}${zone}` : `${from}${zone}`;
};
