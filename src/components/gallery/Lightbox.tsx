"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { GalleryItem } from "@/lib/types";

type LightboxProps = {
  item: GalleryItem | null;
  onClose: () => void;
};

export default function Lightbox({ item, onClose }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key and trap initial focus
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!item) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, handleKeyDown]);

  if (!item) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing: ${item.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm"
        aria-label="Close lightbox"
        onClick={onClose}
      />

      {/* Content panel */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-lg border border-gold-400/40 bg-navy-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gold-400/20 px-4 py-3 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-white">{item.title}</h2>
            <p className="text-sm text-gold-300">
              {item.category} · {item.type === "video" ? "Video" : "Photo"}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="relative aspect-video bg-navy-950">
          {item.type === "image" ? (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-contain p-4"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <svg
                viewBox="0 0 24 24"
                className="h-16 w-16 text-gold-400"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <p className="text-white/80">{item.alt}</p>
              <a
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-gold-400 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-300"
              >
                Open Video Resource
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
