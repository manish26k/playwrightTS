import { faker } from "@faker-js/faker/locale/en";
// export function format(date: string) {
//   const parts = date.split("/");
//   return `${parts[2]}-${parts[1]}-${parts[0]}`;
// }

export function format(date: string): string {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }

export function getRandomDate(): string {
  return faker.date.soon().toISOString().split("T")[0];
}

export function generateDynamicDate(): string {
  const currentYear = new Date().getFullYear();
  const randomYear = Math.floor(Math.random() * (currentYear - 2020 + 1)) + 2020;
  const randomMonth = Math.floor(Math.random() * 12) + 1;
  const randomDay = Math.floor(Math.random() * 28) + 1;
  const randomHour = Math.floor(Math.random() * 24);
  const randomMinute = Math.floor(Math.random() * 60);

  return `${randomYear}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}T${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}`;
}

export function formatDateToExpected(date: string): string {
  const [datePart, timePart] = date.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}