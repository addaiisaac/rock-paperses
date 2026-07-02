"use client";

import { FormEvent, useState } from "react";
import type { FormErrors, JoinFormData } from "@/lib/types";

const initialFormData: JoinFormData = {
  fullName: "",
  studentId: "",
  age: "",
  nextOfKin: "",
  motivation: "",
};

/** Validates each field and returns an errors object (empty = valid). */
function validateForm(data: JoinFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full legal name.";
  }

  if (!data.studentId.trim()) {
    errors.studentId = "Student ID is required.";
  } else if (!/^[A-Za-z0-9-]{4,20}$/.test(data.studentId.trim())) {
    errors.studentId =
      "Student ID must be 4–20 alphanumeric characters or hyphens.";
  }

  const ageNum = parseInt(data.age, 10);
  if (!data.age.trim()) {
    errors.age = "Age is required.";
  } else if (isNaN(ageNum) || ageNum < 12 || ageNum > 18) {
    errors.age = "Cadets must be between 12 and 18 years of age.";
  }

  if (!data.nextOfKin.trim()) {
    errors.nextOfKin = "Next of kin is required.";
  } else if (data.nextOfKin.trim().length < 3) {
    errors.nextOfKin = "Please provide a contact name and relationship.";
  }

  if (!data.motivation.trim()) {
    errors.motivation = "Please tell us why you want to join.";
  } else if (data.motivation.trim().length < 20) {
    errors.motivation =
      "Please write at least 20 characters about your motivation.";
  }

  return errors;
}

export default function JoinForm() {
  const [formData, setFormData] = useState<JoinFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: keyof JoinFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on edit
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API submission — replace with real endpoint
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData(initialFormData);
    setErrors({});
  };

  const fieldClass = (field: keyof JoinFormData) =>
    `w-full rounded-md border px-4 py-2.5 text-sm text-navy-950 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 ${
      errors[field]
        ? "border-red-500 bg-red-50"
        : "border-navy-800/20 bg-white"
    }`;

  return (
    <div className="mx-auto max-w-2xl">
      {submitted && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-green-500/30 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Application submitted successfully! A training officer will contact
          you within 5 working days.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Cadet membership application form"
        className="space-y-6 rounded-lg border border-navy-800/10 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-navy-950">
            Full Name <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={`mt-1.5 ${fieldClass("fullName")}`}
            placeholder="e.g. James Alexander Smith"
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Student ID */}
        <div>
          <label htmlFor="studentId" className="block text-sm font-semibold text-navy-950">
            Student ID <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.studentId}
            aria-describedby={errors.studentId ? "studentId-error" : "studentId-hint"}
            value={formData.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
            className={`mt-1.5 ${fieldClass("studentId")}`}
            placeholder="e.g. STU-2026-0042"
          />
          <p id="studentId-hint" className="mt-1 text-xs text-maritime-muted">
            Your school or college student identification number.
          </p>
          {errors.studentId && (
            <p id="studentId-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.studentId}
            </p>
          )}
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-semibold text-navy-950">
            Age <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={12}
            max={18}
            required
            aria-required="true"
            aria-invalid={!!errors.age}
            aria-describedby={errors.age ? "age-error" : "age-hint"}
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            className={`mt-1.5 ${fieldClass("age")}`}
            placeholder="e.g. 15"
          />
          <p id="age-hint" className="mt-1 text-xs text-maritime-muted">
            Applicants must be aged 12–18.
          </p>
          {errors.age && (
            <p id="age-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.age}
            </p>
          )}
        </div>

        {/* Next of Kin */}
        <div>
          <label htmlFor="nextOfKin" className="block text-sm font-semibold text-navy-950">
            Next of Kin <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="nextOfKin"
            name="nextOfKin"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.nextOfKin}
            aria-describedby={errors.nextOfKin ? "nextOfKin-error" : "nextOfKin-hint"}
            value={formData.nextOfKin}
            onChange={(e) => handleChange("nextOfKin", e.target.value)}
            className={`mt-1.5 ${fieldClass("nextOfKin")}`}
            placeholder="e.g. Mary Smith (Mother) — 07xxx xxxxxx"
          />
          <p id="nextOfKin-hint" className="mt-1 text-xs text-maritime-muted">
            Include name, relationship, and contact number.
          </p>
          {errors.nextOfKin && (
            <p id="nextOfKin-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.nextOfKin}
            </p>
          )}
        </div>

        {/* Motivation */}
        <div>
          <label htmlFor="motivation" className="block text-sm font-semibold text-navy-950">
            Motivation for Joining{" "}
            <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <textarea
            id="motivation"
            name="motivation"
            rows={5}
            required
            aria-required="true"
            aria-invalid={!!errors.motivation}
            aria-describedby={
              errors.motivation ? "motivation-error" : "motivation-hint"
            }
            value={formData.motivation}
            onChange={(e) => handleChange("motivation", e.target.value)}
            className={`mt-1.5 resize-y ${fieldClass("motivation")}`}
            placeholder="Tell us why you want to become a navy cadet and what you hope to achieve..."
          />
          <p id="motivation-hint" className="mt-1 text-xs text-maritime-muted">
            Minimum 20 characters.
          </p>
          {errors.motivation && (
            <p id="motivation-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.motivation}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-gold-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy-950 transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:w-auto"
        >
          {isSubmitting ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
