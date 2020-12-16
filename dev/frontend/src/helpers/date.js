export function getFormattedDatetime(date) {
  return getFormattedDate(date) + " " + getFormattedTime(date);
}

export function getFormattedDate(date) {
  let formattedDate = new Date(date).toLocaleDateString().split(" ");
  return formattedDate[0];
}

export function getFormattedTime(date) {
  let formattedDate = new Date(date).toTimeString().split(" ");
  return formattedDate[0];
}
