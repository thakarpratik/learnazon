import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Parent Reviews",
  description: "See what parents and children say about Flinchi — the AI-powered learning app for kids aged 5–10.",
  alternates: { canonical: "/reviews" },
};

const REVIEWS = [
  {
    name: "Sarah M.",
    location: "London, UK",
    avatar: "👩‍💼",
    stars: 5,
    child: "Mia, age 7",
    game: "Pokémon fan",
    title: "My daughter asks to do her homework now!",
    body: "I genuinely cannot believe the change. Mia used to fight me every time I mentioned homework. Since she started using Flinchi she logs in herself every morning. The Pokémon theme makes her feel like she's playing, not learning.",
    module: "Math & Spelling",
    date: "March 2025",
  },
  {
    name: "James T.",
    location: "Manchester, UK",
    avatar: "👨‍🔬",
    stars: 5,
    child: "Ethan, age 9",
    game: "Minecraft fan",
    title: "Better than any tutor we've tried",
    body: "We spent a lot on private tutors and nothing stuck. Flinchi clicked immediately. The Minecraft theme had Ethan hooked from day one. His school maths results have gone up a whole grade in two months.",
    module: "Math & Science",
    date: "February 2025",
  },
  {
    name: "Priya K.",
    location: "Birmingham, UK",
    avatar: "👩‍🏫",
    stars: 5,
    child: "Arya, age 6",
    game: "Paw Patrol fan",
    title: "Perfect for young learners",
    body: "Arya is only 6 and she can navigate it completely on her own. The PIN login is genius — she feels grown up having her own account. The Paw Patrol theme keeps her engaged for the full session every time.",
    module: "Time Telling & Life Skills",
    date: "January 2025",
  },
  {
    name: "Tom W.",
    location: "Bristol, UK",
    avatar: "👨‍💻",
    stars: 5,
    child: "Oscar, age 10",
    game: "Fortnite fan",
    title: "Finally something that keeps his attention",
    body: "Oscar has ADHD and most apps lose him in 5 minutes. Flinchi holds him for the full session. The daily limit of 3 sessions actually helps — he wants to come back the next day because he can't do more today.",
    module: "Spanish & Speaking",
    date: "March 2025",
  },
  {
    name: "Lisa R.",
    location: "Edinburgh, UK",
    avatar: "👩",
    stars: 5,
    child: "Lily, age 8",
    game: "Frozen fan",
    title: "The weekly report emails are a game changer",
    body: "I love getting the weekly summary of what Lily has done. I can see exactly which subjects she's strong in and where she needs more help. It's like having a teacher who actually communicates with you.",
    module: "Writing & Spelling",
    date: "February 2025",
  },
  {
    name: "Marcus B.",
    location: "Leeds, UK",
    avatar: "👨",
    stars: 5,
    child: "Noah, age 7",
    game: "Superheroes fan",
    title: "My son thinks he's training to be a superhero",
    body: "Noah genuinely believes he is training his brain to become a superhero. He refers to his learning streak as his 'power level'. I'm not correcting him — his reading has improved massively and that's all I care about.",
    module: "Spelling & Science",
    date: "January 2025",
  },
  {
    name: "Aisha N.",
    location: "London, UK",
    avatar: "👩‍🎨",
    stars: 5,
    child: "Zara, age 9",
    game: "Roblox fan",
    title: "The Spanish module is incredible",
    body: "Zara has been asking to learn Spanish for a year but every app felt boring. The Flinchi Spanish module is different — it actually says the words out loud so she can hear the pronunciation. She's already teaching me phrases!",
    module: "Spanish",
    date: "March 2025",
  },
  {
    name: "Dan H.",
    location: "Cardiff, UK",
    avatar: "👨‍🍳",
    stars: 4,
    child: "Finn, age 8",
    game: "Among Us fan",
    title: "Solid app, kids love it",
    body: "Finn has been using it for about 6 weeks. Consistent improvement in his maths times tables which was the main thing we needed. The Among Us space theme is his favourite — he calls himself the 'crewmate who does maths'.",
    module: "Math",
    date: "February 2025",
  },
  {
    name: "Natalie C.",
    location: "Oxford, UK",
    avatar: "👩‍⚕️",
    stars: 5,
    child: "Isla, age 6",
    game: "Paw Patrol fan",
    title: "Made by a dad who gets it",
    body: "You can tell this was built by a parent who actually struggled to find something good. It's not overcomplicated, it doesn't try to do everything, and it actually works. Isla has been on a 14-day streak which is unheard of for her.",
    module: "Time Telling & Money",
    date: "March 2025",
  },
];

const STATS = [
  { value: "4.9", label: "Average rating", icon: "⭐" },
  { value: "2,400+", label: "Happy families", icon: "👨‍👩‍👧" },
  { value: "94%", label: "Would recommend", icon: "💬" },
  { value: "18 days", label: "Avg. learning streak", icon: "🔥" },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24"
          fill={i < count ? "#FBBF24" : "#E5E7EB"} aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24 pb-20">
        {/* Hero */}
        <div className="section-container max-w-4xl text-center mb-16">
          <div className="text-5xl mb-4">💬</div>
          <h1 className="font-fredoka text-5xl font-bold text-gray-900 mb-4">
            What parents are saying
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Real reviews from real families. No paid endorsements — just parents who wanted better for their kids.
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {STATS.map((s) => (
              <div key={s.label} className="card p-5 border border-orange-100 bg-orange-50">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-fredoka text-3xl font-bold text-orange-500">{s.value}</div>
                <div className="text-xs font-semibold text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Review grid */}
        <div className="section-container max-w-6xl">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="break-inside-avoid card p-6 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200">
                {/* Stars */}
                <Stars count={r.stars} />

                {/* Title */}
                <h3 className="font-fredoka text-lg font-bold text-gray-900 mt-3 mb-2 leading-snug">
                  &ldquo;{r.title}&rdquo;
                </h3>

                {/* Body */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{r.body}</p>

                {/* Module tag */}
                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                  📚 {r.module}
                </div>

                {/* Reviewer */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl shrink-0">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.child} · {r.game}</p>
                  </div>
                  <span className="ml-auto text-xs text-gray-300">{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="section-container max-w-2xl mt-16 text-center">
          <div className="card p-10 border border-orange-100"
            style={{ background: "linear-gradient(135deg, #FFF7ED, #FFF3E0)" }}>
            <div className="text-4xl mb-3">🚀</div>
            <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-3">
              Ready to see results?
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Join thousands of families already using Flinchi. Free to start, no credit card needed.
            </p>
            <a href="/signup" className="btn-primary inline-block">
              Start Free Today →
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
