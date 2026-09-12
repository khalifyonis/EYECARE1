'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Eye,
  Glasses,
  Stethoscope,
  CalendarCheck,
  ShieldCheck,
  ClipboardList,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronUp,
  Menu,
  X,
  Sparkles,
  HeartPulse,
  Users,
} from 'lucide-react';

/* ────────────────────── Counter Animation ────────────────────── */
function useCountUp(target: number, duration = 2000) {
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
          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ────────────────────── Scroll Reveal Hook ────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ────────────────────── Data ────────────────────── */
const services = [
  {
    icon: Eye,
    title: 'Eye Examinations',
    desc: 'Complete eye examinations for accurate diagnosis and early detection of conditions.',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
  },
  {
    icon: Glasses,
    title: 'Refraction & Prescriptions',
    desc: 'Advanced refraction testing and personalized optical prescriptions for clear vision.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Stethoscope,
    title: 'Eye Surgery',
    desc: 'Safe and professional surgical care with modern technology and expert surgeons.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
  },
  {
    icon: CalendarCheck,
    title: 'Follow-up Care',
    desc: 'Continuous monitoring and post-treatment support for better outcomes.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
  },
];

const features = [
  { icon: ShieldCheck, title: 'Secure Patient Records', desc: 'Keep patient data safe, private and always accessible.' },
  { icon: ClipboardList, title: 'Organized Clinical Workflows', desc: 'Efficient processes for better care coordination.' },
  { icon: CalendarCheck, title: 'Appointment Management', desc: 'Easy scheduling and reduced waiting times.' },
  { icon: HeartPulse, title: 'Accurate Prescriptions', desc: 'Reliable and precise prescriptions for every patient.' },
];

const stats = [
  { value: 12500, suffix: '+', label: 'Patients Served' },
  { value: 28, suffix: '+', label: 'Expert Doctors' },
  { value: 8200, suffix: '+', label: 'Appointments' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate' },
];

/* ────────────────────── Main Landing Page ────────────────────── */
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

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ══════════ NAVBAR ══════════ */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/60'
            : 'bg-transparent'
          }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-5 py-3.5 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#0c3d5f] to-[#0EA5E9] flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/40 transition-shadow">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">AL-IXSAAN</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Eye Hospital</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {['Home', 'Services', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:text-[#0EA5E9] hover:bg-sky-50/70 transition-all"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0c3d5f] to-[#0EA5E9] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Users className="h-4 w-4" />
              Staff Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileNav && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/60 animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 space-y-1">
              {['Home', 'Services', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileNav(false)}
                  className="block px-4 py-3 text-sm font-semibold text-slate-700 rounded-lg hover:bg-sky-50 hover:text-[#0EA5E9] transition-all"
                >
                  {item}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileNav(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0c3d5f] to-[#0EA5E9] px-6 py-3 text-sm font-bold text-white shadow-lg"
              >
                <Users className="h-4 w-4" />
                Staff Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section id="home" className="relative pt-20 lg:pt-0">
        {/* Gradient BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2e47] via-[#0c3d5f] to-[#0f4c75] -z-10" />
        <div className="absolute inset-0 opacity-30 -z-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(14,165,233,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6,182,212,0.2) 0%, transparent 50%)'
        }} />

        <div className="relative mx-auto max-w-7xl grid items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          {/* Left */}
          <div className="space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-xs font-bold text-sky-300 tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              AL-IXSAAN Eye Hospital
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-6xl">
              Modern Eye Care,<br />
              Managed with{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  Confidence
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-sky-400 to-teal-400 opacity-60" />
              </span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg mx-auto lg:mx-0">
              Streamlined patient records, appointments, eye examinations,
              prescriptions and surgery management — all in one secure and efficient system.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0c3d5f] shadow-xl shadow-black/10 hover:shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Users className="h-4 w-4" />
                Staff Login
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 backdrop-blur-sm px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              {stats.map((s) => {
                const c = useCountUp(s.value);
                return (
                  <div key={s.label} ref={c.ref} className="text-center lg:text-left">
                    <p className="text-2xl font-extrabold text-white sm:text-3xl">
                      {c.count.toLocaleString()}{s.suffix}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-400">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl shadow-black/30 ring-1 ring-white/10">
              <Image
                src="/hero-doctor.png"
                alt="Eye care professional examining a patient"
                width={800}
                height={600}
                className="h-auto w-full object-cover"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e47]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-bold text-white/90 tracking-wide">Better Vision &nbsp;|&nbsp; Healthier Lives</p>
              </div>
            </div>
            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-teal-500/20 blur-3xl" />
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-16 sm:h-20">
            <path d="M0 80L60 68C120 56 240 32 360 28C480 24 600 40 720 48C840 56 960 56 1080 48C1200 40 1320 24 1380 16L1440 8V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="services" className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            badge="Our Eye Care Services"
            title="Comprehensive Eye Care Services"
            subtitle="We provide a full range of professional eye care services using advanced technology and experienced specialists."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((svc, i) => {
              const r = useReveal();
              return (
                <div
                  key={svc.title}
                  ref={r.ref}
                  className={`group relative rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1 ${r.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${svc.color} shadow-lg`}>
                    <svc.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{svc.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{svc.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#0EA5E9] opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ WHY AL-IXSAAN ══════════ */}
      <section id="about" className="relative py-20 lg:py-28 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl -z-10" />
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left content */}
            <div>
              <SectionHeader
                badge="Why AL-IXSAAN"
                title="Trusted. Organized. Patient Focused."
                subtitle="We combine modern technology with compassionate care to deliver the best eye health services."
                align="left"
              />

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {features.map((f, i) => {
                  const r = useReveal();
                  return (
                    <div
                      key={f.title}
                      ref={r.ref}
                      className={`flex gap-4 rounded-xl border border-slate-200/50 bg-white p-5 shadow-sm transition-all duration-500 hover:shadow-md ${r.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0EA5E9]">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Dashboard preview */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                <div className="flex items-center gap-2 px-3 pb-2 border-b border-slate-100">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 h-5 rounded-md bg-slate-100 mx-8" />
                </div>
                <div className="mt-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 space-y-4">
                  {/* Fake dashboard stats */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0c3d5f] to-[#0EA5E9] flex items-center justify-center">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-800">AL-IXSAAN Dashboard</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Total Patients', val: '16', color: 'from-sky-500 to-blue-600' },
                      { label: 'Appointments', val: '8', color: 'from-emerald-500 to-teal-600' },
                      { label: 'Doctors', val: '4', color: 'from-violet-500 to-purple-600' },
                    ].map((d) => (
                      <div key={d.label} className="rounded-xl bg-white p-4 shadow-sm border border-slate-200/60">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{d.label}</p>
                        <p className={`text-2xl font-extrabold bg-gradient-to-r ${d.color} bg-clip-text text-transparent`}>{d.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-28 rounded-xl bg-white border border-slate-200/60 flex items-end px-4 pb-3 gap-2">
                    {[40, 65, 30, 80, 55, 70, 45, 90, 60, 75, 50, 85].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-sky-500 to-sky-300 opacity-70" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Decorative */}
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a2e47] via-[#0c3d5f] to-[#0f4c75] px-8 py-14 lg:px-16 lg:py-16">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(14,165,233,0.4) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(6,182,212,0.3) 0%, transparent 50%)'
            }} />
            <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="hidden lg:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Eye className="h-8 w-8 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white lg:text-3xl">Access the EyeCare Portal</h3>
                  <p className="mt-2 text-sm text-slate-300 max-w-lg">
                    Manage patient records, appointments, examinations, prescriptions and surgeries — all in one place.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#0c3d5f] shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all whitespace-nowrap"
              >
                Staff Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CONTACT / FOOTER ══════════ */}
      <footer id="contact" className="bg-[#0a1e2e] text-white pt-16 pb-6">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3 pb-10 border-b border-white/10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-cyan-400 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-extrabold">AL-IXSAAN</span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Eye Hospital Dr.Social</span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
                Better vision. Healthier lives. Our mission is to provide high-quality eye care for a brighter future.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Contact Information</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 text-[#0EA5E9] shrink-0" />
                  Mogadishu, Somalia
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone className="h-4 w-4 text-[#0EA5E9] shrink-0" />
                  +252 61 234 5678
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail className="h-4 w-4 text-[#0EA5E9] shrink-0" />
                  info@al-ixsaan.so
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Clock className="h-4 w-4 text-[#0EA5E9] shrink-0" />
                  Mon – Sat: 8:00 AM – 5:00 PM
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Quick Links</h4>
              <ul className="mt-4 space-y-3">
                {['Home', 'Services', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-[#0EA5E9] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/login" className="text-sm text-slate-400 hover:text-[#0EA5E9] transition-colors">
                    Staff Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
            <p>© 2026 AL-IXSAAN Medical Group. All rights reserved.</p>
            <p className="font-medium text-slate-400">Better Vision &nbsp;|&nbsp; Healthier Lives</p>
          </div>
        </div>
      </footer>

      {/* ══════════ SCROLL TO TOP ══════════ */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-gradient-to-br from-[#0c3d5f] to-[#0EA5E9] text-white shadow-xl shadow-sky-500/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-in fade-in zoom-in duration-300"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

/* ────────────────────── Shared Section Header ────────────────────── */
function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
}: {
  badge: string;
  title: string;
  subtitle: string;
  align?: 'center' | 'left';
}) {
  const r = useReveal();
  return (
    <div
      ref={r.ref}
      className={`max-w-2xl transition-all duration-700 ${r.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        } ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      <div className={`inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-100 px-4 py-1.5 text-xs font-bold text-[#0EA5E9] uppercase tracking-wider ${align === 'center' ? '' : ''}`}>
        <Eye className="h-3.5 w-3.5" />
        {badge}
      </div>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-slate-500">{subtitle}</p>
    </div>
  );
}
