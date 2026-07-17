"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import galleryData from "@/data/gallery.json";
import type { GalleryCategory, GalleryItem } from "@/lib/types";
import Lightbox from "./Lightbox";

const categories: GalleryCategory[] = [
  "All",
  "Parades",
  "Camps",
  "Drills",
];

export default function GalleryGrid() {
  const items = galleryData as GalleryItem[];
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Filter gallery items by selected category
  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <>
      {/* Category filter buttons */}
      <div
        role="group"
        aria-label="Filter gallery by event category"
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const count =
            category === "All"
              ? items.length
              : items.filter((i) => i.category === category).length;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-gold-400 text-navy-950"
                  : "border border-navy-800/20 bg-white text-navy-800 hover:border-gold-400 hover:text-gold-500"
              }`}
            >
              {category}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results count for screen readers */}
      <p className="sr-only" aria-live="polite">
        Showing {filteredItems.length} items
        {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
      </p>

      {/* Responsive image grid */}
      {filteredItems.length === 0 ? (
        <p className="mt-8 text-center text-maritime-muted">
          No media found for this category.
        </p>
      ) : (
        <ul
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
        >
          {filteredItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setLightboxItem(item)}
                className="group relative w-full overflow-hidden rounded-lg border border-navy-800/10 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                aria-label={`View ${item.title} — ${item.category}`}
              >
                <div className="relative aspect-[4/3] bg-navy-900">
                  <Image
                    src={item.thumbnail ?? item.src}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    aria-hidden="true"
                  />
                  {item.type === "video" && (
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-navy-950/40"
                      aria-hidden="true"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400 text-navy-950">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  )}
                </div>
                <div className="p-3 text-left">
                  <p className="text-sm font-semibold text-navy-950">
                    {item.title}
                  </p>
                  <p className="text-xs text-maritime-muted">{item.category}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
