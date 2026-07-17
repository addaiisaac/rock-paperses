import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import KnotTyingComponent from "@/components/knots/KnotTyingComponent";

export const metadata: Metadata = {
  title: "Knot Tying Guide",
  description:
    "Interactive step-by-step instructions for essential naval knots.",
};

export default function KnotsPage() {
  return (
    <>
      <PageHeader
        title="Knot Tying Guide"
        description="Select a knot from the list to view step-by-step tying instructions. Practice these essential knots for seamanship and mooring."
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <KnotTyingComponent />
        </div>
      </section>
    </>
  );
}
