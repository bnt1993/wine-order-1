import { ChatMessage } from "../types";

export const getHealthConsultation = async (
  userMessage: string,
  history: ChatMessage[]
) => {
  try {
    const response = await fetch("http://localhost:4000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        history: history,
      }),
    });

    const data = await response.json();
    return data.reply || "Không có phản hồi từ chatbot";
  } catch (error) {
    console.error("Backend Proxy Error:", error);
    return "Xin lỗi, tôi gặp chút trục trặc trong việc kết nối. Bạn vui lòng thử lại sau nhé!";
  }
};
