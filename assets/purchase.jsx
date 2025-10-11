/** UMD version for CDN React + Babel in-browser **/
/** ใช้ React global จาก <script> UMD แทน import  **/
const { useState, useEffect } = React;

// ---------- URL Apps Script (ใส่ของคุณแทน) ----------
const WEB_APP_URL = "https://script.google.com/macros/s/PASTE_YOUR_WEB_APP_ID/exec";

// ---------- Types (Babel preset: typescript เปิดไว้ใน HTML แล้ว) ----------
type FormState = {
  fullName: string;
  email: string;
  phone: string;
  mt5: string;
  purchaseDate: string; // yyyy-mm-dd
  slip: File | null;
};

type ValidateResult = Record<string, string>;

// Pure function (แยกไว้เพื่อให้ทดสอบได้ง่าย)
function validatePurchaseForm(selectedPackage: string, values: FormState): ValidateResult {
  const e: ValidateResult = {};
  if (!values.fullName.trim()) e.fullName = "กรุณากรอกชื่อ-นามสกุล";
  if (!values.email) e.email = "กรุณากรอกอีเมล";
  else if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(values.email)) e.email = "อีเมลไม่ถูกต้อง";
  if (!values.phone) e.phone = "กรุณากรอกเบอร์โทร";
  if (selectedPackage === "IRT GOLD PC" && !values.mt5) e.mt5 = "กรุณากรอกหมายเลขพอร์ต MT5";
  if (!values.purchaseDate) e.purchaseDate = "กรุณาเลือกวันที่ซื้อ";
  if (!values.slip) e.slip = "กรุณาอัปโหลดสลิปโอนเงิน";
  return e;
}

// ---------- รูปเริ่มต้น ----------
const DEFAULTS = {
  heroUrl:
    "https://images.unsplash.com/photo-1601597111158-d1a2169d7b2b?q=80&w=1600&auto=format&fit=crop",
  pcImgUrl:
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
  mbImgUrl:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
};

// ---------- ฟอร์ม ----------
function PurchaseForm({
  selectedPackage,
  setSelectedPackage,
}: {
  selectedPackage: string;
  setSelectedPackage: (v: string) => void;
}) {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    mt5: "",
    purchaseDate: "",
    slip: null,
  });
  const [errors, setErrors] = useState<ValidateResult>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validatePurchaseForm(selectedPackage, form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    setSuccess(null);

    try {
      // TODO: fetch ไปหา WEB_APP_URL ตามที่ต้องการ
      await new Promise((r) => setTimeout(r, 800));
      setSuccess("ส่งข้อมูลเรียบร้อย! ทีมงานจะตรวจสอบภายใน 24 ชั่วโมง");
      setForm({ fullName: "", email: "", phone: "", mt5: "", purchaseDate: "", slip: null });
    } catch (err) {
      setErrors({ submit: "เกิดข้อผิดพลาดขณะส่งข้อมูล" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500">
      <h2 className="text-2xl font-semibold text-center mb-2 text-indigo-700">ฟอร์มสั่งซื้อแพ็กเกจ</h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        เลือกแพ็กเกจ ชำระเงิน และอัปโหลดสลิปเพื่อยืนยันการสั่งซื้อ
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 ${
            selectedPackage === "IRT GOLD PC"
              ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
              : "border-gray-200 hover:border-indigo-300"
          }`}
          onClick={() => setSelectedPackage("IRT GOLD PC")}
        >
          <h3 className="font-bold text-indigo-700">IRT GOLD PC</h3>
          <p className="text-sm text-gray-600">สำหรับใช้งานบนคอมพิวเตอร์</p>
          <p className="text-lg font-semibold text-indigo-600 mt-2">฿4,590</p>
        </div>

        <div
          className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 ${
            selectedPackage === "IRT GOLD MB"
              ? "border-green-500 bg-green-50 scale-[1.02]"
              : "border-gray-200 hover:border-green-300"
          }`}
          onClick={() => setSelectedPackage("IRT GOLD MB")}
        >
          <h3 className="font-bold text-green-700">IRT GOLD MB</h3>
          <p className="text-sm text-gray-600">สำหรับใช้งานบนมือถือ</p>
          <p className="text-lg font-semibold text-green-600 mt-2">฿2,390</p>
        </div>
      </div>

      <div className="bg-gray-50 border rounded-xl p-4 mb-6">
        <p className="font-medium text-gray-800">💳 ธนาคารกสิกรไทย</p>
        <p className="text-gray-700">ชื่อบัญชี: บริษัท ไออาร์ที เทรดดิ้ง จำกัด</p>
        <p className="text-gray-700">
          เลขที่บัญชี: <span className="font-semibold">123-4-56789-0</span>
        </p>
        <p className="text-gray-500 text-sm mt-1">(โปรดตรวจสอบยอดก่อนโอน)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ชื่อ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
              errors.fullName ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="เช่น สมชาย ใจดี"
          />
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
        </div>

        {/* อีเมล */}
        <div>
          <label className="block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
              errors.email ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* โทร */}
        <div>
          <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
              errors.phone ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="เช่น 0812345678"
          />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* MT5 เฉพาะ PC */}
        {selectedPackage === "IRT GOLD PC" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">หมายเลขพอร์ต MT5</label>
            <input
              value={form.mt5}
              onChange={(e) => setForm({ ...form, mt5: e.target.value })}
              className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
                errors.mt5 ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="กรอกหมายเลขพอร์ต MT5"
            />
            {errors.mt5 && <p className="text-xs text-red-600">{errors.mt5}</p>}
          </div>
        )}

        {/* วันที่ซื้อ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">วันที่ซื้อ</label>
          <input
            type="date"
            value={form.purchaseDate}
            onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
              errors.purchaseDate ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.purchaseDate && <p className="text-xs text-red-600">{errors.purchaseDate}</p>}
        </div>

        {/* สลิป */}
        <div>
          <label className="block text-sm font-medium text-gray-700">อัปโหลดสลิปโอนเงิน</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e /** @type {React.ChangeEvent<HTMLInputElement>} */) =>
              setForm({ ...form, slip: e.target.files?.[0] ?? null })
            }
            className="mt-1 block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-indigo-50 hover:file:bg-indigo-100"
          />
          {errors.slip && <p className="text-xs text-red-600">{errors.slip}</p>}
        </div>

        {errors.submit && <p className="text-sm text-red-600 text-center">{errors.submit}</p>}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-xl py-2 font-semibold text-white shadow-md transition-transform ${
            submitting
              ? "bg-indigo-300 cursor-wait"
              : "bg-gradient-to-r from-indigo-600 to-green-500 hover:scale-[1.02]"
          }`}
        >
          {submitting ? "กำลังส่งข้อมูล..." : "ยืนยันการสั่งซื้อ"}
        </button>
      </form>

      {/* success overlay */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-4 rounded-xl shadow-xl text-center">
            <p className="font-semibold mb-1">✅ {success}</p>
            <button onClick={() => setSuccess(null)} className="mt-2 text-sm text-green-700 underline">
              ปิด
            </button>
          </div>
        </div>
      )}

      <footer className="mt-6 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} IRT — ระบบสั่งซื้อแพ็กเกจ
      </footer>
    </div>
  );
}

// ---------- หน้าเว็บหลัก ----------
function Page({ initPackage }: { initPackage?: string }) {
  const [selectedPackage, setSelectedPackage] = useState(initPackage || "IRT GOLD PC");
  const [urls, setUrls] = useState(DEFAULTS);

  // รับ event จากปุ่ม “สั่งซื้อเลย”/การ์ด
  useEffect(() => {
    const onSelect = (e: any) => e?.detail && setSelectedPackage(e.detail);
    window.addEventListener("irt:select-package", onSelect);
    return () => window.removeEventListener("irt:select-package", onSelect);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* แถบแก้ URL รูป */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <span className="text-sm font-medium text-gray-700">🔧 เปลี่ยนรูป (วางเป็น URL):</span>
          <input className="w-full md:w-1/3 rounded-lg border px-3 py-1.5 text-sm"
            placeholder="Hero URL" value={urls.heroUrl}
            onChange={(e) => setUrls({ ...urls, heroUrl: e.target.value })} />
          <input className="w-full md:w-1/4 rounded-lg border px-3 py-1.5 text-sm"
            placeholder="PC Image URL" value={urls.pcImgUrl}
            onChange={(e) => setUrls({ ...urls, pcImgUrl: e.target.value })} />
          <input className="w-full md:w-1/4 rounded-lg border px-3 py-1.5 text-sm"
            placeholder="MB Image URL" value={urls.mbImgUrl}
            onChange={(e) => setUrls({ ...urls, mbImgUrl: e.target.value })} />
        </div>
      </div>

      {/* การ์ดรูป */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden shadow border">
            <img src={urls.pcImgUrl} alt="IRT GOLD PC" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl md:text-2xl font-extrabold text-indigo-700">IRT GOLD PC</h3>
              <p className="text-sm text-gray-600 mt-1">สำหรับใช้งานบนคอมพิวเตอร์ • ฿4,590</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow border">
            <img src={urls.mbImgUrl} alt="IRT GOLD MB" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl md:text-2xl font-extrabold text-green-700">IRT GOLD MB</h3>
              <p className="text-sm text-gray-600 mt-1">สำหรับใช้งานบนมือถือ • ฿2,390</p>
            </div>
          </div>
        </div>
      </div>

      {/* ฟอร์ม */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <PurchaseForm selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} />
      </div>

      <div className="h-10" />
    </div>
  );
}

/** --- Dev Test Harness (optional) --- */
if (typeof window !== "undefined" && window.__RUN_PURCHASE_PAGE_TESTS__) {
  const base: FormState = {
    fullName: "",
    email: "bad@email",
    phone: "",
    mt5: "",
    purchaseDate: "",
    slip: null,
  };

  console.group("PurchaseForm validate tests");
  const r1 = validatePurchaseForm("IRT GOLD PC", base);
  console.assert(
    !!r1.fullName && !!r1.email && !!r1.phone && !!r1.mt5 && !!r1.purchaseDate && !!r1.slip,
    "TC1 failed"
  );

  const okMB: FormState = {
    fullName: "สมชาย ใจดี",
    email: "ok@example.com",
    phone: "0812345678",
    mt5: "",
    purchaseDate: "2025-01-01",
    slip: new File(["x"], "slip.png"),
  };
  const r2 = validatePurchaseForm("IRT GOLD MB", okMB);
  console.assert(Object.keys(r2).length === 0, "TC2 failed");

  const pcNoMt5: FormState = { ...okMB, mt5: "", slip: new File(["x"], "s.png") };
  const r3 = validatePurchaseForm("IRT GOLD PC", pcNoMt5);
  console.assert(!!r3.mt5, "TC3 failed");

  const noSlip: FormState = { ...okMB, slip: null };
  const r4 = validatePurchaseForm("IRT GOLD MB", noSlip);
  console.assert(!!r4.slip, "TC4 failed");

  const okPC: FormState = {
    fullName: "A B",
    email: "a@b.com",
    phone: "0123456789",
    mt5: "123456",
    purchaseDate: "2025-02-01",
    slip: new File(["x"], "ok.png"),
  };
  const r5 = validatePurchaseForm("IRT GOLD PC", okPC);
  console.assert(Object.keys(r5).length === 0, "TC5 failed");

  console.groupEnd();
}

// 👇 สำคัญ: ให้ HTML เรียก root.render(<Page />) ได้
// ห้ามใช้ export default เมื่อรันผ่าน CDN+UMD
window.Page = Page;
