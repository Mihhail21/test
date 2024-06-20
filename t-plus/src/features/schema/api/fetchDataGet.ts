// import { IEquipment } from "@/interface/IEquipment";
// import { TransformedData } from "@/interface";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { loginAndGetToken } from "./authService";

// interface EquipPrtResponse {
//   kks: string;
//   samples: any[]; // Replace 'any' with the actual type of samples
// }


// interface IProps {
//   schemaDataId: number;
//   blocks: TransformedData[];
//   stationCode: string | undefined;
// }
// export const fetchDataGet = createAsyncThunk(
//   "schema/fetchDataGet",
//   async ({ schemaDataId, stationCode, blocks }: IProps) => {
//     console.log(blocks);

//     try {
//       const token = await loginAndGetToken();
//       const dataResponse = await fetch(`/api/${stationCode}/${schemaDataId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!dataResponse.ok) {
//         throw new Error("Ошибка получения данных");
//       }

//       const data = await dataResponse.json();
//       console.log(data, 1);

//       // const updatedComponents = blocks.map((block) => {
//       //   if ("kks" in block) {
//       //     const valveData = data.equipPrtResponses.find((equipment: IEquipment) => equipment.kks === block.kks);
//       //     if (valveData) {
//       //       return {
//       //         ...block,
//       //         samples: [...valveData.samples],
//       //       };
//       //     }
//       //   }
//       //   return block;
//       // });

//       const equipPrtResponses: EquipPrtResponse[] = data.equipPrtResponses;

//       // Now you have equipPrtResponses available for creating the Map
//       const equipPrtResponsesMap = new Map(equipPrtResponses.map(response => [response.kks, response]));

//       const updatedComponents = blocks.map((block) => {
//         if ("kks" in block) {
//           const valveData = equipPrtResponsesMap.get(block.kks);
//           if (valveData) {
//             return {
//              ...block,
//               samples: [...valveData.samples],
//             };
//           }
//         }
//         return block;
//       });
//       console.log(updatedComponents, 2222222222222222222222222);

//       return updatedComponents;
//     } catch (error) {
//       console.error("Произошла ошибка:", error);
//       throw error;
//     }
//   }
// );
