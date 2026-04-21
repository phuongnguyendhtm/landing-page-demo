import sqlite3
import datetime
import os

db_path = 'brain.db'

def setup_database():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create tables
    tables = ['knowledge', 'business', 'brand_voice']
    for table in tables:
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {table} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

    # Add sample data
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    sample_data = {
        'knowledge': [
            ('Nguyên lý 80/20', 'Tập trung vào 20% nỗ lực tạo ra 80% kết quả.'),
            ('Hiệu ứng Compound', 'Sức mạnh của những thay đổi nhỏ tích lũy theo thời gian.')
        ],
        'business': [
            ('FreeUp Content Machine', 'Giải pháp xây dựng phòng marketing tinh gọn với AI.'),
            ('Khách hàng mục tiêu', 'Chủ doanh nghiệp nhỏ, Solopreneur muốn tối ưu quy trình nội dung.')
        ],
        'brand_voice': [
            ('Triết lý nội dung', 'Thực tiễn, không lý thuyết suông, tập trung vào kết quả.'),
            ('Phong cách cá nhân', 'Trực diện, dễ hiểu, dùng ngôn ngữ đời thường.')
        ]
    }

    for table, rows in sample_data.items():
        cursor.executemany(f'INSERT INTO {table} (title, content) VALUES (?, ?)', rows)

    conn.commit()
    conn.close()
    print(f"Database '{db_path}' đã được tạo thành công với 3 bảng và dữ liệu mẫu.")

if __name__ == "__main__":
    setup_database()
