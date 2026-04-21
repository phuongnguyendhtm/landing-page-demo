const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../../brain.db');

// Helper to run SQL queries in a promise
const dbQuery = (query, params = [], method = 'all') => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) return reject(err);
        });

        if (method === 'get') {
            db.get(query, params, (err, row) => {
                db.close();
                if (err) reject(err);
                else resolve(row);
            });
        } else if (method === 'run') {
            db.run(query, params, function(err) {
                db.close();
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        } else {
            db.all(query, params, (err, rows) => {
                db.close();
                if (err) reject(err);
                else resolve(rows);
            });
        }
    });
};

exports.handler = async (event, context) => {
    const { httpMethod, path: fullPath, body } = event;
    const segments = fullPath.split('/');
    const resource = segments[segments.length - 1]; 

    console.log(`[Admin API] ${httpMethod} request for ${resource}`);

    try {
        if (httpMethod === 'GET') {
            if (resource === 'products') {
                const results = await dbQuery('SELECT * FROM products');
                return { statusCode: 200, body: JSON.stringify(results) };
            }
            if (resource === 'customers') {
                const results = await dbQuery('SELECT * FROM customers');
                return { statusCode: 200, body: JSON.stringify(results) };
            }
            if (resource === 'orders') {
                const results = await dbQuery(`
                    SELECT o.id, c.name as customer_name, p.name as product_name, o.amount, o.status 
                    FROM orders o 
                    LEFT JOIN customers c ON o.customer_id = c.id 
                    LEFT JOIN products p ON o.product_id = p.id
                `);
                return { statusCode: 200, body: JSON.stringify(results) || '[]' };
            }
        }

        if (httpMethod === 'POST') {
            if (!body) throw new Error('Yêu cầu không có dữ liệu (Body is empty)');
            const data = JSON.parse(body);
            console.log(`[Admin API] Adding new ${resource}:`, data);

            if (resource === 'products') {
                const result = await dbQuery(
                    'INSERT INTO products (name, price, description, stock_quantity) VALUES (?, ?, ?, ?)',
                    [data.name, data.price, data.description, data.stock_quantity],
                    'run'
                );
                return { statusCode: 201, body: JSON.stringify(result) };
            }
            if (resource === 'customers') {
                const result = await dbQuery(
                    'INSERT INTO customers (name, phone, zalo) VALUES (?, ?, ?)',
                    [data.name, data.phone, data.zalo],
                    'run'
                );
                return { statusCode: 201, body: JSON.stringify(result) };
            }
            if (resource === 'orders') {
                if (!data.customer_id || !data.product_id) throw new Error('Thiếu ID khách hàng hoặc sản phẩm');
                
                const result = await dbQuery(
                    'INSERT INTO orders (customer_id, product_id, amount, status) VALUES (?, ?, ?, ?)',
                    [data.customer_id, data.product_id, data.amount, data.status],
                    'run'
                );
                // Giảm kho
                await dbQuery(
                    'UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = ?',
                    [data.product_id],
                    'run'
                );
                return { statusCode: 201, body: JSON.stringify(result) };
            }
        }

        if (httpMethod === 'DELETE') {
            const data = JSON.parse(body);
            if (!data.id) return { statusCode: 400, body: 'Thiếu ID để xóa' };
            
            console.log(`[Admin API] Deleting from ${resource}, ID: ${data.id}`);
            await dbQuery(`DELETE FROM ${resource} WHERE id = ?`, [data.id], 'run');
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 405, body: 'Phương thức không được hỗ trợ' };
    } catch (err) {
        console.error('[Admin API Error]:', err);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ 
                error: err.message,
                note: "Lưu ý: Bạn phải chạy bằng lệnh 'npm run chat' hoặc 'netlify dev' để SQLite hoạt động."
            }) 
        };
    }
};
