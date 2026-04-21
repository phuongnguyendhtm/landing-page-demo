const sqlite3 = require('sqlite3').verbose();
const path = 'brain.db';

const db = new sqlite3.Database(path, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    const tables = ['knowledge', 'business', 'brand_voice'];
    tables.forEach(table => {
        db.run(`CREATE TABLE IF NOT EXISTS ${table} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });

    const sampleData = {
        knowledge: [
            ['Nguyên lý 80/20', 'Tập trung vào 20% nỗ lực tạo ra 80% kết quả.'],
            ['Hiệu ứng Compound', 'Sức mạnh của những thay đổi nhỏ tích lũy theo thời gian.']
        ],
        business: [
            ['FreeUp Content Machine', 'Giải pháp xây dựng phòng marketing tinh gọn với AI.'],
            ['Khách hàng mục tiêu', 'Chủ doanh nghiệp nhỏ, Solopreneur muốn tối ưu quy trình nội dung.']
        ],
        brand_voice: [
            ['Triết lý nội dung', 'Thực tiễn, không lý thuyết suông, tập trung vào kết quả.'],
            ['Phong cách cá nhân', 'Trực diện, dễ hiểu, dùng ngôn ngữ đời thường.']
        ]
    };

    Object.keys(sampleData).forEach(table => {
        const stmt = db.prepare(`INSERT INTO ${table} (title, content) VALUES (?, ?)`);
        sampleData[table].forEach(row => {
            stmt.run(row);
        });
        stmt.finalize();
    });

    console.log("Database 'brain.db' đã được tạo thành công với 3 bảng và dữ liệu mẫu.");
});

db.close();
