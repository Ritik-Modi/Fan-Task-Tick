export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}


export function parseFormattedDate(formattedDate: string): string {
  const [day, month, year] = formattedDate.split(" ");

  const months: { [key: string]: number } = {
    January: 0, February: 1, March: 2, April: 3,
    May: 4, June: 5, July: 6, August: 7,
    September: 8, October: 9, November: 10, December: 11
  };

  const parsedDate = new Date(
    Number(year),
    months[month],
    Number(day)
  );

  return parsedDate.toISOString(); // Returns full ISO string
}
