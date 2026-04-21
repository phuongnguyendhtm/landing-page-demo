const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'brain.db');
const waitlistPath = path.join(__dirname, '..', 'waitlist.json');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database at:', dbPath);
});

db.serialize(() => {
    // 1. products (tên, giá, mô tả, số lượng)
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        stock_quantity INTEGER DEFAULT 0
    )`, (err) => {
        if (err) console.error('Error creating products table:', err.message);
        else console.log('Table "products" created or already exists.');
    });

    // 2. customers (tên, sđt, zalo, ngày đăng ký)
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        zalo TEXT,
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating customers table:', err.message);
        else console.log('Table "customers" created or already exists.');
    });

    // 3. orders (khách hàng, sản phẩm, số tiền, trạng thái, ngày mua)
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        product_id INTEGER,
        amount REAL,
        status TEXT DEFAULT 'pending',
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )`, (err) => {
        if (err) console.error('Error creating orders table:', err.message);
        else console.log('Table "orders" created or already exists.');
    });

    // Import data from waitlist.json
    if (fs.existsSync(waitlistPath)) {
        try {
            const fileContent = fs.readFileSync(waitlistPath, 'utf8');
            const data = JSON.parse(fileContent);
            
            if (Array.isArray(data)) {
                const stmt = db.prepare(`INSERT INTO customers (name, phone, zalo, registration_date) VALUES (?, ?, ?, ?)`);
                data.forEach(item => {
                    const name = item.name || item['tên'] || 'Chưa rõ';
                    const phone = item.phone || item['sđt'] || '';
                    const zalo = item.zalo || '';
                    const date = item.registration_date || item['ngày đăng ký'] || new Date().toISOString();
                    stmt.run([name, phone, zalo, date]);
                });
                stmt.finalize();
                console.log(`Successfully imported ${data.length} customers from waitlist.json`);
            } else {
                console.warn('waitlist.json is not an array. skipping import.');
            }
        } catch (e) {
            console.error('Error importing from waitlist.json:', e.message);
        }
    } else {
        console.log('waitlist.json not found in root directory. Skipping data import.');
    }
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});
