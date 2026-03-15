import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Info, Mail, MapPin, Phone, ArrowRight, Shield, Truck, RefreshCw } from "lucide-react";
import UserNav from "../components/UserNav";

const features = [
  {
    icon: Shield,
    title: "Quality First",
    description: "Every garment undergoes rigorous quality checks before reaching your doorstep.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Free delivery on all orders. Express options available for urgent needs.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free returns. Your satisfaction is our priority.",
  },
];

const stats = [
  { value: "100K+", label: "Happy Customers" },
  { value: "50+", label: "Countries Served" },
  { value: "500+", label: "Products" },
  { value: "99%", label: "Satisfaction Rate" },
];

function About() {
  const revealRef = useRef(null);

  useEffect(() => {
    const root = revealRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <UserNav />

      <div ref={revealRef} className="min-h-screen bg-neutral-950 text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba6877a4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/80 to-neutral-950" />

          <div className="relative px-4 sm:px-6 md:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70">
                <Info className="h-3.5 w-3.5" />
                About Us
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Who We <span className="italic text-neon">Are</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
                NOMAD. is a contemporary fashion brand dedicated to creating timeless,
                sustainable clothing for the modern individual. We believe in quality
                over quantity, and style over trends.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 sm:px-6 md:px-8 py-12 border-t border-white/10">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="reveal text-center p-6 rounded-2xl border border-white/10 bg-white/5"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-neon">{stat.value}</div>
                  <div className="mt-1 text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-white/10">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              <div className="reveal space-y-6">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                  What We Do
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Crafted for the Modern Explorer
                </h2>
                <p className="text-white/60 leading-relaxed">
                  At NOMAD., we design clothing that adapts to your lifestyle. From
                  bustling city streets to quiet mountain retreats, our pieces are
                  built to move with you. Each collection is thoughtfully curated to
                  provide versatile essentials that work together seamlessly.
                </p>
                <p className="text-white/60 leading-relaxed">
                  Our design philosophy centers on three pillars: functionality,
                  sustainability, and timeless aesthetics. We do not follow fast
                  fashion trends. Instead, we create garments that remain relevant
                  season after season.
                </p>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 text-neon hover:underline"
                >
                  View Our Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="reveal">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop"
                    alt="Our craft"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-white/10">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12 reveal">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                Why Choose Us
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                The NOMAD. Difference
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="reveal group rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="mx-auto mb-4 inline-flex rounded-xl bg-neon/10 p-4 text-neon">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-white/10">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12 reveal">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                Get In Touch
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Contact Us
              </h2>
              <p className="mt-4 text-white/60">
                Have questions? We would love to hear from you.
              </p>
            </div>

            <div className="reveal grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="mx-auto mb-3 inline-flex rounded-xl bg-neon/10 p-3 text-neon">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-white/90">Email</h3>
                <p className="mt-1 text-sm text-white/60">hello@nomad.com</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="mx-auto mb-3 inline-flex rounded-xl bg-neon/10 p-3 text-neon">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-white/90">Phone</h3>
                <p className="mt-1 text-sm text-white/60">+1 (555) 123-4567</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="mx-auto mb-3 inline-flex rounded-xl bg-neon/10 p-3 text-neon">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-white/90">Location</h3>
                <p className="mt-1 text-sm text-white/60">New York, NY</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 md:px-8 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="reveal rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Explore?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-white/60">
                Discover our collection of timeless pieces designed for the modern nomad.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 rounded-xl bg-neon px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/story"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  Read Our Story
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}

export default About;
