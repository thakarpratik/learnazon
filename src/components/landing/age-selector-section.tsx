"use client";

import { useState } from "react";
import Link from "next/link";

const ageGroups = [
  { age: "5",  label: "Age 5",  animal: "🐣", bg: "#FFF7ED", border: "#F97316", activeBg: "#F97316", activeText: "#fff", subjects: ["Count to 20","Basic shapes","Colors & patterns","Sight words"] },
  { age: "6",  label: "Age 6",  animal: "🐥", bg: "#FFFBEB", border: "#FBBF24", activeBg: "#FBBF24", activeText: "#78350F", subjects: ["Number bonds","Half hours","3-letter words","Morning routine"] },
  { age: "7",  label: "Age 7",  animal: "🦊", bg: "#F5F3FF", border: "#A78BFA", activeBg: "#A78BFA", activeText: "#fff", subjects: ["+/- within 20","Count coins","Describe pictures","3-letter words"] },
  { age: "8",  label: "Age 8",  animal: "🦁", bg: "#ECFDF5", border: "#34D399", activeBg: "#34D399", activeText: "#065F46", subjects: ["Multiplication","5-min intervals","Tell a story","Compound words"] },
  { age: "9",  label: "Age 9",  animal: "🦋", bg: "#EEF2FF", border: "#818CF8", activeBg: "#4F46E5", activeText: "#fff", subjects: ["Word problems","Make change","Story telling","Plan your day"] },
  { age: "10", label: "Age 10", animal: "🚀", bg: "#FFF1F2", border: "#FB7185", activeBg: "#FB7185", activeText: "#fff", subjects: ["Fractions & division","Budgeting","Debate topics","Goal setting"] },
] as const;

export function AgeSelectorSection() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const selected = ageGroups.find((g) => g.age === selectedAge);

  return (
    <section id="ages" className="py-20 md:py-28 bg-white" aria-labelledby="age-selector-heading">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="badge-pill mb-5"
            style={{ background: "var(--indigo-light)", color: "var(--indigo)", borderColor: "var(--indigo-soft)" }}
          >
            Ages 5–10
          </span>
          <h2
            id="age-selector-heading"
            className="font-baloo text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: "var(--text)" }}
          >
            Built for{" "}
            <span style={{ color: "var(--indigo)" }}>every age</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            KidLearn automatically adjusts difficulty and content for every age group.
          </p>
        </div>

        {/* Age buttons */}
        <div
          className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto mb-10"
          role="radiogroup"
          aria-label="Select child's age"
        >
          {ageGroups.map((group) => {
            const isSelected = selectedAge === group.age;
            return (
              <button
                key={group.age}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedAge(group.age)}
                className="flex flex-col items-center gap-2 p-4 rounded-[20px] font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background:  isSelected ? group.activeBg : group.bg,
                  color:       isSelected ? group.activeText : "var(--text)",
                  border:      `3px solid ${group.border}`,
                  boxShadow:   isSelected
                    ? `0 6px 0 ${group.border}, 0 2px 12px ${group.border}40`
                    : `0 4px 0 ${group.border}60`,
                  transform:   isSelected ? "translateY(-4px)" : undefined,
                }}
              >
                <span className="text-3xl" aria-hidden="true">{group.animal}</span>
                <span className="text-sm">{group.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content preview */}
        {selected ? (
          <div
            className="max-w-2xl mx-auto rounded-[24px] p-8 text-center animate-slide-up"
            style={{
              background:  selected.bg,
              border:      `3px solid ${selected.border}`,
              boxShadow:   `0 6px 0 ${selected.border}60`,
            }}
          >
            <p
              className="font-baloo text-2xl font-extrabold mb-2"
              style={{ color: "var(--text)" }}
            >
              {selected.animal} Perfect for Age {selected.age}!
            </p>
            <p className="mb-6 font-bold text-sm" style={{ color: "var(--muted)" }}>
              Your child will learn:
            </p>
            <ul className="grid grid-cols-2 gap-3 mb-8">
              {selected.subjects.map((subject) => (
                <li
                  key={subject}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold bg-white"
                  style={{ border: `2px solid ${selected.border}`, color: "var(--text)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke={selected.border} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {subject}
                </li>
              ))}
            </ul>
            <Link
              href={`/signup?age=${selected.age}`}
              className="btn-primary"
              aria-label={`Start KidLearn for age ${selected.age}`}
            >
              Start for Age {selected.age}
            </Link>
          </div>
        ) : (
          <p className="text-center font-bold" style={{ color: "var(--muted)" }}>
            Tap an age above to see what your child will learn!
          </p>
        )}
      </div>
    </section>
  );
}
