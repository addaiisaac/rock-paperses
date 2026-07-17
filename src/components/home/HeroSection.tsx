import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-navy-900"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,21,41,0.95)_0%,rgba(0,51,102,0.85)_100%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-24">
        {/* Hero copy */}
        <div>
          <p className="mb-3 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300">
            Est. 1948 — Service • Honour • Courage
          </p>
          <h1
            id="hero-heading"
            className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Forge Your Future at{" "}
            <span className="text-gold-400">Sea</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            The Navy Cadet Association prepares young people for leadership
            through drill, seamanship, navigation, and adventure training. Join
            a proud tradition of naval excellence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/join"
              className="inline-flex items-center rounded-md bg-gold-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy-950 transition-colors hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
            >
              Apply to Join
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center rounded-md border-2 border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              Explore Resources
            </Link>
          </div>
        </div>

        {/* Placeholder for cadet training image */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-gold-400/40 shadow-2xl"
          role="img"
          aria-label="Placeholder for cadet training photograph — cadets in uniform during field exercise"
        >
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#003366_0%,#001529_50%,#004080_100%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <svg
              viewBox="0 0 64 64"
              className="mb-4 h-20 w-20 text-gold-400/60"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M32 4L8 16v20c0 14 10 26 24 28 14-2 24-14 24-28V16L32 4zm0 6l18 9v17c0 10-7 19-18 21-11-2-18-11-18-21V19l18-9z"
              />
              <circle cx="32" cy="30" r="8" fill="currentColor" opacity="0.5" />
            </svg>
            <p className="text-sm font-medium uppercase tracking-wider text-gold-400/80">
              Cadet Training Image
            </p>
            <p className="mt-1 text-xs text-white/50">
              Replace with unit photography
            </p>
          </div>
          {/* Decorative anchor corner accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>
      </div>
    </section>
  );
}
