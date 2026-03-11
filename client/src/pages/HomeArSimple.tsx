import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const headingFont = { fontFamily: "'Almarai', 'Cairo', sans-serif" };
const bodyFont = { fontFamily: "'Tajawal', 'Cairo', sans-serif" };

function fireConversion() {
  try {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-11290068550/-TxgCLmvjoYcEMaMw4cq",
        value: 1.0,
        currency: "EGP",
      });
    }
    if (window.fbq) window.fbq("track", "Lead");
  } catch (_) {}
}

function fireContact() {
  try {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-11290068550/-TxgCLmvjoYcEMaMw4cq",
        value: 1.0,
        currency: "EGP",
      });
    }
    if (window.fbq) window.fbq("track", "Contact");
  } catch (_) {}
}

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

const LAUNCH_DATE = new Date("2026-03-31T18:00:00+02:00");
const WA_NUMBER = "201080488822";
const WA_MSG = encodeURIComponent("أهلاً، أنا مهتم بحفل إطلاق مارينا تاورز 31 مارس 2026.");

export default function HomeArSimple() {
  const [form, setForm] = useState({ name: "", phone: "", unitType: "2 Bedrooms", timeline: "خلال 3 شهور" });
  const [submitted, setSubmitted] = useState(false);
  const countdown = useCountdown(LAUNCH_DATE);

  const utmSource = new URLSearchParams(window.location.search).get("utm_source") || "";
  const utmMedium = new URLSearchParams(window.location.search).get("utm_medium") || "";
  const utmCampaign = new URLSearchParams(window.location.search).get("utm_campaign") || "";

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      fireConversion();
    },
    onError: () => toast.error("في مشكلة، حاول تاني أو كلمنا على واتساب."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return toast.error("من فضلك ادخل اسمك ورقمك.");
    submitLead.mutate({
      name: form.name,
      phone: form.phone,
      email: "",
      unitType: form.unitType,
      timeline: form.timeline,
      utmSource,
      utmMedium,
      utmCampaign,

    });
  }

  return (
    <div dir="rtl" style={{ ...bodyFont, background: "#fff", color: "#1a1a1a", minHeight: "100vh" }}>

      {/* ── Top Bar ── */}
      <header style={{ background: "#fff", borderBottom: "3px solid #c8a96e", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...headingFont, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: 1 }}>
            IL MONTE GALALA
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>MARINA TOWERS · Tatweer Misr</div>
        </div>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={fireContact}
          style={{
            background: "#25D366",
            color: "#fff",
            borderRadius: 50,
            padding: "12px 22px",
            fontWeight: 700,
            fontSize: 16,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" width={22} height={22}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/></svg>
          واتساب
        </a>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg, #1a2a3a 0%, #0d1b2a 100%)", padding: "60px 24px 50px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#c8a96e", color: "#fff", borderRadius: 50, padding: "10px 28px", fontSize: 18, fontWeight: 700, marginBottom: 28 }}>
          📅 31 مارس 2026 · القاهرة
        </div>
        <h1 style={{ ...headingFont, fontSize: "clamp(36px, 8vw, 68px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: "0 0 20px" }}>
          مارينا تاورز
        </h1>
        <h2 style={{ ...headingFont, fontSize: "clamp(22px, 5vw, 38px)", fontWeight: 700, color: "#c8a96e", margin: "0 0 24px" }}>
          أفخم وحدات على البحر الأحمر
        </h2>
        <p style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#ccc", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.8 }}>
          مشروع Tatweer Misr في IL Monte Galala — إدارة Marriott — بدفعة أولى 5% وتقسيط 10 سنين
        </p>

        {/* Countdown */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
          {[
            { label: "يوم", value: countdown.days },
            { label: "ساعة", value: countdown.hours },
            { label: "دقيقة", value: countdown.minutes },
            { label: "ثانية", value: countdown.seconds },
          ].map((item) => (
            <div key={item.label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "20px 24px", minWidth: 90, textAlign: "center" }}>
              <div style={{ ...headingFont, fontSize: 48, fontWeight: 900, color: "#c8a96e", lineHeight: 1 }}>
                {String(item.value).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 18, color: "#aaa", marginTop: 6 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <a
          href="#register"
          style={{
            display: "inline-block",
            background: "#c8a96e",
            color: "#fff",
            borderRadius: 16,
            padding: "22px 56px",
            fontSize: 24,
            fontWeight: 800,
            textDecoration: "none",
            boxShadow: "0 8px 30px rgba(200,169,110,0.4)",
          }}
        >
          سجّل حضورك الآن
        </a>
      </section>

      {/* ── Key Facts ── */}
      <section style={{ background: "#f8f6f0", padding: "50px 24px" }}>
        <h2 style={{ ...headingFont, textAlign: "center", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#1a1a1a", marginBottom: 36 }}>
          لماذا مارينا تاورز؟
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto" }}>
          {[
            { icon: "🌊", title: "إطلالة بحر مباشرة", desc: "كل الوحدات بإطلالة بانورامية على البحر الأحمر" },
            { icon: "🏨", title: "إدارة ماريوت", desc: "خدمات فندقية 5 نجوم على مدار السنة" },
            { icon: "💰", title: "دفعة أولى 5% فقط", desc: "ابدأ بـ 450,000 جنيه وتقسيط 10 سنين" },
            { icon: "🏗️", title: "Tatweer Misr", desc: "أكبر مطور عقاري في مصر — سجل حافل بالتسليم" },
            { icon: "📍", title: "45 دقيقة من القاهرة", desc: "على طريق السويس الجديد — سهل الوصول" },
            { icon: "🏊", title: "15+ مرفق", desc: "مسابح، مارينا، ملاعب، مطاعم، شاطئ خاص" },
          ].map((f) => (
            <div key={f.title} style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ ...headingFont, fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 17, color: "#555", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ background: "#fff", padding: "50px 24px" }}>
        <h2 style={{ ...headingFont, textAlign: "center", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#1a1a1a", marginBottom: 12 }}>
          الأسعار والوحدات
        </h2>
        <p style={{ textAlign: "center", fontSize: 20, color: "#888", marginBottom: 36 }}>أسعار الإطلاق — متاحة للحضور فقط</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto" }}>
          {[
            { type: "استوديو", area: "65 م²", price: "من 9 مليون" },
            { type: "غرفة نوم", area: "85 م²", price: "من 11 مليون" },
            { type: "غرفتان", area: "110 م²", price: "من 14 مليون" },
            { type: "3 غرف", area: "135 م²", price: "من 17 مليون" },
            { type: "بنتهاوس", area: "450 م²", price: "على الطلب" },
          ].map((u) => (
            <div key={u.type} style={{ border: "2px solid #c8a96e", borderRadius: 20, padding: "28px 20px", textAlign: "center" }}>
              <div style={{ ...headingFont, fontSize: 26, fontWeight: 900, color: "#1a1a1a", marginBottom: 8 }}>{u.type}</div>
              <div style={{ fontSize: 20, color: "#888", marginBottom: 12 }}>{u.area}</div>
              <div style={{ ...headingFont, fontSize: 24, fontWeight: 800, color: "#c8a96e" }}>{u.price}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 18, color: "#888", marginTop: 24 }}>
          دفعة أولى 5% · تقسيط 10 سنين · EOI 200,000 جنيه قابلة للاسترداد
        </p>
      </section>

      {/* ── Registration Form ── */}
      <section id="register" style={{ background: "#1a2a3a", padding: "60px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ ...headingFont, textAlign: "center", fontSize: "clamp(30px, 6vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            سجّل حضورك
          </h2>
          <p style={{ textAlign: "center", fontSize: 20, color: "#c8a96e", marginBottom: 36 }}>
            حفل الإطلاق · 31 مارس 2026 · القاهرة
          </p>

          {submitted ? (
            <div style={{ background: "#fff", borderRadius: 24, padding: "48px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
              <h3 style={{ ...headingFont, fontSize: 32, fontWeight: 900, color: "#1a1a1a", marginBottom: 12 }}>
                تم التسجيل بنجاح!
              </h3>
              <p style={{ fontSize: 20, color: "#555", marginBottom: 28, lineHeight: 1.8 }}>
                هيتواصل معاك فريقنا قريباً لتأكيد حضورك.
              </p>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={fireContact}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#25D366",
                  color: "#fff",
                  borderRadius: 16,
                  padding: "18px 40px",
                  fontSize: 22,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                <svg viewBox="0 0 24 24" fill="white" width={26} height={26}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/></svg>
                أكد حضورك على واتساب
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="اكتب اسمك هنا"
                  required
                  style={{ width: "100%", border: "2px solid #ddd", borderRadius: 12, padding: "16px 18px", fontSize: 20, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  رقم الموبايل *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  required
                  style={{ width: "100%", border: "2px solid #ddd", borderRadius: 12, padding: "16px 18px", fontSize: 20, outline: "none", boxSizing: "border-box", direction: "ltr", textAlign: "right" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  نوع الوحدة المهتم بيها
                </label>
                <select
                  value={form.unitType}
                  onChange={(e) => setForm({ ...form, unitType: e.target.value })}
                  style={{ width: "100%", border: "2px solid #ddd", borderRadius: 12, padding: "16px 18px", fontSize: 20, outline: "none", background: "#fff", boxSizing: "border-box" }}
                >
                  <option>استوديو</option>
                  <option>غرفة نوم</option>
                  <option>غرفتان</option>
                  <option>3 غرف</option>
                  <option>بنتهاوس</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitLead.isPending}
                style={{
                  background: submitLead.isPending ? "#aaa" : "#c8a96e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  padding: "22px",
                  fontSize: 24,
                  fontWeight: 900,
                  cursor: submitLead.isPending ? "not-allowed" : "pointer",
                  marginTop: 8,
                }}
              >
                {submitLead.isPending ? "جاري التسجيل..." : "سجّل حضوري الآن ✓"}
              </button>
              <p style={{ textAlign: "center", fontSize: 16, color: "#888" }}>
                بياناتك آمنة ومش هتتشارك مع أي جهة خارجية
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#0d1b2a", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ ...headingFont, fontSize: 20, fontWeight: 800, color: "#c8a96e", marginBottom: 8 }}>
          مارينا تاورز · IL Monte Galala
        </div>
        <div style={{ fontSize: 16, color: "#888", marginBottom: 16 }}>
          Tatweer Misr · إدارة Marriott · العين السخنة، مصر
        </div>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={fireContact}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#25D366",
            color: "#fff",
            borderRadius: 50,
            padding: "14px 32px",
            fontSize: 18,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" width={20} height={20}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/></svg>
          تواصل معنا على واتساب
        </a>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={fireContact}
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 24px rgba(37,211,102,0.5)",
          zIndex: 200,
          transition: "transform 0.2s",
        }}
        aria-label="واتساب"
      >
        <svg viewBox="0 0 24 24" fill="white" width={32} height={32}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/></svg>
      </a>
    </div>
  );
}
