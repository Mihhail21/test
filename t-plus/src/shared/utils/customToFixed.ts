export const customToFixed = (num: number, fixed: number) => {
  const power = Math.pow(10, fixed);
  return String(Math.round(num * power) / power);
};
