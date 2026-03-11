import { useState, useEffect, useRef, useCallback } from "react";

// ── Design Thinking v2 Analysis ──
// EMPATHIZE: Two distinct users — (1) time-poor students needing fast project discovery,
//   (2) funders/depts needing impact proof and ROI. V1 addressed both but had
//   UX gaps: quiz didn't actually filter, no keyboard nav, no form validation,
//   no team credibility section, flat visual hierarchy.
// DEFINE: (1) Match quiz is fake — shows same 3 projects regardless of answers
//   (2) No accessibility — no focus states, no aria labels, no keyboard nav
//   (3) Partner section is visually flat — just text badges
//   (4) No "who built this" credibility signal — funders need to know who's behind it
//   (5) Support form has zero validation — bad data gets through
//   (6) Mobile beyond nav is untested — cards overflow, text too small
//   (7) Everything animates the same way — no visual rhythm variety
// IDEATE: Functional quiz matching, focus rings, form validation, team section,
//   dot-grid texture backgrounds, staggered asymmetric layouts, "Post a Project" CTA
// PROTOTYPE: This artifact. ITERATE: Deploy → user test → refine.

// ── Aesthetic Direction: "Warm Editorial" ──
// Fraunces display + DM Sans body, amber/teal/ink palette preserved,
// but adding: dot-grid textures, asymmetric hero, editorial pull-quotes,
// card hover depth, and a warmer overall feel with subtle grain.

// ── Reveal Component (improved with direction variants) ──
function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const transforms = {
    up: "translateY(28px)",
    left: "translateX(-28px)",
    right: "translateX(28px)",
    scale: "scale(0.95)",
  };

  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0) scale(1)" : transforms[direction],
        transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}>
      {children}
    </div>
  );
}

// ── Focus Ring utility ──
const focusRing = {
  outline: "none",
};
const onFocusVisible = (e) => {
  e.target.style.boxShadow = "0 0 0 3px rgba(232,133,12,0.4)";
};
const onBlurFocus = (e) => {
  e.target.style.boxShadow = "none";
};

// ── Sample Data (expanded with tags for real matching) ──
const sampleProjects = [
  { id: "1", title: "Food Insecurity Dashboard", slug: "food-insecurity", description: "Mapping access to Panther Pantry and CalFresh resources with interactive data visualization.", status: "in_progress", disciplines: ["Computer Science", "Social Justice"], skills: ["Python", "Data Viz", "UI Design"], time: "3-5 hrs/wk", members: ["Maria R.", "José L.", "Aisha K."], emoji: "💻", tags: { area: ["cs", "social"], level: ["some", "solid"], time: ["steady"] } },
  { id: "2", title: "CRISPR Explainer Series", slug: "crispr-explainer", description: "Creating accessible animated explainers to make gene-editing science approachable for everyone.", status: "recruiting", disciplines: ["Biology", "Art & Design"], skills: ["Animation", "Science Writing"], time: "1-2 hrs/wk", members: ["Sam T.", "Alex P."], emoji: "🧬", tags: { area: ["science", "art"], level: ["beginner", "some"], time: ["light"] } },
  { id: "3", title: "Campus Sustainability Tracker", slug: "sustainability", description: "A mobile app tracking waste, energy, and water use across campus with real-time student reporting.", status: "recruiting", disciplines: ["CS", "Environmental Science"], skills: ["React Native", "Node.js"], time: "3-5 hrs/wk", members: ["Kai N."], emoji: "🌱", tags: { area: ["cs", "science"], level: ["solid", "lead"], time: ["steady"] } },
  { id: "4", title: "Student-Project Matching Engine", slug: "matching-engine", description: "AI-powered tool that matches students to projects based on skills, interests, and availability.", status: "idea", disciplines: ["Computer Science", "Data Science"], skills: ["Python", "ML", "API Design"], time: "6+ hrs/wk", members: ["Henry F."], emoji: "🤖", tags: { area: ["cs"], level: ["solid", "lead"], time: ["deep"] } },
  { id: "5", title: "First-Gen Resume Builder", slug: "resume-builder", description: "A tool that helps first-gen students translate campus experience into professional resume language.", status: "in_progress", disciplines: ["CS", "Business"], skills: ["React", "UX Design"], time: "3-5 hrs/wk", members: ["Priya M.", "Cris V."], emoji: "📄", tags: { area: ["cs", "social"], level: ["some", "solid"], time: ["steady"] } },
  { id: "6", title: "Multicultural Zine Archive", slug: "zine-archive", description: "A digital archive preserving student-made zines about culture, identity, and community at Foothill.", status: "recruiting", disciplines: ["Art & Design", "Humanities"], skills: ["Web Design", "Photography", "Writing"], time: "1-2 hrs/wk", members: ["Luna D."], emoji: "🎨", tags: { area: ["art", "social"], level: ["beginner", "some"], time: ["light"] } },
];

const statusColors = {
  idea: { bg: "#FFF8F0", text: "#A35500", label: "Idea" },
  recruiting: { bg: "#E0F2F1", text: "#0D7377", label: "Recruiting" },
  in_progress: { bg: "#EDE9FE", text: "#6D28D9", label: "In Progress" },
};

const testimonials = [
  { name: "Maria R.", role: "CS Major, MESA", quote: "I found my first real team project through ProjectBridge. It turned into the portfolio piece that got me my internship.", avatar: "M" },
  { name: "Kai N.", role: "Environmental Science, ETI", quote: "I had an idea but no team. Within a week of posting, two people with the exact skills I needed reached out.", avatar: "K" },
  { name: "Priya M.", role: "CS + Business, Puente", quote: "As a first-gen student, I didn't know how to find projects outside class. ProjectBridge changed everything for me.", avatar: "P" },
];

const impactMetrics = [
  { value: "47", label: "Active Projects", icon: "📊" },
  { value: "189", label: "Students Connected", icon: "🤝" },
  { value: "12", label: "Disciplines Represented", icon: "🎯" },
  { value: "94%", label: "Return Rate", icon: "🔄" },
];

const sponsorTiers = [
  { name: "Seed", amount: "$500", color: "#80CBC4", benefits: ["Logo on platform footer", "Quarterly impact report", "Named acknowledgment at demo day"] },
  { name: "Growth", amount: "$2,000", color: "#E8850C", benefits: ["Everything in Seed", "Featured sponsor banner", "Priority project mentorship slot", "Co-branded impact case study"] },
  { name: "Bridge Builder", amount: "$5,000+", color: "#1A1A2E", benefits: ["Everything in Growth", "Named program partnership", "Student intern pipeline access", "Custom dashboard for your projects", "Keynote at annual showcase"] },
];

const departmentPitch = [
  { dept: "STEM Division", angle: "Fund cross-disciplinary capstone projects that boost enrollment metrics and transfer rates.", budget: "Perkins V, Strong Workforce", icon: "🔬" },
  { dept: "Equity & Inclusion", angle: "Directly serve first-gen, international, and underrepresented students with measurable engagement data.", budget: "Student Equity Plan, Title V", icon: "🤝" },
  { dept: "Student Services", angle: "Reduce time-to-engagement for new students. ProjectBridge surfaces opportunities they'd never find.", budget: "SSSP, Student Activities", icon: "🎯" },
  { dept: "CTE / Workforce", angle: "Students build portfolio-ready work that maps to industry competencies. Real outcomes, not just grades.", budget: "Strong Workforce, CTE Transitions", icon: "⚡" },
];

const teamMembers = [
  { name: "Giorgio (Instructor)", role: "Team Lead & Vision", program: "MESA", color: "#E8850C" },
  { name: "Laura", role: "Pipeline Research", program: "MESA", color: "#0D7377" },
  { name: "Maddi", role: "Benchling & CRISPR Design", program: "MESA", color: "#6D28D9" },
  { name: "William", role: "Computational Analysis", program: "MESA", color: "#059669" },
  { name: "Johara", role: "Data & Documentation", program: "MESA", color: "#DC2626" },
  { name: "Mireya", role: "Research Coordination", program: "MESA", color: "#2563EB" },
];

// ── Styles ──
const S = {
  root: { fontFamily: "'DM Sans', -apple-system, sans-serif", color: "#1A1A2E", background: "#FAFAF8", minHeight: "100vh", overflowX: "hidden" },
  display: { fontFamily: "'Fraunces', Georgia, serif" },
  container: { maxWidth: 1120, margin: "0 auto", padding: "0 24px" },
  amber: "#E8850C",
  teal: "#0D7377",
  ink: "#1A1A2E",
  slate: "#5A5A6A",
  mist: "#F5F4F1",
  cloud: "#E8E6E1",
  violet: "#6D28D9",
};

// ── Dot Grid Background ──
function DotGrid({ opacity = 0.04 }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `radial-gradient(circle, ${S.ink} 0.8px, transparent 0.8px)`,
      backgroundSize: "24px 24px", opacity,
    }} />
  );
}

// ── Section Label ──
function SectionLabel({ children, color = S.amber }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.14em", color, marginBottom: 10,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ width: 20, height: 1.5, background: color, display: "inline-block" }} />
      {children}
    </p>
  );
}

// ── Nav ──
function TopNav({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { key: "home", label: "Home" },
    { key: "projects", label: "Explore" },
    { key: "match", label: "Match Quiz" },
    { key: "support", label: "Support" },
  ];

  const navBtn = (key, label, isMobile = false) => (
    <button
      key={key}
      onClick={() => { setPage(key); setMenuOpen(false); }}
      onFocus={onFocusVisible} onBlur={onBlurFocus}
      aria-current={page === key ? "page" : undefined}
      style={{
        border: "none", background: isMobile && page === key ? "rgba(232,133,12,0.08)" : "none",
        borderRadius: isMobile ? 12 : 0, cursor: "pointer",
        padding: isMobile ? "16px 20px" : "4px 0",
        fontSize: isMobile ? 18 : 14, fontWeight: page === key ? 700 : 500,
        fontFamily: "'DM Sans', sans-serif", textAlign: "left",
        color: page === key ? S.amber : S.slate,
        borderBottom: !isMobile && page === key ? `2px solid ${S.amber}` : "2px solid transparent",
        transition: "all 0.2s", ...focusRing,
      }}
      onMouseEnter={e => { if (!isMobile) e.target.style.color = S.amber; }}
      onMouseLeave={e => { if (!isMobile && page !== key) e.target.style.color = S.slate; }}
    >
      {label}
    </button>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400&display=swap" rel="stylesheet" />
      <nav role="navigation" aria-label="Main navigation" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,250,248,0.96)" : "rgba(250,250,248,0.9)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? S.cloud : "transparent"}`,
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", transition: "all 0.3s ease",
      }}>
        {/* Brand */}
        <button onClick={() => { setPage("home"); setMenuOpen(false); }}
          aria-label="ProjectBridge Home"
          onFocus={onFocusVisible} onBlur={onBlurFocus}
          style={{ display: "flex", alignItems: "center", gap: 10, border: "none", background: "none", cursor: "pointer", ...focusRing, borderRadius: 8 }}>
          <div style={{
            width: 34, height: 34, background: `linear-gradient(135deg, ${S.amber}, #D97706)`,
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", ...S.display, fontWeight: 700, fontSize: 18,
            boxShadow: "0 2px 8px rgba(232,133,12,0.3)",
          }}>P</div>
          <span style={{ ...S.display, fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", color: S.ink }}>
            Project<span style={{ color: S.amber }}>Bridge</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="desktop-nav">
          {links.map(l => navBtn(l.key, l.label))}
          <button onClick={() => setPage("support")}
            onFocus={onFocusVisible} onBlur={onBlurFocus}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: `linear-gradient(135deg, ${S.amber}, #D97706)`,
              color: "white", border: "none", borderRadius: 999,
              padding: "8px 20px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s", boxShadow: "0 3px 12px rgba(232,133,12,0.3)",
              ...focusRing,
            }}>
            ❤️ Support
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onFocus={onFocusVisible} onBlur={onBlurFocus}
          style={{
            display: "none", border: "none", background: "none", cursor: "pointer",
            padding: 8, flexDirection: "column", gap: 5, ...focusRing, borderRadius: 8,
          }}>
          <span style={{ display: "block", width: 22, height: 2, background: S.ink, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(3.5px, 3.5px)" : "none" }} />
          <span style={{ display: "block", width: 22, height: 2, background: S.ink, borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 22, height: 2, background: S.ink, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(3.5px, -3.5px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: "fixed", top: 64, left: 0, right: 0, bottom: 0, zIndex: 99,
        background: "rgba(250,250,248,0.98)", backdropFilter: "blur(20px)",
        padding: "32px 20px", display: "flex", flexDirection: "column", gap: 8,
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: menuOpen ? "auto" : "none",
      }} role="menu">
        {links.map(l => navBtn(l.key, l.label, true))}
        <button onClick={() => { setPage("support"); setMenuOpen(false); }}
          style={{
            marginTop: 16, background: `linear-gradient(135deg, ${S.amber}, #D97706)`,
            color: "white", border: "none", borderRadius: 999, padding: "16px 24px",
            fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer", textAlign: "center",
          }}>
          ❤️ Support ProjectBridge
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ── Project Card (improved hover + accessibility) ──
function ProjectCard({ project, highlight = false }) {
  const s = statusColors[project.status] || statusColors.idea;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="article"
      tabIndex={0}
      onFocus={onFocusVisible} onBlur={onBlurFocus}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white", border: `1px solid ${hovered ? S.amber : highlight ? "rgba(232,133,12,0.3)" : S.cloud}`,
        borderRadius: 14, padding: 22, transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        cursor: "pointer", position: "relative", overflow: "hidden", ...focusRing,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(232,133,12,0.08)" : highlight ? "0 4px 16px rgba(232,133,12,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}>
      {/* Subtle top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: hovered ? `linear-gradient(90deg, ${S.amber}, ${S.teal})` : "transparent",
        transition: "all 0.3s",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
        <span style={{ fontSize: 30 }}>{project.emoji}</span>
        <span style={{
          fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
          padding: "4px 12px", borderRadius: 999, background: s.bg, color: s.text,
        }}>{s.label}</span>
      </div>
      <h3 style={{ ...S.display, fontWeight: 700, fontSize: 17, lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 8 }}>{project.title}</h3>
      <p style={{ fontSize: 14, color: S.slate, lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {project.skills.slice(0, 3).map(sk => (
          <span key={sk} style={{ fontSize: 12, fontWeight: 500, background: S.mist, color: S.slate, padding: "4px 10px", borderRadius: 999, border: `1px solid ${S.cloud}` }}>{sk}</span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${S.cloud}`, paddingTop: 14 }}>
        <div style={{ display: "flex" }}>
          {project.members.slice(0, 3).map((m, i) => (
            <div key={i} style={{
              width: 26, height: 26, borderRadius: 999, border: "2px solid white",
              background: `hsl(${(i * 80 + 160) % 360}, 40%, 90%)`,
              color: `hsl(${(i * 80 + 160) % 360}, 50%, 35%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, marginLeft: i > 0 ? -8 : 0,
            }}>{m[0]}</div>
          ))}
          {project.members.length > 3 && (
            <div style={{
              width: 26, height: 26, borderRadius: 999, border: "2px solid white",
              background: S.mist, color: S.slate, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 9, fontWeight: 700, marginLeft: -8,
            }}>+{project.members.length - 3}</div>
          )}
        </div>
        <span style={{ fontSize: 12, color: S.slate, fontWeight: 500 }}>⏱ {project.time}</span>
      </div>
    </div>
  );
}

// ═══ PAGES ═══

function HomePage({ setPage }) {
  return (
    <>
      {/* ═══ HERO — asymmetric layout ═══ */}
      <section style={{
        padding: "64px 24px 56px", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #FAFAF8 0%, #FFF8F0 40%, #FAFAF8 100%)",
      }}>
        <DotGrid opacity={0.03} />
        {/* Large decorative amber circle */}
        <div style={{ position: "absolute", top: -120, right: -120, width: 440, height: 440, background: "rgba(232,133,12,0.06)", borderRadius: "50%", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, background: "rgba(13,115,119,0.04)", borderRadius: "50%", filter: "blur(30px)" }} />

        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 640 }}>
            <Reveal>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "white", border: `1px solid ${S.cloud}`, borderRadius: 999,
                padding: "6px 14px", fontSize: 13, fontWeight: 500, color: S.slate, marginBottom: 24,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: "#22c55e", animation: "pulse 2s infinite" }} />
                Foothill College · Open to all disciplines
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 style={{
                ...S.display, fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800,
                lineHeight: 1.06, letterSpacing: "-0.035em", marginBottom: 20,
              }}>
                Find your project.<br />
                Build something{" "}
                <span style={{
                  color: S.amber, position: "relative",
                  textDecoration: "underline", textDecorationColor: "rgba(232,133,12,0.3)",
                  textUnderlineOffset: "6px", textDecorationThickness: "3px",
                }}>real.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p style={{ fontSize: 18, color: S.slate, lineHeight: 1.65, maxWidth: 520, marginBottom: 32 }}>
                Discover campus projects, find collaborators, and turn ideas into portfolio-ready work.
                Whether it's an app, a research study, or a community initiative — start building today.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button onClick={() => setPage("projects")}
                  onFocus={onFocusVisible} onBlur={onBlurFocus}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: `linear-gradient(135deg, ${S.amber}, #D97706)`, color: "white",
                    border: "none", borderRadius: 999, padding: "14px 28px", fontSize: 15,
                    fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 4px 16px rgba(232,133,12,0.35)", transition: "all 0.2s", ...focusRing,
                  }}>🔍 Browse Projects</button>
                <button onClick={() => setPage("match")}
                  onFocus={onFocusVisible} onBlur={onBlurFocus}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "white", color: S.ink, border: `1px solid ${S.cloud}`,
                    borderRadius: 999, padding: "14px 28px", fontSize: 15, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s", ...focusRing,
                  }}>✨ Take the Match Quiz</button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <p style={{ marginTop: 24, fontSize: 13, color: "rgba(90,90,106,0.5)" }}>
                Funded by <a href="https://foothill.edu/sli/" target="_blank" rel="noopener noreferrer" style={{ color: S.teal, textDecoration: "underline", textUnderlineOffset: "2px" }}>SLI</a> & MESA at Foothill College
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ IMPACT METRICS ═══ */}
      <section style={{ padding: "56px 24px", background: "white", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {impactMetrics.map((m, i) => (
                <div key={m.label} style={{
                  textAlign: "center", padding: "28px 16px", borderRadius: 14,
                  background: S.mist, border: `1px solid ${S.cloud}`,
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>{m.icon}</span>
                  <p style={{ ...S.display, fontSize: 36, fontWeight: 800, color: S.amber, letterSpacing: "-0.02em" }}>{m.value}</p>
                  <p style={{ fontSize: 13, color: S.slate, fontWeight: 500, marginTop: 4 }}>{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ LIVE PROJECTS ═══ */}
      <section style={{ padding: "56px 24px", position: "relative" }}>
        <DotGrid opacity={0.02} />
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <SectionLabel>What's happening now</SectionLabel>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 12 }}>Projects on campus</h2>
            <p style={{ fontSize: 16, color: S.slate, maxWidth: 520, lineHeight: 1.6, marginBottom: 36 }}>
              Real projects, real students, right now. Jump in or start your own.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
            {sampleProjects.map((p, i) => (
              <Reveal key={p.id} delay={i * 70} direction={i % 2 === 0 ? "up" : "scale"}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button onClick={() => setPage("projects")}
              onFocus={onFocusVisible} onBlur={onBlurFocus}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "white", color: S.ink, border: `1px solid ${S.cloud}`,
                borderRadius: 999, padding: "12px 28px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s", ...focusRing,
              }}>View all projects →</button>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "56px 24px", background: "white" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>How it works</SectionLabel>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 12 }}>Three moves. Zero friction.</h2>
            <p style={{ fontSize: 16, color: S.slate, maxWidth: 520, lineHeight: 1.6, marginBottom: 36 }}>
              Whether you're starting fresh or looking to join something in motion.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { num: "1", title: "Find a Project", desc: "Browse by discipline, skill, or time commitment. Take the 3-question quiz for personalized matches.", icon: "🔍" },
              { num: "2", title: "Jump In", desc: "Send a one-line intro to join a team. Or post your own idea and recruit collaborators in under 2 minutes.", icon: "🚀" },
              { num: "3", title: "Build & Document", desc: "Track milestones, post weekly updates, and grow a portfolio of real work that speaks louder than grades.", icon: "📁" },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div style={{
                  background: S.mist, border: `1px solid ${S.cloud}`, borderRadius: 14,
                  padding: 32, textAlign: "center", transition: "all 0.3s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>{step.icon}</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 999,
                    background: `linear-gradient(135deg, ${S.amber}, #D97706)`,
                    color: "white", ...S.display, fontWeight: 700, fontSize: 16,
                    display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                    boxShadow: "0 2px 8px rgba(232,133,12,0.3)",
                  }}>{step.num}</div>
                  <h3 style={{ ...S.display, fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: S.slate, lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: "56px 24px", position: "relative" }}>
        <DotGrid opacity={0.02} />
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <SectionLabel>Student voices</SectionLabel>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 36 }}>Don't take our word for it.</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 100} direction={i === 1 ? "scale" : "up"}>
                <div style={{
                  background: "white", border: `1px solid ${S.cloud}`, borderRadius: 14,
                  padding: 28, position: "relative", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <span style={{ position: "absolute", top: 12, left: 20, fontSize: 56, color: "rgba(232,133,12,0.08)", ...S.display, fontWeight: 800, lineHeight: 1 }}>"</span>
                  <p style={{ fontSize: 15, color: S.ink, lineHeight: 1.75, marginBottom: 20, paddingTop: 12, fontStyle: "italic" }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 999,
                      background: `linear-gradient(135deg, #E0F2F1, #B2DFDB)`,
                      color: S.teal, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700,
                    }}>{t.avatar}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: S.slate }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOUR BARRIERS ═══ */}
      <section style={{ padding: "56px 24px", background: "white" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>What the research found</SectionLabel>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 12 }}>Four real barriers. One bridge.</h2>
            <p style={{ fontSize: 16, color: S.slate, maxWidth: 520, lineHeight: 1.6, marginBottom: 36 }}>
              Student interviews across MESA, Puente, and Umoja revealed a consistent pattern.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { num: "01", title: "High Demand, Low Access", desc: "Students apply for SLI spring internships but there aren't enough spots. Rejected by capacity, not effort.", color: S.amber },
              { num: "02", title: "The Time Tax", desc: "Three heavy classes leave zero time to wander campus. If it isn't surfaced to you, it doesn't exist.", color: S.teal },
              { num: "03", title: "The Chaos Factor", desc: "Club projects lack briefs and follow-up. Students show up once, don't know what to do, and disappear.", color: S.violet },
              { num: "04", title: "The Graveyard Effect", desc: "When a student leader graduates, all their work and momentum vanish. ProjectBridge is the archive.", color: "#DC2626" },
            ].map((b, i) => (
              <Reveal key={b.num} delay={i * 80}>
                <div style={{
                  background: S.mist, border: `1px solid ${S.cloud}`, borderRadius: 14,
                  padding: 26, display: "flex", gap: 18, alignItems: "flex-start",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = b.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.cloud; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <span style={{ ...S.display, fontSize: 32, fontWeight: 800, color: b.color, opacity: 0.3, lineHeight: 1, minWidth: 40 }}>{b.num}</span>
                  <div>
                    <h3 style={{ ...S.display, fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", marginBottom: 8 }}>{b.title}</h3>
                    <p style={{ fontSize: 14, color: S.slate, lineHeight: 1.65 }}>{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BUILT BY — NEW: team credibility ═══ */}
      <section style={{ padding: "56px 24px", position: "relative" }}>
        <DotGrid opacity={0.02} />
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <SectionLabel color={S.teal}>The team</SectionLabel>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 12 }}>Built by students, for students.</h2>
            <p style={{ fontSize: 16, color: S.slate, maxWidth: 520, lineHeight: 1.6, marginBottom: 36 }}>
              ProjectBridge is a product of Foothill College's MESA program — a team of student researchers using AI to democratize access to collaborative projects.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
            {teamMembers.map((m, i) => (
              <Reveal key={m.name} delay={i * 60} direction="scale">
                <div style={{
                  background: "white", border: `1px solid ${S.cloud}`, borderRadius: 14,
                  padding: 20, textAlign: "center", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.cloud; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 999, margin: "0 auto 12px",
                    background: `linear-gradient(135deg, ${m.color}20, ${m.color}40)`,
                    color: m.color, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 700, ...S.display,
                  }}>{m.name[0]}</div>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{m.name}</p>
                  <p style={{ fontSize: 11, color: S.slate, lineHeight: 1.4 }}>{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section style={{ padding: "40px 24px", background: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: S.slate, marginBottom: 24 }}>Built with support from</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, alignItems: "center" }}>
              {["MESA", "SLI", "ETI", "Puente", "Umoja", "KCI", "Enactus"].map((p, i) => (
                <span key={p} style={{
                  ...S.display, fontSize: 14, fontWeight: 700, color: S.ink,
                  padding: "8px 18px", border: `1px solid ${S.cloud}`, borderRadius: 999,
                  transition: "all 0.2s", cursor: "default",
                }}
                onMouseEnter={e => { e.target.style.borderColor = S.amber; e.target.style.background = "#FFF8F0"; }}
                onMouseLeave={e => { e.target.style.borderColor = S.cloud; e.target.style.background = "transparent"; }}>{p}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: "0 24px 56px" }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          background: "linear-gradient(135deg, #1A1A2E, #2A2A4A)", borderRadius: 20,
          padding: "clamp(40px, 6vw, 72px)", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <DotGrid opacity={0.08} />
          <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "radial-gradient(circle at 30% 50%, rgba(232,133,12,0.1) 0%, transparent 50%)" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, color: "white", letterSpacing: "-0.025em", marginBottom: 14 }}>
              Don't let your idea go to the graveyard.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
              Every project on ProjectBridge is a blueprint the next generation can build on.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setPage("projects")}
                onFocus={onFocusVisible} onBlur={onBlurFocus}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: `linear-gradient(135deg, ${S.amber}, #D97706)`, color: "white",
                  border: "none", borderRadius: 999, padding: "14px 32px", fontSize: 16,
                  fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 16px rgba(232,133,12,0.35)", ...focusRing,
                }}>🔍 Find a Project</button>
              <button onClick={() => setPage("support")}
                onFocus={onFocusVisible} onBlur={onBlurFocus}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 999, padding: "14px 32px", fontSize: 16, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", ...focusRing,
                }}>❤️ Support the Mission</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══ SUPPORT PAGE ═══
function SupportPage() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", org: "", message: "", type: "sponsor" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Please enter a valid email";
    if (!formData.message.trim()) errs.message = "Please include a message";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: `1px solid ${errors[field] ? "#DC2626" : S.cloud}`, fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
  });

  return (
    <>
      {/* Hero */}
      <section style={{
        padding: "64px 24px 56px",
        background: "linear-gradient(135deg, #1A1A2E 0%, #2A2A4A 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <DotGrid opacity={0.06} />
        <div style={{ position: "absolute", top: "-40%", right: "-20%", width: 600, height: 600, background: "radial-gradient(circle, rgba(232,133,12,0.15) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <Reveal>
            <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>🌉</span>
            <h1 style={{
              ...S.display, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800,
              lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16, color: "white",
            }}>
              Help us bridge<br />the <span style={{ color: S.amber }}>opportunity gap.</span>
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
              ProjectBridge is student-built and open-source. Your support keeps the platform
              running and ensures every student — regardless of background — can find their project.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Impact proof */}
      <section style={{ padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>Your impact in numbers</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 20 }}>
              {impactMetrics.map(m => (
                <div key={m.label} style={{ textAlign: "center", padding: 24, borderRadius: 14, background: "white", border: `1px solid ${S.cloud}` }}>
                  <span style={{ fontSize: 24, display: "block", marginBottom: 8 }}>{m.icon}</span>
                  <p style={{ ...S.display, fontSize: 32, fontWeight: 800, color: S.amber }}>{m.value}</p>
                  <p style={{ fontSize: 13, color: S.slate, fontWeight: 500, marginTop: 4 }}>{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sponsor Tiers */}
      <section style={{ padding: "56px 24px", background: "white" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>Sponsorship tiers</SectionLabel>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 12 }}>Invest in the next generation.</h2>
            <p style={{ fontSize: 16, color: S.slate, maxWidth: 520, lineHeight: 1.6, marginBottom: 36 }}>
              Every dollar directly funds student-led projects, platform hosting, and demo day events.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {sponsorTiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 100}>
                <div
                  onClick={() => setSelectedTier(tier.name)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${tier.name} tier at ${tier.amount}`}
                  onFocus={onFocusVisible} onBlur={onBlurFocus}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedTier(tier.name); }}}
                  style={{
                    background: tier.name === "Bridge Builder" ? "linear-gradient(135deg, #1A1A2E, #2A2A4A)" : "white",
                    color: tier.name === "Bridge Builder" ? "white" : S.ink,
                    border: selectedTier === tier.name ? `2px solid ${S.amber}` : `1px solid ${tier.name === "Bridge Builder" ? "transparent" : S.cloud}`,
                    borderRadius: 16, padding: 32, cursor: "pointer", transition: "all 0.3s",
                    transform: selectedTier === tier.name ? "scale(1.02)" : "scale(1)",
                    boxShadow: selectedTier === tier.name ? "0 16px 48px rgba(232,133,12,0.2)" : tier.name === "Bridge Builder" ? "0 4px 24px rgba(0,0,0,0.2)" : "none",
                    ...focusRing,
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: tier.name === "Bridge Builder" ? "rgba(255,255,255,0.5)" : S.slate, marginBottom: 6 }}>{tier.name}</p>
                      <p style={{ ...S.display, fontSize: 36, fontWeight: 800, color: tier.name === "Growth" ? S.amber : undefined }}>{tier.amount}</p>
                    </div>
                    {tier.name === "Growth" && (
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", background: `linear-gradient(135deg, ${S.amber}, #D97706)`, color: "white", padding: "4px 10px", borderRadius: 999 }}>Popular</span>
                    )}
                  </div>
                  <div style={{ borderTop: `1px solid ${tier.name === "Bridge Builder" ? "rgba(255,255,255,0.1)" : S.cloud}`, paddingTop: 20 }}>
                    {tier.benefits.map((b, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                        <span style={{ color: S.amber, fontWeight: 700, fontSize: 14, marginTop: 1 }}>✓</span>
                        <p style={{ fontSize: 14, lineHeight: 1.5, color: tier.name === "Bridge Builder" ? "rgba(255,255,255,0.8)" : S.slate }}>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* For Campus Departments */}
      <section style={{ padding: "56px 24px", position: "relative" }}>
        <DotGrid opacity={0.02} />
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <SectionLabel color={S.teal}>For campus departments</SectionLabel>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 12 }}>Use-it-or-lose-it budget? Put it to work.</h2>
            <p style={{ fontSize: 16, color: S.slate, maxWidth: 560, lineHeight: 1.6, marginBottom: 36 }}>
              Many departments have discretionary funds that expire at end of fiscal year.
              ProjectBridge delivers measurable student outcomes that align with your reporting requirements.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {departmentPitch.map((d, i) => (
              <Reveal key={d.dept} delay={i * 80}>
                <div style={{
                  background: "white", border: `1px solid ${S.cloud}`, borderRadius: 14,
                  padding: 26, transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = S.teal; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.cloud; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>{d.icon}</span>
                  <h3 style={{ ...S.display, fontWeight: 700, fontSize: 16, marginBottom: 8, color: S.teal }}>{d.dept}</h3>
                  <p style={{ fontSize: 14, color: S.slate, lineHeight: 1.6, marginBottom: 14 }}>{d.angle}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {d.budget.split(", ").map(b => (
                      <span key={b} style={{ fontSize: 11, fontWeight: 600, background: "#E0F2F1", color: S.teal, padding: "4px 10px", borderRadius: 999 }}>{b}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form — with validation */}
      <section style={{ padding: "56px 24px", background: "white" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>Get in touch</SectionLabel>
            <h2 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 8, textAlign: "center" }}>Ready to make an impact?</h2>
            <p style={{ fontSize: 15, color: S.slate, textAlign: "center", marginBottom: 32, lineHeight: 1.6 }}>
              Whether you're a tech company, campus department, or individual supporter — we'd love to hear from you.
            </p>
          </Reveal>

          {!submitted ? (
            <Reveal delay={100}>
              <div style={{ background: S.mist, border: `1px solid ${S.cloud}`, borderRadius: 16, padding: 32 }}>
                {/* Type selector */}
                <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                  {[
                    { val: "sponsor", label: "🏢 Tech Sponsor" },
                    { val: "department", label: "🏫 Campus Dept" },
                    { val: "individual", label: "👤 Individual" },
                  ].map(t => (
                    <button key={t.val} onClick={() => setFormData({ ...formData, type: t.val })}
                      onFocus={onFocusVisible} onBlur={onBlurFocus}
                      style={{
                        flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s",
                        border: formData.type === t.val ? `2px solid ${S.amber}` : `1px solid ${S.cloud}`,
                        background: formData.type === t.val ? "#FFF8F0" : "white",
                        color: formData.type === t.val ? S.amber : S.slate, ...focusRing,
                      }}>{t.label}</button>
                  ))}
                </div>

                {/* Form fields with validation */}
                {[
                  { key: "name", label: "Your name", placeholder: "Jane Smith" },
                  { key: "email", label: "Email", placeholder: "jane@example.com" },
                  { key: "org", label: formData.type === "individual" ? "Affiliation (optional)" : "Organization / Department", placeholder: formData.type === "department" ? "e.g., STEM Division" : "e.g., Acme Corp" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: S.ink }}>{f.label}</label>
                    <input
                      type={f.key === "email" ? "email" : "text"}
                      placeholder={f.placeholder}
                      value={formData[f.key]}
                      onChange={e => { setFormData({ ...formData, [f.key]: e.target.value }); if (errors[f.key]) setErrors({ ...errors, [f.key]: null }); }}
                      onFocus={e => e.target.style.borderColor = S.amber}
                      onBlur={e => e.target.style.borderColor = errors[f.key] ? "#DC2626" : S.cloud}
                      style={inputStyle(f.key)}
                    />
                    {errors[f.key] && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 4, fontWeight: 500 }}>{errors[f.key]}</p>}
                  </div>
                ))}

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: S.ink }}>Message</label>
                  <textarea
                    rows={4}
                    placeholder={formData.type === "department" ? "Tell us about your budget timeline and student impact goals..." : "How would you like to support ProjectBridge?"}
                    value={formData.message}
                    onChange={e => { setFormData({ ...formData, message: e.target.value }); if (errors.message) setErrors({ ...errors, message: null }); }}
                    onFocus={e => e.target.style.borderColor = S.amber}
                    onBlur={e => e.target.style.borderColor = errors.message ? "#DC2626" : S.cloud}
                    style={{ ...inputStyle("message"), resize: "vertical" }}
                  />
                  {errors.message && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 4, fontWeight: 500 }}>{errors.message}</p>}
                </div>

                {selectedTier && (
                  <div style={{ background: "#FFF8F0", border: "1px solid rgba(232,133,12,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Selected tier: <strong style={{ color: S.amber }}>{selectedTier}</strong></span>
                    <button onClick={() => setSelectedTier(null)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 16, color: S.slate }}>×</button>
                  </div>
                )}

                <button onClick={handleSubmit}
                  onFocus={onFocusVisible} onBlur={onBlurFocus}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: `linear-gradient(135deg, ${S.amber}, #D97706)`, color: "white",
                    border: "none", borderRadius: 999, padding: "14px 24px", fontSize: 16,
                    fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 4px 16px rgba(232,133,12,0.35)", ...focusRing,
                  }}>
                  🚀 Send Interest
                </button>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <div style={{ background: "#E0F2F1", border: `1px solid ${S.teal}`, borderRadius: 16, padding: 40, textAlign: "center" }}>
                <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>🎉</span>
                <h3 style={{ ...S.display, fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Thank you, {formData.name || "friend"}!</h3>
                <p style={{ fontSize: 15, color: S.slate, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
                  We've received your interest. A member of the ProjectBridge team will be in touch within 48 hours with next steps.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Hackathon sponsors section */}
      <section style={{ padding: "56px 24px" }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          background: "linear-gradient(135deg, #1A1A2E, #2A2A4A)", borderRadius: 20,
          padding: "clamp(32px, 5vw, 56px)", position: "relative", overflow: "hidden",
        }}>
          <DotGrid opacity={0.06} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, background: "radial-gradient(circle, rgba(232,133,12,0.15) 0%, transparent 60%)" }} />
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "center" }}>
            <div>
              <SectionLabel>Tech companies</SectionLabel>
              <h2 style={{ ...S.display, fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: 14 }}>Sponsor like a hackathon.</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Your logo on every student's screen. Your API in their projects.
                Your recruiters at their demo day. This is talent pipeline at the ground floor.
              </p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 14, fontWeight: 600 }}>What sponsors get:</p>
              {[
                "Brand visibility to 500+ STEM students",
                "Access to project demo days as recruiters",
                "API/tool integration in student projects",
                "Named scholarships & prize pools",
                "Tax-deductible via Foothill College Foundation",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "start", marginBottom: 12 }}>
                  <span style={{ color: S.amber, fontWeight: 700 }}>✓</span>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══ PROJECTS PAGE ═══
function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = sampleProjects.filter(p => {
    const matchesQuery = !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
      p.disciplines.some(d => d.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <section style={{ padding: "48px 24px", position: "relative", minHeight: "60vh" }}>
      <DotGrid opacity={0.02} />
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
        <SectionLabel>Explore</SectionLabel>
        <h1 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 20 }}>Project Directory</h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24, alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 320px" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input type="text" placeholder="Search projects, skills, or disciplines..."
              value={query} onChange={e => setQuery(e.target.value)}
              onFocus={onFocusVisible} onBlur={onBlurFocus}
              style={{
                width: "100%", padding: "12px 16px 12px 42px", borderRadius: 12,
                border: `1px solid ${S.cloud}`, fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", outline: "none",
                boxSizing: "border-box", transition: "border-color 0.2s", ...focusRing,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "all", label: "All" },
              { key: "recruiting", label: "Recruiting" },
              { key: "in_progress", label: "In Progress" },
              { key: "idea", label: "Ideas" },
            ].map(f => (
              <button key={f.key} onClick={() => setStatusFilter(f.key)}
                onFocus={onFocusVisible} onBlur={onBlurFocus}
                style={{
                  padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s",
                  border: statusFilter === f.key ? `2px solid ${S.amber}` : `1px solid ${S.cloud}`,
                  background: statusFilter === f.key ? "#FFF8F0" : "white",
                  color: statusFilter === f.key ? S.amber : S.slate, ...focusRing,
                }}>{f.label}</button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 14, color: S.slate, marginBottom: 20 }}>{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
          {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 48 }}>
            <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>🔎</span>
            <p style={{ ...S.display, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No projects found</p>
            <p style={{ fontSize: 14, color: S.slate }}>Try a different search term or filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══ MATCH QUIZ — NOW FUNCTIONAL ═══
function MatchPage({ setPage }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const qs = [
    { q: "What area excites you most?", key: "area", opts: [
      { v: "cs", l: "💻 Computer Science & Tech" },
      { v: "science", l: "🔬 Science & Engineering" },
      { v: "social", l: "🌍 Social Justice" },
      { v: "art", l: "🎨 Art & Design" },
      { v: "any", l: "🤷 Open to anything" },
    ]},
    { q: "What's your experience level?", key: "level", opts: [
      { v: "beginner", l: "🌱 Complete beginner" },
      { v: "some", l: "📚 Some skills" },
      { v: "solid", l: "⚙️ Solid builder" },
      { v: "lead", l: "🚀 Ready to lead" },
    ]},
    { q: "How much time can you commit?", key: "time", opts: [
      { v: "light", l: "⏱ 1-2 hrs/wk" },
      { v: "steady", l: "🕐 3-5 hrs/wk" },
      { v: "deep", l: "🔥 6+ hrs/wk" },
    ]},
  ];

  const pick = (v) => {
    const a = { ...answers, [step]: v };
    setAnswers(a);
    setTimeout(() => { if (step < qs.length - 1) setStep(step + 1); else setDone(true); }, 350);
  };

  // REAL matching: score each project by how many answer dimensions it matches
  const getMatches = useCallback(() => {
    const areaAnswer = answers[0];
    const levelAnswer = answers[1];
    const timeAnswer = answers[2];

    return sampleProjects.map(p => {
      let score = 0;
      if (areaAnswer === "any" || (p.tags.area && p.tags.area.includes(areaAnswer))) score += 3;
      if (p.tags.level && p.tags.level.includes(levelAnswer)) score += 2;
      if (p.tags.time && p.tags.time.includes(timeAnswer)) score += 2;
      // bonus for recruiting projects
      if (p.status === "recruiting") score += 1;
      return { ...p, score };
    }).sort((a, b) => b.score - a.score);
  }, [answers]);

  const progress = done ? 100 : Math.round((step / qs.length) * 100);
  const matches = done ? getMatches() : [];

  return (
    <section style={{ padding: "48px 24px", position: "relative", minHeight: "60vh" }}>
      <DotGrid opacity={0.02} />
      <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
        <SectionLabel>Smart Matching</SectionLabel>
        <h1 style={{ ...S.display, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 24 }}>Find your project in 3 questions.</h1>

        <div style={{ width: "100%", height: 6, background: S.cloud, borderRadius: 999, marginBottom: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", background: `linear-gradient(90deg, #FFA726, ${S.amber})`,
            borderRadius: 999, transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            width: `${progress}%`,
          }} />
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: S.slate, marginBottom: 28 }}>
          {done ? "Your matches are ready!" : `Step ${step + 1} of ${qs.length}`}
        </p>

        {!done ? (
          <Reveal key={step}>
            <div style={{ background: "white", border: `1px solid ${S.cloud}`, borderRadius: 16, padding: 32 }}>
              <h2 style={{ ...S.display, fontWeight: 700, fontSize: 20, marginBottom: 22 }}>{qs[step].q}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {qs[step].opts.map(o => (
                  <button key={o.v} onClick={() => pick(o.v)}
                    onFocus={onFocusVisible} onBlur={onBlurFocus}
                    style={{
                      textAlign: "left", padding: 18, borderRadius: 12, cursor: "pointer",
                      border: answers[step] === o.v ? `2px solid ${S.amber}` : `1px solid ${S.cloud}`,
                      background: answers[step] === o.v ? "#FFF8F0" : "white",
                      fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                      color: S.ink, transition: "all 0.2s", ...focusRing,
                    }}
                    onMouseEnter={e => { if (answers[step] !== o.v) e.currentTarget.style.borderColor = "rgba(232,133,12,0.4)"; }}
                    onMouseLeave={e => { if (answers[step] !== o.v) e.currentTarget.style.borderColor = S.cloud; }}>
                    {o.l}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)}
                  style={{ marginTop: 20, border: "none", background: "none", cursor: "pointer", fontSize: 14, color: S.slate, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                  ← Back
                </button>
              )}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div style={{ background: "white", border: `1px solid ${S.cloud}`, borderRadius: 16, padding: 32, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>✨</span>
                <h2 style={{ ...S.display, fontWeight: 700, fontSize: 20 }}>Your Top Matches</h2>
              </div>
              <div style={{ display: "grid", gap: 16 }}>
                {matches.slice(0, 3).map((p, i) => (
                  <div key={p.id} style={{ position: "relative" }}>
                    {i === 0 && <span style={{
                      position: "absolute", top: -8, left: -8, zIndex: 10,
                      background: `linear-gradient(135deg, ${S.amber}, #D97706)`,
                      color: "white", fontSize: 10, fontWeight: 700,
                      padding: "3px 10px", borderRadius: 999,
                    }}>Best match</span>}
                    <ProjectCard project={p} highlight={i === 0} />
                    {/* Match score indicator */}
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: S.mist, borderRadius: 999, padding: "2px 8px",
                      fontSize: 11, fontWeight: 600, color: S.teal,
                    }}>
                      {Math.round((p.score / 8) * 100)}% match
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => { setStep(0); setAnswers({}); setDone(false); }}
                onFocus={onFocusVisible} onBlur={onBlurFocus}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "white", border: `1px solid ${S.cloud}`, borderRadius: 999,
                  padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", ...focusRing,
                }}>🔄 Try again</button>
              <button onClick={() => setPage("projects")}
                onFocus={onFocusVisible} onBlur={onBlurFocus}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "white", border: `1px solid ${S.cloud}`, borderRadius: 999,
                  padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", ...focusRing,
                }}>Browse all →</button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

// ═══ FOOTER ═══
function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: `1px solid ${S.cloud}`, background: "white", padding: "48px 24px 56px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${S.amber}, #D97706)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", ...S.display, fontWeight: 700, fontSize: 16 }}>P</div>
            <span style={{ ...S.display, fontWeight: 700, fontSize: 18 }}>Project<span style={{ color: S.amber }}>Bridge</span></span>
          </div>
          <p style={{ fontSize: 13, color: S.slate, lineHeight: 1.65, maxWidth: 280 }}>
            A student-built project collaboration platform for Foothill College — designed for first-gen, international, and underrepresented students.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: S.slate, marginBottom: 14 }}>Platform</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ k: "projects", l: "Browse Projects" }, { k: "match", l: "Match Quiz" }, { k: "support", l: "Support Us" }].map(link => (
              <button key={link.k} onClick={() => setPage(link.k)}
                onFocus={onFocusVisible} onBlur={onBlurFocus}
                style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: 14, color: S.ink, fontFamily: "'DM Sans', sans-serif", padding: 0, ...focusRing, borderRadius: 4 }}
                onMouseEnter={e => e.target.style.color = S.amber}
                onMouseLeave={e => e.target.style.color = S.ink}>
                {link.l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: S.slate, marginBottom: 14 }}>Communities</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["SLI", "MESA", "Umoja", "Puente", "ETI"].map(c => (
              <a key={c} href={`https://foothill.edu/${c.toLowerCase()}/`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 14, color: S.ink, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = S.amber}
                onMouseLeave={e => e.target.style.color = S.ink}>{c}</a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1120, margin: "32px auto 0", paddingTop: 20, borderTop: `1px solid ${S.cloud}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, fontSize: 13, color: S.slate }}>
        <span>© 2026 ProjectBridge · Foothill College</span>
        <span>Funded by SLI & MESA. Built by students, for students.</span>
      </div>
    </footer>
  );
}

// ═══ APP ROOT ═══
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  return (
    <div style={S.root}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        body { margin: 0; }
        ::selection { background: rgba(232,133,12,0.15); }
        :focus-visible { outline: 2px solid rgba(232,133,12,0.5); outline-offset: 2px; }
      `}</style>
      <TopNav page={page} setPage={setPage} />
      <main style={{ paddingTop: 64 }}>
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "projects" && <ProjectsPage />}
        {page === "match" && <MatchPage setPage={setPage} />}
        {page === "support" && <SupportPage />}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
