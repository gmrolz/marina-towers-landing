import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Google Sheets Webhook ───────────────────────────────────────────────────
const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbxQ4xmiXE2ovq0g23mtsosFyhatOKdcurv9RSFiw5rUFZ0bvpZUzW5qB72OYZ_ipUst1Q/exec";

async function sendToSheets(data: {
  name: string; phone: string; email: string;
  unitType: string; timeline: string;
  utmSource?: string; utmMedium?: string; utmCampaign?: string;
}) {
  try {
    await fetch(SHEETS_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        source: "Marina Towers Arabic Landing Page",
        submittedAt: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.warn("[Sheets] Failed to sync lead:", e);
  }
}

// ─── UTM Parameter Hook ───────────────────────────────────────────────────────
function useUTM() {
  const [utm, setUtm] = useState({ source: "", medium: "", campaign: "" });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      source: params.get("utm_source") || "",
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
    });
  }, []);
  return utm;
}

// ─── Unit Types Data (Arabic) ─────────────────────────────────────────────────
const UNIT_TYPES = [
  {
    id: "studio",
    label: "ستوديو",
    size: "65 م²",
    beds: "ستوديو",
    baths: "1",
    features: ["تراس بحمام سباحة خاص", "مطبخ مفتوح", "إطلالة على البحر", "غرفة ماستر"],
    planImage: "/images/unit-studio-plan.jpg",
    renderImage: "/images/unit-studio-render.jpg",
    startingPrice: "من 9 مليون جنيه",
  },
  {
    id: "1br",
    label: "غرفة نوم",
    size: "85 م²",
    beds: "1",
    baths: "1",
    features: ["تراس بحمام سباحة خاص", "مطبخ مفتوح", "إطلالة على البحر", "صالة معيشة واسعة"],
    planImage: "/images/unit-1br-plan.jpg",
    renderImage: "/images/unit-1br-render.jpg",
    startingPrice: "من 12 مليون جنيه",
  },
  {
    id: "2br",
    label: "غرفتان",
    size: "110 م²",
    beds: "2",
    baths: "2",
    features: ["تراس بحمام سباحة خاص", "مطبخ مفتوح", "إطلالة على البحر والجبل", "جناح ماستر"],
    planImage: "/images/unit-2br-plan.jpg",
    renderImage: "/images/unit-2br-render.jpg",
    startingPrice: "من 16 مليون جنيه",
  },
  {
    id: "3br",
    label: "3 غرف نوم",
    size: "135 م²",
    beds: "3",
    baths: "2",
    features: ["تراس بحمام سباحة خاص", "مطبخ مفتوح", "إطلالة بانورامية", "3 أجنحة ماستر"],
    planImage: "/images/unit-3br-plan.jpg",
    renderImage: "/images/unit-3br-render.jpg",
    startingPrice: "من 20 مليون جنيه",
  },
  {
    id: "penthouse",
    label: "بنتهاوس",
    size: "450 م²",
    beds: "3",
    baths: "4",
    features: ["حديقة خاصة 9.35×6.40م", "غرفة ماستر 8.60×3.35م", "ريسبشن + مطبخ مفتوح 10.60×6.70م", "غرفة خادمة + غسيل"],
    planImage: "/images/penthouse-floorplan.jpg",
    renderImage: "/images/penthouse-floorplan.jpg",
    startingPrice: "عند الطلب",
  },
];

// ─── Image Paths ──────────────────────────────────────────────────────────────
const IMAGES = {
  hero: "/images/gallery-sea-view.jpg",
  heroAerial: "/images/hero-aerial.jpg",
  seaView: "/images/gallery-sea-view.jpg",
  marinaPromenade: "/images/gallery-marina-promenade.jpg",
  beachClub: "/images/gallery-beach-club.jpg",
  marinaLifestyle: "/images/gallery-marina-lifestyle.jpg",
  eveningRetail: "/images/gallery-evening-retail.jpg",
  lobbyInterior: "/images/gallery-lobby-interior.jpg",
  locationMap: "/images/location-map.jpg",
  masterplan: "/images/masterplan.jpg",
  logoTower: "/images/tower-logo.png",
};

// ─── Countdown Timer ──────────────────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-03-31T10:00:00+02:00");

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = LAUNCH_DATE.getTime() - new Date().getTime();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="countdown-box rounded-lg text-center" style={{ minWidth: 'clamp(52px, 16vw, 90px)', padding: 'clamp(8px, 2vw, 16px) clamp(10px, 3vw, 24px)' }}>
        <span className="font-serif font-light text-gold-300 tabular-nums" style={{ fontSize: 'clamp(1.5rem, 7vw, 3rem)' }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-1.5 text-[9px] md:text-[10px] tracking-[0.1em] uppercase text-muted-foreground" style={{ fontFamily: "'Tajawal', sans-serif" }}>{label}</span>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
const GALLERY = [
  { src: IMAGES.seaView, label: "معمار أيقوني", desc: "8 أبراج أسطوانية ترتفع من البحر الأحمر، محاطة بجبال الجلالة الشامخة" },
  { src: IMAGES.marinaPromenade, label: "كورنيش المارينا", desc: "كورنيش مائي حيوي بكافيهات ومطاعم راقية ومحلات لايف ستايل — خطوات من شقتك" },
  { src: IMAGES.beachClub, label: "نادي الشاطئ الخاص", desc: "نادي شاطئ متكامل بشزلونجات ومطعم على الشاطئ — بإطلالة على جبل الجلالة" },
  { src: IMAGES.marinaLifestyle, label: "مارينا دولية", desc: "أرصفة خاصة لليخوت، كورنيش بنخيل، ومطاعم على الواجهة المائية" },
  { src: IMAGES.eveningRetail, label: "ميريديان كلوب والريتيل", desc: "وجهة لايف ستايل مسائية — بوتيكات وفاين دايننج ونادي ميريديان بإطلالة على البحر الأحمر" },
  { src: IMAGES.lobbyInterior, label: "لوبي فاخر", desc: "حجر تراڤرتين ورخام وإطلالة على البحر من الأرض للسقف — تجربة وصول لا تُنسى" },
];

// ─── Pricing Calculator (Arabic) ─────────────────────────────────────────────
function PricingCalculator() {
  const [price, setPrice] = useState(9000000);
  const downPayment = price * 0.05;
  const remaining = price - downPayment;
  const monthlyInstallment = remaining / 120;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 gold-glow" dir="rtl">
      <h3 className="font-serif text-2xl md:text-3xl text-gold-300 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>حاسبة الدفع</h3>
      <p className="text-muted-foreground text-sm mb-6" style={{ fontFamily: "'Tajawal', sans-serif" }}>اختار سعر الوحدة وشوف خطة السداد المناسبة ليك</p>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-cream-200 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>سعر الوحدة</label>
          <span className="text-gold-300 font-serif text-xl">{price.toLocaleString("ar-EG")} جنيه</span>
        </div>
        <input
          type="range" min={9000000} max={30000000} step={500000} value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to left, oklch(76% 0.14 85) 0%, oklch(76% 0.14 85) ${((price - 9000000) / 21000000) * 100}%, oklch(28% 0.04 240) ${((price - 9000000) / 21000000) * 100}%, oklch(28% 0.04 240) 100%)` }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1" style={{ fontFamily: "'Tajawal', sans-serif" }}><span>30 مليون</span><span>9 مليون</span></div>
      </div>
      <div className="space-y-3">
        {[
          { label: "EOI (تعبير عن الاهتمام)", value: 200000, note: "قابل للاسترداد بالكامل", highlight: false },
          { label: "مقدم (5%)", value: downPayment, note: "عند توقيع العقد", highlight: true },
          { label: "الرصيد المتبقي", value: remaining, note: "على 10 سنين", highlight: false },
          { label: "القسط الشهري", value: monthlyInstallment, note: "120 قسط متساوي", highlight: true },
        ].map((item) => (
          <div key={item.label} className={`flex items-center justify-between p-3 rounded-lg ${item.highlight ? "bg-gold-400/10 border border-gold-400/20" : "bg-navy-800/50"}`}>
            <div>
              <p className="text-cream-100 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>{item.label}</p>
              <p className="text-muted-foreground text-xs" style={{ fontFamily: "'Tajawal', sans-serif" }}>{item.note}</p>
            </div>
            <span className={`font-serif text-lg ${item.highlight ? "text-gold-300" : "text-cream-200"}`}>
              {Math.round(item.value).toLocaleString("ar-EG")} ج
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gold-400/20">
        <p className="text-xs text-muted-foreground text-center" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          * الأسعار استرشادية. التسعير النهائي يُعلن في حفل الإطلاق <span className="text-gold-400">31 مارس 2026</span>
        </p>
      </div>
    </div>
  );
}

// ─── Popup Form Types ─────────────────────────────────────────────────────────
type FormData = {
  name: string;
  phone: string;
  email: string;
  unitType: string;
  timeline: string;
};

const INITIAL_FORM: FormData = {
  name: "", phone: "", email: "", unitType: "", timeline: "",
};

// ─── Popup Multi-Step Form (Arabic) ──────────────────────────────────────────
function LaunchPopup({
  isOpen, onClose, onSubmit, isSubmitting, isSubmitted, formData, updateForm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  formData: FormData;
  updateForm: (field: keyof FormData, value: string) => void;
}) {
  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 3;

  useEffect(() => { if (isOpen) setStep(0); }, [isOpen]);

  const canAdvanceStep0 = formData.name.trim().length >= 2 && formData.phone.trim().length >= 8;

  if (!isOpen) return null;

  const STEP_LABELS = ["بياناتك", "تفضيلاتك", "تأكيد الحجز"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ backgroundColor: "rgba(3,7,18,0.92)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto glass-card rounded-t-2xl sm:rounded-2xl gold-glow"
          style={{ border: "1px solid oklch(76% 0.14 85 / 0.3)", fontFamily: "'Tajawal', sans-serif" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-cream-50 transition-colors"
            style={{ background: "oklch(18% 0.03 240 / 0.8)" }}
          >
            ✕
          </button>

          <div className="p-5 md:p-8">
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold-300 font-serif text-2xl">✦</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-gold-300 mb-2">تم تأكيد دعوتك</h3>
                <div className="divider-gold max-w-xs mx-auto mb-3" />
                <p className="text-cream-200 text-sm leading-relaxed mb-5">
                  أهلاً <strong>{formData.name}</strong>، بنحجزلك مقعدك في حفل إطلاق مارينا تاورز{" "}
                  <span className="text-gold-400">31 مارس 2026</span> دلوقتي.
                </p>

                {/* WhatsApp CTA */}
                <div className="glass-card rounded-2xl p-5 mb-4 border border-gold-400/20">
                  <p className="text-xs tracking-widest uppercase text-gold-400 mb-1">مش عايز تستنى مكالمة؟</p>
                  <p className="text-cream-200 text-xs mb-4 leading-relaxed">
                    راسلنا على واتساب دلوقتي وأكد حضورك وهتاخد كل تفاصيل الحفلة فوراً.
                  </p>
                  <a
                    href={`https://wa.me/201080488822?text=${encodeURIComponent(`أهلاً، أنا سجلت في حفل إطلاق مارينا تاورز 31 مارس 2026. اسمي ${formData.name} ورقمي ${formData.phone}. عايز أأكد حضوري.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all"
                    style={{ background: "#25D366", color: "#fff" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                    أكد حضورك على واتساب
                  </a>
                </div>

                {/* What happens next */}
                <div className="glass-card rounded-xl p-4 text-right">
                  <p className="text-xs tracking-widest uppercase text-gold-400 mb-3">إيه اللي هيحصل بعد كده</p>
                  {[
                    "مكالمة شخصية من مستشارك في مارينا تاورز خلال 24 ساعة",
                    "بروشور رقمي حصري وعرض أولي لتوافر الوحدات",
                    "دعوة أولوية لحفل الإطلاق 31 مارس",
                    "حق الأولوية في اختيار وحدتك المفضلة",
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 mb-2 flex-row-reverse">
                      <span className="text-gold-400 text-xs mt-0.5 font-medium">0{i + 1}</span>
                      <span className="text-cream-200 text-xs">{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-5">
                  <img src={IMAGES.logoTower} alt="Marina Towers" className="h-10 w-auto mx-auto mb-3 opacity-90" />
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400 mb-1">حفل إطلاق حصري · 31 مارس 2026</p>
                  <h2 className="font-serif text-xl text-cream-50">احجز مقعدك</h2>
                </div>

                {/* Step Progress */}
                <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-gold-400" : "bg-navy-700"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-5">
                  خطوة {step + 1} من {TOTAL_STEPS} — {STEP_LABELS[step]}
                </p>

                <AnimatePresence mode="wait">

                  {/* ── Step 0: Contact Details ── */}
                  {step === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <p className="text-cream-200 text-xs mb-5 leading-relaxed">
                        احجز مقعدك في حفل الإطلاق. مستشارك الشخصي هيتواصل معاك خلال 24 ساعة.
                      </p>
                      <div className="space-y-4 mb-5">
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 mb-2">الاسم الكامل *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateForm("name", e.target.value)}
                            placeholder="اسمك الكامل"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm text-right"
                            style={{ fontFamily: "'Tajawal', sans-serif" }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 mb-2">رقم الموبايل *</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateForm("phone", e.target.value)}
                            placeholder="01XX XXX XXXX"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 mb-2">
                            الإيميل <span className="text-muted-foreground normal-case tracking-normal">(اختياري)</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateForm("email", e.target.value)}
                            placeholder="your@email.com"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => canAdvanceStep0 ? setStep(1) : toast.error("من فضلك ادخل اسمك ورقم موبايلك.")}
                        className="btn-gold w-full py-3 rounded-full text-sm tracking-widest"
                      >
                        استمرار
                      </button>
                      <p className="text-center text-[10px] text-muted-foreground mt-3">
                        بياناتك محفوظة وسرية تماماً.
                      </p>
                    </motion.div>
                  )}

                  {/* ── Step 1: Soft Qualification ── */}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <p className="text-cream-200 text-xs mb-5 leading-relaxed">
                        ساعد مستشارك يجهزلك المعلومات الصح. الاختيارات دي اختيارية.
                      </p>

                      <div className="mb-5">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 mb-3">نوع الوحدة اللي بتفكر فيها</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["ستوديو", "غرفة نوم", "غرفتان", "3 غرف", "4 غرف", "بنتهاوس"].map((type) => (
                            <button
                              key={type}
                              onClick={() => updateForm("unitType", formData.unitType === type ? "" : type)}
                              className={`p-2.5 rounded-lg border text-xs text-center transition-all ${formData.unitType === type ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 mb-3">امتى بتفكر تشتري؟</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "launch", label: "في حفل 31 مارس" },
                            { value: "q2_2026", label: "خلال الربع التاني 2026" },
                            { value: "year", label: "خلال السنة دي" },
                            { value: "exploring", label: "لسه بستكشف" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateForm("timeline", formData.timeline === opt.value ? "" : opt.value)}
                              className={`p-3 rounded-lg border text-xs text-center transition-all ${formData.timeline === opt.value ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(0)}
                          className="flex-1 py-3 rounded-full text-xs border border-cream-200/20 text-cream-200 hover:border-gold-400/40 transition-all"
                        >
                          رجوع
                        </button>
                        <button
                          onClick={() => setStep(2)}
                          className="flex-[2] btn-gold py-3 rounded-full text-sm tracking-widest"
                        >
                          استمرار
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step 2: Confirm & Submit ── */}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <div className="glass-card rounded-xl p-4 mb-5">
                        <p className="text-xs tracking-widest uppercase text-gold-400 mb-3">ملخص طلبك</p>
                        {[
                          { label: "الاسم", value: formData.name },
                          { label: "الموبايل", value: formData.phone },
                          { label: "الإيميل", value: formData.email || "—" },
                          { label: "نوع الوحدة", value: formData.unitType || "لم يُحدد" },
                          { label: "موعد الشراء", value: formData.timeline || "لم يُحدد" },
                        ].map((row) => (
                          <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-gold-400/10 last:border-0">
                            <span className="text-muted-foreground text-xs">{row.label}</span>
                            <span className="text-cream-200 text-xs font-medium">{row.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="glass-card rounded-xl p-4 mb-5 border border-gold-400/20">
                        <p className="text-xs tracking-widest uppercase text-gold-400 mb-2">إيه اللي هتاخده</p>
                        {[
                          "مكالمة شخصية خلال 24 ساعة",
                          "بروشور حصري وتفاصيل الوحدات",
                          "دعوة أولوية لحفل 31 مارس",
                          "حق الأولوية في الاختيار",
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 mb-1.5 flex-row-reverse">
                            <span className="text-gold-400 text-xs">◆</span>
                            <span className="text-cream-200 text-xs">{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 py-3 rounded-full text-xs border border-cream-200/20 text-cream-200 hover:border-gold-400/40 transition-all"
                        >
                          رجوع
                        </button>
                        <button
                          onClick={onSubmit}
                          disabled={isSubmitting}
                          className="flex-[2] btn-gold py-3 rounded-full text-sm tracking-widest disabled:opacity-60"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                              <span>جاري الحجز</span>
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 rounded-full bg-gold-400"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                />
                              ))}
                            </div>
                          ) : "احجز مقعدي دلوقتي"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Highlight Card ───────────────────────────────────────────────────────────
function HighlightCard({ image, title, desc }: { image: string; title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-default">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-right">
        <h3 className="font-serif text-xl text-cream-50 mb-1" style={{ fontFamily: "'Tajawal', sans-serif" }}>{title}</h3>
        <p className="text-cream-200 text-xs leading-relaxed" style={{ fontFamily: "'Tajawal', sans-serif" }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Main Arabic Home Component ───────────────────────────────────────────────
export default function HomeAr() {
  const countdown = useCountdown();
  const utm = useUTM();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeUnitTab, setActiveUnitTab] = useState("studio");
  const [unitView, setUnitView] = useState<"render" | "plan">("render");

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => { setIsSubmitted(true); setIsSubmitting(false); },
    onError: (err: unknown) => {
      toast.error("في مشكلة، حاول تاني أو كلمنا على واتساب.");
      console.error(err);
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setGalleryIndex((i) => (i + 1) % GALLERY.length), 5000);
    return () => clearInterval(id);
  }, []);

  const openPopup = () => {
    setIsSubmitted(false);
    setFormData(INITIAL_FORM);
    setIsPopupOpen(true);
  };

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error("من فضلك ادخل اسمك ورقم موبايلك.");
      return;
    }
    setIsSubmitting(true);
    sendToSheets({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      unitType: formData.unitType || "لم يُحدد",
      timeline: formData.timeline || "لم يُحدد",
      utmSource: utm.source,
      utmMedium: utm.medium,
      utmCampaign: utm.campaign,
    });
    submitLead.mutate({
      personalityType: "direct",
      primaryMotivation: "inquiry",
      dreamLifestyle: formData.unitType || "not specified",
      useCase: "launch_event",
      timeline: formData.timeline || "not specified",
      unitType: formData.unitType || "not specified",
      budgetRange: "not specified",
      downPaymentReady: "not specified",
      financingMethod: "installment",
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      utmSource: utm.source || undefined,
      utmMedium: utm.medium || undefined,
      utmCampaign: utm.campaign || undefined,
    });
  };

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const arFont = { fontFamily: "'Tajawal', sans-serif" };

  return (
    <div className="min-h-screen bg-navy-950 text-cream-50 overflow-x-hidden" dir="rtl" style={arFont}>

      {/* ─── Floating WhatsApp Button ─────────────────────────────────── */}
      <a
        href="https://wa.me/201080488822?text=أهلاً%2C%20أنا%20مهتم%20بحفل%20إطلاق%20مارينا%20تاورز%2031%20مارس%202026."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-[200] flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
        style={{ background: "#25D366" }}
        aria-label="تواصل على واتساب"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/>
        </svg>
      </a>

      {/* ─── Popup Form ───────────────────────────────────────────────── */}
      <LaunchPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        formData={formData}
        updateForm={updateForm}
      />

      {/* ─── Navigation ───────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isNavScrolled ? "nav-blur" : "bg-transparent"}`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo on right (RTL) */}
            <div className="flex items-center gap-3">
              <img src={IMAGES.logoTower} alt="Marina Towers" className="h-10 md:h-12 w-auto object-contain" />
            </div>
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "مميزات المشروع", id: "highlights" },
                { label: "المعرض", id: "gallery" },
                { label: "الأسعار", id: "pricing" },
                { label: "الموقع", id: "location" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-xs tracking-[0.1em] text-cream-200 hover:text-gold-300 transition-colors bg-transparent border-none cursor-pointer"
                  style={arFont}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <a
                href="/"
                className="hidden md:flex items-center gap-1.5 border border-gold-400/30 hover:border-gold-400/70 text-gold-400/70 hover:text-gold-400 text-[10px] tracking-[0.1em] px-3 py-1.5 transition-all"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                <span>🌐</span>
                <span>English</span>
              </a>
              <button
                onClick={openPopup}
                className="btn-gold px-4 py-2 rounded-full text-xs tracking-wide"
                style={arFont}
              >
                احجز مقعدك
              </button>
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex flex-col gap-1.5 p-2"
                aria-label="القائمة"
              >
                <span className={`block w-5 h-px bg-cream-200 transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-5 h-px bg-cream-200 transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-px bg-cream-200 transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden nav-blur border-t border-gold-400/15"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {[
                  { label: "مميزات المشروع", id: "highlights" },
                  { label: "المعرض", id: "gallery" },
                  { label: "الأسعار", id: "pricing" },
                  { label: "الموقع", id: "location" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="text-sm text-cream-200/70 text-right py-1 bg-transparent border-none cursor-pointer"
                    style={arFont}
                  >
                    {item.label}
                  </button>
                ))}
                <a href="/" className="flex items-center justify-center gap-2 border border-gold-400/30 text-gold-400 text-sm py-2.5" style={arFont}>
                  <span>🌐</span>
                  <span>English Version</span>
                </a>
                <button onClick={openPopup} className="bg-gold-500 text-[#0a0a0a] text-sm font-bold py-3" style={arFont}>
                  احجز مقعدك
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0">
          <img src={IMAGES.seaView} alt="مارينا تاورز — إيل مونتي جلالة" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-transparent to-navy-950/40" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-20" style={{ overflowX: 'hidden' }}>
          {/* Invitation Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-5 px-3 py-2 md:px-5 md:py-2.5 rounded-full border border-gold-400/50 bg-navy-950/70 backdrop-blur-sm max-w-full"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-gold" />
            <span className="text-gold-300 text-xs tracking-[0.15em] uppercase" style={arFont}>
              أنت مدعو · 31 مارس 2026
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
            className="font-light leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 9vw, 5rem)', fontFamily: "'Tajawal', sans-serif", fontWeight: 300 }}
          >
            <span className="text-cream-50">أفخم إطلاق عقاري</span>
            <br />
            <span className="text-shimmer">في 2026</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
            className="text-cream-200 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto mb-4 px-2"
            style={arFont}
          >
            مارينا تاورز في إيل مونتي جلالة — أيقونة الفخامة على البحر الأحمر.
            إدارة ماريوت. تطوير تطوير مصر. <span className="text-gold-400 font-medium">الأماكن محدودة جداً.</span>
          </motion.p>

          {/* FOMO Scarcity Signal */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-red-900/30 border border-red-500/30"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-[10px] tracking-[0.1em] uppercase" style={arFont}>
              عدد محدود من الدعوات متاح
            </span>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-10"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-4" style={arFont}>الحفل يبدأ بعد</p>
            <div className="flex items-start justify-center flex-row-reverse" style={{ gap: 'clamp(4px, 2vw, 20px)' }}>
              <CountdownUnit value={countdown.days} label="يوم" />
              <span className="font-serif text-gold-400/60 mt-2" style={{ fontSize: 'clamp(1.2rem, 5vw, 2.5rem)' }}>:</span>
              <CountdownUnit value={countdown.hours} label="ساعة" />
              <span className="font-serif text-gold-400/60 mt-2" style={{ fontSize: 'clamp(1.2rem, 5vw, 2.5rem)' }}>:</span>
              <CountdownUnit value={countdown.minutes} label="دقيقة" />
              <span className="font-serif text-gold-400/60 mt-2" style={{ fontSize: 'clamp(1.2rem, 5vw, 2.5rem)' }}>:</span>
              <CountdownUnit value={countdown.seconds} label="ثانية" />
            </div>
          </motion.div>

          {/* Key Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-10 w-full max-w-xl mx-auto"
          >
            {[
              { label: "EOI", value: "200 ألف", note: "قابل للاسترداد" },
              { label: "يبدأ من", value: "9 مليون", note: "سعر الإطلاق" },
              { label: "مقدم", value: "5%", note: "عند التوقيع" },
              { label: "خطة السداد", value: "10 سنين", note: "أقساط شهرية" },
            ].map((item) => (
              <div key={item.label} className="text-center px-2 py-3 rounded-xl glass-card">
                <p className="text-[10px] tracking-[0.1em] uppercase text-gold-400/80 mb-1" style={arFont}>{item.label}</p>
                <p className="font-serif text-lg md:text-2xl text-gold-300" style={arFont}>{item.value}</p>
                <p className="text-[10px] text-muted-foreground" style={arFont}>{item.note}</p>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col items-stretch sm:flex-row sm:items-center justify-center gap-3 w-full max-w-sm mx-auto sm:max-w-none"
          >
            <button
              onClick={openPopup}
              className="btn-gold px-8 py-4 rounded-full text-sm tracking-wide w-full sm:w-auto"
              style={arFont}
            >
              احجز مقعدي في الحفل
            </button>
            <a
              href="#gallery"
              className="btn-outline-gold px-8 py-4 rounded-full text-sm tracking-wide w-full sm:w-auto text-center"
              style={arFont}
            >
              استكشف المشروع
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60" style={arFont}>اسكرول</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold-400/60 to-transparent" />
        </motion.div>
      </section>

      {/* ─── Unit Types Section ───────────────────────────────────────── */}
      <section id="units" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>الوحدات</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4" style={arFont}>اختار وحدتك</h2>
            <div className="divider-gold max-w-xs mx-auto mb-4" />
            <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed" style={arFont}>
              كل وحدة في مارينا تاورز بتراس بحمام سباحة خاص وإطلالة بانورامية على البحر وتشطيبات ماريوت. يبدأ من 9 مليون بمقدم 5% وخطة سداد 10 سنين.
            </p>
          </div>

          {/* Unit Type Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {UNIT_TYPES.map((unit) => (
              <button
                key={unit.id}
                onClick={() => { setActiveUnitTab(unit.id); setUnitView("render"); }}
                className={`px-4 py-2 rounded-full text-xs tracking-[0.1em] transition-all duration-300 border ${
                  activeUnitTab === unit.id
                    ? "bg-gold-400 text-navy-950 border-gold-400 font-semibold"
                    : "bg-transparent text-cream-200 border-cream-200/30 hover:border-gold-400/60 hover:text-gold-300"
                }`}
                style={arFont}
              >
                {unit.label}
              </button>
            ))}
          </div>

          {/* Active Unit Display */}
          {UNIT_TYPES.filter((u) => u.id === activeUnitTab).map((unit) => (
            <div key={unit.id} className="grid md:grid-cols-2 gap-8 items-start">
              {/* Image Panel */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-navy-900">
                  <img
                    src={unitView === "render" ? unit.renderImage : unit.planImage}
                    alt={`${unit.label} ${unitView === "render" ? "داخلي" : "مسقط أفقي"}`}
                    className="w-full h-full object-cover transition-all duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setUnitView("render")}
                    className={`flex-1 py-2 rounded-lg text-xs tracking-wide transition-all border ${unitView === "render" ? "bg-gold-400/20 border-gold-400/60 text-gold-300" : "bg-transparent border-cream-200/20 text-muted-foreground hover:border-gold-400/40"}`}
                    style={arFont}
                  >
                    داخلي
                  </button>
                  <button
                    onClick={() => setUnitView("plan")}
                    className={`flex-1 py-2 rounded-lg text-xs tracking-wide transition-all border ${unitView === "plan" ? "bg-gold-400/20 border-gold-400/60 text-gold-300" : "bg-transparent border-cream-200/20 text-muted-foreground hover:border-gold-400/40"}`}
                    style={arFont}
                  >
                    مسقط أفقي
                  </button>
                </div>
              </div>

              {/* Info Panel */}
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-3 mb-2 flex-row-reverse justify-end">
                  <h3 className="font-serif text-3xl md:text-4xl text-cream-50" style={arFont}>{unit.label}</h3>
                  <span className="text-gold-400 text-sm" style={arFont}>{unit.size}</span>
                </div>
                <div className="divider-gold mb-5" />

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl glass-card">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-gold-400/80 mb-1" style={arFont}>غرف النوم</p>
                    <p className="font-serif text-2xl text-cream-50">{unit.beds}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl glass-card">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-gold-400/80 mb-1" style={arFont}>الحمامات</p>
                    <p className="font-serif text-2xl text-cream-50">{unit.baths}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl glass-card">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-gold-400/80 mb-1" style={arFont}>المساحة</p>
                    <p className="font-serif text-lg text-cream-50">{unit.size}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/80 mb-3" style={arFont}>المميزات الرئيسية</p>
                  <div className="grid grid-cols-2 gap-2">
                    {unit.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 flex-row-reverse justify-end">
                        <div className="w-1 h-1 rounded-full bg-gold-400 flex-shrink-0" />
                        <span className="text-cream-200 text-xs" style={arFont}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl glass-card mb-4">
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-gold-400/80 mb-1" style={arFont}>المقدم</p>
                    <p className="font-serif text-xl text-cream-50">5%</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.1em] uppercase text-gold-400/80 mb-1" style={arFont}>السعر يبدأ من</p>
                    <p className="font-serif text-2xl text-gold-300" style={arFont}>{unit.startingPrice}</p>
                  </div>
                </div>

                <button
                  onClick={openPopup}
                  className="btn-gold w-full py-3 rounded-full text-xs tracking-wide"
                  style={arFont}
                >
                  احجز الوحدة دي في الإطلاق
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────── */}
      <section className="bg-navy-900 border-y border-gold-400/15 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "8", unit: "أبراج", desc: "تصميم أسطواني أيقوني" },
              { value: "45", unit: "دقيقة", desc: "من العاصمة الإدارية" },
              { value: "100%", unit: "تسليم", desc: "سجل تطوير مصر الحافل" },
              { value: "+15", unit: "مرفق", desc: "مرافق عالمية المستوى" },
            ].map((stat) => (
              <div key={stat.unit}>
                <div className="stat-number text-4xl md:text-5xl">{stat.value}</div>
                <div className="text-gold-400 text-xs tracking-[0.1em] uppercase mt-1" style={arFont}>{stat.unit}</div>
                <div className="text-muted-foreground text-xs mt-1" style={arFont}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Project Highlights ───────────────────────────────────────── */}
      <Section id="highlights" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>مميزات المشروع</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4" style={arFont}>صُمِّم ليبهرك</h2>
            <div className="divider-gold max-w-xs mb-4" />
            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed" style={arFont}>
              إيل مونتي جلالة مارينا تاورز — أول سكاي لاين على البحر الأحمر في مصر. مكان اتلاقت فيه العمارة والطبيعة والفخامة في مشروع واحد.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <HighlightCard image={IMAGES.seaView} title="8 أبراج أيقونية" desc="ثمانية أبراج أسطوانية مميزة معمارياً تشكّل أول سكاي لاين على البحر الأحمر — كل دور مدوّر قليلاً لتعظيم الإطلالة البانورامية." />
            <HighlightCard image={IMAGES.beachClub} title="نادي الشاطئ الخاص" desc="نادي شاطئ متكامل بشزلونجات ومطعم على الشاطئ ورياضات مائية — بخلفية جبل الجلالة الرائعة والبحر الأحمر." />
            <HighlightCard image={IMAGES.marinaLifestyle} title="مارينا دولية" desc="كورنيش مارينا حيوي بأرصفة خاصة لليخوت والسوبر يخوت وكافيهات راقية ومطاعم ومحلات لايف ستايل طول السنة." />
          </div>
        </div>
      </Section>

      {/* ─── Architecture & Lifestyle ─────────────────────────────────── */}
      <Section className="section-padding bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>العمارة والتصميم</p>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6 leading-tight" style={arFont}>
                ملاذك المستوحى<br /><span className="text-gold-gradient">من الطبيعة</span>
              </h2>
              <div className="divider-gold mb-6" />
              <p className="text-muted-foreground text-sm leading-relaxed mb-8" style={arFont}>
                إيل مونتي جلالة صُمِّم ليجيب الطبيعة جوّاك — حجر طبيعي وأخشاب وتصميم منسجم مع البيئة. كل وحدة بإطلالة بانورامية على البحر الأحمر وجبل الجلالة في نفس الوقت.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "مارينا دولية", "إدارة ماريوت", "مستشفى 24/7", "مدارس دولية",
                  "يخت كلوب", "مركز مؤتمرات", "كورنيش فاين دايننج", "حمامات سباحة لا نهاية لها",
                  "شاطئ خاص", "جيم بانورامي", "بوليفار تجاري", "خدمات كونسيرج",
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 flex-row-reverse justify-end">
                    <span className="text-gold-400 text-xs">◆</span>
                    <span className="text-cream-200 text-xs" style={arFont}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={IMAGES.lobbyInterior} alt="لوبي مارينا تاورز الفاخر" className="rounded-2xl w-full object-cover aspect-[4/5]" />
              <div className="absolute -bottom-4 -right-4 glass-card rounded-xl p-4 gold-glow">
                <p className="text-xs tracking-widest uppercase text-gold-400" style={arFont}>بإدارة</p>
                <p className="font-serif text-xl text-cream-50" style={arFont}>ماريوت إنترناشيونال</p>
                <p className="text-xs text-muted-foreground" style={arFont}>تميز فندقي طوال العام</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Gallery ──────────────────────────────────────────────────── */}
      <Section id="gallery" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>المعرض</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4" style={arFont}>عالم فوق المعتاد</h2>
            <div className="divider-gold max-w-xs mx-auto" />
          </div>
          <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[16/9] md:aspect-[21/9]">
            <AnimatePresence mode="wait">
              <motion.img
                key={galleryIndex} src={GALLERY[galleryIndex].src} alt={GALLERY[galleryIndex].label}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 text-right">
              <h3 className="font-serif text-2xl text-cream-50" style={arFont}>{GALLERY[galleryIndex].label}</h3>
              <p className="text-cream-200 text-sm" style={arFont}>{GALLERY[galleryIndex].desc}</p>
            </div>
            <div className="absolute bottom-6 left-6 flex gap-2">
              {GALLERY.map((_, i) => (
                <button key={i} onClick={() => setGalleryIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === galleryIndex ? "bg-gold-400 w-6" : "bg-cream-200/40"}`} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {GALLERY.map((item, i) => (
              <div key={i} onClick={() => setGalleryIndex(i)}
                className={`gallery-item rounded-lg overflow-hidden aspect-square cursor-pointer border-2 transition-all ${i === galleryIndex ? "border-gold-400" : "border-transparent"}`}
              >
                <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Masterplan ───────────────────────────────────────────────── */}
      <Section id="masterplan" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>المخطط العام</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4" style={arFont}>الرؤية الكاملة</h2>
            <div className="divider-gold max-w-xs mx-auto mb-4" />
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed" style={arFont}>
              إيل مونتي جلالة ممتد على شبه جزيرة رائعة بين جبل الجلالة والبحر الأحمر. مارينا تاورز (M1–M5) بتحتل أفضل موقع على الواجهة المائية — مباشرة على المارينا بإطلالة بحرية من ثلاث جهات.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden gold-glow">
            <img
              src={IMAGES.masterplan}
              alt="المخطط العام لإيل مونتي جلالة — مارينا تاورز M1–M5"
              className="w-full object-contain bg-[#f5f0e8] rounded-2xl"
              style={{ maxHeight: "80vh" }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/90 to-transparent p-6 rounded-b-2xl">
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { label: "M1–M5", desc: "مجمعات مارينا تاورز" },
                  { label: "المارينا", desc: "مارينا يخوت دولية" },
                  { label: "الشاطئ", desc: "نادي الشاطئ الخاص" },
                  { label: "الفندق", desc: "ماريوت أوتوجراف كولكشن" },
                ].map((tag) => (
                  <div key={tag.label} className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full">
                    <span className="text-gold-400 font-serif text-sm">{tag.label}</span>
                    <span className="text-cream-200 text-xs" style={arFont}>{tag.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Pricing Calculator ───────────────────────────────────────── */}
      <Section id="pricing" className="section-padding bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>الاستثمار</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4" style={arFont}>خطة السداد بتاعتك</h2>
            <div className="divider-gold max-w-xs mx-auto mb-4" />
            <p className="text-muted-foreground text-sm max-w-lg mx-auto" style={arFont}>مصممة للمستثمر الجاد. دخول بسيط وقيمة عالية.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <PricingCalculator />
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { title: "EOI: 200,000 جنيه", desc: "تعبير عن الاهتمام قابل للاسترداد بالكامل. بيأمنلك أولوية الوصول لحفل الإطلاق واختيار الوحدة المفضلة." },
              { title: "مقدم 5%", desc: "التزام بسيط عند توقيع العقد. الرصيد المتبقي موزع على 10 سنين بأقساط شهرية متساوية." },
              { title: "خطة 10 سنين", desc: "120 قسط شهري متساوي. من غير رسوم خفية ولا مدفوعات مفاجئة. تملّك فاخر شفاف وواضح." },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-5">
                <div className="divider-gold mb-3 max-w-[2rem]" />
                <h4 className="font-serif text-lg text-gold-300 mb-2" style={arFont}>{item.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed" style={arFont}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Location ─────────────────────────────────────────────────── */}
      <Section id="location" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src={IMAGES.locationMap} alt="خريطة موقع إيل مونتي جلالة" className="rounded-2xl w-full object-cover aspect-[4/3]" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>الموقع</p>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6 leading-tight" style={arFont}>
                جبل الجلالة.<br /><span className="text-gold-gradient">ساحل البحر الأحمر.</span>
              </h2>
              <div className="divider-gold mb-6" />
              <div className="space-y-4">
                {[
                  { label: "45 دقيقة", desc: "من العاصمة الإدارية الجديدة" },
                  { label: "60 دقيقة", desc: "من القاهرة" },
                  { label: "90 دقيقة", desc: "من مطار القاهرة الدولي" },
                  { label: "مباشر", desc: "واجهة مائية على البحر الأحمر" },
                  { label: "الجلالة", desc: "خلفية جبلية وواجهة بحرية" },
                  { label: "ماريوت", desc: "إدارة فندقية داخل المشروع" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 border-b border-gold-400/10 pb-3 flex-row-reverse">
                    <span className="text-gold-300 font-serif text-lg min-w-[80px] text-right" style={arFont}>{item.label}</span>
                    <span className="text-muted-foreground text-sm" style={arFont}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Developer Trust ──────────────────────────────────────────── */}
      <Section className="section-padding bg-navy-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>المطور</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6" style={arFont}>مبني على أساس من الثقة</h2>
          <div className="divider-gold max-w-xs mx-auto mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "100%", label: "نسبة التسليم", desc: "كل مشروع، في موعده" },
              { value: "+15", label: "سنة", desc: "من التميز المُثبَت" },
              { value: "4", label: "مشاريع عملاقة", desc: "إيل مونتي، فوكا باي، D-Bay، بلومفيلدز" },
              { value: "4.5 مليار", label: "استثمار ذكي", desc: "في التكنولوجيا والابتكار" },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-xl p-5">
                <div className="stat-number text-3xl md:text-4xl mb-1">{item.value}</div>
                <div className="text-gold-400 text-xs tracking-widest uppercase" style={arFont}>{item.label}</div>
                <div className="text-muted-foreground text-xs mt-1" style={arFont}>{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm mt-8 max-w-xl mx-auto leading-relaxed" style={arFont}>
            تطوير مصر هو أكثر مطور فاخر موثوق في مصر، بسجل تسليم مثالي عبر إيل مونتي جلالة وفوكا باي وD-Bay وبلومفيلدز. استثمارك محمي بـ 15 سنة من التميز.
          </p>
        </div>
      </Section>

      {/* ─── Final CTA Banner ─────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.marinaPromenade} alt="مارينا تاورز" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-950/88" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-3" style={arFont}>31 مارس 2026 · القاهرة</p>
          <h2 className="font-serif text-4xl md:text-6xl text-cream-50 mb-4 leading-tight" style={arFont}>
            دعوتك<br />
            <span className="text-shimmer">في انتظارك</span>
          </h2>
          <p className="text-cream-200 text-sm max-w-lg mx-auto mb-3 leading-relaxed" style={arFont}>
            حفل إطلاق مارينا تاورز هو أكثر حدث عقاري منتظر في مصر 2026. الأولوية محدودة — كل مقعد بيتحجز دلوقتي هو مقعد أقل متاح بكره.
          </p>
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-red-900/30 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-[11px] tracking-[0.1em] uppercase" style={arFont}>أماكن محدودة متبقية</span>
          </div>
          <br />
          <button
            onClick={openPopup}
            className="btn-gold px-10 py-4 rounded-full text-sm tracking-wide"
            style={arFont}
          >
            احجز دعوتي — EOI 200 ألف جنيه
          </button>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-navy-950 border-t border-gold-400/15 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={IMAGES.logoTower} alt="Marina Towers" className="h-10 w-auto object-contain opacity-80" />
              <div className="text-right">
                <div className="font-serif text-xs tracking-[0.2em] text-gold-400 uppercase" style={arFont}>إيل مونتي جلالة</div>
                <div className="font-serif text-sm tracking-[0.15em] text-cream-100 uppercase" style={arFont}>مارينا تاورز</div>
                <div className="text-muted-foreground text-xs mt-0.5" style={arFont}>تطوير مصر · البحر الأحمر، مصر</div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs" style={arFont}>© 2026 مارينا تاورز — إيل مونتي جلالة. جميع الحقوق محفوظة.</p>
              <p className="text-muted-foreground text-xs mt-1" style={arFont}>الأسعار والتوافر قابلة للتغيير. الـ EOI قابل للاسترداد بالكامل.</p>
            </div>
            <div className="text-left">
              <p className="text-xs tracking-widest uppercase text-gold-400 mb-1" style={arFont}>حفل الإطلاق</p>
              <p className="font-serif text-xl text-cream-50" style={arFont}>31 مارس 2026</p>
              <p className="text-muted-foreground text-xs" style={arFont}>القاهرة، مصر</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
