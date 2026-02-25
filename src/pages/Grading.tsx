import { useState } from "react";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import GoldDivider from "@/components/GoldDivider";
import PrimaryButton from "@/components/PrimaryButton";
import SEO from "@/components/SEO";
import { ChevronDown, Award, Crown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroDancer1 from "@/assets/hero-dancer-1.jpg";
import heroDancer2 from "@/assets/hero-dancer-2.jpg";
import heroTemple from "@/assets/hero-temple.jpg";
import dancerPortrait from "@/assets/dancer-portrait-1.jpg";

/* ───── Intro ───── */
const IntroSection = () => {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <section className="py-16 sm:py-20 md:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[45%_1fr] gap-8 sm:gap-12 lg:gap-20 items-start">
        <div className="relative">
          <div className="absolute -inset-3 border-[4px] border-gold/30 pointer-events-none" style={{ borderRadius: "2px" }} />
          <div className="relative overflow-hidden aspect-[3/4]" style={{ borderRadius: "2px" }}>
            {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
            <img src={dancerPortrait} alt="Grading" loading="lazy" onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`} />
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[2.5rem] text-primary leading-tight mb-6">
            A Journey, Not Just a Grade
          </h2>
          <p className="font-body font-light text-[0.95rem] sm:text-[1rem] text-foreground leading-relaxed mb-4">
            At Javni, grading is more than an exam. It tracks holistic progress in technique, expression, rhythm, theory, and performance — a well-rounded development framework.
          </p>
          <p className="font-body font-light text-[0.95rem] sm:text-[1rem] text-foreground leading-relaxed mb-4">
            Each grade milestone prepares students not just for the next level, but for a deeper personal relationship with the art form itself.
          </p>
          <p className="font-body font-light text-[0.95rem] sm:text-[1rem] text-foreground leading-relaxed mb-8">
            Our grading system is aligned with national examination standards, giving your journey both spiritual and professional value.
          </p>
          <div className="space-y-4">
            <div className="border-l-[3px] border-gold pl-4 sm:pl-5 py-3 bg-ivory rounded-r-lg">
              <p className="font-body text-[0.85rem] sm:text-[0.95rem] text-foreground break-words">🎓 <strong>University-Linked Certifications</strong> — Our grade examinations are linked with recognized universities and examination bodies, making your certificate valuable nationwide.</p>
            </div>
            <div className="border-l-[3px] border-gold pl-4 sm:pl-5 py-3 bg-ivory rounded-r-lg">
              <p className="font-body text-[0.85rem] sm:text-[0.95rem] text-foreground break-words">📋 <strong>Structured Progression</strong> — Every grade has a defined syllabus, assessment criteria, and a clear milestone — so students always know their path forward.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ───── Grading Ladder ───── */
const steps = [
  { badge: "F", title: "Foundation", level: "Pre-Grade", desc: "Introduction to posture, basic Adavus, rhythm fundamentals. No examination — just joy of learning." },
  { badge: "G1", title: "Grade 1", level: "Beginner", desc: "First formal graded examination. Covers foundational Adavus, basic Abhinaya, and simple compositions." },
  { badge: "G2", title: "Grade 2", level: "Elementary", desc: "Intermediate compositions, advanced footwork patterns, and expanded mudra vocabulary." },
  { badge: "G3", title: "Grade 3", level: "Intermediate", desc: "Performance-level Adavus, full Varnam introduction, and formal stage presence training." },
  { badge: "G4/5", title: "Grade 4 / 5", level: "Senior", desc: "Senior level — complete Margam, advanced Abhinaya, and solo performance capability." },
  { badge: "JD", title: "Junior Diploma", level: "Advanced", desc: "University-examination level. Covers full traditional repertoire with written theory component." },
  { badge: "SD", title: "Senior Diploma / Arangetram", level: "Master", desc: "The pinnacle — a full solo debut performance (Arangetram) and Senior Diploma certification.", crown: true },
];

const LadderSection = () => (
  <section className="py-16 sm:py-20 md:py-32" style={{ background: "hsl(var(--bg-section))" }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <SectionLabel text="THE PROGRESSION PATH" className="mb-6" />
      <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[3rem] text-foreground text-center mb-10 sm:mb-14">From First Step to Master Level</h2>
      <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-3 sm:gap-4 min-w-[1100px] px-4 sm:px-0">
          {steps.map((s, i) => (
            <div key={s.badge} className="flex items-start">
              <div className="bg-card shadow-card rounded-lg p-4 sm:p-6 w-[155px] sm:w-[175px] text-center hover:-translate-y-1 transition-all duration-300 relative">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-accent text-xs sm:text-sm font-bold ${
                  (s as any).crown ? "bg-gold text-white ring-4 ring-gold/30" : "bg-gold/10 text-gold"
                }`}>
                  {(s as any).crown ? <Crown className="w-4 h-4 sm:w-5 sm:h-5" /> : s.badge}
                </div>
                <h3 className="font-display font-semibold text-[0.9rem] sm:text-[1rem] text-foreground mb-1">{s.title}</h3>
                <p className="font-body text-xs text-gold font-medium mb-2">{s.level}</p>
                <p className="font-body font-light text-[0.75rem] sm:text-[0.8rem] text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center px-1 pt-8">
                  <div className="w-4 sm:w-6 h-0.5 bg-gold/40" />
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-gold/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ───── Certificate Mockup ───── */
const CertificationSection = () => (
  <section className="py-16 sm:py-20 md:py-32 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
      <div>
        <SectionLabel text="WHAT YOU EARN" className="justify-start mb-6" />
        <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[2.8rem] text-primary leading-tight mb-8">
          Your Certificate, Recognized Nationally
        </h2>
        <ul className="space-y-4 mb-8">
          {[
            "Issued by a recognized national examination board",
            "University-affiliated for higher-grade levels",
            "Accepted for government arts scholarships and competitions",
            "Digital + physical certificate provided",
            "Progressive record maintained — full transcript available",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span className="font-body text-[0.9rem] sm:text-[0.95rem] text-foreground">{t}</span>
            </li>
          ))}
        </ul>
        <PrimaryButton>Ask About Certification</PrimaryButton>
      </div>
      <div className="bg-ivory rounded-lg p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(201,168,76,0.2)]" style={{ border: "3px double hsl(42,50%,54%)" }}>
        <div className="text-center">
          <p className="font-accent text-[1.1rem] sm:text-[1.2rem] md:text-[1.4rem] text-gold mb-2">Javni Spiritual Arts</p>
          <GoldDivider className="mb-4" />
          <p className="font-display text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 tracking-widest uppercase">Certificate of Achievement</p>
          <p className="font-display text-[0.95rem] sm:text-[1.1rem] text-foreground leading-relaxed mb-6 sm:mb-8">
            This certifies that <span className="font-semibold text-primary">[Student Name]</span> has successfully completed <span className="font-semibold">Grade 3</span> in <span className="font-semibold">Bharatanatyam</span>
          </p>
          <div className="flex items-end justify-between mt-8 sm:mt-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-gold flex items-center justify-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
            </div>
            <div className="text-right">
              <div className="w-24 sm:w-32 h-px bg-foreground/30 mb-1" />
              <p className="font-body text-xs text-muted-foreground">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ───── Exam Process ───── */
const examSteps = [
  { num: "1", title: "Register for Grade", desc: "Inform our faculty of your readiness. They assess your current level and recommend your exam grade." },
  { num: "2", title: "Preparation Period", desc: "Dedicated preparation classes with your guru. Syllabus reviewed, recorded practice sessions, mock exams." },
  { num: "3", title: "Examination Day", desc: "Examination conducted at our academy by certified board examiners. Practical + theory components." },
  { num: "4", title: "Receive Certificate", desc: "Results within 60 days. Digital certificate immediately. Physical certificate by post within 90 days." },
];

const ExamProcessSection = () => (
  <section className="py-16 sm:py-20 md:py-32" style={{ background: "hsl(var(--bg-section))" }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <SectionLabel text="THE EXAM JOURNEY" className="mb-6" />
      <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[3rem] text-foreground text-center mb-10 sm:mb-14">How Examinations Work</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {examSteps.map((s, i) => (
          <div key={s.num} className="relative group">
            <div className="bg-card shadow-card rounded-lg p-5 sm:p-6 hover:-translate-y-1 hover:border-t-[3px] hover:border-gold border-t-[3px] border-transparent transition-all duration-300 h-full">
              <div className="w-10 h-10 rounded-full bg-gold text-white font-accent text-sm flex items-center justify-center mb-4">{s.num}</div>
              <h3 className="font-display font-semibold text-[1rem] sm:text-[1.1rem] text-foreground mb-2">{s.title}</h3>
              <p className="font-body font-light text-[0.85rem] sm:text-[0.9rem] text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
            {i < examSteps.length - 1 && (
              <div className="hidden lg:block absolute top-10 -right-3 z-10">
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-gold/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ───── FAQ Accordion ───── */
const faqs = [
  { q: "At what age can a student appear for their first graded examination?", a: "Students can appear for Grade 1 from age 6 onwards, provided they have completed our Pre-Grade Foundation program and faculty assessment confirms readiness." },
  { q: "Is the certificate recognized outside Telangana?", a: "Yes. Our certifications are issued by national examination bodies and are recognized across India. Senior Diploma certifications are university-linked and accepted nationally." },
  { q: "How long does it take to complete all grades?", a: "Most students complete Grades 1–5 over 4–6 years with consistent practice. Timeline varies based on frequency of classes and individual progress." },
  { q: "Can adult learners also appear for certifications?", a: "Absolutely. There is no age limit for any grade. We have adult students earning their certifications alongside children, and many find it deeply fulfilling." },
  { q: "What happens if a student fails an exam?", a: "Students can re-appear in the next examination cycle. Our faculty will provide targeted guidance to strengthen areas that need improvement." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionLabel text="COMMON QUESTIONS" className="mb-6" />
        <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[3rem] text-foreground text-center mb-10 sm:mb-12">Grading FAQs</h2>
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`bg-card shadow-sm rounded-lg overflow-hidden transition-all duration-300 ${isOpen ? "border-l-[3px] border-gold" : "border-l-[3px] border-transparent"}`}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left"
                >
                  <span className="font-display font-semibold text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] text-foreground pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 pb-4 sm:pb-5 md:pb-6" : "max-h-0"}`}>
                  <p className="px-4 sm:px-5 md:px-6 font-body font-light text-[0.85rem] sm:text-[0.95rem] text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ───── Main Page ───── */
const Grading = () => (
  <>
    <SEO
      title="Grading System & Certification | Javni Spiritual Arts"
      description="Understand our university-linked certification and grade-based progression system. From foundation level to Senior Diploma and Arangetram."
    />
    <main>
      <PageHero
        backgroundImages={[heroDancer2, heroTemple, heroDancer1]}
        label="GRADING SYSTEM"
        heading="Understanding Our Grading System"
        subtext="A transparent, progressive, and internationally-aligned certification pathway."
      />
      <IntroSection />
      <LadderSection />
      <CertificationSection />
      <ExamProcessSection />
      <FAQSection />
    </main>
    <Footer />
  </>
);

export default Grading;
