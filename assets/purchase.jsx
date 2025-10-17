/** assets/purchase.jsx (UMD + Babel) */
const { useState, useEffect } = React;

// <<< ใส่ URL ของ Web App ที่เพิ่ง Deploy (ลงท้าย /exec) >>>
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwgGqBf4eF6e_PsLJf8DGHrYhkrtehwRlG9Cok8CmBKyMMUwznAbRyN5OQZAJDfPNpjdw/exec";

// ----- ตรวจฟอร์ม -----
function validatePurchaseForm(selectedPackage, values) {
  const e = {};
  if (!values.fullName || !values.fullName.trim()) e.fullName = "กรุณากรอกชื่อ-นามสกุล";
  if (!values.email) e.email = "กรุณากรอกอีเมล";
  else if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(values.email)) e.email = "อีเมลไม่ถูกต้อง";
  if (!values.phone) e.phone = "กรุณากรอกเบอร์โทร";
  if (selectedPackage === "IRT GOLD PC" && !values.mt5) e.mt5 = "กรุณากรอกหมายเลขพอร์ต MT5";
  if (!values.purchaseDate) e.purchaseDate = "กรุณาเลือกวันที่ซื้อ";
  if (!values.slip) e.slip = "กรุณาอัปโหลดสลิปโอนเงิน";
  return e;
}

// ----- รูปเริ่มต้น -----
const DEFAULTS = {
  heroUrl: "Github-p/bn/bn.png",
  pcImgUrl: "Github-p/irtpc/irtpc1.png",
  mbImgUrl: "Github-p/itrmb/mb1.png",
};

// ----- ฟอร์มสั่งซื้อ -----
function PurchaseForm({ selectedPackage, setSelectedPackage }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    mt5: "",
    purchaseDate: "",
    slip: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validatePurchaseForm(selectedPackage, form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    setSuccess(null);

    try {
      const fd = new FormData();
      fd.append("selectedPackage", selectedPackage);
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("mt5", selectedPackage === "IRT GOLD PC" ? form.mt5 : "");
      fd.append("purchaseDate", form.purchaseDate);
      if (form.slip) fd.append("slip", form.slip, form.slip.name);

const res = await fetch(WEB_APP_URL, {
  method: "POST",
  body: fd,             // ส่ง FormData ตรง ๆ ไม่ต้องใส่ header เอง
  // ไม่ต้องใส่ mode/cache/header อะไรเพิ่มเติม
});

const data = await res.json().catch(() => ({}));
console.log("AppsScript response:", data);

if (!res.ok || !data.ok) {
  throw new Error(data.error || data.msg || `HTTP ${res.status}`);
}


      setSuccess("ส่งข้อมูลเรียบร้อย! ทีมงานจะตรวจสอบภายใน 24 ชั่วโมง");
      setForm({ fullName: "", email: "", phone: "", mt5: "", purchaseDate: "", slip: null });
    } catch (err) {
      console.error("submit error:", err);
      setErrors({ submit: `เกิดข้อผิดพลาดขณะส่งข้อมูล: ${String(err.message || err)}` });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500">
      <h2 className="text-2xl font-semibold text-center mb-2 text-indigo-700">สั่งซื้อแพ็กเกจ</h2>
      <p className="text-center text-sm text-gray-500 mb-6">เลือกแพ็กเกจ ชำระเงิน และอัปโหลดสลิปเพื่อยืนยันการสั่งซื้อ</p>

      {/* เลือกแพ็กเกจ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 ${
            selectedPackage === "IRT GOLD PC" ? "border-indigo-500 bg-indigo-50 scale-[1.02]" : "border-gray-200 hover:border-indigo-300"
          }`}
          onClick={() => setSelectedPackage("IRT GOLD PC")}
        >
          <h3 className="font-bold text-indigo-700 flex items-center gap-2">
            <img src="Github-p/icon/Pc.png" alt="PC" className="h-5 w-5 object-contain" />
            IRT GOLD PC
          </h3>
          <p className="text-sm text-gray-600">สำหรับใช้งานบนคอมพิวเตอร์</p>
          <p className="text-lg font-semibold text-indigo-600 mt-2">฿4,590</p>
        </div>

        <div
          className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 ${
            selectedPackage === "IRT GOLD MB" ? "border-green-500 bg-green-50 scale-[1.02]" : "border-gray-200 hover:border-green-300"
          }`}
          onClick={() => setSelectedPackage("IRT GOLD MB")}
        >
          <h3 className="font-bold text-green-700 flex items-center gap-2">
            <img src="Github-p/icon/Mb.png" alt="Mobile" className="h-5 w-5 object-contain" />
            IRT GOLD MB
          </h3>
          <p className="text-sm text-gray-600">สำหรับใช้งานบนมือถือ</p>
          <p className="text-lg font-semibold text-green-600 mt-2">฿2,390</p>
        </div>
      </div>

      {/* ฟอร์มข้อมูลลูกค้า */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${errors.fullName ? "border-red-300" : "border-gray-200"}`}
            placeholder="เช่น ศุภวัสส์ เลิศฐาชัยพรกุล "
          />
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${errors.email ? "border-red-300" : "border-gray-200"}`}
            placeholder="you1234@gmail.com"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${errors.phone ? "border-red-300" : "border-gray-200"}`}
            placeholder="เช่น 0812345678"
          />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
        </div>

        {selectedPackage === "IRT GOLD PC" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">หมายเลขพอร์ต MT5</label>
            <input
              value={form.mt5}
              onChange={(e) => setForm({ ...form, mt5: e.target.value })}
              className={`mt-1 block w-full rounded-xl border px-3 py-2 ${errors.mt5 ? "border-red-300" : "border-gray-200"}`}
              placeholder="กรอกหมายเลขพอร์ต MT5 เช่น 100400"
            />
            {errors.mt5 && <p className="text-xs text-red-600">{errors.mt5}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">วันที่ซื้อ</label>
          <input
            type="date"
            value={form.purchaseDate}
            onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${errors.purchaseDate ? "border-red-300" : "border-gray-200"}`}
          />
          {errors.purchaseDate && <p className="text-xs text-red-600">{errors.purchaseDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">อัปโหลดสลิปโอนเงิน</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, slip: e.target.files?.[0] ?? null })}
            className="mt-1 block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-indigo-50 hover:file:bg-indigo-100"
          />
          {errors.slip && <p className="text-xs text-red-600">{errors.slip}</p>}
        </div>

        {errors.submit && <p className="text-sm text-red-600 text-center">{errors.submit}</p>}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-xl py-2 font-semibold text-white shadow-md transition-transform ${
            submitting ? "bg-indigo-300 cursor-wait" : "bg-gradient-to-r from-indigo-600 to-green-500 hover:scale-[1.02]"
          }`}
        >
          {submitting ? "กำลังส่งข้อมูล..." : "ยืนยันการสั่งซื้อ"}
        </button>
      </form>

      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-4 rounded-xl shadow-xl text-center">
            <p className="font-semibold mb-1">✅ {success}</p>
            <button onClick={() => setSuccess(null)} className="mt-2 text-sm text-green-700 underline">ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----- หน้า Page -----
function Page({ initPackage }) {
  const [selectedPackage, setSelectedPackage] = useState(initPackage || "IRT GOLD PC");
  const [urls] = useState(DEFAULTS);

  useEffect(() => {
    const onSelect = (e) => e && e.detail && setSelectedPackage(e.detail);
    window.addEventListener("irt:select-package", onSelect);
    return () => window.removeEventListener("irt:select-package", onSelect);
  }, []);

  return (
    <div className="bg-white">
      <div className="w-full">
        <img src={urls.heroUrl} alt="IRT GOLD Banner" className="block w-full object-cover aspect-[21/8]" />
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 mb-10">
        <PurchaseForm selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} />
      </div>
    </div>
  );
}
window.Page = Page;
