import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();


const app = express();
const port = process.env.PORT || 4000;


// Configure CORS – allow your UI origin and ChatGPT actions (wide-open for POC)
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));
app.use(express.json());


// ---- Mock Data ---- //
const mockProducts = [
{
id: "P001",
name: "Ford Mustang GT",
category: "vehicle",
make: "Ford",
price: 6500000,
image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
description: "5.0L V8 Fastback with 450 HP",
specs: { engine: "5.0L V8", transmission: "6-speed MT", color: "Red" }
},
{
id: "P002",
name: "Ford EV Home Charger",
category: "accessory",
make: "Ford",
price: 48000,
image: "https://images.unsplash.com/photo-1600083720666-c47d5ff3e2a9?w=1200",
description: "Fast charging station for Ford EVs",
specs: { power: "7.4kW", plug: "Type 2" }
},
{
id: "P003",
name: "Ford Ranger Brake Pads",
category: "parts",
make: "Ford",
price: 8500,
image: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=1200",
description: "Genuine brake pads for Ford Ranger",
specs: { material: "Ceramic", warranty: "12 months" }
}
];	

// ---- Helpers ---- //
const ok = (res, data) => res.json(data);
const err = (res, code, message) => res.status(code).json({ message });


// ---- Routes ---- //
app.get("/healthz", (_, res) => ok(res, { status: "ok" }));


// GET /products?make=Ford&category=vehicle|parts|accessory
app.get("/products", (req, res) => {
const { make, category, q } = req.query;
let results = mockProducts;
if (make) results = results.filter(p => p.make.toLowerCase() === String(make).toLowerCase());
if (category) results = results.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
if (q) {
const qq = String(q).toLowerCase();
results = results.filter(p =>
p.name.toLowerCase().includes(qq) ||
p.description.toLowerCase().includes(qq)
);
}
ok(res, results);
});


// POST /quotes { name, email, phone, product_id }
app.post("/quotes", (req, res) => {
const { name, email, phone, product_id } = req.body || {};
if (!name || !email || !phone || !product_id) return err(res, 400, "Missing required fields");
const quoteId = "Q" + Math.floor(Math.random() * 100000);
console.log("[QUOTE]", { quoteId, name, email, phone, product_id });
ok(res, { message: `Quote request submitted for product ${product_id}`, quoteId });
});


// POST /checkout { product_id, quantity }
app.post("/checkout", (req, res) => {
const { product_id, quantity = 1 } = req.body || {};
if (!product_id) return err(res, 400, "product_id is required");
const cart_id = "C" + Math.floor(Math.random() * 100000);
const checkout_url = `${process.env.CHECKOUT_BASE_URL || "https://example.com/checkout"}/${cart_id}`;
console.log("[CHECKOUT]", { cart_id, product_id, quantity });
ok(res, { message: "Checkout created successfully", cart_id, checkout_url });
});


app.listen(port, () => {
console.log(`✅ API running on http://localhost:${port}`);
});