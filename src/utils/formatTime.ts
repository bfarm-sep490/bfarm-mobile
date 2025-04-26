import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export const formatRelativeTime = (date: string) => {
  const now = dayjs();
  const notificationDate = dayjs(date);
  const diffInHours = now.diff(notificationDate, 'hour');
  const diffInDays = now.diff(notificationDate, 'day');

  if (diffInHours < 24) {
    return notificationDate.fromNow();
  } else if (diffInDays < 7) {
    return notificationDate.format('dddd [lúc] HH:mm');
  } else {
    return notificationDate.format('DD/MM/YYYY [lúc] HH:mm');
  }
};
