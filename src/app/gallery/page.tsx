import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Media Gallery",
  description:
    "Browse photos and videos from parades, camps, and drill events.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Media Gallery"
        description="Browse photos and videos from parades, summer camps, and drill sessions. Filter by event category and click any item to expand."
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
