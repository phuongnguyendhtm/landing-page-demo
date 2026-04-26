/**
 * FreeUp Academy — Payment API Server
 * Chạy trên port 3001, Nginx proxy /api/ → đây
 */
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');

const app      = express();
const PORT     = 3001;
const DB_PATH  = path.join(__dirname, 'orders.json');

app.use(express.json());
app.use(cors({ origin: '*' }));

// ── Helpers ───────────────────────────────────────────────────────────────────
function readOrders() {
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}
function writeOrders(orders) {
    fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2));
}

// ── POST /api/orders — Tạo đơn hàng mới ─────────────────────────────────────
app.post('/api/orders', (req, res) => {
    const { name, phone, product, amount, orderId } = req.body;
    if (!orderId || !amount) return res.status(400).json({ error: 'Missing orderId or amount' });

    const orders = readOrders();
    if (orders.find(o => o.id === orderId)) {
        return res.json({ success: true, order: orders.find(o => o.id === orderId) });
    }

    const order = {
        id: orderId, name, phone, product,
        amount: Number(amount),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    orders.push(order);
    writeOrders(orders);
    console.log(`[Order] Created: ${orderId} — ${amount}đ — ${name}`);
    res.json({ success: true, order });
});

// ── GET /api/orders/:id — Kiểm tra trạng thái đơn ───────────────────────────
app.get('/api/orders/:id', (req, res) => {
    const orders = readOrders();
    const order  = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
});

// ── POST /api/sepay-webhook — Nhận thông báo từ Sepay ───────────────────────
app.post('/api/sepay-webhook', (req, res) => {
    console.log('[Sepay Webhook]', JSON.stringify(req.body));

    const { content, transferAmount, transferType, code } = req.body;

    // Chỉ xử lý tiền vào
    if (transferType !== 'in') return res.json({ success: true });

    const description = (content || code || '').toUpperCase();
    const orders      = readOrders();

    // Tìm đơn hàng khớp theo mã (VD: FU4821)
    const matched = orders.find(o =>
        description.includes(o.id.toUpperCase()) &&
        o.status === 'pending'
    );

    if (matched) {
        // Cho phép sai lệch tối đa 1% (tránh sai số phí)
        if (Number(transferAmount) >= matched.amount * 0.99) {
            matched.status       = 'success';
            matched.paidAt       = new Date().toISOString();
            matched.paidAmount   = Number(transferAmount);
            writeOrders(orders);
            console.log(`[Sepay] ✅ Order ${matched.id} SUCCESS — ${transferAmount}đ`);
        } else {
            console.log(`[Sepay] ⚠️  Amount mismatch: expected ${matched.amount}, got ${transferAmount}`);
        }
    } else {
        console.log(`[Sepay] ❓ No matching pending order for: "${description}"`);
    }

    res.json({ success: true }); // Luôn trả 200 để Sepay không retry
});

// ── GET /api/health ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.listen(PORT, () => console.log(`✅ FreeUp API listening on port ${PORT}`));
