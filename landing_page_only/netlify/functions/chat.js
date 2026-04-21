require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey || apiKey === "dien_key_gemini_cua_ban_vao_day") {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Chưa cấu hình API Key." })
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `
Bạn là trợ lý AI của FreeUp Academy. Nhiệm vụ của bạn là tư vấn cho khách hàng dựa trên kịch bản bán hàng dưới đây.

KIẾN THỨC CỐT LÕI (Từ sales_script.md):
- Tên chương trình: "Phòng Marketing Tinh Gọn 30 Ngày".
- Giá: 16.000.000 VNĐ.
- Giá trị: Chuyển giao hệ thống vận hành AI, không chỉ dạy kiến thức.
- Lộ trình: 4 tuần (Vị thế Vua -> Giải mã VIP -> Kế hoạch AI -> Sản xuất 24/7).
- Bonus: Done-For-You AI Setup, 100+ Premium Prompts.

CÂU TRẢ LỜI MẪU:
- Về công nghệ: Cầm tay chỉ việc, có team kỹ thuật cài đặt hộ.
- Về nội dung AI: Dùng 'Second Brain' để nạp Brand Voice, viết như người thật.
- Về Agency: Giúp kiểm soát agency tốt hơn hoặc tự chủ hoàn toàn.
- Case Study: Medvi (công ty 2 người doanh thu tỷ đô).

QUY TẮC QUAN TRỌNG:
1. Trả lời ngắn gọn, thẳng thắn, phong cách chuyên gia thực chiến.
2. Khi khách hàng hỏi về giá, cách đăng ký, muốn mua hoặc muốn tham gia -> SAU KHI trả lời thông tin, hãy kẹp thêm mã này ở cuối câu: [[SHOW_REGISTER_BUTTON]]
3. Nếu khách chưa sẵn sàng, hãy khuyên họ để lại thông tin vào danh sách chờ.

Tin nhắn của khách hàng: "${message}"
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: text })
    };
  } catch (error) {
    console.error("Chat error:", error);
    if (error.status === 429 || error.status === 503) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "Hệ thống AI đang quá tải, bạn đợi 30 giây rồi hỏi tiếp nhé! 🙏" })
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Có lỗi xảy ra khi kết nối với AI." })
    };
  }
};
