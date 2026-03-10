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
        source: "Marina Towers Landing Page",
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

// ─── Unit Types Data ──────────────────────────────────────────────────────────
const UNIT_TYPES = [
  {
    id: "studio",
    label: "Studio",
    size: "65 m²",
    beds: "Studio",
    baths: "1",
    features: ["Private Pool Terrace", "Open Kitchen", "Sea View", "Master Bedroom"],
    planImage: "/images/unit-studio-plan.jpg",
    renderImage: "/images/unit-studio-render.jpg",
    startingPrice: "From 9M EGP",
  },
  {
    id: "1br",
    label: "1 Bedroom",
    size: "85 m²",
    beds: "1",
    baths: "1",
    features: ["Private Pool Terrace", "Open Kitchen", "Sea View", "Spacious Living"],
    planImage: "/images/unit-1br-plan.jpg",
    renderImage: "/images/unit-1br-render.jpg",
    startingPrice: "From 12M EGP",
  },
  {
    id: "2br",
    label: "2 Bedrooms",
    size: "110 m²",
    beds: "2",
    baths: "2",
    features: ["Private Pool Terrace", "Open Kitchen", "Sea & Mountain Views", "Master Suite"],
    planImage: "/images/unit-2br-plan.jpg",
    renderImage: "/images/unit-2br-render.jpg",
    startingPrice: "From 16M EGP",
  },
  {
    id: "3br",
    label: "3 Bedrooms",
    size: "135 m²",
    beds: "3",
    baths: "2",
    features: ["Private Pool Terrace", "Open Kitchen", "Panoramic Views", "3 Master Suites"],
    planImage: "/images/unit-3br-plan.jpg",
    renderImage: "/images/unit-3br-render.jpg",
    startingPrice: "From 20M EGP",
  },
  {
    id: "penthouse",
    label: "Penthouse",
    size: "450 m²",
    beds: "3",
    baths: "4",
    features: ["Private Garden 9.35×6.40m", "Master Bedroom 8.60×3.35m", "Reception + Open Kitchen 10.60×6.70m", "Maid Room + Laundry"],
    planImage: "/images/penthouse-floorplan.jpg",
    renderImage: "/images/penthouse-floorplan.jpg",
    startingPrice: "On Request",
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
  { src: IMAGES.seaView, label: "Iconic Architecture", desc: "8 cylindrical towers rising from the Red Sea, framed by the dramatic cliffs of Galala Mountain" },
  { src: IMAGES.marinaPromenade, label: "Marina Promenade", desc: "A vibrant waterfront promenade with premium cafes, restaurants, and lifestyle retail — all steps from your residence" },
  { src: IMAGES.beachClub, label: "Private Beach Club", desc: "A full beach club with sunbeds, umbrellas, and a beachfront restaurant — all against the backdrop of Galala Mountain" },
  { src: IMAGES.marinaLifestyle, label: "International Marina", desc: "Private berths for yachts and superyachts, with a palm-lined promenade and waterfront dining" },
  { src: IMAGES.eveningRetail, label: "Meridian Club & Retail", desc: "An evening lifestyle destination — boutiques, fine dining, and the Meridian Club lit against the Red Sea sky" },
  { src: IMAGES.lobbyInterior, label: "Luxury Lobby", desc: "Travertine stone, marble accents, and floor-to-ceiling sea views define the arrival experience at Marina Towers" },
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
          * Prices are indicative. Final pricing confirmed at the launch event on <span className="text-gold-400">March 31, 2026</span>
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
  updateForm: (field: keyof FormData, value: string) => void;
}) {
  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 3;

  useEffect(() => { if (isOpen) setStep(0); }, [isOpen]);

  // Step 0: Contact details — always capturable
  const canAdvanceStep0 = formData.name.trim().length >= 2 && formData.phone.trim().length >= 8;
  // Step 1: Soft qualification — optional but helpful
  const canAdvanceStep1 = true; // never block on soft qualification

  if (!isOpen) return null;

  const STEP_LABELS = ["Your Details", "Your Preference", "Confirmed"];

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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto glass-card rounded-t-2xl sm:rounded-2xl gold-glow"
          style={{ border: "1px solid oklch(76% 0.14 85 / 0.3)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-cream-50 transition-colors"
            style={{ background: "oklch(18% 0.03 240 / 0.8)" }}
          >
            ✕
          </button>

          <div className="p-5 md:p-8">
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                {/* Success icon */}
                <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold-300 font-serif text-2xl">✦</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-gold-300 mb-2">Invitation Confirmed</h3>
                <div className="divider-gold max-w-xs mx-auto mb-3" />
                <p className="text-cream-200 font-sans text-sm leading-relaxed mb-5">
                  Welcome, <strong>{formData.name}</strong>. Your seat at the Marina Towers Launch Event on{" "}
                  <span className="text-gold-400">March 31, 2026</span> is being reserved.
                </p>

                {/* WhatsApp instant confirmation CTA */}
                <div className="glass-card rounded-2xl p-5 mb-4 border border-gold-400/20">
                  <p className="text-xs tracking-widest uppercase text-gold-400 font-sans mb-1">Don't want to wait for a call?</p>
                  <p className="text-cream-200 text-xs font-sans mb-4 leading-relaxed">
                    Message us directly on WhatsApp to instantly confirm your attendance and get your exclusive event details.
                  </p>
                  <a
                    href={`https://wa.me/201080488822?text=${encodeURIComponent(`Hello, I just registered for the Marina Towers Launch Event on March 31, 2026. My name is ${formData.name} and my phone is ${formData.phone}. I would like to confirm my attendance.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3.5 rounded-full text-sm font-sans font-medium tracking-wide transition-all"
                    style={{ background: "#25D366", color: "#fff" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                    Confirm Attendance on WhatsApp
                  </a>
                </div>

                {/* What happens next */}
                <div className="glass-card rounded-xl p-4 text-left">
                  <p className="text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">What Happens Next</p>
                  {[
                    "Personal call from your Marina Towers advisor within 24 hours",
                    "Exclusive digital brochure and unit availability preview",
                    "Priority invitation to the March 31 launch event",
                    "First right of refusal on your preferred unit",
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 mb-2">
                      <span className="text-gold-400 text-xs mt-0.5 font-sans font-medium">0{i + 1}</span>
                      <span className="text-cream-200 text-xs font-sans">{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-5">
                  <img src={IMAGES.logoTower} alt="Marina Towers" className="h-10 w-auto mx-auto mb-3 opacity-90" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans mb-1">Exclusive Launch Event · March 31, 2026</p>
                  <h2 className="font-serif text-xl text-cream-50">Secure Your Seat</h2>
                </div>

                {/* Step Progress */}
                <div className="flex items-center gap-2 mb-1">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-gold-400" : "bg-navy-700"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-sans mb-5">
                  Step {step + 1} of {TOTAL_STEPS} — {STEP_LABELS[step]}
                </p>

                <AnimatePresence mode="wait">

                  {/* ── Step 0: Contact Details (capture first) ── */}
                  {step === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <p className="text-cream-200 text-xs font-sans mb-5 leading-relaxed">
                        Reserve your seat at the Marina Towers launch event. A dedicated advisor will contact you personally within 24 hours.
                      </p>
                      <div className="space-y-4 mb-5">
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateForm("name", e.target.value)}
                            placeholder="Your full name"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateForm("phone", e.target.value)}
                            placeholder="+20 1XX XXX XXXX"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-2">
                            Email Address <span className="text-muted-foreground normal-case tracking-normal">(optional)</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateForm("email", e.target.value)}
                            placeholder="your@email.com"
                            className="luxury-input w-full px-4 py-3 rounded-lg text-sm font-sans"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => canAdvanceStep0 ? setStep(1) : toast.error("Please enter your name and phone number.")}
                        className="btn-gold w-full py-3 rounded-full text-sm tracking-widest"
                      >
                        Continue
                      </button>
                      <p className="text-center text-[10px] text-muted-foreground font-sans mt-3">
                        Your information is kept strictly confidential.
                      </p>
                    </motion.div>
                  )}

                  {/* ── Step 1: Soft Qualification ── */}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <p className="text-cream-200 text-xs font-sans mb-5 leading-relaxed">
                        Help your advisor prepare the right information for your call. These selections are optional.
                      </p>

                      <div className="mb-5">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">Unit type of interest</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "Penthouse"].map((type) => (
                            <button
                              key={type}
                              onClick={() => updateForm("unitType", formData.unitType === type ? "" : type)}
                              className={`p-2.5 rounded-lg border text-xs font-sans text-center transition-all ${formData.unitType === type ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-xs tracking-widest uppercase text-gold-400 font-sans mb-3">When are you planning to buy?</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "launch", label: "At the March 31 Launch" },
                            { value: "q2_2026", label: "Within Q2 2026" },
                            { value: "year", label: "Within This Year" },
                            { value: "exploring", label: "Still Exploring" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateForm("timeline", formData.timeline === opt.value ? "" : opt.value)}
                              className={`p-3 rounded-lg border text-xs font-sans text-left transition-all ${formData.timeline === opt.value ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-navy-600 bg-navy-800/50 text-cream-200 hover:border-gold-400/40"}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep(0)} className="btn-outline-gold flex-1 py-3 rounded-full text-sm tracking-widest">Back</button>
                        <button
                          onClick={() => setStep(2)}
                          className="btn-gold flex-1 py-3 rounded-full text-sm tracking-widest"
                        >
                          Confirm My Seat
                        </button>
                      </div>
                      <p className="text-center text-[10px] text-muted-foreground font-sans mt-3">
                        You can skip this step — your advisor will discuss details on the call.
                      </p>
                    </motion.div>
                  )}

                  {/* ── Step 2: Submit ── */}
                  {step === 2 && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onAnimationComplete={() => {
                        if (!isSubmitting) onSubmit();
                      }}
                    >
                      <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto mb-4">
                          <span className="text-gold-300 font-serif text-lg">✦</span>
                        </div>
                        <p className="text-cream-200 text-sm font-sans mb-4">Reserving your seat...</p>
                        <div className="flex justify-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-gold-400"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
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

// ─── Project Highlight Card ───────────────────────────────────────────────────
function HighlightCard({ image, title, desc }: { image: string; title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-default">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-serif text-xl text-cream-50 mb-1">{title}</h3>
        <p className="text-cream-200 text-xs font-sans leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
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
    onSuccess: () => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      // Fire Google Ads conversion event
      try {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-11290068550/-TxgCLmvjoYcEMaMw4cq',
            value: 1.0,
            currency: 'EGP',
          });
        }
      } catch (e) { /* silent */ }
    },
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

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error("Please provide your name and phone number.");
      return;
    }
    setIsSubmitting(true);
    // Send to Google Sheets immediately (non-blocking)
    sendToSheets({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      unitType: formData.unitType || "Not specified",
      timeline: formData.timeline || "Not specified",
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

  return (
    <div className="min-h-screen bg-navy-950 text-cream-50 overflow-x-hidden">

      {/* ─── Floating WhatsApp Button ────────────────────────────────────── */}
      <a
        href="https://wa.me/201080488822?text=Hello%2C%20I%27m%20interested%20in%20the%20Marina%20Towers%20Launch%20Event%20on%20March%2015%2C%202026."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[200] flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
        style={{ background: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.727.887.928-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/>
        </svg>
      </a>

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
              <img src={IMAGES.logoTower} alt="Marina Towers" className="h-10 md:h-12 w-auto object-contain" />
            </div>
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Project Highlights", href: "highlights" },
                { label: "Gallery", href: "gallery" },
                { label: "Pricing", href: "pricing" },
                { label: "Location", href: "location" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    const el = document.getElementById(item.href);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="text-xs tracking-[0.15em] uppercase text-cream-200 hover:text-gold-300 transition-colors font-sans bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <a
                href="/ar"
                className="hidden md:flex items-center gap-1.5 border border-gold-400/30 hover:border-gold-400/70 text-gold-400/70 hover:text-gold-400 text-[10px] tracking-[0.15em] uppercase font-sans px-3 py-1.5 transition-all"
              >
                <span>🌐</span>
                <span>عربي</span>
              </a>
              <button
                onClick={openPopup}
                className="btn-gold px-4 py-2 rounded-full text-xs tracking-widest"
              >
                Attend the Launch
              </button>
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex flex-col gap-1.5 p-2"
                aria-label="Menu"
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
                  { label: "Project Highlights", href: "highlights" },
                  { label: "Gallery", href: "gallery" },
                  { label: "Pricing", href: "pricing" },
                  { label: "Location", href: "location" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById(item.href);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 150);
                    }}
                    className="text-xs tracking-[0.15em] uppercase text-cream-200 hover:text-gold-300 transition-colors font-sans py-1 bg-transparent border-none cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                ))}
                <a
                  href="/ar"
                  className="flex items-center gap-2 border border-gold-400/30 text-gold-400 text-xs tracking-[0.15em] uppercase font-sans py-2.5 px-3 mt-1"
                >
                  <span>🌐</span>
                  <span>عربي — Arabic Version</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0">
          <img src={IMAGES.seaView} alt="Marina Towers — IL Monte Galala" className="w-full h-full object-cover object-center" />
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
              You Are Invited · March 31, 2026
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

      {/* ─── Unit Types Section ─────────────────────────────────────── */}
      <section id="units" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Residences</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">Choose Your Residence</h2>
            <div className="divider-gold max-w-xs mx-auto mb-4" />
            <p className="text-muted-foreground font-sans text-sm max-w-xl mx-auto leading-relaxed">
              Every unit at Marina Towers features a private pool terrace, panoramic sea views, and Marriott-standard finishes. Starting from 9M EGP with 5% down and 10-year payment plan.
            </p>
          </div>

          {/* Unit Type Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {UNIT_TYPES.map((unit) => (
              <button
                key={unit.id}
                onClick={() => { setActiveUnitTab(unit.id); setUnitView("render"); }}
                className={`px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-sans transition-all duration-300 border ${
                  activeUnitTab === unit.id
                    ? "bg-gold-400 text-navy-950 border-gold-400 font-semibold"
                    : "bg-transparent text-cream-200 border-cream-200/30 hover:border-gold-400/60 hover:text-gold-300"
                }`}
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
                    alt={`${unit.label} ${unitView === "render" ? "interior" : "floor plan"}`}
                    className="w-full h-full object-cover transition-all duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                </div>
                {/* View Toggle */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setUnitView("render")}
                    className={`flex-1 py-2 rounded-lg text-xs tracking-widest uppercase font-sans transition-all border ${
                      unitView === "render"
                        ? "bg-gold-400/20 border-gold-400/60 text-gold-300"
                        : "bg-transparent border-cream-200/20 text-muted-foreground hover:border-gold-400/40"
                    }`}
                  >
                    Interior
                  </button>
                  <button
                    onClick={() => setUnitView("plan")}
                    className={`flex-1 py-2 rounded-lg text-xs tracking-widest uppercase font-sans transition-all border ${
                      unitView === "plan"
                        ? "bg-gold-400/20 border-gold-400/60 text-gold-300"
                        : "bg-transparent border-cream-200/20 text-muted-foreground hover:border-gold-400/40"
                    }`}
                  >
                    Floor Plan
                  </button>
                </div>
              </div>

              {/* Info Panel */}
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-serif text-3xl md:text-4xl text-cream-50">{unit.label}</h3>
                  <span className="text-gold-400 text-sm font-sans">{unit.size}</span>
                </div>
                <div className="divider-gold mb-5" />

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl glass-card">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/80 font-sans mb-1">Bedrooms</p>
                    <p className="font-serif text-2xl text-cream-50">{unit.beds}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl glass-card">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/80 font-sans mb-1">Bathrooms</p>
                    <p className="font-serif text-2xl text-cream-50">{unit.baths}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl glass-card">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/80 font-sans mb-1">Area</p>
                    <p className="font-serif text-lg text-cream-50">{unit.size}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold-400/80 font-sans mb-3">Key Features</p>
                  <div className="grid grid-cols-2 gap-2">
                    {unit.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gold-400 flex-shrink-0" />
                        <span className="text-cream-200 text-xs font-sans">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between p-4 rounded-xl glass-card mb-4">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/80 font-sans mb-1">Starting Price</p>
                    <p className="font-serif text-2xl text-gold-300">{unit.startingPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/80 font-sans mb-1">Down Payment</p>
                    <p className="font-serif text-xl text-cream-50">5%</p>
                  </div>
                </div>

                <button
                  onClick={openPopup}
                  className="btn-gold w-full py-3 rounded-full text-xs tracking-widest"
                >
                  Secure This Unit at Launch
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats Bar ──────────────────────────────────────────────────── */}
      <section className="bg-navy-900 border-y border-gold-400/15 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "8", unit: "Towers", desc: "Iconic cylindrical design" },
              { value: "45", unit: "Minutes", desc: "From New Capital" },
              { value: "100%", unit: "Delivered", desc: "Tatweer Misr track record" },
              { value: "15+", unit: "Amenities", desc: "World-class facilities" },
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

      {/* ─── Project Highlights ─────────────────────────────────────────── */}
      <Section id="highlights" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Project Highlights</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">Built to Impress</h2>
            <div className="divider-gold max-w-xs mb-4" />
            <p className="text-muted-foreground font-sans text-sm max-w-xl leading-relaxed">
              IL Monte Galala Marina Towers invites world-class operators to join in shaping Egypt's first Red Sea skyline. A landmark development where architecture, nature, and luxury converge.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <HighlightCard
              image={IMAGES.seaView}
              title="8 Iconic Towers"
              desc="Eight architecturally distinctive cylindrical towers shaping Egypt's first Red Sea skyline — each floor rotating slightly to maximise panoramic sea and mountain views."
            />
            <HighlightCard
              image={IMAGES.beachClub}
              title="Private Beach Club"
              desc="A full-service beach club with sunbeds, beachfront restaurant, and water sports — all against the dramatic backdrop of Galala Mountain and the Red Sea."
            />
            <HighlightCard
              image={IMAGES.marinaLifestyle}
              title="International Marina"
              desc="A vibrant marina promenade with private berths for yachts and superyachts, premium cafes, restaurants, and lifestyle retail activated year-round."
            />
          </div>
        </div>
      </Section>

      {/* ─── Architecture & Lifestyle ───────────────────────────────────── */}
      <Section className="section-padding bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Architecture & Design</p>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6 leading-tight">
                Your Nature<br /><span className="text-gold-gradient">Inspired Sanctuary</span>
              </h2>
              <div className="divider-gold mb-6" />
              <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-8">
                IL Monte Galala is designed to bring the outdoors inside — combining raw stone, wooden beams, and flowing landscapes so that nature wraps itself around you. Every residence commands panoramic views of the Red Sea and Galala Mountain simultaneously.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "International Marina",
                  "Marriott Hotel Management",
                  "24/7 Hospital",
                  "International Schools",
                  "Yacht Club",
                  "Conference Centre",
                  "Fine Dining Promenade",
                  "Infinity Pools",
                  "Private Beach",
                  "Panoramic Gym",
                  "Retail Boulevard",
                  "Concierge Services",
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <span className="text-gold-400 text-xs">◆</span>
                    <span className="text-cream-200 text-xs font-sans">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={IMAGES.lobbyInterior} alt="Marina Towers Luxury Lobby" className="rounded-2xl w-full object-cover aspect-[4/5]" />
              <div className="absolute -bottom-4 -left-4 glass-card rounded-xl p-4 gold-glow">
                <p className="text-xs tracking-widest uppercase text-gold-400 font-sans">Managed By</p>
                <p className="font-serif text-xl text-cream-50">Marriott International</p>
                <p className="text-xs text-muted-foreground font-sans">Year-round hospitality excellence</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Gallery ────────────────────────────────────────────────────── */}
      <Section id="gallery" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Gallery</p>
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

      {/* ─── Masterplan ─────────────────────────────────────────────────── */}
      <Section id="masterplan" className="section-padding bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Site Plan</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">The Full Vision</h2>
            <div className="divider-gold max-w-xs mx-auto mb-4" />
            <p className="text-muted-foreground font-sans text-sm max-w-2xl mx-auto leading-relaxed">
              IL Monte Galala spans a dramatic peninsula between Galala Mountain and the Red Sea. Marina Towers (clusters M1–M5) occupies the prime waterfront position — directly on the marina, with unobstructed sea views on three sides.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden gold-glow">
            <img
              src={IMAGES.masterplan}
              alt="IL Monte Galala Masterplan — Marina Towers M1–M5"
              className="w-full object-contain bg-[#f5f0e8] rounded-2xl"
              style={{ maxHeight: "80vh" }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/90 to-transparent p-6 rounded-b-2xl">
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { label: "M1–M5", desc: "Marina Towers Clusters" },
                  { label: "Marina", desc: "International Yacht Marina" },
                  { label: "Beach", desc: "Private Beach Club" },
                  { label: "Hotel", desc: "Marriott Autograph Collection" },
                ].map((tag) => (
                  <div key={tag.label} className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full">
                    <span className="text-gold-400 font-serif text-sm">{tag.label}</span>
                    <span className="text-cream-200 text-xs font-sans">{tag.desc}</span>
                  </div>
                ))}
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
              { title: "EOI: 200,000 EGP", desc: "Fully refundable expression of interest. Secures your priority access to the launch event and preferred unit selection." },
              { title: "5% Down Payment", desc: "Minimal commitment on contract signing. The remaining balance is structured across 10 years of equal monthly installments." },
              { title: "10-Year Plan", desc: "120 equal monthly payments. No hidden fees, no balloon payments. Pure, transparent luxury ownership." },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-5">
                <div className="divider-gold mb-3 max-w-[2rem]" />
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
              <img src={IMAGES.locationMap} alt="IL Monte Galala Location Map" className="rounded-2xl w-full object-cover aspect-[4/3]" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">Location</p>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6 leading-tight">
                Galala Mountain.<br /><span className="text-gold-gradient">Red Sea Coast.</span>
              </h2>
              <div className="divider-gold mb-6" />
              <div className="space-y-4">
                {[
                  { label: "45 min", desc: "From New Administrative Capital" },
                  { label: "60 min", desc: "From Cairo" },
                  { label: "90 min", desc: "From Cairo International Airport" },
                  { label: "Direct", desc: "Red Sea waterfront access" },
                  { label: "Galala", desc: "Mountain backdrop, sea frontage" },
                  { label: "Marriott", desc: "On-site hotel management" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 border-b border-gold-400/10 pb-3">
                    <span className="text-gold-300 font-serif text-lg min-w-[60px]">{item.label}</span>
                    <span className="text-muted-foreground text-sm font-sans">{item.desc}</span>
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
              { value: "4", label: "Mega Projects", desc: "IL Monte Galala, Fouka Bay, D-Bay, Bloomfields" },
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
          <img src={IMAGES.marinaPromenade} alt="Marina Towers" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-950/88" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-400 font-sans mb-3">March 31, 2026 · Cairo</p>
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
            className="btn-gold px-10 py-4 rounded-full text-sm tracking-widest"
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
              <p className="font-serif text-xl text-cream-50">March 31, 2026</p>
              <p className="text-muted-foreground text-xs font-sans">Cairo, Egypt</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
