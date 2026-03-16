"use client";

import { useState } from "react";
import Link from "next/link";

const ageGroups = [
  { age: "5",  emoji: "🐣", label: "Age 5",  active: "bg-brand-blue text-white",    inactive: "bg-brand-blue-light text-brand-blue hover:bg-blue-100",   subjects: ["Count to 20","Basic shapes","Colors & patterns","Sight words"] },
  { age: "6",  emoji: "🐥", label: "Age 6",  active: "bg-yellow-400 text-gray-900", inactive: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",          subjects: ["Number bonds","Half hours","3-letter words","Morning routine"] },
  { age: "7",  emoji: "🦊", label: "Age 7",  active: "bg-brand-purple text-white",  inactive: "bg-brand-purple-light text-brand-purple hover:bg-purple-100",subjects: ["+/- within 20","Count coins","Describe pictures","3-letter words"] },
  { age: "8",  emoji: "🦁", label: "Age 8",  active: "bg-brand-green text-gray-900",inactive: "bg-brand-green-light text-green-700 hover:bg-green-100",    subjects: ["Multiplication","5-min intervals","Tell a story","Compound words"] },
  { age: "9",  emoji: "🦋", label: "Age 9",  active: "bg-brand-blue text-white",    inactive: "bg-brand-blue-light text-brand-blue hover:bg-blue-100",     subjects: ["Word problems","Make change","Story telling","Plan your day"] },
  { age: "10", emoji: "🚀", label: "Age 10", active: "bg-brand-purple text-white",  inactive: "bg-brand-purple-light text-brand-purple hover:bg-purple-100",subjects: ["Fractions & division","Budgeting","Debate topics","Goal setting"] },
];

export function AgeSelectorSection() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const selected = ageGroups.find((g) => g.age === selectedAge);

  return (
    <section id="ages" className="py-20 md:py-28" aria-labelledby="age-selector-heading">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 id="age-selector-heading" className="font-fredoka text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            Pick your child&apos;s age 👇
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-muted)" }}>
            KidLearn automatically adjusts difficulty and content for every age group.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto mb-10" role="radiogroup" aria-label="Select child's age">
          {ageGroups.map((group) => (
            <button key={group.age} role="radio" aria-checked={selectedAge === group.age}
              onClick={() => setSelectedAge(group.age)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
                selectedAge === group.age ? group.active + " border-transparent shadow-fun" : group.inactive + " border-transparent"}`}>
              <span className="text-3xl" aria-hidden="true">{group.emoji}</span>
              <span className="text-sm">{group.label}</span>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="max-w-2xl mx-auto card p-8 text-center border" style={{ borderColor: "var(--color-blue-light)" }}>
            <p className="font-fredoka text-2xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
              {selected.emoji} Perfect for Age {selected.age}!
            </p>
            <p className="mb-6" style={{ color: "var(--color-muted)" }}>Your child will learn:</p>
            <ul className="grid grid-cols-2 gap-3 mb-8">
              {selected.subjects.map((subject) => (
                <li key={subject} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                  style={{ background: "var(--color-blue-light)", color: "var(--color-text)" }}>
                  <span style={{ color: "var(--color-green-dark)" }}>✓</span>
                  {subject}
                </li>
              ))}
            </ul>
            <Link href={`/signup?age=${selected.age}`} className="btn-primary" aria-label={`Start KidLearn for age ${selected.age}`}>
              Start for Age {selected.age} →
            </Link>
          </div>
        ) : (
          <p className="text-center font-semibold animate-pulse" style={{ color: "var(--color-muted)" }}>
            👆 Tap an age to see what your child will learn!
          </p>
        )}
      </div>
    </section>
  );
}
