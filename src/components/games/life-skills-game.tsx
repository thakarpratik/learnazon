"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MORNING_ROUTINE = [
  { id: "wake", label: "Wake up", emoji: "⏰" },
  { id: "brush", label: "Brush teeth", emoji: "🦷" },
  { id: "wash", label: "Wash face", emoji: "🚿" },
  { id: "dress", label: "Get dressed", emoji: "👕" },
  { id: "eat", label: "Eat breakfast", emoji: "🥣" },
  { id: "bag", label: "Pack your bag", emoji: "🎒" },
  { id: "shoes", label: "Put on shoes", emoji: "👟" },
  { id: "go", label: "Head to school", emoji: "🏫" },
];

const GOALS = [
  { category: "Learning", goals: ["Read for 10 minutes", "Practice math facts", "Learn 5 new words"] },
  { category: "Health", goals: ["Drink 6 glasses of water", "Exercise for 20 minutes", "Sleep by 9pm"] },
  { category: "Kindness", goals: ["Help someone today", "Say something nice", "Share with a friend"] },
];

interface LifeSkillsGameProps { age: number; childId: string; }
export function LifeSkillsGame({ age, childId }: LifeSkillsGameProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<"game" | "done">("game");
  const [score, setScore] = useState(0);

  if (age <= 7) return <MorningRoutineGame age={age} childId={childId} onComplete={(s) => { setScore(s); setPhase("done"); }} />;
  if (age <= 9) return <DayPlannerGame age={age} childId={childId} onComplete={(s) => { setScore(s); setPhase("done"); }} />;
  return <GoalSettingGame age={age} childId={childId} onComplete={(s) => { setScore(s); setPhase("done"); }} />;
}

function MorningRoutineGame({ age, childId, onComplete }: { age: number; childId: string; onComplete: (s: number) => void }) {
  const [items, setItems] = useState(() => [...MORNING_ROUTINE].sort(() => Math.random() - 0.5));
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<"" | "correct" | "wrong">("");
  const router = useRouter();

  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    const next = [...items];
    [next[dragIdx], next[i]] = [next[i], next[dragIdx]];
    setItems(next);
    setDragIdx(null);
  };

  const checkOrder = () => {
    const isCorrect = items.every((item, i) => item.id === MORNING_ROUTINE[i].id);
    setResult(isCorrect ? "correct" : "wrong");
    setChecked(true);
    const score = isCorrect ? 100 : 50;
    fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ childId, module: "LIFE_SKILLS", score, timeTaken: 60 }) }).catch(console.error);
    onComplete(score);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-card p-6 mb-6 border border-pink-100">
        <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-2 text-center">Morning Routine 🌅</h2>
        <p className="text-gray-500 text-center mb-4 text-sm">Drag the steps into the right order!</p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={item.id} draggable onDragStart={() => handleDragStart(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(i)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-grab active:cursor-grabbing transition-all ${checked ? (item.id === MORNING_ROUTINE[i].id ? "border-green-400 bg-green-50" : "border-red-300 bg-red-50") : "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50"}`}
              role="listitem" aria-label={item.label}>
              <span className="text-xl font-bold text-gray-300 w-6">{i + 1}.</span>
              <span className="text-3xl">{item.emoji}</span>
              <span className="font-semibold text-gray-700">{item.label}</span>
              <span className="ml-auto text-gray-300">⠿</span>
            </div>
          ))}
        </div>
      </div>
      {!checked ? (
        <button onClick={checkOrder} className="btn-primary w-full text-xl">Check My Order! ✓</button>
      ) : (
        <div className="text-center">
          <div className={`rounded-2xl p-4 mb-4 font-semibold ${result === "correct" ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>
            {result === "correct" ? "🎉 Perfect morning routine! You're ready for the day!" : "Good try! The order has been corrected above."}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/dashboard")} className="btn-secondary">Home</button>
            <button onClick={() => { setItems([...MORNING_ROUTINE].sort(() => Math.random() - 0.5)); setChecked(false); setResult(""); }} className="btn-primary">Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DayPlannerGame({ childId, onComplete }: { age: number; childId: string; onComplete: (s: number) => void }) {
  const router = useRouter();
  const SLOTS = ["7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"];
  const [plan, setPlan] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const filled = Object.values(plan).filter(Boolean).length;
    const score = Math.round((filled / SLOTS.length) * 100);
    setSubmitted(true);
    fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ childId, module: "LIFE_SKILLS", score, timeTaken: 90 }) }).catch(console.error);
    onComplete(score);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-card p-6 mb-6 border border-blue-100">
        <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-2 text-center">Plan Your Day! 📅</h2>
        <p className="text-gray-500 text-center mb-4 text-sm">Fill in what you&apos;ll do at each time</p>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {SLOTS.map((slot) => (
            <div key={slot} className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500 w-12 shrink-0">{slot}</span>
              <input type="text" value={plan[slot] ?? ""} onChange={(e) => setPlan((p) => ({ ...p, [slot]: e.target.value }))} disabled={submitted}
                className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-sm font-medium"
                placeholder="What will you do?" aria-label={`Activity at ${slot}`} />
            </div>
          ))}
        </div>
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} className="btn-primary w-full text-xl">Save My Plan! 📅</button>
      ) : (
        <div className="text-center">
          <div className="bg-blue-50 rounded-2xl p-4 mb-4 text-blue-700 font-semibold border border-blue-200">
            🌟 Amazing planning! You&apos;re super organised!
          </div>
          <button onClick={() => router.push("/dashboard")} className="btn-primary">Back to Home</button>
        </div>
      )}
    </div>
  );
}

function GoalSettingGame({ childId, onComplete }: { age: number; childId: string; onComplete: (s: number) => void }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleGoal = (goal: string) => {
    setSelected((s) => s.includes(goal) ? s.filter((g) => g !== goal) : s.length < 3 ? [...s, goal] : s);
  };

  const handleSubmit = () => {
    const all = [...selected, customGoal].filter(Boolean);
    const score = Math.min(100, all.length * 25 + 25);
    setSubmitted(true);
    fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ childId, module: "LIFE_SKILLS", score, timeTaken: 60 }) }).catch(console.error);
    onComplete(score);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-card p-6 mb-6 border border-green-100">
        <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-2 text-center">Set Your Goals! 🎯</h2>
        <p className="text-gray-500 text-center mb-4 text-sm">Pick up to 3 goals for today</p>
        {GOALS.map((cat) => (
          <div key={cat.category} className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{cat.category}</p>
            <div className="space-y-2">
              {cat.goals.map((goal) => (
                <button key={goal} onClick={() => toggleGoal(goal)} disabled={submitted}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${selected.includes(goal) ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 hover:border-green-300 text-gray-700"}`}
                  aria-pressed={selected.includes(goal)}>
                  {selected.includes(goal) ? "✅ " : "○ "}{goal}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">My Own Goal</p>
          <input type="text" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)} disabled={submitted}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none font-medium text-sm"
            placeholder="Write your own goal…" />
        </div>
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={selected.length === 0 && !customGoal} className="btn-primary w-full text-xl disabled:opacity-50">
          Set My Goals! 🎯
        </button>
      ) : (
        <div className="text-center">
          <div className="bg-green-50 rounded-2xl p-4 mb-4 text-green-700 font-semibold border border-green-200">
            🏆 Excellent goal setting! You&apos;re going to crush it today!
          </div>
          <button onClick={() => router.push("/dashboard")} className="btn-primary">Back to Home</button>
        </div>
      )}
    </div>
  );
}
