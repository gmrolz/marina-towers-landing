import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const H = { fontFamily: "'Almarai', 'Cairo', sans-serif" };
const B = { fontFamily: "'Tajawal', 'Cairo', sans-serif" };
const GOLD = "#c8a96e";
const DARK = "#1a2a3a";

const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbxQ4xmiXE2ovq0g23mtsosFyhatOKdcurv9RSFiw5rUFZ0bvpZUzW5qB72OYZ_ipUst1Q/exec";

async function sendToSheets(data: Record<string, string>) {
  try {
    await fetch(SHEETS_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: "Marina Towers Arabic Simple Page", submittedAt: new Date().toISOString() }),
    });
  } catch (_) {}
}

function fireConversion() {
  try {
    if (window.gtag) window.gtag("event", "conversion", { send_to: "AW-11290068550/-TxgCLmvjoYcEMaMw4cq", value: 1.0, currency: "EGP" });
    if (window.fbq) window.fbq("track", "Lead");
  } catch (_) {}
}
function fireContact() {
  try {
    if (window.gtag) window.gtag("event", "conversion", { send_to: "AW-11290068550/-TxgCLmvjoYcEMaMw4cq", value: 1.0, currency: "EGP" });
    if (window.fbq) window.fbq("track", "Contact");
  } catch (_) {}
}

const LAUNCH_DATE = new Date("2026-03-31T10:00:00+02:00");
function useCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = LAUNCH_DATE.getTime() - Date.now();
      if (diff <= 0) return setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setT({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return t;
}

const UNITS = [
  { label: "استوديو", size: "65 م²", beds: "استوديو", baths: "1", price: "من 9 مليون جنيه", plan: "/images/unit-studio-plan.jpg", render: "/images/unit-studio-render.jpg", features: ["تراس خاص بحوض سباحة", "مطبخ مفتوح", "إطلالة بحر", "غرفة نوم رئيسية"] },
  { label: "غرفة نوم", size: "85 م²", beds: "1", baths: "1", price: "من 12 مليون جنيه", plan: "/images/unit-1br-plan.jpg", render: "/images/unit-1br-render.jpg", features: ["تراس خاص بحوض سباحة", "مطبخ مفتوح", "إطلالة بحر", "صالة واسعة"] },
  { label: "غرفتان", size: "110 م²", beds: "2", baths: "2", price: "من 16 مليون جنيه", plan: "/images/unit-2br-plan.jpg", render: "/images/unit-2br-render.jpg", features: ["تراس خاص بحوض سباحة", "مطبخ مفتوح", "إطلالة بحر وجبل", "جناح رئيسي"] },
  { label: "3 غرف نوم", size: "135 م²", beds: "3", baths: "2", price: "من 20 مليون جنيه", plan: "/images/unit-3br-plan.jpg", render: "/images/unit-3br-render.jpg", features: ["تراس خاص بحوض سباحة", "مطبخ مفتوح", "إطلالة بانورامية", "3 أجنحة رئيسية"] },
  { label: "بنتهاوس", size: "450 م²", beds: "3", baths: "4", price: "على الطلب", plan: "/images/penthouse-floorplan.jpg", render: "/images/penthouse-floorplan.jpg", features: ["حديقة خاصة 9.35×6.40م", "غرفة نوم رئيسية 8.60×3.35م", "صالة + مطبخ 10.60×6.70م", "غرفة خادمة + غسيل"] },
];

const GALLERY = [
  { src: "/images/gallery-sea-view.jpg", label: "إطلالة البحر الأحمر" },
  { src: "/images/gallery-marina-promenade.jpg", label: "كورنيش المارينا" },
  { src: "/images/gallery-beach-club.jpg", label: "نادي الشاطئ" },
  { src: "/images/gallery-marina-lifestyle.jpg", label: "أسلوب حياة المارينا" },
  { src: "/images/gallery-evening-retail.jpg", label: "الحياة الليلية" },
  { src: "/images/gallery-lobby-interior.jpg", label: "اللوبي الفاخر" },
];

const WA = "201080488822";
const WA_MSG = encodeURIComponent("أهلاً، أنا مهتم بحفل إطلاق مارينا تاورز 31 مارس 2026.");

function WaBtn({ style, children }: { style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" onClick={fireContact}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#25D366", color: "#fff", borderRadius: 16, padding: "18px 36px", fontSize: 22, fontWeight: 800, textDecoration: "none", ...style }}>
      <svg viewBox="0 0 24 24" fill="white" width={26} height={26}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/></svg>
      {children}
    </a>
  );
}

export default function HomeArSimple() {
  const [activeUnit, setActiveUnit] = useState(0);
  const [tab, setTab] = useState<"render" | "plan">("render");
  const [form, setForm] = useState({ name: "", phone: "", unitType: "غرفتان", timeline: "خلال 3 شهور" });
  const [submitted, setSubmitted] = useState(false);
  const countdown = useCountdown();

  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtmSource(p.get("utm_source") || "");
    setUtmMedium(p.get("utm_medium") || "");
    setUtmCampaign(p.get("utm_campaign") || "");
  }, []);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      fireConversion();
      sendToSheets({ name: form.name, phone: form.phone, email: "", unitType: form.unitType, timeline: form.timeline, utmSource, utmMedium, utmCampaign });
    },
    onError: () => toast.error("في مشكلة، حاول تاني أو كلمنا على واتساب."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return toast.error("من فضلك ادخل اسمك ورقمك.");
    submitLead.mutate({ name: form.name, phone: form.phone, email: "", unitType: form.unitType, timeline: form.timeline, utmSource, utmMedium, utmCampaign });
  }

  const unit = UNITS[activeUnit];

  return (
    <div dir="rtl" style={{ ...B, background: "#fff", color: "#1a1a1a", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: `3px solid ${GOLD}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...H, fontSize: 20, fontWeight: 900, color: DARK, letterSpacing: 1 }}>IL MONTE GALALA</div>
          <div style={{ fontSize: 13, color: "#888" }}>MARINA TOWERS · Tatweer Misr</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/" style={{ fontSize: 15, color: "#888", textDecoration: "none" }}>🌐 English</a>
          <WaBtn style={{ padding: "10px 20px", fontSize: 16, borderRadius: 50 }}>واتساب</WaBtn>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: 520, overflow: "hidden" }}>
        <img src="/images/hero-aerial.jpg" alt="مارينا تاورز" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,20,35,0.7) 0%, rgba(10,20,35,0.85) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "60px 24px 50px" }}>
          <div style={{ display: "inline-block", background: GOLD, color: "#fff", borderRadius: 50, padding: "10px 28px", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            📅 حفل الإطلاق · 31 مارس 2026 · القاهرة
          </div>
          <h1 style={{ ...H, fontSize: "clamp(40px, 9vw, 72px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
            مارينا تاورز
          </h1>
          <h2 style={{ ...H, fontSize: "clamp(22px, 5vw, 38px)", fontWeight: 700, color: GOLD, margin: "0 0 20px" }}>
            أفخم وحدات على البحر الأحمر
          </h2>
          <p style={{ fontSize: "clamp(17px, 3.5vw, 22px)", color: "#ddd", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.9 }}>
            مشروع Tatweer Misr في IL Monte Galala — إدارة Marriott — بدفعة أولى 5% وتقسيط 10 سنين
          </p>

          {/* Countdown */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
            {[{ label: "يوم", v: countdown.days }, { label: "ساعة", v: countdown.hours }, { label: "دقيقة", v: countdown.minutes }, { label: "ثانية", v: countdown.seconds }].map(({ label, v }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "18px 22px", minWidth: 88, textAlign: "center" }}>
                <div style={{ ...H, fontSize: 46, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{String(v).padStart(2, "0")}</div>
                <div style={{ fontSize: 17, color: "#bbb", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#register" style={{ display: "inline-block", background: GOLD, color: "#fff", borderRadius: 16, padding: "20px 48px", fontSize: 22, fontWeight: 900, textDecoration: "none", boxShadow: `0 8px 30px rgba(200,169,110,0.4)` }}>
              سجّل حضورك الآن
            </a>
            <WaBtn style={{ borderRadius: 16 }}>تواصل على واتساب</WaBtn>
          </div>
        </div>
      </section>

      {/* ── Key Numbers ── */}
      <section style={{ background: DARK, padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          {[
            { num: "5%", label: "دفعة أولى فقط" },
            { num: "10", label: "سنين تقسيط" },
            { num: "200K", label: "EOI قابل للاسترداد" },
            { num: "8", label: "أبراج دائرية" },
            { num: "45", label: "دقيقة من القاهرة" },
            { num: "15+", label: "مرفق فاخر" },
          ].map(({ num, label }) => (
            <div key={label}>
              <div style={{ ...H, fontSize: 40, fontWeight: 900, color: GOLD }}>{num}</div>
              <div style={{ fontSize: 17, color: "#aaa", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section style={{ background: "#f8f6f0", padding: "56px 24px" }}>
        <h2 style={{ ...H, textAlign: "center", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: DARK, marginBottom: 8 }}>
          صور المشروع
        </h2>
        <p style={{ textAlign: "center", fontSize: 19, color: "#888", marginBottom: 32 }}>IL Monte Galala · العين السخنة · البحر الأحمر</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, maxWidth: 960, margin: "0 auto" }}>
          {GALLERY.map((g) => (
            <div key={g.src} style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", position: "relative" }}>
              <img src={g.src} alt={g.label} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, left: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "24px 16px 14px" }}>
                <div style={{ ...H, fontSize: 18, fontWeight: 700, color: "#fff" }}>{g.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Units ── */}
      <section style={{ background: "#fff", padding: "56px 24px" }}>
        <h2 style={{ ...H, textAlign: "center", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: DARK, marginBottom: 8 }}>
          اختار وحدتك
        </h2>
        <p style={{ textAlign: "center", fontSize: 19, color: "#888", marginBottom: 32 }}>كل الوحدات بتراس خاص وحوض سباحة وإطلالة بحر</p>

        {/* Unit Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {UNITS.map((u, i) => (
            <button key={u.label} onClick={() => { setActiveUnit(i); setTab("render"); }}
              style={{ ...H, background: activeUnit === i ? GOLD : "#f0ede6", color: activeUnit === i ? "#fff" : DARK, border: "none", borderRadius: 50, padding: "12px 24px", fontSize: 18, fontWeight: 700, cursor: "pointer" }}>
              {u.label}
            </button>
          ))}
        </div>

        {/* Unit Card */}
        <div style={{ maxWidth: 820, margin: "0 auto", background: "#f8f6f0", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          {/* Image */}
          <div style={{ position: "relative" }}>
            <img src={tab === "render" ? unit.render : unit.plan} alt={unit.label} style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
              {(["render", "plan"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ background: tab === t ? GOLD : "rgba(255,255,255,0.85)", color: tab === t ? "#fff" : DARK, border: "none", borderRadius: 50, padding: "8px 18px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  {t === "render" ? "الوحدة" : "المسقط"}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: "28px 28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <h3 style={{ ...H, fontSize: 32, fontWeight: 900, color: DARK, margin: 0 }}>{unit.label}</h3>
                <div style={{ fontSize: 19, color: "#888", marginTop: 4 }}>{unit.size} · {unit.beds === "استوديو" ? "استوديو" : `${unit.beds} غرفة نوم`} · {unit.baths} حمام</div>
              </div>
              <div style={{ ...H, fontSize: 28, fontWeight: 900, color: GOLD }}>{unit.price}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 24 }}>
              {unit.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, color: "#444" }}>
                  <span style={{ color: GOLD, fontSize: 20 }}>✓</span> {f}
                </div>
              ))}
            </div>

            <a href="#register" style={{ display: "inline-block", background: GOLD, color: "#fff", borderRadius: 14, padding: "16px 40px", fontSize: 20, fontWeight: 800, textDecoration: "none" }}>
              سجّل اهتمامك بهذه الوحدة
            </a>
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section style={{ background: "#f8f6f0", padding: "56px 24px" }}>
        <h2 style={{ ...H, textAlign: "center", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: DARK, marginBottom: 32 }}>
          الموقع
        </h2>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "center" }}>
          <img src="/images/location-map.jpg" alt="خريطة الموقع" style={{ width: "100%", borderRadius: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }} />
          <div>
            {[
              { icon: "🚗", text: "60 دقيقة من القاهرة" },
              { icon: "✈️", text: "90 دقيقة من مطار القاهرة" },
              { icon: "🏛️", text: "45 دقيقة من العاصمة الإدارية" },
              { icon: "🌊", text: "على البحر الأحمر مباشرة" },
              { icon: "⛰️", text: "جبل الجلالة خلفية طبيعية" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid #e8e4da", fontSize: 20, color: DARK }}>
                <span style={{ fontSize: 32 }}>{icon}</span>
                <span style={{ fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Masterplan ── */}
      <section style={{ background: "#fff", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ ...H, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: DARK, marginBottom: 16 }}>
          المخطط العام
        </h2>
        <p style={{ fontSize: 19, color: "#888", marginBottom: 28 }}>5 مجمعات أبراج · مارينا يخوت · بحيرات · شاطئ خاص</p>
        <img src="/images/masterplan.jpg" alt="المخطط العام" style={{ maxWidth: 860, width: "100%", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }} />
      </section>

      {/* ── Registration Form ── */}
      <section id="register" style={{ background: DARK, padding: "64px 24px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 style={{ ...H, textAlign: "center", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 900, color: "#fff", marginBottom: 10 }}>
            سجّل حضورك
          </h2>
          <p style={{ textAlign: "center", fontSize: 20, color: GOLD, marginBottom: 36 }}>
            حفل الإطلاق · 31 مارس 2026 · القاهرة
          </p>

          {submitted ? (
            <div style={{ background: "#fff", borderRadius: 24, padding: "48px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
              <h3 style={{ ...H, fontSize: 34, fontWeight: 900, color: DARK, marginBottom: 12 }}>تم التسجيل بنجاح!</h3>
              <p style={{ fontSize: 20, color: "#555", marginBottom: 28, lineHeight: 1.9 }}>
                هيتواصل معاك فريقنا قريباً لتأكيد حضورك في حفل الإطلاق.
              </p>
              <WaBtn>أكد حضورك على واتساب</WaBtn>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", display: "flex", flexDirection: "column", gap: 22 }}>
              {[
                { label: "الاسم الكامل *", key: "name", type: "text", placeholder: "اكتب اسمك هنا" },
                { label: "رقم الموبايل *", key: "phone", type: "tel", placeholder: "01xxxxxxxxx" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 21, fontWeight: 700, color: DARK, marginBottom: 8 }}>{label}</label>
                  <input type={type} value={form[key as "name" | "phone"]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder} required
                    style={{ width: "100%", border: "2px solid #ddd", borderRadius: 12, padding: "16px 18px", fontSize: 20, outline: "none", boxSizing: "border-box", direction: key === "phone" ? "ltr" : "rtl", textAlign: key === "phone" ? "right" : "right" }} />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: 21, fontWeight: 700, color: DARK, marginBottom: 8 }}>نوع الوحدة</label>
                <select value={form.unitType} onChange={(e) => setForm({ ...form, unitType: e.target.value })}
                  style={{ width: "100%", border: "2px solid #ddd", borderRadius: 12, padding: "16px 18px", fontSize: 20, outline: "none", background: "#fff", boxSizing: "border-box" }}>
                  {UNITS.map((u) => <option key={u.label}>{u.label}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 21, fontWeight: 700, color: DARK, marginBottom: 8 }}>متى تفكر في الشراء؟</label>
                <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  style={{ width: "100%", border: "2px solid #ddd", borderRadius: 12, padding: "16px 18px", fontSize: 20, outline: "none", background: "#fff", boxSizing: "border-box" }}>
                  <option>خلال 3 شهور</option>
                  <option>خلال 6 شهور</option>
                  <option>خلال سنة</option>
                  <option>بس بستعلم</option>
                </select>
              </div>

              <button type="submit" disabled={submitLead.isPending}
                style={{ background: submitLead.isPending ? "#aaa" : GOLD, color: "#fff", border: "none", borderRadius: 16, padding: "22px", fontSize: 24, fontWeight: 900, cursor: submitLead.isPending ? "not-allowed" : "pointer", marginTop: 4 }}>
                {submitLead.isPending ? "جاري التسجيل..." : "سجّل حضوري الآن ✓"}
              </button>
              <p style={{ textAlign: "center", fontSize: 16, color: "#888" }}>بياناتك آمنة ومش هتتشارك مع أي جهة خارجية</p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#0d1b2a", padding: "36px 24px", textAlign: "center" }}>
        <div style={{ ...H, fontSize: 22, fontWeight: 900, color: GOLD, marginBottom: 8 }}>مارينا تاورز · IL Monte Galala</div>
        <div style={{ fontSize: 17, color: "#888", marginBottom: 20 }}>Tatweer Misr · إدارة Marriott · العين السخنة، مصر</div>
        <WaBtn style={{ borderRadius: 50 }}>تواصل معنا على واتساب</WaBtn>
      </footer>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" onClick={fireContact}
        style={{ position: "fixed", bottom: 24, left: 24, width: 64, height: 64, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(37,211,102,0.5)", zIndex: 200 }}
        aria-label="واتساب">
        <svg viewBox="0 0 24 24" fill="white" width={32} height={32}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/></svg>
      </a>
    </div>
  );
}
