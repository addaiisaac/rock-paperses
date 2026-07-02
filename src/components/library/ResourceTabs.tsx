"use client";

import { useMemo, useState } from "react";
import resourcesData from "@/data/resources.json";
import type { Resource, ResourceCategory } from "@/lib/types";

const tabs: ResourceCategory[] = [
  "Naval Knowledge",
  "Drill & Ceremonies",
  "First Aid & Survival",
];

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="flex flex-col rounded-lg border border-navy-800/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-navy-950">{resource.title}</h3>
        <span className="shrink-0 rounded-full bg-navy-900 px-2.5 py-0.5 text-xs font-semibold text-gold-300">
          {resource.badge}
        </span>
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-maritime-muted">
        {resource.description}
      </p>
      <a
        href={resource.url}
        className="inline-flex w-fit items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
        {...(resource.action === "download"
          ? { download: true }
          : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {resource.action === "download" ? (
          <>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Download
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
            View Online
          </>
        )}
      </a>
    </article>
  );
}

export default function ResourceTabs() {
  const resources = resourcesData as Resource[];
  const [activeTab, setActiveTab] = useState<ResourceCategory>(
    "Naval Knowledge",
  );

  const filteredResources = useMemo(
    () => resources.filter((r) => r.category === activeTab),
    [resources, activeTab],
  );

  const tabPanelId = (category: ResourceCategory) =>
    `tabpanel-${category.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Resource categories"
        className="flex flex-wrap gap-2 border-b border-navy-800/10 pb-4"
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab.replace(/\s+/g, "-").toLowerCase()}`}
              aria-selected={isSelected}
              aria-controls={tabPanelId(tab)}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                isSelected
                  ? "bg-navy-900 text-gold-300"
                  : "bg-maritime-gray text-navy-800 hover:bg-navy-800/10"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab panels — only active panel is visible */}
      {tabs.map((tab) => (
        <div
          key={tab}
          role="tabpanel"
          id={tabPanelId(tab)}
          aria-labelledby={`tab-${tab.replace(/\s+/g, "-").toLowerCase()}`}
          hidden={activeTab !== tab}
          tabIndex={0}
          className="mt-8"
        >
          {activeTab === tab && (
            <>
              <p className="mb-6 text-sm text-maritime-muted">
                {filteredResources.length} resource
                {filteredResources.length !== 1 ? "s" : ""} available in{" "}
                <strong className="text-navy-950">{tab}</strong>.
              </p>
              <ul
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                role="list"
              >
                {filteredResources.map((resource) => (
                  <li key={resource.id}>
                    <ResourceCard resource={resource} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
