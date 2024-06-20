import useSendCommand from "../api/useSendCommand";

export const sendCloseCommandsEL = async (stationCode: string, kks: string) => {
  const { sendCommand } = useSendCommand(stationCode || "");
  const commands = [
    { name: `ss:${kks}_ala`, value: 1 },
    { name: `ycc:${kks}_fhd`, value: 1 },
    { name: `ss:${kks}_ala`, value: 0 },
    { name: `ycc:${kks}_fhd`, value: 0 },
  ];

  for (const command of commands) {
    try {
      await sendCommand(command);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      break;
    }
  }
};

export const sendOpenCommandsEL = async (stationCode: string, kks: string) => {
  const { sendCommand } = useSendCommand(stationCode || "");
  const commands = [
    { name: `ss:${kks}_ale`, value: 1 },
    { name: `ycc:${kks}_fhd`, value: 1 },
    { name: `ss:${kks}_ale`, value: 0 },
    { name: `ycc:${kks}_fhd`, value: 0 },
  ];

  for (const command of commands) {
    try {
      await sendCommand(command);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      break;
    }
  }
};

export const universalCommands = async (
  stationCode: string,
  kks: string,
  prefix: string,
  suffix: string,
  conf: string
) => {
  const { sendCommand } = useSendCommand(stationCode);
  const commands = [
    { name: `${prefix}${kks}${suffix}`, value: 1 },
    { name: `${prefix}${kks}${conf}`, value: 1 },
    { name: `${prefix}${kks}${suffix}`, value: 0 },
    { name: `${prefix}${kks}${conf}`, value: 0 },
  ];

  for (const command of commands) {
    try {
      await sendCommand(command);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      break;
    }
  }
};

export const universalCommand = async (
  stationCode: string,
  kks: string,
  prefix: string,
  suffix: string,
  value: number
) => {
  const { sendCommand } = useSendCommand(stationCode);
  const command = { name: `${prefix}${kks}${suffix}`, value: value };
  try {
    await sendCommand(command);
  } catch (error) {
    console.error("Ошибка при отправке команды закрытия:", error);
  }
};
