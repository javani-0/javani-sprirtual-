import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useContactInfo } from "@/hooks/useContactInfo";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import PrimaryButton from "@/components/PrimaryButton";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MessageCircle } from "lucide-react";
import heroDancer1 from "@/assets/hero-dancer-1.jpg";
import heroDancer2 from "@/assets/hero-dancer-2.jpg";
import heroDancer3 from "@/assets/hero-dancer-3.jpg";

type CourseCategory = "all" | "certification" | "diploma" | "pre-grade" | "music" | "dance" | "yoga";

interface Course {
  id: string;
  image: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  category: string;
  extra?: string;
  status: string;
}

const filters: { label: string; value: CourseCategory }[] = [
  { label: "All Courses", value: "all" },
  { label: "Certification", value: "certification" },
  { label: "Diploma", value: "diploma" },
  { label: "Pre-Grade", value: "pre-grade" },
];

const badgeStyles: Record<string, string> = {
  red: "bg-primary text-primary-foreground",
  gold: "bg-gold text-gold-foreground",
  charcoal: "bg-charcoal text-charcoal-foreground",
};

const SkeletonCard = () => (
  <div className="bg-card shadow-card rounded-lg overflow-hidden">
    <div className="aspect-[3/2] skeleton-shimmer" />
    <div className="p-5 sm:p-6 space-y-3">
      <div className="h-5 w-28 skeleton-shimmer rounded" />
      <div className="h-6 w-3/4 skeleton-shimmer rounded" />
      <div className="h-4 w-full skeleton-shimmer rounded" />
      <div className="h-4 w-2/3 skeleton-shimmer rounded" />
      <div className="h-10 w-40 skeleton-shimmer rounded" />
    </div>
  </div>
);

const ExtCourseCard = ({ course, delay = 0 }: { course: Course; delay?: number }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { ref, isVisible } = useScrollAnimation();
  const { whatsappNumber } = useContactInfo();
  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in the *${course.title}* course (${course.badge}) at Javni Spiritual Arts.\n\n${course.description}${course.extra ? `\n${course.extra}` : ""}\n\nPlease share more details.`
  );

  return (
    <div ref={ref} className={`${isVisible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: isVisible ? `${delay}s` : undefined }}>
      <div className="bg-card shadow-card rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hero group flex flex-col h-full">
        <div className="aspect-[3/2] relative overflow-hidden">
          {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
          <img src={course.image} alt={course.title} loading="lazy" onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] ${imgLoaded ? "opacity-100" : "opacity-0"}`} />
        </div>
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <span className={`inline-block px-3 py-1 text-xs font-body font-medium rounded-full mb-3 self-start ${badgeStyles[course.badgeColor] || badgeStyles.red}`}>{course.badge}</span>
          {course.extra && <p className="font-body text-xs text-muted-foreground mb-2">{course.extra}</p>}
          <h3 className="font-display font-semibold text-[1.2rem] sm:text-[1.4rem] text-foreground mb-2 transition-colors duration-300 group-hover:text-gold">{course.title}</h3>
          <p className="font-body text-[0.85rem] sm:text-[0.9rem] text-muted-foreground mb-4 leading-relaxed flex-1">{course.description}</p>
          <div className="flex gap-2 sm:gap-3">
            <Link to="/contact" className="flex-1"><PrimaryButton compact className="text-[0.85rem] w-full">Know More + Enquire</PrimaryButton></Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-sm bg-[#25D366] text-white font-body font-medium text-[0.75rem] sm:text-[0.8rem] hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const tableData = [
  ["Duration", "Grade-based (1–6 yrs)", "Advanced (2–3 yrs)", "Flexible (3 months+)"],
  ["Certificate", "✅ Nationally Recognized", "✅ University-Linked", "❌ Not Applicable"],
  ["Examination", "✅ Graded Exams", "✅ Final Assessment", "❌ No Exam"],
  ["Age Group", "All ages", "12+ years", "All ages"],
  ["Ideal For", "Serious learners", "Career artists", "Beginners, hobby"],
  ["Fee Range", "₹₹₹", "₹₹₹₹", "₹₹"],
];

const ComparisonTable = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 sm:py-20 md:py-32 bg-background">
      <div ref={ref} className={`max-w-5xl mx-auto px-4 sm:px-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <SectionLabel text="FIND YOUR TRACK" className="mb-6" />
        <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[3rem] text-foreground text-center mb-10 sm:mb-12">Which Course Is Right for You?</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="p-3 sm:p-4 text-left font-display font-semibold text-[0.85rem] sm:text-[0.95rem]">Feature</th>
                <th className="p-3 sm:p-4 text-left font-display font-semibold text-[0.85rem] sm:text-[0.95rem]">Certification</th>
                <th className="p-3 sm:p-4 text-left font-display font-semibold text-[0.85rem] sm:text-[0.95rem]">Diploma</th>
                <th className="p-3 sm:p-4 text-left font-display font-semibold text-[0.85rem] sm:text-[0.95rem]">Pre-Grade</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-ivory" : "bg-card"}>
                  {row.map((cell, j) => (
                    <td key={j} className={`p-3 sm:p-4 border-l border-gold/10 ${j === 0 ? "font-display font-semibold text-foreground" : "font-body text-[0.8rem] sm:text-[0.9rem] text-muted-foreground"}`}>
                      {cell.startsWith("✅") ? (
                        <span><span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-600 text-center text-xs leading-5 mr-2">✓</span>{cell.slice(2)}</span>
                      ) : cell.startsWith("❌") ? (
                        <span><span className="inline-block w-5 h-5 rounded-full bg-red-50 text-red-400 text-center text-xs leading-5 mr-2">✗</span>{cell.slice(2)}</span>
                      ) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-8 sm:mt-10">
          <PrimaryButton>Enquire About a Course</PrimaryButton>
        </div>
      </div>
    </section>
  );
};

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState<CourseCategory>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "courses"), where("status", "==", "active"));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course)));
      }
      setLoading(false);
    }, () => { setLoading(false); });
    return unsub;
  }, []);

  const certCourses = useMemo(() => courses.filter((c) => c.category === "certification"), [courses]);
  const diplomaCourses = useMemo(() => courses.filter((c) => c.category === "diploma"), [courses]);
  const preGradeCourses = useMemo(() => courses.filter((c) => c.category === "pre-grade"), [courses]);

  const filteredCert = useMemo(() => activeFilter === "all" || activeFilter === "certification" ? certCourses : [], [activeFilter, certCourses]);
  const filteredDiploma = useMemo(() => activeFilter === "all" || activeFilter === "diploma" ? diplomaCourses : [], [activeFilter, diplomaCourses]);
  const filteredPreGrade = useMemo(() => activeFilter === "all" || activeFilter === "pre-grade" ? preGradeCourses : [], [activeFilter, preGradeCourses]);
  const hasAny = filteredCert.length + filteredDiploma.length + filteredPreGrade.length > 0;

  return (
    <>
      <SEO
        title="Courses | Bharatanatyam, Kuchipudi, Carnatic Music & More | Javni Spiritual Arts"
        description="Explore certification, diploma, and pre-grade courses in Bharatanatyam, Kuchipudi, Mohiniyattam, Carnatic Music, Tabla, Veena, and Yoga at Javni Spiritual Arts."
      />
      <main>
        <PageHero backgroundImages={[heroDancer1, heroDancer2, heroDancer3]} label="OUR COURSES" heading="Our Sacred Courses" subtext="Classical arts for every soul — from first steps to national certification." />

        <div className="sticky top-[80px] z-[500] bg-card shadow-sm py-3 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button key={f.value} onClick={() => setActiveFilter(f.value)} className={`px-4 sm:px-5 py-2 rounded-full font-body font-medium text-[0.8rem] sm:text-[0.875rem] transition-all duration-300 ${activeFilter === f.value ? "bg-gradient-primary text-primary-foreground" : "border border-ivory-dark text-muted-foreground hover:bg-ivory-dark"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <section className="py-16 sm:py-20 md:py-32 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {/* Loading - show nothing to avoid confusion */}
            </div>
          </section>
        ) : !hasAny && !loading ? (
          <div className="py-20 text-center">
            <p className="font-display text-xl text-muted-foreground">No courses available at the moment.</p>
          </div>
        ) : (
          <>
            {filteredCert.length > 0 && (
              <section className="py-16 sm:py-20 md:py-32 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <SectionLabel text="FULLY CERTIFIED" className="mb-6" />
                  <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[2.8rem] text-primary mb-3">Certification Courses</h2>
                  <p className="font-body font-light text-[0.95rem] sm:text-[1rem] text-muted-foreground mb-10 sm:mb-12 max-w-2xl">Complete a structured grade-based journey and earn a nationally recognized certificate.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredCert.map((c, i) => <ExtCourseCard key={c.id} course={c} delay={i * 0.12} />)}
                  </div>
                </div>
              </section>
            )}
            {filteredDiploma.length > 0 && (
              <section className="py-16 sm:py-20 md:py-32" style={{ background: "hsl(var(--bg-section))" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <SectionLabel text="ADVANCED MASTERY" className="mb-6" />
                  <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[2.8rem] text-primary mb-3">Diploma Courses</h2>
                  <p className="font-body font-light text-[0.95rem] sm:text-[1rem] text-muted-foreground mb-10 sm:mb-12 max-w-2xl">Deepen your mastery with advanced, university-linked diploma programs.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredDiploma.map((c, i) => <ExtCourseCard key={c.id} course={c} delay={i * 0.12} />)}
                  </div>
                </div>
              </section>
            )}
            {filteredPreGrade.length > 0 && (
              <section className="py-16 sm:py-20 md:py-32 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <SectionLabel text="EXPLORE & DISCOVER" className="mb-6" />
                  <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[2.8rem] text-primary mb-3">Pre-Grade & Hobby Courses</h2>
                  <p className="font-body font-light text-[0.95rem] sm:text-[1rem] text-muted-foreground mb-10 sm:mb-12 max-w-2xl">Perfect for curious beginners, young children, or those exploring arts without formal examination pressure.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredPreGrade.map((c, i) => <ExtCourseCard key={c.id} course={c} delay={i * 0.12} />)}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <ComparisonTable />
      </main>
      <Footer />
    </>
  );
};

export default Courses;
