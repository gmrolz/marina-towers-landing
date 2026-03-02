import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Image Paths ──────────────────────────────────────────────────────────────
const IMAGES = {
  hero: "/images/hero.jpg",
  towers: "/images/towers.jpg",
  marina: "/images/marina.jpg",
  yachtClub: "/images/hotel.jpg",
  interior: "/images/conf.jpg",
  promenade: "/images/club.jpg",
  aerialYachts: "/images/aerial.jpg",
  logoText: "/images/logo.jpg",
  logoTower: "/images/tower-logo.png",
};

// ─── Countdown Timer ──────────────────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-03-15T10:00:00+02:00");

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
      <span className="mt-1.5 text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-sans">{label}</span>
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
  { src: IMAGES.towers, label: "Iconic Architecture", desc: "5 cylindrical towers rising above the Red Sea" },
  { src: IMAGES.marina, label: "International Marina", desc: "Private berths for yachts and superyachts" },
  { src: IMAGES.interior, label: "Luxury Interiors", desc: "Panoramic sea views from every residence" },
  { src: IMAGES.yachtClub, label: "Waterfront Living", desc: "Promenade, dining, and leisure at your doorstep" },
  { src: IMAGES.promenade, label: "Marina Promenade", desc: "World-class amenities along the Red Sea coast" },
  { src: IMAGES.aerialYachts, label: "Red Sea Lifestyle", desc: "Sailing, diving, and water sports year-round" },
];

// ─── Personality Profiles ─────────────────────────────────────────────────────
const PERSONALITIES = [
  {
    type: "achiever",
    mbti: "ENTJ",
    icon: "🏆",
    title: "The Achiever",
    tagline: "Your success deserves an address that matches it.",
    message: "Marina Towers is not just a home — it is a statement. Managed by Marriott, delivering year-round rental yields, and positioned at the apex of Egypt's most prestigious address. Your portfolio deserves this.",
    cta: "See Investment Returns",
    color: "from-gold-600/20 to-gold-400/5",
    borderColor: "border-gold-500/30",
  },
  {
    type: "visionary",
    mbti: "INTJ",
    icon: "🔭",
    title: "The Visionary",
    tagline: "The future of Egyptian real estate is already here.",
    message: "45 minutes from the New Administrative Capital. Galala Mountain's first-of-its-kind development. Tatweer Misr's track record of 100% delivery. This is the strategic acquisition that defines the next decade.",
    cta: "Explore the Vision",
    color: "from-blue-900/30 to-blue-800/5",
    borderColor: "border-blue-500/30",
  },
  {
    type: "security",
    mbti: "ISFJ",
    icon: "🛡️",
    title: "The Protector",
    tagline: "The safest investment is the one backed by proven excellence.",
    message: "Tatweer Misr has never missed a delivery. Marriott's hospitality management ensures professional oversight. Full legal protection, 24/7 hospital on-site, international schools — everything your family needs, secured.",
    cta: "Learn About Security",
    color: "from-emerald-900/20 to-emerald-800/5",
    borderColor: "border-emerald-500/30",
  },
  {
    type: "explorer",
    mbti: "ENFP",
    icon: "🌊",
    title: "The Explorer",
    tagline: "Wake up to the Red Sea. Every single day.",
    message: "Imagine your morning: coffee on a panoramic balcony, the Red Sea shimmering below, your yacht waiting at the marina. Galala Mountain behind you, the horizon before you. This is not a vacation — this is your life.",
    cta: "Feel the Lifestyle",
    color: "from-cyan-900/20 to-cyan-800/5",
    borderColor: "border-cyan-500/30",
  },
];

// ─── Pricing Calculator ───────────────────────────────────────────────────────
function PricingCalculator() {
  const [price, setPrice] = useState(9000000);
  const downPayment = price * 0.05;
  const remaining = price - downPayment;
  const monthlyInstallment = remaining / 120;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 gold-glow">
      <h3 className="font-serif text-2xl md:text-3xl text-gold-300 mb-2">Payment Calculator</h3>
      <p className="text-muted-foreground text-sm mb-6 font-sans">Adjust the unit price to see your personalised payment plan</p>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-cream-200 text-sm font-sans tracking-wide">Unit Price</label>
          <span className="text-gold-300 font-serif text-xl">{price.toLocaleString("en-EG")} EGP</span>
        </div>
        <input
          type="range" min={9000000} max={30000000} step={500000} value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, oklch(76% 0.14 85) 0%, oklch(76% 0.14 85) ${((price - 9000000) / 21000000) * 100}%, oklch(28% 0.04 240) ${((price - 9000000) / 21000000) * 100}%, oklch(28% 0.04 240) 100%)` }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1 font-sans"><span>9M EGP</span><span>30M EGP</span></div>
      </div>
      <div className="space-y-3">
        {[
          { label: "EOI (Expression of Interest)", value: 200000, note: "Fully refundable", highlight: false },
          { label: "Down Payment (5%)", value: downPayment, note: "On contract signing", highlight: true },
          { label: "Remaining Balance", value: remaining, note: "Spread over 10 years", highlight: false },
          { label: "Monthly Installment", value: monthlyInstallment, note: "120 equal payments", highlight: true },
        ].map((item) => (
          <div key={item.label} className={`flex items-center justify-between p-3 rounded-lg ${item.highlight ? "bg-gold-400/10 border border-gold-400/20" : "bg-navy-800/50"}`}>
            <div>
              <p className="text-cream-100 text-sm font-sans">{item.label}</p>
              <p className="text-muted-foreground text-xs font-sans">{item.note}</p>
            </div>
            <span className={`font-serif text-lg ${item.highlight ? "text-gold-300" : "text-cream-200"}`}>
              {Math.round(item.value).toLocaleString("en-EG")} EGP
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gold-400/20">
        <p className="text-xs text-muted-foreground font-sans text-center">
          * Prices are indicative. Final pricing confirmed at the launch event on <span className="text-gold-400">March 15, 2026</span>
        </p>
      </div>
    </div>
  );
}

// ─── Popup Form Types ─────────────────────────────────────────────────────────
type FormData = {
  motivation: string;
  lifestyle: string;
  budgetRange: string;
  unitType: string;
  eoiReadiness: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  agreeToContact: boolean;
};

const INITIAL_FORM: FormData = {
  motivation: "", lifestyle: "", budgetRange: "", unitType: "",
  eoiReadiness: "", timeline: "", name: "", phone: "", email: "", agreeToContact: false,
};

// ─── Popup Multi-Step Form ────────────────────────────────────────────────────
function LaunchPopup({
  isOpen, onClose, onSubmit, isSubmitting, isSubmitted, formData, updateForm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  formData: FormData;
  updateForm: (field: keyof FormData, value: string | boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 3;

  // Reset step when popup opens
  useEffect(() => { if (isOpen) setStep(0); }, [isOpen]);

  const canAdvanceStep0 = formData.motivation && formData.lifestyle;
  const canAdvanceStep1 = formData.budgetRange && formData.eoiReadiness && formData.timeline;
  const canSubmit = formData.name && formData.phone && formData.agreeToContact;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ backgroundColor: "rgba(3,7,18,0.92)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto glass-card rounded-t-2xl sm:rounded-2xl gold-glow"
          style={{ border: "1px solid oklch(76% 0.14 85 / 0.3)" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-cream-50 transition-colors"
            style={{ background: "oklch(18% 0.03 240 / 0.8)" }}
          >
            ✕
          </button>

          <div className="p-4 md:p-8">
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="text-5xl mb-4">✦</div>
                <h3 className="font-serif text-3xl text-gold-300 mb-3">Invitation Confirmed</h3>
                <div className="divider-gold max-w-xs mx-auto mb-4" />
                <p className="text-cream-200 font-sans text-sm leading-relaxed mb-6">
                  Welcome, <strong>{formData.name}</strong>. Your seat at the Marina Towers Launch Event on <span className="text-gold-400">March 15, 2026</span> is being reserved. A dedicated advisor will call you within 24 hours.
                </p>
                <div className="glass-card rounded-xl p-4 text-left">
                  <p className="text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">What Happens Next</p>
                  {[
                    "Personal call from your Marina Towers advisor",
                    "Exclusive digital brochure & unit availability preview",
                    "Priority invitation to the March 15 launch event",
                    "First right of refusal on your preferred unit",
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 mb-2">
                      <span className="text-gold-400 text-xs mt-0.5 font-sans">0{i + 1}</span>
                      <span className="text-cream-200 text-xs font-sans">{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <img src={IMAGES.logoTower} alt="Marina Towers" className="h-12 w-auto mx-auto mb-3 opacity-90" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans mb-1">Exclusive Launch Event · March 15, 2026</p>
                  <h2 className="font-serif text-2xl text-cream-50">Secure Your Seat</h2>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-gold-400" : "bg-navy-700"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-sans mb-6">
                  Step {step + 1} of {TOTAL_STEPS} — {["Your Vision", "Your Capacity", "Your Details"][step]}
                </p>

                <AnimatePresence mode="wait">
                  {/* ── Step 0: Desire + Need ── */}
                  {step === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="mb-5">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">What drives your interest?</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "investment", label: "📈 Investment Returns" },
                            { value: "lifestyle", label: "🌊 Luxury Lifestyle" },
                            { value: "residence", label: "🏠 Primary Residence" },
                            { value: "legacy", label: "👨‍👩‍👧 Family Legacy" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateForm("motivation", opt.value)}
                              className={`p-3 rounded-lg border text-xs font-sans text-left transition-all ${formData.motivation === opt.value ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-5">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">What excites you most?</label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { value: "yacht", label: "🛥️ Yacht club & Red Sea sailing" },
                            { value: "resort", label: "🏨 Marriott resort-style living" },
                            { value: "views", label: "🏔️ Panoramic mountain & sea views" },
                            { value: "community", label: "🏫 Schools, hospital & full community" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateForm("lifestyle", opt.value)}
                              className={`p-3 rounded-lg border text-xs font-sans text-left transition-all ${formData.lifestyle === opt.value ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-5">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">Preferred unit size</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Studio", "1 Bed", "2 Bed", "3 Bed", "4 Bed", "Penthouse"].map((type) => (
                            <button
                              key={type}
                              onClick={() => updateForm("unitType", type)}
                              className={`p-2 rounded-lg border text-xs font-sans text-center transition-all ${formData.unitType === type ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => canAdvanceStep0 ? setStep(1) : toast.error("Please select your motivation and lifestyle preference.")}
                        className="btn-gold w-full py-3 rounded-full text-sm tracking-widest"
                      >
                        Continue →
                      </button>
                    </motion.div>
                  )}

                  {/* ── Step 1: Ability ── */}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="mb-5">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">Your budget range</label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { value: "9-12m", label: "9M – 12M EGP", desc: "1–2 bedroom units" },
                            { value: "12-18m", label: "12M – 18M EGP", desc: "2–3 bedroom units" },
                            { value: "18-25m", label: "18M – 25M EGP", desc: "3–4 bedroom units" },
                            { value: "25m+", label: "25M EGP+", desc: "Penthouse & premium floors" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateForm("budgetRange", opt.value)}
                              className={`p-3 rounded-lg border text-xs font-sans text-left flex justify-between items-center transition-all ${formData.budgetRange === opt.value ? "border-gold-400 bg-gold-400/10" : "border-navy-600 bg-navy-800/50 hover:border-gold-400/40"}`}
                            >
                              <span className={formData.budgetRange === opt.value ? "text-gold-300" : "text-cream-200"}>{opt.label}</span>
                              <span className="text-muted-foreground text-[10px]">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-5">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">EOI readiness (200K EGP)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "ready_now", label: "Ready now" },
                            { value: "ready_2weeks", label: "Within 2 weeks" },
                            { value: "ready_month", label: "Within a month" },
                            { value: "need_info", label: "Need more info" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateForm("eoiReadiness", opt.value)}
                              className={`p-3 rounded-lg border text-xs font-sans text-left transition-all ${formData.eoiReadiness === opt.value ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">When do you plan to buy?</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "launch", label: "At the March 15 Launch" },
                            { value: "q2_2026", label: "Q2 2026" },
                            { value: "year", label: "Within This Year" },
                            { value: "exploring", label: "Still Exploring" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateForm("timeline", opt.value)}
                              className={`p-3 rounded-lg border text-xs font-sans text-left transition-all ${formData.timeline === opt.value ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep(0)} className="btn-outline-gold flex-1 py-3 rounded-full text-sm tracking-widest">← Back</button>
                        <button
                          onClick={() => canAdvanceStep1 ? setStep(2) : toast.error("Please complete all fields.")}
                          className="btn-gold flex-1 py-3 rounded-full text-sm tracking-widest"
                        >
                          Continue →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step 2: Contact ── */}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <p className="text-muted-foreground text-xs font-sans mb-5">
                        A dedicated Marina Towers advisor will call you personally within 24 hours to confirm your seat.
                      </p>

                      <div className="space-y-4 mb-5">
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-2">Full Name *</label>
                          <input
                            type="text" value={formData.name}
                            onChange={(e) => updateForm("name", e.target.value)}
                            placeholder="Your full name"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-2">Phone Number *</label>
                          <input
                            type="tel" value={formData.phone}
                            onChange={(e) => updateForm("phone", e.target.value)}
                            placeholder="+20 1XX XXX XXXX"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-2">Email Address</label>
                          <input
                            type="email" value={formData.email}
                            onChange={(e) => updateForm("email", e.target.value)}
                            placeholder="your@email.com"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm font-sans"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mb-5">
                        <input
                          type="checkbox" id="agree" checked={formData.agreeToContact}
                          onChange={(e) => updateForm("agreeToContact", e.target.checked)}
                          className="mt-0.5 accent-gold-400"
                        />
                        <label htmlFor="agree" className="text-xs text-muted-foreground font-sans leading-relaxed cursor-pointer">
                          I agree to be contacted by the Marina Towers sales team. My information will be kept confidential.
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="btn-outline-gold flex-1 py-3 rounded-full text-sm tracking-widest">← Back</button>
                        <button
                          onClick={onSubmit}
                          disabled={isSubmitting || !canSubmit}
                          className="btn-gold flex-1 py-3 rounded-full text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Confirming..." : "Confirm My Seat ✦"}
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

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
  const countdown = useCountdown();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => { setIsSubmitted(true); },
    onError: (err: unknown) => {
      toast.error("Something went wrong. Please try again or call us directly.");
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

  const updateForm = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error("Please provide your name and phone number.");
      return;
    }
    setIsSubmitting(true);
    submitLead.mutate({
      personalityType: selectedPersonality || formData.motivation,
      primaryMotivation: formData.motivation,
      dreamLifestyle: formData.lifestyle,
      useCase: formData.motivation,
      timeline: formData.timeline,
      unitType: formData.unitType,
      budgetRange: formData.budgetRange,
      downPaymentReady: formData.eoiReadiness,
      financingMethod: "installment",
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-cream-50 overflow-x-hidden">

      {/* ─── Popup Form ─────────────────────────────────────────────────── */}
      <LaunchPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        formData={formData}
        updateForm={updateForm}
      />

      {/* ─── Navigation ─────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isNavScrolled ? "nav-blur" : "bg-transparent"}`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <img
                src={IMAGES.logoTower}
                alt="Marina Towers"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["Gallery", "Pricing", "Location"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs tracking-[0.15em] uppercase text-cream-200 hover:text-gold-300 transition-colors font-sans"
                >
                  {item}
                </a>
              ))}
            </div>
            <button
              onClick={openPopup}
              className="btn-gold px-4 py-2 rounded-full text-xs tracking-widest"
            >
              Attend the Launch
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Marina Towers — IL Monte Galala" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/45 to-navy-950/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-transparent to-navy-950/40" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-20" style={{ overflowX: 'hidden' }}>
          {/* Invitation Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-5 px-3 py-2 md:px-5 md:py-2.5 rounded-full border border-gold-400/50 bg-navy-950/70 backdrop-blur-sm max-w-full"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-gold" />
            <span className="text-gold-300 text-xs tracking-[0.25em] uppercase font-sans">
              You Are Invited · March 15, 2026
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
            className="font-serif font-light leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 9vw, 5rem)' }}
          >
            <span className="text-cream-50">The Most Exclusive</span>
            <br />
            <span className="text-shimmer">Launch of 2026</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
            className="text-cream-200 text-sm md:text-base font-sans font-light tracking-wide max-w-2xl mx-auto mb-4 px-2"
          >
            Marina Towers at IL Monte Galala — Egypt's most iconic luxury development on the Red Sea.
            Managed by Marriott. Built by Tatweer Misr. <span className="text-gold-400 font-medium">Seats are strictly limited.</span>
          </motion.p>

          {/* FOMO Scarcity Signal */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-red-900/30 border border-red-500/30"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-[10px] tracking-[0.1em] uppercase font-sans">
              Limited invitations remaining
            </span>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-10"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-gold-400 font-sans mb-4">Event Begins In</p>
            <div className="flex items-start justify-center" style={{ gap: 'clamp(4px, 2vw, 20px)' }}>
              <CountdownUnit value={countdown.days} label="Days" />
              <span className="font-serif text-gold-400/60 mt-2" style={{ fontSize: 'clamp(1.2rem, 5vw, 2.5rem)' }}>:</span>
              <CountdownUnit value={countdown.hours} label="Hours" />
              <span className="font-serif text-gold-400/60 mt-2" style={{ fontSize: 'clamp(1.2rem, 5vw, 2.5rem)' }}>:</span>
              <CountdownUnit value={countdown.minutes} label="Minutes" />
              <span className="font-serif text-gold-400/60 mt-2" style={{ fontSize: 'clamp(1.2rem, 5vw, 2.5rem)' }}>:</span>
              <CountdownUnit value={countdown.seconds} label="Seconds" />
            </div>
          </motion.div>

          {/* Key Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-10 w-full max-w-xl mx-auto"
          >
            {[
              { label: "EOI", value: "200K EGP", note: "Fully Refundable" },
              { label: "Starting From", value: "9M EGP", note: "Launch Price" },
              { label: "Down Payment", value: "5%", note: "On Signing" },
              { label: "Payment Plan", value: "10 Years", note: "Installments" },
            ].map((item) => (
              <div key={item.label} className="text-center px-2 py-3 rounded-xl glass-card">
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/80 font-sans mb-1">{item.label}</p>
                <p className="font-serif text-lg md:text-2xl text-gold-300">{item.value}</p>
                <p className="text-[10px] text-muted-foreground font-sans">{item.note}</p>
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
              className="btn-gold px-8 py-4 rounded-full text-sm tracking-widest w-full sm:w-auto"
            >
              Secure My Seat at the Launch
            </button>
            <a
              href="#gallery"
              className="btn-outline-gold px-8 py-4 rounded-full text-sm tracking-widest w-full sm:w-auto text-center"
            >
              Explore the Project
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60 font-sans">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold-400/60 to-transparent" />
        </motion.div>
      </section>

      {/* ─── Stats Bar ──────────────────────────────────────────────────── */}
      <section className="bg-navy-900 border-y border-gold-400/15 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "5", unit: "Towers", desc: "Iconic cylindrical design" },
              { value: "45", unit: "Minutes", desc: "From New Capital" },
              { value: "100%", unit: "Delivered", desc: "Tatweer Misr track record" },
              { value: "12+", unit: "Amenities", desc: "World-class facilities" },
            ].map((stat) => (
              <div key={stat.unit}>
                <div className="stat-number text-4xl md:text-5xl">{stat.value}</div>
                <div className="text-gold-400 text-xs tracking-[0.15em] uppercase font-sans mt-1">{stat.unit}</div>
                <div className="text-muted-foreground text-xs font-sans mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Personality Segmentation ───────────────────────────────────── */}
      <Section id="personality" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Tailored For You</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">What Drives Your Decision?</h2>
            <div className="divider-gold max-w-xs mx-auto mb-4" />
            <p className="text-muted-foreground font-sans max-w-xl mx-auto text-sm leading-relaxed">
              Every great investment begins with self-knowledge. Select the profile that resonates with you — and we will show you exactly why Marina Towers is built for your vision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PERSONALITIES.map((p) => (
              <motion.div
                key={p.type}
                whileHover={{ y: -4 }}
                onClick={() => { setSelectedPersonality(p.type); openPopup(); }}
                className={`personality-card glass-card rounded-2xl p-6 border ${p.borderColor} ${selectedPersonality === p.type ? "selected" : ""} bg-gradient-to-br ${p.color} cursor-pointer`}
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-gold-400/70 font-sans mb-1">{p.mbti}</div>
                <h3 className="font-serif text-xl text-cream-50 mb-2">{p.title}</h3>
                <p className="text-gold-300 text-sm font-sans italic mb-3 leading-relaxed">"{p.tagline}"</p>
                <p className="text-muted-foreground text-xs font-sans leading-relaxed">{p.message}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); openPopup(); }}
                  className="mt-4 text-xs tracking-widest uppercase text-gold-400 hover:text-gold-300 font-sans transition-colors"
                >
                  {p.cta} →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Gallery ────────────────────────────────────────────────────── */}
      <Section id="gallery" className="section-padding bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">The Project</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">A World Above the Ordinary</h2>
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
            <div className="absolute bottom-6 left-6">
              <h3 className="font-serif text-2xl text-cream-50">{GALLERY[galleryIndex].label}</h3>
              <p className="text-cream-200 text-sm font-sans">{GALLERY[galleryIndex].desc}</p>
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2">
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

      {/* ─── Amenities ──────────────────────────────────────────────────── */}
      <Section className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">The Experience</p>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6 leading-tight">
                Every Amenity.<br /><span className="text-gold-gradient">Every Luxury.</span>
              </h2>
              <div className="divider-gold mb-6" />
              <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-8">
                Marina Towers is not merely a residence — it is an ecosystem of luxury, curated for those who demand the extraordinary. From the international marina to the Marriott-managed hotel, every detail has been designed to elevate your daily life.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["International Marina", "Marriott Hotel Management", "24/7 Hospital", "International Schools", "Yacht Club", "Conference Centre", "Fine Dining Promenade", "Infinity Pools", "Private Beach", "Panoramic Gym", "Retail Boulevard", "Concierge Services"].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <span className="text-gold-400 text-xs">◆</span>
                    <span className="text-cream-200 text-xs font-sans">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={IMAGES.interior} alt="Luxury Interior" className="rounded-2xl w-full object-cover aspect-[4/5]" />
              <div className="absolute -bottom-4 -left-4 glass-card rounded-xl p-4 gold-glow">
                <p className="text-xs tracking-widest uppercase text-gold-400 font-sans">Managed By</p>
                <p className="font-serif text-xl text-cream-50">Marriott International</p>
                <p className="text-xs text-muted-foreground font-sans">Year-round hospitality excellence</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Pricing Calculator ─────────────────────────────────────────── */}
      <Section id="pricing" className="section-padding bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Investment</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">Your Payment Plan</h2>
            <div className="divider-gold max-w-xs mx-auto mb-4" />
            <p className="text-muted-foreground font-sans text-sm max-w-lg mx-auto">Designed for serious investors. Minimal entry, maximum value.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <PricingCalculator />
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "🔐", title: "EOI: 200,000 EGP", desc: "Fully refundable expression of interest. Secures your priority access to the launch event and preferred unit selection." },
              { icon: "📋", title: "5% Down Payment", desc: "Minimal commitment on contract signing. The remaining balance is structured across 10 years of equal monthly installments." },
              { icon: "📅", title: "10-Year Plan", desc: "120 equal monthly payments. No hidden fees, no balloon payments. Pure, transparent luxury ownership." },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-5 text-center">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h4 className="font-serif text-lg text-gold-300 mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-xs font-sans leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Location ───────────────────────────────────────────────────── */}
      <Section id="location" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src={IMAGES.promenade} alt="Marina Location" className="rounded-2xl w-full object-cover aspect-[4/3]" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Location</p>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6 leading-tight">
                Galala Mountain.<br /><span className="text-gold-gradient">Red Sea Coast.</span>
              </h2>
              <div className="divider-gold mb-6" />
              <div className="space-y-4">
                {[
                  { icon: "🏛️", label: "45 min", desc: "From New Administrative Capital" },
                  { icon: "✈️", label: "90 min", desc: "From Cairo International Airport" },
                  { icon: "🌊", label: "Direct", desc: "Red Sea waterfront access" },
                  { icon: "🏔️", label: "Galala", desc: "Mountain backdrop, sea frontage" },
                  { icon: "🏨", label: "Marriott", desc: "On-site hotel management" },
                  { icon: "🏥", label: "24/7", desc: "Hospital within the compound" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-xl w-8">{item.icon}</span>
                    <div>
                      <span className="text-gold-300 font-serif text-lg">{item.label}</span>
                      <span className="text-muted-foreground text-sm font-sans ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Developer Trust ─────────────────────────────────────────────── */}
      <Section className="section-padding bg-navy-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">The Developer</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6">Built on a Foundation of Trust</h2>
          <div className="divider-gold max-w-xs mx-auto mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "100%", label: "Delivery Rate", desc: "Every project, on time" },
              { value: "15+", label: "Years", desc: "Of proven excellence" },
              { value: "4", label: "Mega Projects", desc: "Across Egypt" },
              { value: "EGP 4.5B", label: "Smart Investment", desc: "In technology & innovation" },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-xl p-5">
                <div className="stat-number text-3xl md:text-4xl mb-1">{item.value}</div>
                <div className="text-gold-400 text-xs tracking-widest uppercase font-sans">{item.label}</div>
                <div className="text-muted-foreground text-xs font-sans mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground font-sans text-sm mt-8 max-w-xl mx-auto leading-relaxed">
            Tatweer Misr is Egypt's most trusted luxury developer, with a perfect track record of delivery across IL Monte Galala, Fouka Bay, D-Bay, and Bloomfields. Your investment is protected by 15 years of excellence.
          </p>
        </div>
      </Section>

      {/* ─── Final CTA Banner ────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.aerialYachts} alt="Marina Towers" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-950/88" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">March 15, 2026 · Ain Sokhna</p>
          <h2 className="font-serif text-4xl md:text-6xl text-cream-50 mb-4 leading-tight">
            Your Invitation<br />
            <span className="text-shimmer">Is Waiting</span>
          </h2>
          <p className="text-cream-200 font-sans text-sm max-w-lg mx-auto mb-3 leading-relaxed">
            The Marina Towers launch event is Egypt's most anticipated real estate moment of 2026. Priority access is strictly limited — every seat confirmed today is one fewer available tomorrow.
          </p>
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-red-900/30 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-[11px] tracking-[0.15em] uppercase font-sans">Limited seats remaining</span>
          </div>
          <br />
          <button
            onClick={openPopup}
            className="btn-gold px-10 py-4 rounded-full text-sm tracking-widest animate-pulse-gold"
          >
            Claim My Invitation — EOI 200K EGP
          </button>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-navy-950 border-t border-gold-400/15 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={IMAGES.logoTower} alt="Marina Towers" className="h-10 w-auto object-contain opacity-80" />
              <div>
                <div className="font-serif text-xs tracking-[0.3em] text-gold-400 uppercase">IL Monte Galala</div>
                <div className="font-serif text-sm tracking-[0.2em] text-cream-100 uppercase">Marina Towers</div>
                <div className="text-muted-foreground text-xs font-sans mt-0.5">By Tatweer Misr · Red Sea, Egypt</div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs font-sans">© 2026 Marina Towers — IL Monte Galala. All rights reserved.</p>
              <p className="text-muted-foreground text-xs font-sans mt-1">Prices and availability are subject to change. EOI is fully refundable.</p>
            </div>
            <div className="text-right">
              <p className="text-xs tracking-widest uppercase text-gold-400 font-sans mb-1">Launch Event</p>
              <p className="font-serif text-xl text-cream-50">March 15, 2026</p>
              <p className="text-muted-foreground text-xs font-sans">Ain Sokhna, Egypt</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
