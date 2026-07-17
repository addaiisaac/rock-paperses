import HeroSection from "@/components/home/HeroSection";
import AnnouncementMarquee from "@/components/home/AnnouncementMarquee";
import LeadershipSection from "@/components/home/LeadershipSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AnnouncementMarquee />

      {/* Quick links to key sections */}
      <section
        aria-labelledby="features-heading"
        className="bg-maritime-gray py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="features-heading" className="sr-only">
            Explore the website
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {[
              {
                href: "/gallery",
                title: "Media Gallery",
                desc: "Photos and videos from parades, camps, and drills.",
              },
              {
                href: "/library",
                title: "Knowledge Library",
                desc: "Naval knowledge, drill manuals, and first aid resources.",
              },
              {
                href: "/knots",
                title: "Knot Tying",
                desc: "Interactive step-by-step knot tying guides.",
              },
              {
                href: "/join",
                title: "Join Us",
                desc: "Apply to become a navy cadet today.",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-lg border border-navy-800/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-navy-950 group-hover:text-navy-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-maritime-muted">
                    {item.desc}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-gold-500 group-hover:text-gold-400">
                    Explore &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LeadershipSection />
    </>
  );
}
