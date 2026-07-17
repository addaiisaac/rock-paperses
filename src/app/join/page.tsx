import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import JoinForm from "@/components/join/JoinForm";

export const metadata: Metadata = {
  title: "Join Us",
  description: "Apply to become a member of the Navy Cadet Association.",
};

export default function JoinPage() {
  return (
    <>
      <PageHeader
        title="Apply to Join"
        description="Complete the form below to apply for membership. All fields are required. A training officer will review your application and be in touch."
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <JoinForm />
        </div>
      </section>
    </>
  );
}
