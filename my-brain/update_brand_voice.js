const sqlite3 = require('sqlite3').verbose();
const path = 'brain.db';

const db = new sqlite3.Database(path);

const brandVoiceData = [
    {
        title: 'Tone & Phẩm chất',
        content: '- Chuyên gia, thực chiến, thẳng thắn, rõ ý\n- Nói như người đã làm thật, không lý thuyết suông\n- Ưu tiên tính thực tế, định hướng hành động và kết quả\n- Có chiều sâu chiến lược nhưng vẫn dễ hiểu\n- Mạnh mẽ, quyết liệt, có sức nặng\n- Chân thành, minh bạch, không màu mè'
    },
    {
        title: 'Từ ngữ hay dùng',
        content: 'thật ra, đơn giản thôi, nói thẳng, vấn đề nằm ở chỗ, cốt lõi là, không phải... mà là..., nếu làm kiểu này, bản chất là, triển khai, hệ thống, tự động hóa, bài bản, chốt sale, chuyển đổi, phễu, chiến lược, thực chiến, ra đơn, làm thật, không cần phức tạp, làm ít nhưng đúng'
    },
    {
        title: 'Từ ngữ cấm dùng',
        content: 'synergy, leverage, optimize the experience, disruptive innovation, paradigm shift, world-class solution, em chỉ xin phép chia sẻ một chút ạ, giải pháp đột phá số 1 thị trường, hoa mỹ sáo rỗng'
    },
    {
        title: 'Đối tượng độc giả',
        content: 'Chủ doanh nghiệp vừa và nhỏ, Chuyên gia, nhà đào tạo, coach, người làm dịch vụ, Người đang vận hành thủ công, thiếu hệ thống, muốn ứng dụng AI/automation vào marketing.'
    },
    {
        title: 'Nỗi đau khách hàng',
        content: 'Làm marketing nhiều không ra đơn, Đội nhóm nhỏ làm gì cũng thủ công, Nội dung không tạo chuyển đổi, Mắc kẹt trong vận hành, dùng AI manh mún.'
    },
    {
        title: 'Công thức viết (Framework)',
        content: 'Vấn đề → Sự thật → Giải pháp → Cách làm → Kêu gọi hành động. Dùng câu ngắn, tạo nhịp mạnh, phản biện niềm tin sai.'
    },
    {
        title: 'Niềm tin cốt lõi',
        content: '- Không phải cứ chạy quảng cáo là có khách\n- Không phải cứ dùng AI là doanh nghiệp nhanh hơn\n- Vấn đề không nằm ở công cụ, mà là thiếu hệ thống'
    }
];

db.serialize(() => {
    // Xóa dữ liệu mẫu cũ để cập nhật dữ liệu thật
    db.run('DELETE FROM brand_voice');
    
    const stmt = db.prepare('INSERT INTO brand_voice (title, content) VALUES (?, ?)');
    brandVoiceData.forEach(item => {
        stmt.run(item.title, item.content);
    });
    stmt.finalize();
    console.log('Đã cập nhật Brand Voice chi tiết vào database.');
});

db.close();
