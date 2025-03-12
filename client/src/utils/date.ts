import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function useRelativeTime(date: string): string {
  return dayjs(date).fromNow();
}
