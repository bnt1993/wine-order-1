
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Always use process.env.API_KEY directly and initialize a new instance before call
export const getHealthConsultation = async (userMessage: string, history: ChatMessage[]) => {
  // Use named parameter as required by SDK
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex reasoning tasks like health consultations
      model: 'gemini-3-pro-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `Bạn là chuyên gia tư vấn sức khỏe của "Rượu Ngâm Thanh Hà". 
        Nhiệm vụ của bạn là tư vấn các loại rượu ngâm thảo dược phù hợp với tình trạng sức khỏe của khách hàng.
        - Luôn nhắc nhở khách hàng sử dụng rượu có điều độ (không quá 30ml/ngày).
        - Nếu khách hàng có bệnh nền nghiêm trọng (gan, thận, tim mạch), hãy khuyên họ tham khảo ý kiến bác sĩ.
        - Hãy giới thiệu khéo léo các sản phẩm như: Đinh Lăng (bồi bổ), Ba Kích (sinh lý), Đông Trùng Hạ Thảo (miễn dịch), Táo Mèo (tiêu hóa).
        - Trả lời bằng tiếng Việt, phong cách lịch sự, chuyên nghiệp, truyền thống.`,
        temperature: 0.7,
      },
    });

    // Directly access .text property as it is a getter, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Xin lỗi, tôi gặp chút trục trặc trong việc kết nối. Bạn vui lòng thử lại sau nhé!";
  }
};
