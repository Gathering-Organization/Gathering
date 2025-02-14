export const getStringedDate = (targetDate: Date) => {
  // 날짜 -> YYYY-MM-DD
  const year = targetDate.getFullYear();
  let month: string = (targetDate.getMonth() + 1).toString();
  let date: string = targetDate.getDate().toString();

  if (month.length < 2) {
    month = `0${month}`;
  }

  if (date.length < 2) {
    date = `0${date}`;
  }

  return `${year}-${month}-${date}`;
};
