import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gold-500/30 bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400">
              Navy Cadet Association
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Developing leadership, discipline, and seamanship skills in the
              next generation of naval service personnel.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400">
              Quick Links
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/gallery"
                  className="text-white/70 transition-colors hover:text-gold-300"
                >
                  Media Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="text-white/70 transition-colors hover:text-gold-300"
                >
                  Knowledge Library
                </Link>
              </li>
              <li>
                <Link
                  href="/knots"
                  className="text-white/70 transition-colors hover:text-gold-300"
                >
                  Knot Tying Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="text-white/70 transition-colors hover:text-gold-300"
                >
                  Apply to Join
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400">
              Contact
            </h2>
            <address className="mt-3 space-y-1 text-sm not-italic text-white/70">
              <p>Unit HQ, Naval Reserve Centre</p>
              <p>training@navycadets.example.org</p>
              <p>Parade Evenings: Tue &amp; Thu 1830–2030</p>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          <p>
            &copy; {currentYear} Navy Cadet Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
