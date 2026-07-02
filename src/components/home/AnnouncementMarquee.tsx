import announcements from "@/data/announcements.json";
import type { Announcement } from "@/lib/types";

export default function AnnouncementMarquee() {
  const items = announcements as Announcement[];
  // Duplicate items so the marquee loop is seamless
  const doubled = [...items, ...items];

  return (
    <section
      aria-label="Upcoming parade orders and announcements"
      className="border-y border-gold-500/30 bg-navy-800"
    >
      <div className="flex items-stretch">
        {/* Static label */}
        <div
          className="flex shrink-0 items-center gap-2 bg-gold-400 px-4 py-3 sm:px-6"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-navy-950"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider text-navy-950">
            Orders
          </span>
        </div>

        {/* Scrolling marquee — hidden from screen readers; live region below */}
        <div className="relative flex-1 overflow-hidden py-3" aria-hidden="true">
          <div className="marquee-track flex w-max gap-12 whitespace-nowrap px-6">
            {doubled.map((item, index) => (
              <span
                key={`${item.id}-${index}`}
                className="inline-flex items-center gap-3 text-sm text-white"
              >
                <time
                  dateTime={item.date}
                  className="rounded bg-navy-950/50 px-2 py-0.5 text-xs font-semibold text-gold-300"
                >
                  {new Date(item.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </time>
                {item.message}
                <span className="text-gold-400">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Accessible static list for assistive technologies */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.id}>
            <time dateTime={item.date}>
              {new Date(item.date).toLocaleDateString("en-GB")}
            </time>
            : {item.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
