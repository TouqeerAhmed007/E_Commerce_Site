require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  stockQuantity: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const sampleProducts = [
  // ─── ELECTRONICS (10) ──────────────────────────────────────────────────────
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancellation with 30-hour battery life and multipoint connection.",
    price: 349.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dce?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 25,
    isActive: true
  },
  {
    name: "Apple Watch Series 9",
    description: "Advanced health monitoring with Sleep apnea detection and always-on Retina display.",
    price: 399.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1434493789747-a7fbad9a22d7?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 15,
    isActive: true
  },
  {
    name: "Samsung Galaxy Watch 6",
    description: "Comprehensive fitness tracking with rotating bezel and BioActive sensor.",
    price: 299.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd0fd1892?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 20,
    isActive: true
  },
  {
    name: "Logitech MX Keys Advanced",
    description: "Wireless backlit keyboard with smart illumination and dual layout support.",
    price: 119.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 40,
    isActive: true
  },
  {
    name: "Logitech MX Master 3S",
    description: "Ergonomic wireless mouse with 8K DPI sensor and quiet click technology.",
    price: 99.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },
  {
    name: "Samsung Odyssey G9 Monitor",
    description: "49-inch ultrawide curved Gaming monitor with 240Hz and Quantum Dot display.",
    price: 1299.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1551645120-d70b5b96d862?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 12,
    isActive: true
  },
  {
    name: "Blue Yeti X USB Microphone",
    description: "Professional condenser mic with四种极性模式 for streaming and podcasting.",
    price: 169.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 18,
    isActive: true
  },
  {
    name: "Anker Nebula Cosmos Mini",
    description: "Portable 1080p projector with Android TV and 2.5-hour battery life.",
    price: 299.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 10,
    isActive: true
  },
  {
    name: "JBL Flip 6 Bluetooth Speaker",
    description: "Waterproof portable speaker with 12 hours playtime and powerful bass.",
    price: 129.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 35,
    isActive: true
  },
  {
    name: "Meta Quest 3 VR Headset",
    description: "Standalone mixed reality headset with 512GB storage and pancake lenses.",
    price: 499.00,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 14,
    isActive: true
  },

  // ─── CLOTHING (10) ─────────────────────────────────────────────────────────
  {
    name: "Herschel Little America Backpack",
    description: "Mid-volume retro-inspired backpack with adjustable drawstring closure.",
    price: 89.50,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 30,
    isActive: true
  },
  {
    name: "Levi's Trucker Jacket",
    description: "Classic fit denim jacket with warm fleece lining for cold weather.",
    price: 79.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 22,
    isActive: true
  },
  {
    name: "Champion Reverse Weave Hoodie",
    description: "Heavyweight fleece with stretch fabric for durable warmth and mobility.",
    price: 65.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 45,
    isActive: true
  },
  {
    name: "Carhartt Worn Wear Pants",
    description: "Rugged work pants with double-front design and relaxed fit.",
    price: 55.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 28,
    isActive: true
  },
  {
    name: "Reformation Linen Midi Dress",
    description: "Sustainable flax linen dress with adjustable tie waist and breathable fit.",
    price: 148.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 15,
    isActive: true
  },
  {
    name: "Everlane Cashmere Crew",
    description: "100% Grade-A Mongolian cashmere sweater in classic crew neck.",
    price: 128.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1576871337632-32c89c9e3f23?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 20,
    isActive: true
  },
  {
    name: "The North Face Rain Jacket",
    description: "Waterproof breathable shell with adjustable hood for outdoor adventures.",
    price: 150.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1551488852-0801462c8b37?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 17,
    isActive: true
  },
  {
    name: "Burberry Kensington Trench",
    description: "Heritage cotton gabardine trench with signature check lining.",
    price: 1290.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 10,
    isActive: true
  },
  {
    name: "Supreme Box Logo Tee",
    description: "Cotton jersey tee with signature box logo embroidered on chest.",
    price: 45.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 80,
    isActive: true
  },
  {
    name: "Patagonia Acorn Beanie",
    description: "Recycled wool blend beanie with reversible patter for versatile wear.",
    price: 29.00,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 100,
    isActive: true
  },

  // ─── SHOES (10) ────────────────────────────────────────────────────────────
  {
    name: "Converse Chuck 70 High Top",
    description: "Vintage-inspired canvas sneaker with premium cushioning and retro design.",
    price: 85.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1607522375404-5c6f1c8b8b8b?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 34,
    isActive: true
  },
  {
    name: "Timberland Premium Boots",
    description: "Handcrafted waterproof leather boots with anti-fatigue technology.",
    price: 180.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 16,
    isActive: true
  },
  {
    name: "Nike Air Max 90",
    description: "Iconic running shoe with Max Air cushioning and visible air unit.",
    price: 150.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 42,
    isActive: true
  },
  {
    name: "Gucci Horsebit Loafers",
    description: "Iconic slip-on with signature horsebit hardware and leather sole.",
    price: 890.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 20,
    isActive: true
  },
  {
    name: "Common Projects Achilles",
    description: "Minimalist Italian leather sneakers in premium white calfskin.",
    price: 225.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },
  {
    name: "Dr. Martens 1460 Boot",
    description: "Classic 8-eye boot with air-cushioned sole and Goodyear welt.",
    price: 169.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1607017464934-b8d8c1002e47?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 12,
    isActive: true
  },
  {
    name: "Nike React Infinity Slide",
    description: "Comfortable slides with React foam for all-day comfort.",
    price: 55.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 75,
    isActive: true
  },
  {
    name: "Johnston & Lewis Oxford",
    description: "Classic cap-toe Oxford with premium calfskin leather upper.",
    price: 295.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 18,
    isActive: true
  },
  {
    name: "On Cloudwalker Trail",
    description: "Lightweight trail running shoe with cloud elements for smooth stride.",
    price: 145.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 26,
    isActive: true
  },
  {
    name: "Tkees Flex Sandals",
    description: "Minimalist leather sandals with butter-soft glove-like leather.",
    price: 65.00,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1562273589-299481293cab?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 30,
    isActive: true
  },

  // ─── BOOKS (10) ────────────────────────────────────────────────────────────
  {
    name: "The Art of Simplicity",
    description: "A profound hardcover guide exploring modern mindfulness and clutter-free living philosophies.",
    price: 24.95,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 15,
    isActive: true
  },
  {
    name: "Chronicles of Nebulae",
    description: "An epic sweeping award-winning sci-fi space opera masterpiece concerning lost worlds.",
    price: 14.99,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 40,
    isActive: true
  },
  {
    name: "The Plant-Based Kitchen",
    description: "Over 150 accessible vibrant nutrient-dense recipes tailored for modern whole-food clean living.",
    price: 29.99,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 25,
    isActive: true
  },
  {
    name: "Design Systems Volume II",
    description: "A highly practical industrial manual outlining digital product UI architectural frameworks.",
    price: 45.00,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 12,
    isActive: true
  },
  {
    name: "Mastering Creative Thinking",
    description: "Proven exercises compiled to bust psychological artistic blocks and unlock expressive creative flow.",
    price: 18.99,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 33,
    isActive: true
  },
  {
    name: "Lost Horizons Fiction",
    description: "A beautifully tragic gripping dark psychological mystery set deep within coastal fog islands.",
    price: 15.95,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 22,
    isActive: true
  },
  {
    name: "The History of Architecture",
    description: "A comprehensive photographic catalog mapping global building monument transformations through centuries.",
    price: 55.00,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 8,
    isActive: true
  },
  {
    name: "Poetry of the Woods",
    description: "A delicate pocket collection of raw romantic verses documenting seasonal wilderness shifts.",
    price: 12.00,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },
  {
    name: "The Startup Playbook",
    description: "Invaluable strategic step-by-step guidance exploring bootstrap funding and global company scaling.",
    price: 22.50,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 19,
    isActive: true
  },
  {
    name: "Stargazing Pocket Guide",
    description: "Handy star map charts mapping celestial night constellations easily visible to standard scopes.",
    price: 9.99,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 60,
    isActive: true
  },

  // ─── FOOD (10) ─────────────────────────────────────────────────────────────
  {
    name: "Barista Roast Coffee Beans",
    description: "1kg single-origin dark roasted organic arabica beans displaying notes of rich cocoa.",
    price: 24.99,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 45,
    isActive: true
  },
  {
    name: "Pure Organic Ceremonial Matcha",
    description: "First-harvest authentic Japanese stone-ground green tea offering clean, focused energy.",
    price: 34.95,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 25,
    isActive: true
  },
  {
    name: "Artisanal Sea Salt Chocolate",
    description: "72% single-origin dark fair-trade chocolate bars infused with hand-harvested flaky sea salt.",
    price: 6.50,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 120,
    isActive: true
  },
  {
    name: "Cold-Pressed Extra Virgin Olive Oil",
    description: "Unfiltered peppery robust single-estate Spanish finishing olive oil in UV-protected glass.",
    price: 28.00,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 30,
    isActive: true
  },
  {
    name: "Raw Wildflower Honey",
    description: "Pure unpasteurized local farm honeycomb-infused amber honey bursting with enzymes.",
    price: 14.50,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 55,
    isActive: true
  },
  {
    name: "Smoked Ghost Pepper Hot Sauce",
    description: "Small-batch oak-barrel aged extreme pepper hot sauce hosting complex hickory undertones.",
    price: 9.99,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 40,
    isActive: true
  },
  {
    name: "Organic Herbal Tea Assortment",
    description: "40 handcrafted compostable pyramid bags containing chamomile, mint, and wellness blends.",
    price: 18.00,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },
  {
    name: "Gourmet Roasted Mixed Nuts",
    description: "Premium salted almonds, cashews, pecans, and macadamias dry-roasted daily.",
    price: 16.99,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1536511154448-116c24362272?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 70,
    isActive: true
  },
  {
    name: "Pure Grade-A Maple Syrup",
    description: "Traditional wood-fired dark amber robust Canadian forest maple syrup bottle.",
    price: 19.50,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1584486520270-19ee1efc74a7?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 24,
    isActive: true
  },
  {
    name: "Plant Protein Isolate Powder",
    description: "Vanilla-infused premium organic pea and hemp clean workout recovery protein blend.",
    price: 39.99,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 32,
    isActive: true
  },

  // ─── BEAUTY (10) ───────────────────────────────────────────────────────────
  {
    name: "Hyaluronic Acid Glow Serum",
    description: "Intense moisture-locking daily skin serum formulated to instantly plump fine lines.",
    price: 32.00,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 45,
    isActive: true
  },
  {
    name: "Matte Crimson Velvet Lipstick",
    description: "Smudge-proof highly pigmented continuous hydrating 12-hour bold coverage lipstick.",
    price: 24.00,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 60,
    isActive: true
  },
  {
    name: "Vitamin C Brightening Mask",
    description: "Refreshing clay cream mask engineered to clarify dull complexions and hyperpigmentation.",
    price: 28.50,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1567894192231-d22d9c1349be?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 35,
    isActive: true
  },
  {
    name: "Santorini Wood Eau de Parfum",
    description: "A warm signature unisex fragrance blending notes of cardamon, cedar, and fresh amber.",
    price: 85.00,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 15,
    isActive: true
  },
  {
    name: "Mineral Broad-Spectrum SPF 50",
    description: "Non-greasy featherweight clean daily zinc face sunscreen offering invisible protection.",
    price: 26.00,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },
  {
    name: "Hydrating Coconut Body Wash",
    description: "Sulfate-free nourishing daily body cleanser packed with pure cold-pressed oils.",
    price: 16.00,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 40,
    isActive: true
  },
  {
    name: "Argan Oil Hair Repair Mask",
    description: "Deep conditioning intense treatment mask crafted to rescue dry, processed cuticles.",
    price: 29.00,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 22,
    isActive: true
  },
  {
    name: "Rosewater Calming Facial Mist",
    description: "Pure organic steam-distilled hydrosol designed to instantly balance inflamed skin bases.",
    price: 18.50,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 55,
    isActive: true
  },
  {
    name: "Retinol Renewing Eye Cream",
    description: "Advanced slow-release active retinol complex targeting stubborn dark under-eye circles.",
    price: 38.00,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 20,
    isActive: true
  },
  {
    name: "Natural Shea Butter Lip Balm",
    description: "Ultra-soothing deeply restorative beeswax and mint-infused protective lip therapy stick.",
    price: 6.00,
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1617422275558-e5f6163026b2?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 150,
    isActive: true
  },

  // ─── SPORTS (10) ───────────────────────────────────────────────────────────
  {
    name: "Eco-Friendly Cork Yoga Mat",
    description: "Natural antimicrobial high-grip sustainable cork non-slip alignment yoga mat.",
    price: 68.00,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 25,
    isActive: true
  },
  {
    name: "Hex Adjustable Dumbbell Set",
    description: "Solid cast-iron space-saving versatile quick-select adjustable weight lifting dumbbells.",
    price: 249.99,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 8,
    isActive: true
  },
  {
    name: "Insulated Stainless Flask",
    description: "1L double-wall vacuum sweat-proof flask keeping water icy cold up to 24 continuous hours.",
    price: 32.50,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 65,
    isActive: true
  },
  {
    name: "Carbon Fiber Tennis Racket",
    description: "Pro-lightweight aerodynamically optimized graphite tennis frame providing high control.",
    price: 179.00,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1617083934333-14907ff923d7?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 14,
    isActive: true
  },
  {
    name: "High-Resistance Bands Kit",
    description: "5 heavy stackable premium latex workout pull bands utilizing secure steel clip systems.",
    price: 24.99,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 40,
    isActive: true
  },
  {
    name: "Aero Ventilation Bike Helmet",
    description: "Impact-absorbing advanced composite shell bicycle safety helmet offering 18 dynamic cooling vents.",
    price: 85.00,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1557803175-df7031ef1b37?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 16,
    isActive: true
  },
  {
    name: "Canadian Maple Skateboard",
    description: "7-ply double kick concave pro-grade trick board equipped with precision ABEC-7 smooth bearings.",
    price: 75.00,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1520156565706-c9b13d641f54?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 20,
    isActive: true
  },
  {
    name: "Waterproof Travel Gym Bag",
    description: "Dedicated ventilated shoe compartment travel duffel engineered from ballistic nylon weave.",
    price: 45.00,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 30,
    isActive: true
  },
  {
    name: "Official Composite Basketball",
    description: "Indoor/Outdoor official structural deep-channel moisture-wicking training game basketball.",
    price: 39.99,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 35,
    isActive: true
  },
  {
    name: "Digital Jump Rope Tracker",
    description: "Smart LCD handle calorie counting skip fitness rope operating auto-loop storage analytics.",
    price: 19.99,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },

  // ─── TOYS (10) ─────────────────────────────────────────────────────────────
  {
    name: "Architectural Building Blocks",
    description: "600-piece premium precision-fit geometric structural kids educational engineering brick set.",
    price: 49.99,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 28,
    isActive: true
  },
  {
    name: "Vintage Soft Teddy Bear",
    description: "Lovingly soft non-allergenic classic stitched plush toy companion ideal for nurseries.",
    price: 22.50,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 40,
    isActive: true
  },
  {
    name: "Settlers Strategic Board Game",
    description: "Intense competitive multiplayer economic resource resource gathering tactical card board game.",
    price: 39.95,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 22,
    isActive: true
  },
  {
    name: "1000-Piece Wilderness Puzzle",
    description: "Thick recycled anti-glare card stock puzzle depicting rich organic detailed landscape graphics.",
    price: 18.99,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1513258496099-48168024addd?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },
  {
    name: "High-Speed RC Desert Buggy",
    description: "Rugged 1:18 scale 4WD off-road remote control car hitting impressive top speeds of 30km/h.",
    price: 59.99,
    category: "toys",
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 15
  },
  {
    name: "Handcrafted Wooden Train Set",
    description: "25-piece premium magnetic connection safe beechwood track loop activity set.",
    price: 34.50,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 18,
    isActive: true
  },
  {
    name: "Programmable Mini Robot",
    description: "Easy-to-learn early STEM drag-and-drop code controlled sensor smartphone smart robot.",
    price: 89.99,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 12,
    isActive: true
  },
  {
    name: "Deluxe Watercolor Art Set",
    description: "Solid wooden case storing 48 vibrant pigment pans, specialized blending brushes and cotton pads.",
    price: 27.00,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 30,
    isActive: true
  },
  {
    name: "Classic Wooden Chessboard",
    description: "Tournament size inlaid walnut wood folding board featuring weighted bottom pieces.",
    price: 45.00,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 16,
    isActive: true
  },
  {
    name: "Space Exploration Rocket Toy",
    description: "Multi-level interactive astronaut figures launchpad toy highlighting glowing exhaust actions.",
    price: 42.00,
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 20,
    isActive: true
  },

  // ─── HOME (10) ─────────────────────────────────────────────────────────────
  {
    name: "Ceramic Matte Mug",
    description: "Hand-thrown minimalist stoneware morning mug completed in an organic volcanic clay texture.",
    price: 18.00,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 40,
    isActive: true
  },
  {
    name: "Scented Soy Wax Candle",
    description: "Hand-poured rich luxury candle blending comforting notes of wild tobacco leaves and smooth vanilla.",
    price: 24.50,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },
  {
    name: "Waffle Knit Throw Blanket",
    description: "100% breathable organic cotton oversized bed blanket offering deep textural warmth.",
    price: 65.00,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 22,
    isActive: true
  },
  {
    name: "Architectural Desk Lamp",
    description: "Industrial matte black aluminum multi-joint balanced swing arm workstation lighting desk lamp.",
    price: 79.99,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 15,
    isActive: true
  },
  {
    name: "Potted Fiddle Leaf Fig",
    description: "Stunning vibrant live indoor foliage houseplant seated in an artisan woven basket base.",
    price: 48.00,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 10,
    isActive: true
  },
  {
    name: "Concrete Wall Clock",
    description: "Modern minimalist dial-free wall clock cast from premium high-density architectural concrete tones.",
    price: 36.00,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 14,
    isActive: true
  },
  {
    name: "Linen Fringe Accent Pillow",
    description: "Plush feather-filled square couch support cushion wrapped inside raw fringed flax covers.",
    price: 29.99,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 30,
    isActive: true
  },
  {
    name: "Geometric Tufted Area Rug",
    description: "Soft hand-woven mid-century modern aesthetic low-pile wool geometric flooring accent rug.",
    price: 189.00,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 6,
    isActive: true
  },
  {
    name: "Stoneware Dinnerware Set",
    description: "12-piece matte speckled earthy dinner plates, side options, and breakfast soup bowls.",
    price: 110.00,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861bcfa?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 12,
    isActive: true
  },
  {
    name: "Ultrasonic Essential Oil Diffuser",
    description: "Quiet textured porcelain aromatherapy cool mist humidifier highlighting customizable ambient cycles.",
    price: 42.00,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 25,
    isActive: true
  },

  // ─── JEWELRY (10) ──────────────────────────────────────────────────────────
  {
    name: "Sterling Silver Band Ring",
    description: "Timeless 925 solid sterling silver thin stackable comfort-fit band ring.",
    price: 45.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 50,
    isActive: true
  },
  {
    name: "14k Gold Chain Pendant",
    description: "Delicate luxury solid yellow gold link necklace highlighting an abstract molten coin medallion.",
    price: 210.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 15,
    isActive: true
  },
  {
    name: "Freshwater Pearl Drop Earrings",
    description: "Luminous organic irregular-shaped matching freshwater pearls fixed to secure gold hoops.",
    price: 89.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 20,
    isActive: true
  },
  {
    name: "Braided Leather Cuff Cuff",
    description: "Rugged double-wrap antique black premium leather cord bracelet fitted with steel magnet locks.",
    price: 35.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 35,
    isActive: true
  },
  {
    name: "Classic Chronograph Wristwatch",
    description: "Sophisticated analog mechanical sports watch displaying deep navy dials over tan calf straps.",
    price: 195.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 18,
    isActive: true
  },
  {
    name: "Raw Emerald Pendant Charm",
    description: "Uncut rich green natural emerald crystal handset within protective silver prong frames.",
    price: 145.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1536588231938-3ed8a4524736?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 8,
    isActive: true
  },
  {
    name: "Minimalist Gold Ear Cuffs",
    description: "Dainty non-piercing slip-on gold vermeil wrap jewelry accessories tailored for cartilage framing.",
    price: 28.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 60,
    isActive: true
  },
  {
    name: "Engraved Silver Cuff Cuff",
    description: "Heavy brushed-finish sterling silver open wrist-cuff tracking subtle linear details.",
    price: 115.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b1a30a5a4a?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 14,
    isActive: true
  },
  {
    name: "Diamond Star Studs Set",
    description: "Miniature brilliant-cut conflict-free small stellar cluster diamond sparkle gold studs.",
    price: 280.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 10,
    isActive: true
  },
  {
    name: "Chunky Link Metal Bracelet",
    description: "Bold industrial polished stainless steel cable interlocking chain fashion statement piece.",
    price: 49.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 40,
    isActive: true
  },

  // ─── GENERATE BULK PADDING DATA (TO REACH 100 UNIQUE ITEMS) ──────────────────
  // Electronics
  { name: "Dual-Lens Drone 4K", description: "GPS auto-return high stability filming quadcopter drone.", price: 389.00, category: "electronics", imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80", stockQuantity: 15, isActive: true },
  { name: "Bose Smart Soundbar", description: "Dolby Atmos enabled home theater soundbar with voice control.", price: 549.00, category: "electronics", imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80", stockQuantity: 20, isActive: true },
  { name: "Graphic Drawing Tablet", description: "Battery-free stylus high pressure sensitivity sketching pad.", price: 159.00, category: "electronics", imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80", stockQuantity: 24, isActive: true },
  // Clothing
  { name: "Suede Utility Vest", description: "Classic functional multi-pocket casual style layering bodywarmer.", price: 69.99, category: "clothing", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80", stockQuantity: 15, isActive: true },
  { name: "Pleated Midi Skirt", description: "Flowy elastic high-waist everyday dress skirt in neutral tones.", price: 45.00, category: "clothing", imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80", stockQuantity: 30, isActive: true },
  { name: "Silk Relaxed Scarf", description: "100% pure mulberry smooth patterned neck lightweight wrap.", price: 34.00, category: "clothing", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", stockQuantity: 40, isActive: true },
  // Shoes
  { name: "Waterproof Winter Boots", description: "Fleece-lined thermal sub-zero protective tracking footwear.", price: 139.99, category: "shoes", imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80", stockQuantity: 12, isActive: true },
  { name: "Platform Canvas Creepers", description: "Chunky vulcanized high-sole skater casual footwear accents.", price: 69.00, category: "shoes", imageUrl: "https://images.unsplash.com/photo-1605405748313-a416a1b84491?auto=format&fit=crop&w=600&q=80", stockQuantity: 25, isActive: true },
  { name: "Woven Breathable Flats", description: "Flexible recycled fiber pointed dress shoes for commute comfort.", price: 78.00, category: "shoes", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80", stockQuantity: 35, isActive: true },
  // Books
  { name: "The Quiet Mind Journal", description: "Guided daily thought prompts for stress reduction strategies.", price: 15.00, category: "books", imageUrl: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=600&q=80", stockQuantity: 45, isActive: true },
  { name: "Astrophotography Deep Sky", description: "Technical processing manual for shooting galaxies and nebulae.", price: 49.99, category: "books", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80", stockQuantity: 10, isActive: true },
  { name: "The Nordic Baking Guide", description: "Traditional rustic bread and pastry methods from Northern Europe.", price: 35.00, category: "books", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80", stockQuantity: 18, isActive: true },
  // Food
  { name: "Cold-Brew Coffee Kit", description: "Thick glass multi-serve pitch-filter extraction setup.", price: 29.99, category: "food", imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80", stockQuantity: 20, isActive: true },
  { name: "Smoked Himalayan Flake Salt", description: "Chardonnay oak-wood cold-infused savory crystalline food seasoning.", price: 12.50, category: "food", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", stockQuantity: 80, isActive: true },
  { name: "Organic Pressed Fuji Cider", description: "Crisp sparkling pure zero added sugar heritage orchard juice.", price: 8.99, category: "food", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80", stockQuantity: 45, isActive: true },
  // Beauty
  { name: "Bakuchiol Natural Retinol", description: "Gentle plant-based overnight anti-aging alternative fluid.", price: 34.00, category: "beauty", imageUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&q=80", stockQuantity: 40, isActive: true },
  { name: "Bamboo Charcoal Detox Scrub", description: "Deep exfoliating black volcanic body clarifying compound polish.", price: 22.00, category: "beauty", imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80", stockQuantity: 50, isActive: true },
  { name: "Hydrating Oat Milk Cleanser", description: "Calming pH balanced non-foaming sensitive wash emulsion.", price: 19.50, category: "beauty", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", stockQuantity: 55, isActive: true },
  // Sports
  { name: "Ergonomic Speed Skipping Rope", description: "Coated steel wire dual-bearing gym cross-fit conditioning accessory.", price: 15.99, category: "sports", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80", stockQuantity: 60, isActive: true },
  { name: "Deep Tissue Massage Gun", description: "Quiet high-torque brushless percussion recovery vibration motor.", price: 129.00, category: "sports", imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f866cb?auto=format&fit=crop&w=600&q=80", stockQuantity: 15, isActive: true },
  { name: "UV-Protection Sports Sunglasses", description: "Polarized lightweight wrapped running cycling shield lenses.", price: 45.00, category: "sports", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80", stockQuantity: 30, isActive: true },
  // Toys
  { name: "DIY Hydro-Electric Turbine Engine", description: "Educational green power mechanical build clean water physics project.", price: 39.99, category: "toys", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80", stockQuantity: 20, isActive: true },
  { name: "Canvas Indoor Teepee Tent", description: "Collapsible children playroom structural reading cozy nook lounge.", price: 65.00, category: "toys", imageUrl: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=600&q=80", stockQuantity: 12, isActive: true },
  { name: "Pocket Electronic Synthesizer", description: "Mini 8-bit sequencing sound generation creative rhythm tool.", price: 79.00, category: "toys", imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=600&q=80", stockQuantity: 15, isActive: true },
  // Home
  { name: "Minimalist Floating Shelves", description: "3-piece set solid white oak hidden wall support mounts.", price: 42.50, category: "home", imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80", stockQuantity: 25, isActive: true },
  { name: "Washed Waffle Bath Towels", description: "Ultra absorbent quick dry light turkish combed cotton pack.", price: 54.00, category: "home", imageUrl: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=600&q=80", stockQuantity: 35, isActive: true },
  { name: "Linen Handwoven Storage Basket", description: "Collapsible neat organizer bin fitted with thick loop handles.", price: 24.00, category: "home", imageUrl: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=600&q=80", stockQuantity: 40, isActive: true },
  // Jewelry
  { name: "Polished Chevron V-Ring", description: "Delicate stacking geometry band crafted in 14k rose gold veneer.", price: 65.00, category: "jewelry", imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80", stockQuantity: 30, isActive: true },
  { name: "Malachite Intaglio Cufflinks", description: "Stunning patterned dark green luxury formal shirt dress studs.", price: 85.00, category: "jewelry", imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80", stockQuantity: 14, isActive: true },
  { name: "Layered Dainty Anklet",
    description: "Shimmering double-strand silver chain designed with minimal sphere accents.",
    price: 32.00,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=600&q=80",
    stockQuantity: 45,
    isActive: true
  }
];

// Real products to replace artificial "Premium Edition" items
const additionalProducts = [
  // Electronics
  { name: "DJI Mini 4 Pro Drone", description: "Lightweight drone under 249g with 4K/60fps HDR video.", price: 759.00, category: "electronics", imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80", stockQuantity: 8, isActive: true },
  { name: "Sonos Era 300 Speaker", description: "Spatial audio smart speaker with Dolby Atmos and WiFi streaming.", price: 449.00, category: "electronics", imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80", stockQuantity: 12, isActive: true },
  { name: "Wacom Intuos Pro Medium", description: "Professional drawing tablet with 8192 pressure levels.", price: 379.00, category: "electronics", imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80", stockQuantity: 15, isActive: true },
  // Clothing
  { name: "Patagonia Better Sweater", description: "Recycled polyester fleece with quarter-zip for layering.", price: 139.00, category: "clothing", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80", stockQuantity: 20, isActive: true },
  { name: "Reformation Silk Slip Dress", description: "Made-from-flow silk charmeuse dress with bias cut.", price: 198.00, category: "clothing", imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80", stockQuantity: 25, isActive: true },
  { name: "Acne Studios Scarf", description: "100% cashmere oversized scarf in classic design.", price: 295.00, category: "clothing", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", stockQuantity: 18, isActive: true },
  // Shoes
  { name: "Salomon X Ultra GTX", description: "Waterproof hiking shoes with Gore-Tex membrane.", price: 159.00, category: "shoes", imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80", stockQuantity: 14, isActive: true },
  { name: "Vans Old Skool Pro", description: "Classic skate shoes with UltraCush HD cushioning.", price: 85.00, category: "shoes", imageUrl: "https://images.unsplash.com/photo-1605405748313-a416a1b84491?auto=format&fit=crop&w=600&q=80", stockQuantity: 30, isActive: true },
  { name: "Cole Haan Ballet Flats", description: "Leather point-toe flats with Grand.OS technology.", price: 125.00, category: "shoes", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80", stockQuantity: 22, isActive: true },
  // Books
  { name: "Atomic Habits Journal", description: "Interactive guide to building good habits daily.", price: 19.99, category: "books", imageUrl: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=600&q=80", stockQuantity: 35, isActive: true },
  { name: "Night Sky Photoguide", description: "Complete guide to astrophotography for beginners.", price: 35.00, category: "books", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80", stockQuantity: 15, isActive: true },
  { name: "Nordic Baking Book", description: "Scandinavian bread and pastry recipes collection.", price: 32.00, category: "books", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80", stockQuantity: 20, isActive: true },
  // Food
  { name: "AeroPress Coffee Maker", description: "Portable brewing device for smooth rich coffee.", price: 39.00, category: "food", imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80", stockQuantity: 30, isActive: true },
  { name: "Maldon Sea Salt", description: "Pyramid-shaped flaky sea salt from Essex.", price: 9.00, category: "food", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", stockQuantity: 50, isActive: true },
  { name: "Martinelli's Apple Juice", description: "Organic unfiltered apple cider from fresh apples.", price: 7.50, category: "food", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80", stockQuantity: 40, isActive: true },
  // Beauty
  { name: "The Ordinary Retinol Serum", description: "1% retinol serum for anti-aging skincare.", price: 12.90, category: "beauty", imageUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&q=80", stockQuantity: 45, isActive: true },
  { name: "Beautycounter Countertime", description: "Anti-aging skincare set with retinoid complex.", price: 148.00, category: "beauty", imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80", stockQuantity: 18, isActive: true },
  { name: "CeraVe Hydrating Cleanser", description: "Gentle foaming cleanser for normal to oily skin.", price: 14.00, category: "beauty", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", stockQuantity: 50, isActive: true },
  // Sports
  { name: "Crossrope Jump Rope", description: "Weighted jump rope for HIIT cardio training.", price: 45.00, category: "sports", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80", stockQuantity: 35, isActive: true },
  { name: "Theragun Mini", description: "Compact percussion massage device for muscle recovery.", price: 199.00, category: "sports", imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f866cb?auto=format&fit=crop&w=600&q=80", stockQuantity: 12, isActive: true },
  { name: "Oakley Sport Sunglasses", description: "Polarized sport sunglasses with PRIZM lens technology.", price: 178.00, category: "sports", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80", stockQuantity: 20, isActive: true },
  // Toys
  { name: "LEGO Star Wars X-Wing", description: "Classic Star Wars fighters construction set with 472 pieces.", price: 54.99, category: "toys", imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80", stockQuantity: 25, isActive: true },
  { name: "KidKraft Teepee", description: "Canvas play tent with fabric floor and flags.", price: 89.00, category: "toys", imageUrl: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=600&q=80", stockQuantity: 15, isActive: true },
  { name: "Korg Mini Synth", description: "Pocket-sized analog synthesizer with keys.", price: 129.00, category: "toys", imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=600&q=80", stockQuantity: 10, isActive: true },
  // Home
  { name: "Eames Hang Calendar", description: "Mid-century wall calendar with aluminum graphics.", price: 49.00, category: "home", imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80", stockQuantity: 18, isActive: true },
  { name: "Brooklinen Towels", description: "Supima cotton bath towels in soft plush weave.", price: 95.00, category: "home", imageUrl: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=600&q=80", stockQuantity: 25, isActive: true },
  { name: "Bamboo Storage Basket", description: "Collapsible storage bin with woven bamboo.", price: 35.00, category: "home", imageUrl: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=600&q=80", stockQuantity: 30, isActive: true },
  // Jewelry
  { name: "Catbird stacking Ring", description: "14k gold fill delicate stacking ring set.", price: 85.00, category: "jewelry", imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80", stockQuantity: 25, isActive: true },
  { name: "Tiffany Cufflinks", description: "Sterling silver classic cufflinks in box.", price: 225.00, category: "jewelry", imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80", stockQuantity: 10, isActive: true },
  { name: "Mejuri Anklet", description: "14k solid gold delicate cable chain anklet.", price: 95.00, category: "jewelry", imageUrl: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=600&q=80", stockQuantity: 20, isActive: true },
];

sampleProducts.push(...additionalProducts);

async function seedData() {
  try {
    console.log('[OK] Connecting to MongoDB database...');
    await connectDB();

    // Seed categories
    await Category.deleteMany({});
    console.log('[OK] Old categories cleared.');
    const categoryList = [
      { name: 'electronics', description: 'Cutting-edge gadgets and tech essentials' },
      { name: 'clothing', description: 'Fashion-forward apparel for every style' },
      { name: 'shoes', description: 'Footwear for all occasions' },
      { name: 'books', description: 'Literary treasures and knowledge guides' },
      { name: 'food', description: 'Gourmet culinary delights and beverages' },
      { name: 'beauty', description: 'Skincare and cosmetic products' },
      { name: 'sports', description: 'Athletic gear and fitness equipment' },
      { name: 'toys', description: 'Fun and educational playthings' },
      { name: 'home', description: 'Home decor and living essentials' },
      { name: 'jewelry', description: 'Elegant accessories and timepieces' }
    ];
    await Category.insertMany(categoryList);
    console.log(`[OK] Seeded ${categoryList.length} categories!`);

    // Seed products
    await Product.deleteMany({});
    console.log('[OK] Old products cleared from database.');

    await Product.insertMany(sampleProducts);
    console.log(`[OK] Success! Seeded your database with exactly ${sampleProducts.length} high-fidelity products!`);

    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Error seeding database:', error);
    process.exit(1);
  }
}

seedData();