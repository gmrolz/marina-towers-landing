import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Google Sheets Webhook ────────────────────────────────────────────────────
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

// ─── UTM Hook ────────────────────────────────────────────────────────────────
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

// ─── Unit Types ───────────────────────────────────────────────────────────────
const UNIT_TYPES = [
  {
    id: "studio",
    label: "استوديو",
    size: "65 م²",
    beds: "استوديو",
    baths: "1",
    features: ["تراس خاص مع مسبح", "مطبخ مفتوح", "إطلالة بحرية", "غرفة نوم رئيسية"],
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
    features: ["تراس خاص مع مسبح", "مطبخ مفتوح", "إطلالة بحرية", "صالة واسعة"],
    planImage: "/images/unit-1br-plan.jpg",
    renderImage: "/images/unit-1br-render.jpg",
    startingPrice: "من 12 مليون جنيه",
  },
  {
    id: "2br",
    label: "غرفتا نوم",
    size: "110 م²",
    beds: "2",
    baths: "2",
    features: ["تراس خاص مع مسبح", "مطبخ مفتوح", "إطلالة بحر وجبل", "جناح رئيسي"],
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
    features: ["تراس خاص مع مسبح", "مطبخ مفتوح", "إطلالة بانورامية", "3 أجنحة رئيسية"],
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
    features: ["حديقة خاصة 9.35×6.40م", "غرفة نوم رئيسية 8.60×3.35م", "صالة + مطبخ مفتوح 10.60×6.70م", "غرفة خادمة + غسيل"],
    planImage: "/images/penthouse-floorplan.jpg",
    renderImage: "/images/penthouse-floorplan.jpg",
    startingPrice: "بالتواصل",
  },
];

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

// ─── Countdown ────────────────────────────────────────────────────────────────
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

// ─── Fade-in animation ────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeAr() {
  const utm = useUTM();
  const timeLeft = useCountdown();
  const submitLead = trpc.leads.submit.useMutation();

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", unitType: "", timeline: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeUnit, setActiveUnit] = useState(0);
  const [activeTab, setActiveTab] = useState<"plan" | "interior">("plan");
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف");
      return;
    }
    try {
      await submitLead.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        unitType: formData.unitType || undefined,
        timeline: formData.timeline || undefined,
        utmSource: utm.source || undefined,
        utmMedium: utm.medium || undefined,
        utmCampaign: utm.campaign || undefined,
      });
      await sendToSheets({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        unitType: formData.unitType,
        timeline: formData.timeline,
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
      });
      setFormSubmitted(true);
    } catch {
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى.");
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] text-cream-50 font-arabic overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navScrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <img src={IMAGES.logoTower} alt="Marina Towers" className="h-12 w-auto" />
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
                className="text-xs tracking-[0.2em] uppercase text-cream-200/70 hover:text-gold-400 transition-colors font-sans"
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollTo("register")}
            className="hidden md:block bg-gold-500 hover:bg-gold-400 text-[#0a0a0a] text-xs font-bold tracking-[0.15em] uppercase px-5 py-2.5 transition-colors"
          >
            احجز مقعدك
          </button>
          <button className="md:hidden text-cream-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0a]/98 border-t border-white/10 px-6 py-4 flex flex-col gap-4"
            >
              {[
                { label: "مميزات المشروع", id: "highlights" },
                { label: "المعرض", id: "gallery" },
                { label: "الأسعار", id: "pricing" },
                { label: "الموقع", id: "location" },
              ].map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="text-sm text-cream-200/70 text-right py-1">
                  {item.label}
                </button>
              ))}
              <button onClick={() => scrollTo("register")} className="bg-gold-500 text-[#0a0a0a] text-sm font-bold py-3 mt-2">
                احجز مقعدك
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.heroAerial} alt="Marina Towers" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/40 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-gold-500/40 bg-gold-500/10 text-gold-400 text-[10px] tracking-[0.3em] uppercase font-sans px-4 py-2 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            أنت مدعو · 31 مارس 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-cream-50 leading-[1.1] mb-6"
          >
            أفخم إطلاق
            <br />
            <span className="text-gold-400">عقاري في 2026</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-cream-200/70 text-lg md:text-xl max-w-2xl mx-auto mb-4 font-arabic leading-relaxed"
          >
            أبراج مارينا في إيل مونت جلالة — أول أبراج فاخرة على البحر الأحمر مباشرةً.
            بإدارة ماريوت. من تطوير مصر.{" "}
            <span className="text-gold-400">الأماكن محدودة.</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-red-400/80 font-sans mb-12"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            دعوات محدودة متبقية
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-cream-200/40 font-sans mb-6">الحفل يبدأ خلال</p>
            <div className="flex items-center justify-center gap-3 md:gap-6">
              {[
                { value: pad(timeLeft.days), label: "يوم" },
                { value: pad(timeLeft.hours), label: "ساعة" },
                { value: pad(timeLeft.minutes), label: "دقيقة" },
                { value: pad(timeLeft.seconds), label: "ثانية" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-sm w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                      <span className="text-2xl md:text-4xl font-serif text-gold-400 tabular-nums">{item.value}</span>
                    </div>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-cream-200/40 font-sans mt-2">{item.label}</span>
                  </div>
                  {i < 3 && <span className="text-gold-400/40 text-2xl font-serif mb-4">:</span>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 border-t border-white/10 pt-8"
          >
            {[
              { value: "EOI", label: "200,000 جنيه" },
              { value: "يبدأ من", label: "9 مليون جنيه" },
              { value: "مقدم", label: "5% فقط" },
              { value: "تقسيط", label: "حتى 10 سنوات" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/60 font-sans">{s.value}</p>
                <p className="text-sm md:text-base font-serif text-cream-50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-gold-400/60 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* ── Project Highlights ── */}
      <section id="highlights" className="py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60 font-sans mb-3">ما يجعله استثنائياً</p>
            <h2 className="text-4xl md:text-5xl font-serif text-cream-50">مميزات المشروع</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {[
              {
                icon: "⚓",
                title: "مارينا دولية IGY",
                desc: "800 متر عرضاً، تستوعب 154 يخت بأطوال 30–120 قدم. بإدارة IGY Marinas الأمريكية — نفس مستوى موناكو وكان.",
              },
              {
                icon: "🏛",
                title: "مركز مؤتمرات عالمي",
                desc: "28,000 م² مستوحى من Palais des Festivals في كان. يضمن إشغالاً طوال العام وعائداً استثمارياً يصل لـ 25%.",
              },
              {
                icon: "🏨",
                title: "إدارة ماريوت",
                desc: "أوتوجراف كوليكشن — إدارة فندقية عالمية، إدراج في شبكة ماريوت، وعائد إيجاري مُدار باحترافية.",
              },
              {
                icon: "🌊",
                title: "إطلالة بانورامية",
                desc: "على هضبة 65 متراً فوق البحر — رؤية غير منقطعة للبحر الأحمر وجبل الجلالة من كل الوحدات.",
              },
              {
                icon: "🚗",
                title: "60 دقيقة من القاهرة",
                desc: "30–45 دقيقة من العاصمة الإدارية. المشروع مصمم للسكن الدائم، ليس المصيف فقط.",
              },
              {
                icon: "🏗",
                title: "تطوير مصر — ضمان المطور",
                desc: "16,000+ عميل، 34,000 وحدة مطورة. مبيعات 12 مليار جنيه في النصف الأول من 2025.",
              },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 0.07} className="bg-[#0e0e0e] p-8 md:p-10">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-serif text-xl text-cream-50 mb-3">{f.title}</h3>
                <p className="text-cream-200/50 text-sm leading-relaxed font-arabic">{f.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="gallery" className="py-24 md:py-32 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60 font-sans mb-3">شاهد المشروع</p>
            <h2 className="text-4xl md:text-5xl font-serif text-cream-50">معرض الصور</h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { src: IMAGES.seaView, label: "إطلالة البحر" },
              { src: IMAGES.marinaPromenade, label: "مارينا برومناد" },
              { src: IMAGES.beachClub, label: "بيتش كلوب" },
              { src: IMAGES.marinaLifestyle, label: "لايف ستايل المارينا" },
              { src: IMAGES.eveningRetail, label: "ميريديان كلوب" },
              { src: IMAGES.lobbyInterior, label: "اللوبي الفاخر" },
            ].map((img, i) => (
              <FadeIn key={i} delay={i * 0.05} className="relative overflow-hidden group aspect-[4/3]">
                <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs tracking-[0.2em] uppercase text-gold-400 font-sans">{img.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Unit Types ── */}
      <section id="pricing" className="py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60 font-sans mb-3">اختر وحدتك</p>
            <h2 className="text-4xl md:text-5xl font-serif text-cream-50">الوحدات والأسعار</h2>
          </FadeIn>

          {/* Unit tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {UNIT_TYPES.map((u, i) => (
              <button
                key={u.id}
                onClick={() => { setActiveUnit(i); setActiveTab("plan"); }}
                className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase font-sans transition-all ${
                  activeUnit === i
                    ? "bg-gold-500 text-[#0a0a0a] font-bold"
                    : "border border-white/10 text-cream-200/50 hover:border-gold-500/40 hover:text-gold-400"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeUnit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-0 border border-white/10"
            >
              {/* Image panel */}
              <div className="relative bg-[#0e0e0e]">
                <div className="flex border-b border-white/10">
                  {(["plan", "interior"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-[10px] tracking-[0.2em] uppercase font-sans transition-colors ${
                        activeTab === tab ? "text-gold-400 border-b-2 border-gold-400" : "text-cream-200/40"
                      }`}
                    >
                      {tab === "plan" ? "المسقط" : "الداخلية"}
                    </button>
                  ))}
                </div>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={activeTab === "plan" ? UNIT_TYPES[activeUnit].planImage : UNIT_TYPES[activeUnit].renderImage}
                    alt={UNIT_TYPES[activeUnit].label}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info panel */}
              <div className="bg-[#0e0e0e] p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-3xl text-cream-50 mb-2">{UNIT_TYPES[activeUnit].label}</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-gold-400 text-sm font-sans">{UNIT_TYPES[activeUnit].size}</span>
                    <span className="w-px h-4 bg-white/20" />
                    <span className="text-cream-200/50 text-sm font-sans">
                      {UNIT_TYPES[activeUnit].beds !== "استوديو" ? `${UNIT_TYPES[activeUnit].beds} غرف نوم` : "استوديو"}
                    </span>
                    <span className="w-px h-4 bg-white/20" />
                    <span className="text-cream-200/50 text-sm font-sans">{UNIT_TYPES[activeUnit].baths} حمام</span>
                  </div>
                  <div className="space-y-2 mb-8">
                    {UNIT_TYPES[activeUnit].features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full bg-gold-400 flex-shrink-0" />
                        <span className="text-cream-200/60 text-sm font-arabic">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="border-t border-white/10 pt-6 mb-6">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-cream-200/40 font-sans mb-1">السعر يبدأ من</p>
                    <p className="font-serif text-2xl text-gold-400">{UNIT_TYPES[activeUnit].startingPrice}</p>
                    <p className="text-[10px] text-cream-200/30 font-sans mt-1">
                      * الأسعار استرشادية. السعر النهائي يُحدد في حفل الإطلاق 31 مارس 2026
                    </p>
                  </div>
                  <button
                    onClick={() => scrollTo("register")}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-[#0a0a0a] text-xs font-bold tracking-[0.15em] uppercase py-4 transition-colors"
                  >
                    احجز مقعدك في حفل الإطلاق
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Payment plan */}
          <FadeIn className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {[
              { label: "مقدم الحجز (EOI)", value: "200,000 جنيه", sub: "مسترد بالكامل" },
              { label: "المقدم", value: "5% فقط", sub: "عند التعاقد" },
              { label: "التقسيط", value: "حتى 10 سنوات", sub: "بدون فوائد" },
              { label: "التسليم", value: "مرحلة الإطلاق", sub: "حسب جدول المطور" },
            ].map((p, i) => (
              <div key={i} className="bg-[#0e0e0e] p-6 text-center">
                <p className="text-[9px] tracking-[0.2em] uppercase text-cream-200/40 font-sans mb-2">{p.label}</p>
                <p className="font-serif text-xl text-gold-400 mb-1">{p.value}</p>
                <p className="text-[10px] text-cream-200/30 font-sans">{p.sub}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location" className="py-24 md:py-32 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60 font-sans mb-3">الموقع الاستراتيجي</p>
              <h2 className="text-4xl md:text-5xl font-serif text-cream-50 mb-8">
                قلب الجلالة،
                <br />
                <span className="text-gold-400">على البحر الأحمر</span>
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  { time: "60 دقيقة", from: "من القاهرة" },
                  { time: "30–45 دقيقة", from: "من العاصمة الإدارية" },
                  { time: "90 دقيقة", from: "من مطار القاهرة الدولي" },
                  { time: "5 كيلومترات", from: "من موفنبيك وبورتو السخنة" },
                ].map((loc, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <span className="font-serif text-gold-400 text-lg w-36 flex-shrink-0">{loc.time}</span>
                    <span className="text-cream-200/50 text-sm font-arabic">{loc.from}</span>
                  </div>
                ))}
              </div>
              <p className="text-cream-200/40 text-sm leading-relaxed font-arabic">
                على هضبة جبلية ترتفع 65 متراً فوق سطح البحر — مناخ معتدل طوال العام، مياه صافية، وشعاب مرجانية نابضة بالحياة.
              </p>
            </FadeIn>
            <FadeIn delay={0.2} className="relative">
              <img src={IMAGES.locationMap} alt="خريطة الموقع" className="w-full object-cover" />
              <div className="absolute inset-0 border border-gold-500/20" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Registration Form ── */}
      <section id="register" className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={IMAGES.seaView} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60 font-sans mb-3">حفل الإطلاق الحصري</p>
            <h2 className="text-4xl md:text-5xl font-serif text-cream-50 mb-4">احجز مقعدك الآن</h2>
            <p className="text-cream-200/50 font-arabic">
              31 مارس 2026 · القاهرة
              <br />
              <span className="text-red-400/70 text-sm">الأماكن محدودة — يُرجى التسجيل المسبق</span>
            </p>
          </FadeIn>

          {!formSubmitted ? (
            <FadeIn delay={0.1}>
              <form onSubmit={handleSubmit} className="bg-[#0e0e0e] border border-white/10 p-8 md:p-10 space-y-5">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-cream-200/40 font-sans mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-cream-50 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 placeholder-cream-200/20 font-arabic"
                    placeholder="محمد أحمد"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-cream-200/40 font-sans mb-2">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-cream-50 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 placeholder-cream-200/20 font-sans"
                    placeholder="+201xxxxxxxxx"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-cream-200/40 font-sans mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-cream-50 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 placeholder-cream-200/20 font-sans"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-cream-200/40 font-sans mb-2">الوحدة المفضلة</label>
                  <select
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-cream-50 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 font-arabic"
                  >
                    <option value="" className="bg-[#0e0e0e]">اختر نوع الوحدة</option>
                    <option value="studio" className="bg-[#0e0e0e]">استوديو — من 9 مليون</option>
                    <option value="1br" className="bg-[#0e0e0e]">غرفة نوم — من 12 مليون</option>
                    <option value="2br" className="bg-[#0e0e0e]">غرفتا نوم — من 16 مليون</option>
                    <option value="3br" className="bg-[#0e0e0e]">3 غرف نوم — من 20 مليون</option>
                    <option value="penthouse" className="bg-[#0e0e0e]">بنتهاوس — بالتواصل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-cream-200/40 font-sans mb-2">الجدول الزمني للشراء</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-cream-50 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 font-arabic"
                  >
                    <option value="" className="bg-[#0e0e0e]">متى تخطط للشراء؟</option>
                    <option value="launch" className="bg-[#0e0e0e]">في حفل الإطلاق 31 مارس</option>
                    <option value="3months" className="bg-[#0e0e0e]">خلال 3 أشهر</option>
                    <option value="6months" className="bg-[#0e0e0e]">خلال 6 أشهر</option>
                    <option value="exploring" className="bg-[#0e0e0e]">أستكشف الخيارات</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-[#0a0a0a] text-xs font-bold tracking-[0.15em] uppercase py-4 transition-colors mt-2"
                >
                  {submitLead.isPending ? "جارٍ التسجيل..." : "تأكيد الحضور في حفل الإطلاق"}
                </button>
                <p className="text-[10px] text-cream-200/25 text-center font-arabic">
                  بياناتك محمية ولن تُشارك مع أي طرف ثالث
                </p>
              </form>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="bg-[#0e0e0e] border border-gold-500/30 p-10 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="font-serif text-2xl text-gold-400 mb-3">تم تأكيد حضورك!</h3>
                <p className="text-cream-200/60 font-arabic mb-6">
                  سيتواصل معك فريق مبيعات مارينا تاورز قريباً لتأكيد التفاصيل.
                </p>
                <a
                  href={`https://wa.me/201080488822?text=${encodeURIComponent(`مرحباً، لقد سجلت في حفل إطلاق مارينا تاورز بتاريخ 31 مارس 2026. اسمي ${formData.name} ورقمي ${formData.phone}. أودّ تأكيد حضوري.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba58] text-white text-xs font-bold tracking-[0.1em] uppercase px-6 py-3 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  تأكيد عبر واتساب
                </a>
                <div className="mt-8 pt-6 border-t border-white/10 text-right">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/60 font-sans mb-2">ما ستجد في الحفل</p>
                  {[
                    "دعوة أولوية لحفل الإطلاق 31 مارس",
                    "عروض الوحدات بسعر الإطلاق الحصري",
                    "نماذج ثلاثية الأبعاد وجولة افتراضية",
                    "فريق مبيعات متخصص للإجابة على استفساراتك",
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5">
                      <div className="w-1 h-1 rounded-full bg-gold-400 flex-shrink-0" />
                      <span className="text-cream-200/50 text-sm font-arabic">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-gold-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.marinaPromenade} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]/60 font-sans mb-3">31 مارس 2026 · القاهرة</p>
            <h2 className="text-3xl md:text-5xl font-serif text-[#0a0a0a] mb-4">
              لا تفوّت سعر الإطلاق
            </h2>
            <p className="text-[#0a0a0a]/70 font-arabic mb-8 text-lg">
              الوحدات تُباع بسرعة في حفلات الإطلاق. سجّل الآن لضمان مقعدك وسعر الإطلاق.
            </p>
            <button
              onClick={() => scrollTo("register")}
              className="bg-[#0a0a0a] hover:bg-[#1a1a1a] text-gold-400 text-xs font-bold tracking-[0.15em] uppercase px-10 py-4 transition-colors"
            >
              احجز مقعدك الآن
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#050505] border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <img src={IMAGES.logoTower} alt="Marina Towers" className="h-10 w-auto mb-3 mx-auto md:mx-0" />
              <p className="text-cream-200/30 text-xs font-arabic">أبراج مارينا في إيل مونت جلالة · العين السخنة، البحر الأحمر</p>
              <p className="text-cream-200/20 text-xs font-arabic mt-1">من تطوير مصر · بإدارة ماريوت أوتوجراف كوليكشن</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60 font-sans mb-2">حفل الإطلاق</p>
              <p className="font-serif text-xl text-cream-50">31 مارس 2026</p>
              <p className="text-cream-200/40 text-xs font-arabic mt-1">القاهرة، مصر</p>
            </div>
            <div className="text-center md:text-left">
              <a
                href="https://wa.me/201080488822"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#25D366] text-sm font-arabic hover:text-[#20ba58] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                تواصل معنا على واتساب
              </a>
              <p className="text-cream-200/20 text-[10px] font-sans mt-3 tracking-[0.1em]">
                <a href="/" className="hover:text-gold-400 transition-colors">English Version</a>
              </p>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-6 text-center">
            <p className="text-cream-200/20 text-[10px] font-sans tracking-[0.1em]">
              © 2026 Marina Towers at IL Monte Galala. All rights reserved. Developed by Tatweer Misr.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp ── */}
      <a
        href="https://wa.me/201080488822?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D9%85%D8%A7%D8%B1%D9%8A%D9%86%D8%A7%20%D8%AA%D8%A7%D9%88%D8%B1%D8%B2"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20ba58] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
