
// export const loginAndGetToken = async (): Promise<string | null> => {
//   const response = await fetch("/authorization", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: "instructor",
//       password: "",
//     }),
//   });
//   if (!response.ok) {
//     throw new Error("Ошибка авторизации");
//   }
//   const data = await response.json();
//   return data.accessToken;
// };