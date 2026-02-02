import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "../types";

export const getHealthConsultation = async (
  userMessage: string,
  history: ChatMessage[]
) => {
  // Lấy API key từ biến môi trường Vite (.env.local)
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  try {
    // Khởi tạo model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Gọi generateContent
    const result = await model.generateContent({
      contents: [
        ...history,
        { role: "user", parts: [{ text: userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
      },
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `Bạn là chuyên gia tư vấn sức khỏe của "Rượu Ngâm Thanh Hà".
Nhiệm vụ của bạn là tư vấn các loại rượu ngâm thảo dược phù hợp với tình trạng sức khỏe của khách hàng.
- Luôn nhắc nhở khách hàng sử dụng rượu có điều độ (không quá 30ml/ngày).
- Nếu khách hàng có bệnh nền nghiêm trọng (gan, thận, tim mạch), hãy khuyên họ tham khảo ý kiến bác sĩ.
- Hãy giới thiệu khéo léo các sản phẩm như: Đinh Lăng (bồi bổ), Ba Kích (sinh lý), Đông Trùng Hạ Thảo (miễn dịch), Táo Mèo (tiêu hóa).
- Trả lời bằng tiếng Việt, phong cách lịch sự, chuyên nghiệp, truyền thống.`,
          },
        ],
      },
    });

    // Lấy text từ response
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Xin lỗi, tôi gặp chút trục trặc trong việc kết nối. Bạn vui lòng thử lại sau nhé!";
  }
};
