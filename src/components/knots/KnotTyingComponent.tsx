"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import knotsData from "@/data/knots.json";
import type { Knot } from "@/lib/types";

export default function KnotTyingComponent() {
  const knots = knotsData as Knot[];
  const [selectedId, setSelectedId] = useState(knots[0]?.id ?? "");

  const selectedKnot = useMemo(
    () => knots.find((k) => k.id === selectedId) ?? knots[0],
    [knots, selectedId],
  );

  if (!selectedKnot) {
    return (
      <p className="text-maritime-muted">No knot data available.</p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Sidebar / dropdown knot selector */}
      <aside aria-label="Knot selection">
        {/* Mobile: dropdown select */}
        <label htmlFor="knot-select" className="block lg:hidden">
          <span className="mb-2 block text-sm font-semibold text-navy-950">
            Select a Knot
          </span>
          <select
            id="knot-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-md border border-navy-800/20 bg-white px-3 py-2.5 text-sm text-navy-950 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            {knots.map((knot) => (
              <option key={knot.id} value={knot.id}>
                {knot.name}
              </option>
            ))}
          </select>
        </label>

        {/* Desktop: sidebar list */}
        <nav className="hidden lg:block" aria-label="Knot list">
          <ul role="list" className="space-y-1">
            {knots.map((knot) => {
              const isActive = knot.id === selectedId;
              return (
                <li key={knot.id}>
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setSelectedId(knot.id)}
                    className={`w-full rounded-md px-4 py-3 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-navy-900 font-semibold text-gold-300"
                        : "text-navy-800 hover:bg-maritime-gray"
                    }`}
                  >
                    {knot.name}
                    <span className="mt-0.5 block text-xs opacity-70">
                      {knot.difficulty}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Step-by-step instructions panel */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="rounded-lg border border-navy-800/10 bg-white p-6 shadow-sm sm:p-8"
      >
        <header className="mb-6 border-b border-navy-800/10 pb-4">
          <h2 className="text-2xl font-bold text-navy-950">
            {selectedKnot.name}
          </h2>
          <p className="mt-2 text-sm text-maritime-muted">
            {selectedKnot.description}
          </p>
          <span className="mt-3 inline-block rounded-full bg-gold-400/20 px-3 py-1 text-xs font-semibold text-gold-500">
            {selectedKnot.difficulty}
          </span>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image/GIF placeholder */}
          <div
            className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gold-400/40 bg-navy-900"
            role="img"
            aria-label={`Step-by-step diagram placeholder for ${selectedKnot.name}`}
          >
            <Image
              src={selectedKnot.imagePlaceholder}
              alt={`${selectedKnot.name} knot diagram`}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Numbered steps */}
          <ol className="space-y-4" aria-label={`Steps to tie ${selectedKnot.name}`}>
            {selectedKnot.steps.map((step) => (
              <li key={step.step} className="flex gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-gold-300"
                  aria-hidden="true"
                >
                  {step.step}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-navy-800">
                  <span className="sr-only">Step {step.step}: </span>
                  {step.instruction}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
