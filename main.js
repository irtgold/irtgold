/* ===================================
   IRT GOLD - Main JavaScript
   Version: 5.0
   =================================== */

// ================================
// 🔗 Image Base URL
// ================================
const IMG_BASE = 'Github_web';
const TOTAL_REVIEWS = 26;

// ================================
// Navigation
// ================================
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

let menuOpen = false;
function toggleMenu() {
  menuOpen = !menuOpen;
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('menuIcon');
  if (menuOpen) {
    menu.classList.remove('hidden');
    icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
  } else {
    menu.classList.add('hidden');
    icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>';
  }
}

// ================================
// Countdown Timer
// ================================
let hours = 23, minutes = 59, seconds = 59;

function updateTimer() {
  if (seconds > 0) { seconds--; }
  else if (minutes > 0) { minutes--; seconds = 59; }
  else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
  else { hours = 23; minutes = 59; seconds = 59; }
  
  document.getElementById('cHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cMins').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cSecs').textContent = String(seconds).padStart(2, '0');
}
setInterval(updateTimer, 1000);

// ================================
// AI Chat
// ================================
const aiResponses = [
  "IRT GOLD บอกจุดเข้าซื้อ/ขายชัดเจน พร้อมเป้ากำไร 2 จุด (TP1, TP2) และจุดตัดขาดทุน (SL) AI แจ้งเตือนผ่าน Telegram 24 ชม. ครับ",
  "ระบบใช้ได้ทั้งคอมและมือถือ รองรับทุกตลาด ทั้งทองคำ, Forex, Crypto, หุ้น ซื้อครั้งเดียวใช้ได้หมดครับ!",
  "ตอนนี้ราคาพิเศษ 3,290 บาท ก่อนปรับขึ้นเป็น 15,000 บาท! แถมคอร์สเรียนมูลค่า 21,900 บาทฟรีด้วยครับ",
  "ซื้อครั้งเดียวจบครับ ไม่ต้องต่อ IB ไม่มีค่ารายเดือน ใช้ได้ตลอดชีพ พร้อมคอร์สเรียนฟรีมูลค่า 21,900 บาท!",
  "ระบบมี 4 เครื่องมือ: Dashboard, Harmonic, Signal, แนวรับ-แนวต้าน ทั้งหมดอยู่ในหน้าจอเดียว ใช้งานง่ายมากครับ"
];

function askAi() {
  const input = document.getElementById('aiInput');
  const responseDiv = document.getElementById('aiResponse');
  if (!input.value.trim()) return;
  
  const btn = document.getElementById('aiBtn');
  btn.innerHTML = '<div class="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>';
  responseDiv.classList.add('hidden');
  
  setTimeout(() => {
    const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    responseDiv.innerHTML = `
      <div class="bg-white p-4 rounded-xl max-w-md mx-auto shadow-2xl text-left">
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-xs">🤖</div>
          <div>
            <div class="text-[10px] font-bold text-blue-600 mb-1">IRT AI</div>
            <p class="text-xs text-slate-700 leading-relaxed">${response}</p>
          </div>
        </div>
      </div>`;
    responseDiv.classList.remove('hidden');
    btn.innerHTML = '➤';
    input.value = '';
  }, 1500);
}

// ================================
// Testimonials Carousel
// ================================
const testimonials = [
  { name: "คุณนพดล S.", role: "Day Trader, กรุงเทพฯ", text: "ใช้มา 3 เดือน กำไรเพิ่มขึ้น 40%! Dashboard ช่วยได้มาก มองเห็นภาพรวมชัดเจน", profit: "+40%", avatar: "น" },
  { name: "คุณสมหญิง T.", role: "Part-time Trader", text: "เป็นมือใหม่ แต่ใช้ได้ง่ายมาก Signal ชัดเจน 2 เดือนแรกทำกำไรได้แล้ว!", profit: "กำไรใน 2 เดือน", avatar: "ส" },
  { name: "คุณวิชัย P.", role: "Professional Trader", text: "ทดสอบมาหลาย Indicator แล้ว IRT GOLD เป็นตัวที่ดีที่สุดสำหรับเทรดทอง", profit: "Best for Gold", avatar: "ว" },
  { name: "คุณเอก", role: "Full-time Trader", text: "รวดเร็วทันใจ บริการดีมาก ทีมงานช่วยแนะนำชัดเจน ประทับใจ", profit: "Service 5 ดาว", avatar: "อ" },
  { name: "คุณเมย์", role: "พนักงานประจำ", text: "ไม่มีเวลาดูจอ แต่ระบบแจ้งเตือน Telegram ช่วยได้มาก ทำงานอยู่ก็เทรดได้", profit: "เหมาะกับคนยุ่ง", avatar: "ม" },
];

let activeTestimonial = 0;

function renderTestimonial() {
  const t = testimonials[activeTestimonial];
  document.getElementById('tAvatar').textContent = t.avatar;
  document.getElementById('tName').textContent = t.name;
  document.getElementById('tRole').textContent = t.role;
  document.getElementById('tProfit').textContent = t.profit;
  document.getElementById('tText').textContent = `"${t.text}"`;
  
  // Dots
  const dots = document.getElementById('tDots');
  dots.innerHTML = '';
  testimonials.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`;
    dot.onclick = () => { activeTestimonial = i; renderTestimonial(); };
    dots.appendChild(dot);
  });
}

setInterval(() => {
  activeTestimonial = (activeTestimonial + 1) % testimonials.length;
  renderTestimonial();
}, 5000);

// ================================
// Review Preview (6 images)
// ================================
function renderReviewPreview() {
  const container = document.getElementById('reviewPreview');
  for (let i = 1; i <= 6; i++) {
    const div = document.createElement('div');
    div.className = 'aspect-square rounded-xl overflow-hidden border border-slate-200 hover:border-blue-300 transition-all cursor-pointer';
    div.onclick = () => openReviews();
    div.innerHTML = `<img src="${IMG_BASE}/Rw/Rw%20(${i}).png" alt="รีวิว ${i}" class="w-full h-full object-cover">`;
    container.appendChild(div);
  }
}

// ================================
// Reviews Modal
// ================================
function openReviews() {
  const modal = document.getElementById('reviewsModal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderReviewsGrid();
}

function closeReviews() {
  document.getElementById('reviewsModal').classList.add('hidden');
  document.body.style.overflow = '';
  closeLightbox();
}

function renderReviewsGrid() {
  const grid = document.getElementById('reviewsGrid');
  if (grid.children.length > 0) return; // already rendered
  
  for (let i = 1; i <= TOTAL_REVIEWS; i++) {
    const div = document.createElement('div');
    div.className = 'review-item aspect-square rounded-xl overflow-hidden border-2 border-slate-200 hover:border-blue-400 transition-all cursor-pointer relative';
    div.onclick = () => openLightbox(i - 1);
    div.innerHTML = `
      <img src="${IMG_BASE}/Rw/Rw%20(${i}).png" alt="รีวิว ${i}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all">
        <div class="opacity-0 hover:opacity-100 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center transition-all">🔍</div>
      </div>`;
    grid.appendChild(div);
  }
}

// ================================
// Lightbox
// ================================
let currentImage = 0;

function openLightbox(index) {
  currentImage = index;
  const lb = document.getElementById('lightbox');
  lb.classList.remove('hidden');
  updateLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
}

function updateLightbox() {
  document.getElementById('lbImage').src = `${IMG_BASE}/Rw/Rw%20(${currentImage + 1}).png`;
  document.getElementById('lbCounter').textContent = `${currentImage + 1} / ${TOTAL_REVIEWS}`;
}

function prevImage() {
  currentImage = currentImage > 0 ? currentImage - 1 : TOTAL_REVIEWS - 1;
  updateLightbox();
}

function nextImage() {
  currentImage = currentImage < TOTAL_REVIEWS - 1 ? currentImage + 1 : 0;
  updateLightbox();
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  if (document.getElementById('lightbox').classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'Escape') closeLightbox();
});

// ================================
// FAQ
// ================================
const faqs = [
  { q: "ใช้งาน IRT GOLD ยากไหม?", a: "ง่ายมากค่ะ! ระบบออกแบบมาให้ใช้งานง่าย AI ช่วยแจ้งสัญญาณให้ตลอด 24 ชม. ไม่ต้องนั่งเฝ้ากราฟทั้งวัน ทั้งหมดนี้ระบบคิดให้หมด แค่ทำตามได้เลย 👍" },
  { q: "ใช้ได้กับตลาดอะไรบ้าง?", a: "ใช้ได้กับทุกตลาดเลยค่ะ! ทองคำ, Forex ทุกคู่เงิน, Crypto, หุ้นไทย, หุ้นต่างประเทศ และทุกคู่ที่มีใน MT4/MT5" },
  { q: "ใช้ได้ทั้งคอมและมือถือไหม?", a: "ได้ค่ะ! ซื้อครั้งเดียวได้ครบทั้ง PC และ Mobile (2 เครื่อง) ไม่ต้องจ่ายเพิ่ม" },
  { q: "ต้องนั่งเฝ้าหน้าจอตลอดไหม?", a: "ไม่ต้องค่ะ! AI แจ้งสัญญาณอัตโนมัติ 24 ชม. ส่งแจ้งเตือนตรงถึง Telegram บอกชัดเจนว่า ซื้อตรงไหน, ขายทำกำไรตรงไหน, ตัดขาดทุนตรงไหน" },
  { q: "จ่ายครั้งเดียวหรือรายเดือน?", a: "จ่ายครั้งเดียวจบค่ะ! ไม่ต้องต่อ IB ไม่มีค่ารายเดือน ใช้ได้ตลอดชีพ" },
  { q: "ราคาเท่าไหร่?", a: "ตอนนี้ราคาพิเศษ 3,290 บาท ครบจบในที่เดียว! ก่อนปรับขึ้นเป็น 15,000 บาท 🔥" }
];

let openFaq = null;

function renderFaqs() {
  const container = document.getElementById('faqContainer');
  faqs.forEach((faq, index) => {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl overflow-hidden border border-slate-100';
    div.innerHTML = `
      <button onclick="toggleFaq(${index})" class="w-full px-5 py-4 text-left flex justify-between items-center gap-4">
        <span class="font-bold text-sm text-slate-800">${faq.q}</span>
        <svg class="w-4 h-4 text-slate-400 faq-chevron" id="faqChevron${index}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-answer px-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100" id="faqAnswer${index}">
        ${faq.a}
      </div>`;
    container.appendChild(div);
  });
}

function toggleFaq(index) {
  const answer = document.getElementById(`faqAnswer${index}`);
  const chevron = document.getElementById(`faqChevron${index}`);
  
  if (openFaq === index) {
    answer.classList.remove('open');
    chevron.classList.remove('rotated');
    openFaq = null;
  } else {
    // Close previous
    if (openFaq !== null) {
      document.getElementById(`faqAnswer${openFaq}`).classList.remove('open');
      document.getElementById(`faqChevron${openFaq}`).classList.remove('rotated');
    }
    answer.classList.add('open');
    chevron.classList.add('rotated');
    openFaq = index;
  }
}

// ================================
// Initialize
// ================================
document.addEventListener('DOMContentLoaded', () => {
  renderTestimonial();
  renderReviewPreview();
  renderFaqs();
});
