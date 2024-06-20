// import { loginAndGetToken } from "@/features/schema/api/initializeSchema";

interface Command {
  time?: number;
  frame?: number;
  commandType?: string;
  name: string;
  value: number;
}

const useSendCommand = (stationCode: string) => {
  const sendCommand = async (command: Command) => {
    // const token = await loginAndGetToken();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "text/plain", Authorization: `Bearer ${token}` },
      body: `SET ${JSON.stringify(command)}`,
    };
    try {
      const response = await fetch(`/commands/${stationCode}`, requestOptions);
      if (!response.ok) {
        throw new Error("Сетевой запрос завершился с ошибкой");
      }
      return response;
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      throw error;
    }
  };

  return { sendCommand };
};

export default useSendCommand;
