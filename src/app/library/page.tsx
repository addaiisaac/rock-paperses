import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ResourceTabs from "@/components/library/ResourceTabs";

export const metadata: Metadata = {
  title: "Cadet Knowledge Library",
  description:
    "Naval knowledge, drill and ceremonies, and first aid resources for cadets.",
};

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title="Cadet Knowledge Library"
        description="Access study materials, drill manuals, and survival guides. Resources are organised by category — select a tab to browse."
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ResourceTabs />
        </div>
      </section>
    </>
  );
}
