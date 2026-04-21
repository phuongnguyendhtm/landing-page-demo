const sqlite3 = require('sqlite3').verbose();
const dbPath = 'd:/FreeUp Content Machine/brain.db';

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    // Create products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        stock_quantity INTEGER NOT NULL
    )`, (err) => {
        if (err) console.error('Error creating products table:', err.message);
        else console.log('Products table ready.');
    });

    // Create customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        zalo TEXT,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating customers table:', err.message);
        else console.log('Customers table ready.');
    });

    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        product_id INTEGER,
        amount INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )`, (err) => {
        if (err) console.error('Error creating orders table:', err.message);
        else console.log('Orders table ready.');
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed.');
});
