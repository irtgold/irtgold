/** assets/purchase.jsx - ฉบับส่งไฟล์แบบ Base64 + คำแนะนำเช็ค Spam + แสดงเลขบัญชี */
const { useState, useEffect } = React;

// ⭐ ใส่ Web App URL ของคุณที่นี่
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwUGeIiAEu3JkIjCIsQ3WyoJMYA7PZ90vEDrDsOSi6Pc2MHd2VIwbwUFI8GuQtoqK5VeQ/exec";

// ⭐ ข้อมูลบัญชีธนาคาร
const BANK_INFO = {
  bankName: "ธนาคารกสิกรไทย",
  accountName: "นาย.เลิศฐาชัยพรกุล 1994",
  accountNumber: "216-8-19894-1",
  bankLogo: "Github-p/icon/Kb.png" // หรือใส่ลิงก์โลโก้ของคุณ
};

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

// ⭐ ฟังก์ชันแปลงไฟล์เป็น Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ⭐ Component แสดงข้อมูลบัญชีธนาคาร
function BankAccountInfo() {
  const [copied, setCopied] = useState(false);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(BANK_INFO.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
          <span className="text-2xl">🏦</span>
          บัญชีสำหรับโอนเงิน
        </h3>
        <div className="bg-white px-3 py-1 rounded-full">
          <img 
            src={BANK_INFO.bankLogo} 
            alt="Bank Logo" 
            className="h-6 object-contain"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      </div>
      
      <div className="space-y-3 bg-white rounded-lg p-4 border border-green-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-500 mb-1">ธนาคาร</p>
            <p className="text-sm font-semibold text-gray-800">{BANK_INFO.bankName}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500 mb-1">ชื่อบัญชี</p>
          <p className="text-sm font-semibold text-gray-800">{BANK_INFO.accountName}</p>
        </div>
        
        <div className="border-t border-gray-100 pt-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">เลขที่บัญชี</p>
              <p className="text-xl font-bold text-green-700 tracking-wider font-mono">
                {BANK_INFO.accountNumber}
              </p>
            </div>
            <button
              onClick={copyAccountNumber}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span>คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span>คัดลอก</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-gray-700 flex items-start gap-2">
          <span className="text-base">💡</span>
          <span>
            <strong>คำแนะนำ:</strong> โอนเงินตามจำนวนที่เลือก จากนั้นอัปโหลดสลิปโอนเงินด้านล่าง
          </span>
        </p>
      </div>
    </div>
  );
}

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
    if (Object.keys(validation).length) {
      console.log('❌ Form validation failed:', validation);
      return;
    }

    setSubmitting(true);
    setSuccess(null);

    try {
      console.log('=== Starting form submission ===');
      console.log('📦 Package:', selectedPackage);
      console.log('👤 Name:', form.fullName);
      console.log('📧 Email:', form.email);

      let slipBase64 = '';
      let slipName = '';
      let slipType = '';

      if (form.slip && form.slip instanceof File) {
        console.log('📎 Converting file to Base64...');
        console.log('   File name:', form.slip.name);
        console.log('   File size:', form.slip.size, 'bytes');
        console.log('   File type:', form.slip.type);

        slipBase64 = await fileToBase64(form.slip);
        slipName = form.slip.name;
        slipType = form.slip.type;

        console.log('✅ Base64 conversion complete, length:', slipBase64.length);
      } else {
        console.error('❌ No valid file');
        throw new Error('กรุณาอัปโหลดสลิปโอนเงิน');
      }

      const fd = new FormData();
      fd.append("selectedPackage", selectedPackage);
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("mt5", selectedPackage === "IRT GOLD PC" ? form.mt5 : "");
      fd.append("purchaseDate", form.purchaseDate);
      fd.append("slipBase64", slipBase64);
      fd.append("slipName", slipName);
      fd.append("slipType", slipType);

      console.log('📤 Sending to:', WEB_APP_URL);

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: fd,
        redirect: 'follow'
      });

      console.log('📥 Response status:', res.status);
      console.log('📥 Response URL:', res.url);

      const contentType = res.headers.get("content-type");
      console.log('📥 Content-Type:', contentType);

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.log('📥 Response text:', text.substring(0, 200));
        throw new Error('Response is not JSON');
      }

      console.log('📥 Response data:', data);

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      console.log('✅ SUCCESS!');
      console.log('✅ Slip URL:', data.slipUrl);

      setSuccess("✅ ส่งข้อมูลเรียบร้อย! ทีมงานจะตรวจสอบภายใน 24 ชั่วโมง");

      setForm({
        fullName: "",
        email: "",
        phone: "",
        mt5: "",
        purchaseDate: "",
        slip: null
      });

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error('❌ Submit error:', err);
      setErrors({
        submit: `เกิดข้อผิดพลาด: ${String(err.message || err)}`
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500">
      <h2 className="text-2xl font-semibold text-center mb-2 text-indigo-700">สั่งซื้อแพ็กเกจ</h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        เลือกแพ็กเกจ ชำระเงิน และอัปโหลดสลิปเพื่อยืนยันการสั่งซื้อ
      </p>

      {/* เลือกแพ็กเกจ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 ${
            selectedPackage === "IRT GOLD PC"
              ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
              : "border-gray-200 hover:border-indigo-300"
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
            selectedPackage === "IRT GOLD MB"
              ? "border-green-500 bg-green-50 scale-[1.02]"
              : "border-gray-200 hover:border-green-300"
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

      {/* ⭐ แสดงข้อมูลบัญชีธนาคาร */}
      <BankAccountInfo />

      {/* ฟอร์มข้อมูลลูกค้า */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
              errors.fullName ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="เช่น ศุภวัสส์ เลิศฐาชัยพรกุล"
          />
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
              errors.email ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="you1234@gmail.com"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

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

        {selectedPackage === "IRT GOLD PC" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">หมายเลขพอร์ต MT5</label>
            <input
              value={form.mt5}
              onChange={(e) => setForm({ ...form, mt5: e.target.value })}
              className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
                errors.mt5 ? "border-red-300" : "border-gray-200"
              }`}
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
            className={`mt-1 block w-full rounded-xl border px-3 py-2 ${
              errors.purchaseDate ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.purchaseDate && <p className="text-xs text-red-600">{errors.purchaseDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">อัปโหลดสลิปโอนเงิน</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              console.log('📎 File selected:', file ? file.name : 'none');
              if (file) {
                console.log('   Size:', file.size, 'bytes');
                console.log('   Type:', file.type);
              }
              setForm({ ...form, slip: file });
            }}
            className="mt-1 block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-indigo-50 hover:file:bg-indigo-100"
          />
          {errors.slip && <p className="text-xs text-red-600">{errors.slip}</p>}
        </div>

        {errors.submit && (
          <div className="rounded-lg bg-red-50 p-3 border border-red-200">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-xl py-3 font-semibold text-white shadow-md transition-all ${
            submitting
              ? "bg-indigo-300 cursor-wait"
              : "bg-gradient-to-r from-indigo-600 to-green-500 hover:scale-[1.02] hover:shadow-lg"
          }`}
        >
          {submitting ? "⏳ กำลังส่งข้อมูล..." : "🚀 ยืนยันการสั่งซื้อ"}
        </button>
      </form>

      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">สำเร็จ!</h3>
            <p className="text-gray-700 mb-4">{success}</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-700 font-semibold mb-2">
                📧 เราได้ส่งอีเมลยืนยันไปแล้ว
              </p>
              <p className="text-xs text-gray-600 mb-2">
                หากไม่พบอีเมล กรุณาตรวจสอบที่:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>📂 โฟลเดอร์ Spam/จดหมายขยะ</li>
                <li>📂 โฟลเดอร์ Promotions</li>
                <li>📂 โฟลเดอร์ Updates</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">
                💡 พบอีเมลแล้ว? กด "ไม่ใช่สแปม" เพื่อให้ครั้งต่อไปเข้ากล่องจดหมายปกติ
              </p>
            </div>
            
            <button
              onClick={() => setSuccess(null)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
            >
              เข้าใจแล้ว
            </button>
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
