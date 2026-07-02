import leadership from "@/data/leadership.json";
import type { Leader } from "@/lib/types";

export default function LeadershipSection() {
  const leaders = leadership as Leader[];

  return (
    <section
      aria-labelledby="leadership-heading"
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Unit history introduction */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-500">
            Our Unit
          </p>
          <h2
            id="leadership-heading"
            className="mt-2 text-3xl font-bold text-navy-950 sm:text-4xl"
          >
            Leadership &amp; History
          </h2>
          <p className="mt-4 text-base leading-relaxed text-maritime-muted">
            Founded in 1948, the Navy Cadet Association has trained thousands
            of young people in naval traditions, seamanship, and leadership.
            Our unit operates under the guidance of experienced naval personnel
            committed to developing the next generation of capable, disciplined
            cadets ready to serve with honour.
          </p>
        </div>

        {/* Leadership cards */}
        <ul
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {leaders.map((leader) => (
            <li
              key={leader.id}
              className="group rounded-lg border border-navy-800/10 bg-maritime-gray p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Avatar placeholder */}
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400 bg-navy-900 text-xl font-bold text-gold-400"
                aria-hidden="true"
              >
                {leader.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <h3 className="text-lg font-bold text-navy-950">{leader.name}</h3>
              <p className="text-sm font-medium text-gold-500">{leader.rank}</p>
              <p className="mt-1 text-sm font-semibold text-navy-800">
                {leader.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-maritime-muted">
                {leader.bio}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
