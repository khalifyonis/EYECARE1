'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Eye, Glasses, Stethoscope, CalendarCheck, ShieldCheck,
  ClipboardList, ArrowRight, Phone, Mail, MapPin, Clock,
  ChevronUp, Menu, X, HeartPulse, Users, Activity, Zap,
} from 'lucide-react';
import s from './landing.module.css';

/* ═══════════ ANIMATED COUNTER COMPONENT ═══════════ */
function AnimatedCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / 2000, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className={s.statCard}>
      <p className={s.statNumber}>
        {count.toLocaleString()}
        <span className={s.statSuffix}>{suffix}</span>
      </p>
      <p className={s.statLabel}>{label}</p>
    </div>
  );
}

/* ═══════════ REVEAL WRAPPER COMPONENT ═══════════ */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════ DATA ═══════════ */
const services = [
  { icon: Eye, title: 'Eye Examinations', desc: 'Complete diagnostic eye exams using advanced imaging and slit-lamp technology for accurate diagnosis.', gradient: 'linear-gradient(135deg, #0EA5E9, #0284C7)' },
  { icon: Glasses, title: 'Refraction & Lenses', desc: 'Precision refraction testing and custom optical prescriptions tailored for crystal-clear vision.', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  { icon: Stethoscope, title: 'Eye Surgery', desc: 'State-of-the-art surgical procedures performed by experienced ophthalmologists with proven outcomes.', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
  { icon: CalendarCheck, title: 'Follow-up Care', desc: 'Scheduled monitoring, post-operative reviews, and ongoing support for sustained eye health.', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
];

const features = [
  { icon: ShieldCheck, title: 'Secure Records', desc: 'Encrypted patient data with role-based access control.' },
  { icon: ClipboardList, title: 'Clinical Workflows', desc: 'Streamlined processes from reception to prescription.' },
  { icon: CalendarCheck, title: 'Smart Scheduling', desc: 'Intelligent appointment booking with conflict detection.' },
  { icon: HeartPulse, title: 'Digital Prescriptions', desc: 'Instant optical & medicine prescriptions with print support.' },
];

const stats = [
  { value: 12500, suffix: '+', label: 'Patients Served' },
  { value: 28, suffix: '+', label: 'Expert Doctors' },
  { value: 8200, suffix: '+', label: 'Appointments' },
  { value: 99, suffix: '%', label: 'Satisfaction' },
];

/* ═══════════ MAIN LANDING PAGE ═══════════ */
export default function LandingPage() {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobileNav = useCallback(() => setMobileNav(false), []);

  return (
    <div className={s.root}>

      {/* ══════════ NAVBAR ══════════ */}
      <nav className={`${s.navbar} ${scrolled ? s.navbarScrolled : ''}`}>
        <div className={s.navInner}>
          <Link href="/" className={s.navLogo}>
            <div className={s.navLogoIcon}>
              <Eye size={20} color="#fff" />
            </div>
            <div>
              <span className={s.navLogoText}>AL-IXSAAN</span>
              <span className={s.navLogoSub}>Eye Hospital</span>
            </div>
          </Link>

          <div className={s.navLinks}>
            {['Home', 'Services', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className={s.navLink}>{item}</a>
            ))}
          </div>

          <div className={s.navCtaWrap}>
            <Link href="/login" className={s.navCta}>
              <Users size={15} /> Staff Login
            </Link>
          </div>

          <button className={s.mobileMenuBtn} onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileNav && (
          <div className={s.mobileDropdown}>
            {['Home', 'Services', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className={s.mobileLink} onClick={closeMobileNav}>{item}</a>
            ))}
            <Link href="/login" className={s.mobileCta} onClick={closeMobileNav}>
              <Users size={16} /> Staff Login
            </Link>
          </div>
        )}
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section id="home" className={s.hero}>
        <div className={s.heroGrid} />

        <div className={s.heroContent}>
          {/* Left */}
          <div>
            <Reveal>
              <div className={s.heroBadge}>
                <Eye size={14} /> AL-IXSAAN Eye Hospital
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className={s.heroTitle}>
                Modern Eye Care,<br />
                Managed with{' '}
                <span className={s.gradientText}>Confidence</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className={s.heroDesc}>
                Streamlined patient records, appointments, eye examinations,
                prescriptions and surgery management — all in one secure and efficient platform.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className={s.heroBtns}>
                <Link href="/login" className={s.btnPrimary}>
                  <Users size={16} /> Staff Login
                </Link>
                <a href="#services" className={s.btnSecondary}>
                  Explore Services <ArrowRight size={16} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className={s.statsRow}>
                {stats.map(st => (
                  <AnimatedCounter key={st.label} target={st.value} suffix={st.suffix} label={st.label} />
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — Hero Image */}
          <Reveal delay={200}>
            <div style={{ position: 'relative' }}>
              <div className={s.heroImgWrap}>
                <Image
                  src="/hero-doctor.png"
                  alt="Eye care professional performing examination"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                  priority
                />
                <div className={s.heroImgBadge}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={18} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: 0 }}>Better Vision</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Healthier Lives</p>
                  </div>
                </div>
              </div>
              <div className={s.heroFloat} style={{ width: 160, height: 160, background: '#0ea5e9', top: -40, right: -40, opacity: 0.15 }} />
              <div className={s.heroFloat} style={{ width: 120, height: 120, background: '#06b6d4', bottom: -30, left: -30, opacity: 0.12, animationDelay: '-3s' }} />
            </div>
          </Reveal>
        </div>

        {/* Wave divider */}
        <div className={s.heroWave}>
          <svg viewBox="0 0 1440 80" fill="none" style={{ width: '100%', height: 80, display: 'block' }}>
            <path d="M0 80L60 68C120 56 240 32 360 28C480 24 600 40 720 48C840 56 960 56 1080 48C1200 40 1320 24 1380 16L1440 8V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="services" className={s.servicesSection}>
        <div className={s.container} style={{ textAlign: 'center' }}>
          <Reveal>
            <div className={s.sectionBadge}><Eye size={13} /> Our Services</div>
            <h2 className={s.sectionTitle}>Comprehensive Eye Care Services</h2>
            <p className={s.sectionSubtitle} style={{ margin: '12px auto 0' }}>
              Professional eye care services delivered by experienced specialists using advanced diagnostic technology.
            </p>
          </Reveal>

          <div className={s.servicesGrid}>
            {services.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 100}>
                <div className={s.serviceCard}>
                  <div className={s.serviceCardTopline} style={{ background: svc.gradient }} />
                  <div className={s.serviceIcon} style={{ background: svc.gradient }}><svc.icon size={24} /></div>
                  <h3 className={s.serviceTitle}>{svc.title}</h3>
                  <p className={s.serviceDesc}>{svc.desc}</p>
                  <div className={s.serviceArrow}>Learn more <ArrowRight size={14} /></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHY AL-IXSAAN ══════════ */}
      <section id="about" className={s.whySection}>
        <div className={s.container}>
          <div className={s.whyGrid}>
            {/* Left */}
            <div>
              <Reveal>
                <div className={s.sectionBadge}><Eye size={13} /> Why AL-IXSAAN</div>
                <h2 className={s.sectionTitle}>Trusted. Organized.<br />Patient Focused.</h2>
                <p className={s.sectionSubtitle}>
                  We combine modern technology with compassionate care to deliver the best eye health services.
                </p>
              </Reveal>

              <div className={s.featuresGrid}>
                {features.map((f, i) => (
                  <Reveal key={f.title} delay={i * 80}>
                    <div className={s.featureCard}>
                      <div className={s.featureIconBox}><f.icon size={18} /></div>
                      <div>
                        <h4 className={s.featureTitle}>{f.title}</h4>
                        <p className={s.featureDesc}>{f.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Right — Dashboard Mock */}
            <Reveal delay={200}>
              <div className={s.dashMock}>
                <div className={s.mockTopbar}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={s.mockDot} style={{ background: '#ef4444' }} />
                    <span className={s.mockDot} style={{ background: '#f59e0b' }} />
                    <span className={s.mockDot} style={{ background: '#22c55e' }} />
                  </div>
                  <div className={s.mockUrlbar} />
                </div>
                <div className={s.mockBody}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #0c3d5f, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Eye size={16} color="#fff" />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>AL-IXSAAN Dashboard</span>
                  </div>
                  <div className={s.mockStatsRow}>
                    {[
                      { label: 'Patients', val: '16', color: '#0ea5e9' },
                      { label: 'Appointments', val: '8', color: '#10b981' },
                      { label: 'Doctors', val: '4', color: '#8b5cf6' },
                    ].map(d => (
                      <div key={d.label} className={s.mockStatCard}>
                        <p className={s.mockStatLabel}>{d.label}</p>
                        <p className={s.mockStatVal} style={{ color: d.color }}>{d.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className={s.mockChart}>
                    {[40, 65, 30, 80, 55, 70, 45, 90, 60, 75, 50, 85].map((h, i) => (
                      <div key={i} className={s.mockBar} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section className={s.ctaSection}>
        <div className={s.container}>
          <div className={s.ctaBanner}>
            <div className={s.ctaInner}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div className={s.ctaIconBox}>
                  <Eye size={28} color="#7dd3fc" />
                </div>
                <div>
                  <h3 className={s.ctaTitle}>Access the EyeCare Portal</h3>
                  <p className={s.ctaDesc}>Manage patients, appointments, examinations, prescriptions and surgeries — all in one place.</p>
                </div>
              </div>
              <Link href="/login" className={s.btnPrimary} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Staff Login <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer id="contact" className={s.footer}>
        <div className={s.container}>
          <div className={s.footerGrid}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Eye size={20} color="#fff" />
                </div>
                <div>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc' }}>AL-IXSAAN</span>
                  <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b' }}>Eye Hospital</span>
                </div>
              </div>
              <p className={s.footerBrand}>
                Better vision. Healthier lives. Our mission is to provide high-quality eye care and clinical excellence for every patient.
              </p>
            </div>

            <div>
              <h4 className={s.footerHeading}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className={s.footerLink}><MapPin size={15} color="#0ea5e9" /> Mogadishu, Somalia</span>
                <span className={s.footerLink}><Phone size={15} color="#0ea5e9" /> +252 61 234 5678</span>
                <span className={s.footerLink}><Mail size={15} color="#0ea5e9" /> info@al-ixsaan.so</span>
                <span className={s.footerLink}><Clock size={15} color="#0ea5e9" /> Mon – Sat: 8:00 AM – 5:00 PM</span>
              </div>
            </div>

            <div>
              <h4 className={s.footerHeading}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['Home', 'Services', 'About', 'Contact'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} className={s.footerLink}>{item}</a>
                ))}
                <Link href="/login" className={s.footerLink}>Staff Portal</Link>
              </div>
            </div>
          </div>

          <div className={s.footerBottom}>
            <p className={s.footerCopy}>© 2026 AL-IXSAAN Medical Group. All rights reserved.</p>
            <p className={s.footerTag}>Better Vision &nbsp;|&nbsp; Healthier Lives</p>
          </div>
        </div>
      </footer>

      {/* ══════════ SCROLL TO TOP ══════════ */}
      {showTop && (
        <button className={s.scrollTopBtn} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}
