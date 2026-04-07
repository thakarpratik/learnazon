"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Level } from "./level-picker";

interface WritingPrompt {
  type: "fill-blank" | "sentences" | "paragraph";
  prompt: string;
  starter?: string; // sentence starter for fill-blank
  tip: string;
  minWords: number;
  emoji: string;
}

// Fill-in-the-blank prompts (ages 5-6)
const FILL_BLANK: WritingPrompt[] = [
  { type: "fill-blank", prompt: "Complete the sentence:", starter: "My favourite animal is a ___ because it is ___.", tip: "Think of an animal you love and one word to describe it!", minWords: 3, emoji: "🐾" },
  { type: "fill-blank", prompt: "Complete the sentence:", starter: "Today the weather is ___ and I want to ___.", tip: "Look outside! What do you see? What would you like to do?", minWords: 3, emoji: "🌤️" },
  { type: "fill-blank", prompt: "Complete the sentence:", starter: "My favourite food is ___ because it tastes ___.", tip: "Think of a food you love — is it sweet, salty, crunchy?", minWords: 3, emoji: "🍎" },
  { type: "fill-blank", prompt: "Complete the sentence:", starter: "At school I love to ___ with my friends.", tip: "What activity do you enjoy most at school?", minWords: 2, emoji: "🏫" },
  { type: "fill-blank", prompt: "Complete the sentence:", starter: "My favourite colour is ___ because it looks like ___.", tip: "Name your colour and something in nature that has that colour!", minWords: 3, emoji: "🌈" },
  { type: "fill-blank", prompt: "Complete the sentence:", starter: "If I had a magic wand, I would ___.", tip: "Be creative — anything is possible with magic!", minWords: 4, emoji: "🪄" },
];

// Short sentence prompts (ages 7-9)
const SHORT_SENTENCES: WritingPrompt[] = [
  { type: "sentences", prompt: "Write 3 sentences about your favourite season.", starter: "", tip: "Use describing words. What do you see, hear, or feel in that season?", minWords: 15, emoji: "🍂" },
  { type: "sentences", prompt: "Write 3 sentences about an animal you find interesting.", starter: "", tip: "Where does it live? What does it eat? What makes it special?", minWords: 15, emoji: "🦁" },
  { type: "sentences", prompt: "Write 3 sentences about what you want to be when you grow up.", starter: "", tip: "Name the job, say why you like it, and one thing you'd do in that job.", minWords: 15, emoji: "🚀" },
  { type: "sentences", prompt: "Write 3 sentences about a trip or holiday you enjoyed.", starter: "", tip: "Where did you go? What did you see? How did you feel?", minWords: 15, emoji: "✈️" },
  { type: "sentences", prompt: "Write 3 sentences about your best friend or a family member.", starter: "", tip: "Describe them, say what you do together, and why you like them.", minWords: 15, emoji: "👫" },
  { type: "sentences", prompt: "Write 3 sentences about an invention you wish existed.", starter: "", tip: "Name the invention, how it works, and why the world needs it!", minWords: 15, emoji: "💡" },
  { type: "sentences", prompt: "Write about a time you felt proud of yourself.", starter: "", tip: "What happened? What did you do? How did it make you feel?", minWords: 15, emoji: "🏅" },
  { type: "sentences", prompt: "Write 3 sentences about your favourite book, game, or film.", starter: "", tip: "Name it, describe one character or scene, and say what you like about it.", minWords: 15, emoji: "📖" },
];

// Paragraph prompts (ages 9+)
const PARAGRAPH: WritingPrompt[] = [
  { type: "paragraph", prompt: "Write a short story that starts with: 'It was the strangest Monday morning I had ever seen…'", starter: "It was the strangest Monday morning I had ever seen…", tip: "Introduce a character, a problem, and how they solve it. Use vivid describing words!", minWords: 40, emoji: "📖" },
  { type: "paragraph", prompt: "Write a persuasive paragraph: 'Why every child should learn to cook.'", starter: "", tip: "Give 3 reasons and use persuasive phrases like 'In addition…' and 'Most importantly…'", minWords: 40, emoji: "🍳" },
  { type: "paragraph", prompt: "Describe a place you have never been to but would love to visit. Make it come alive!", starter: "", tip: "Use the five senses — what can you see, hear, smell, taste, and touch there?", minWords: 40, emoji: "🗺️" },
  { type: "paragraph", prompt: "Write a diary entry for an astronaut who just landed on Mars.", starter: "Day 1 on Mars — I can't believe I'm here…", tip: "Describe what you see, how you feel, and what you do first.", minWords: 40, emoji: "🚀" },
  { type: "paragraph", prompt: "Write a story that starts with: 'The door appeared in the library one Thursday afternoon…'", starter: "The door appeared in the library one Thursday afternoon…", tip: "Where does it lead? Who goes through it? What happens?", minWords: 40, emoji: "🚪" },
  { type: "paragraph", prompt: "Write a persuasive paragraph: 'Should schools teach students how to manage money?'", starter: "", tip: "State your opinion clearly, give evidence, and close with a strong sentence.", minWords: 40, emoji: "💰" },
  { type: "paragraph", prompt: "Write about the most important lesson you have ever learned. Tell the story of how you learned it.", starter: "", tip: "Set the scene, describe what happened, and reflect on what it taught you.", minWords: 40, emoji: "💡" },
  { type: "paragraph", prompt: "Write a description of a mysterious creature. Make it as vivid as possible!", starter: "Nobody had seen anything like it before…", tip: "Describe its appearance, sound, smell, and movement using powerful adjectives.", minWords: 40, emoji: "🐉" },
];

function getPrompt(age: number, level: Level): WritingPrompt {
  let pool: WritingPrompt[];

  if (level === "easy" || age <= 6) {
    pool = FILL_BLANK;
  } else if (level === "medium" || age <= 9) {
    pool = SHORT_SENTENCES;
  } else {
    pool = PARAGRAPH;
  }

  // Advanced bumps up one level
  if (level === "advanced" && age <= 9) pool = PARAGRAPH;
  if (level === "easy" && age > 6) pool = FILL_BLANK;

  return pool[Math.floor(Math.random() * pool.length)];
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface WritingGameProps { age: number; childId: string; level?: Level; }

export function WritingGame({ age, childId, level = "medium" }: WritingGameProps) {
  const router = useRouter();
  const [prompt] = useState(() => getPrompt(age, level));
  const [text, setText] = useState(prompt.starter ?? "");
  const [phase, setPhase] = useState<"write" | "feedback">("write");
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const words = wordCount(text);
  const ready = words >= prompt.minWords;
  const levelBadge: Record<Level, string> = { easy: "🌱 Easy", medium: "⭐ Medium", advanced: "🔥 Advanced" };

  const handleSubmit = async () => {
    if (!ready || submitted) return;
    setSubmitted(true);
    setLoadingFeedback(true);
    setPhase("feedback");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childAge: age,
          module: "WRITING",
          context: `Writing prompt: "${prompt.prompt}". Level: ${level}.`,
          question: `The child wrote: "${text.slice(0, 500)}". Give warm, specific feedback — praise 1-2 things they did well (word choice, ideas, structure) and give 1 gentle suggestion to improve. Keep it encouraging and age-appropriate.`,
        }),
      });
      const data = await res.json();
      setAiFeedback(data.response ?? "Fantastic writing! Keep practising — every word you write makes you a better writer! ✍️");
    } catch {
      setAiFeedback("Wonderful work! Every sentence you write is building your writing skills. Keep it up! ✍️");
    } finally {
      setLoadingFeedback(false);
      const score = Math.min(100, Math.round((words / (prompt.minWords * 2)) * 100) + 20);
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, module: "WRITING", score, timeTaken: 120 }),
      }).catch(console.error);
    }
  };

  if (phase === "feedback") {
    const score = Math.min(100, Math.round((words / (prompt.minWords * 2)) * 100) + 20);
    const stars = score >= 80 ? 3 : score >= 60 ? 2 : 1;
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="text-7xl mb-3">✍️</div>
          <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">Great writing!</h2>
          <div className="flex justify-center gap-2 mb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-4xl ${i < stars ? "opacity-100" : "opacity-20"}`}>⭐</span>
            ))}
          </div>
          <p className="text-gray-500">{words} words written</p>
        </div>

        {/* Their writing */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-4 border border-indigo-100">
          <p className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-wide">Your writing</p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{text}</p>
        </div>

        {/* AI feedback */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-6 border border-green-100">
          <p className="font-bold text-gray-700 mb-3">🤖 Writing Coach says:</p>
          {loadingFeedback
            ? <p className="text-gray-500 italic">Reading your writing…</p>
            : <p className="text-gray-600 leading-relaxed">{aiFeedback}</p>}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">Home</button>
          <button onClick={() => { setPhase("write"); setText(prompt.starter ?? ""); setSubmitted(false); setAiFeedback(""); }} className="btn-primary">
            Write Again ✍️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
          {levelBadge[level]}
        </span>
        <span className="text-2xl">{prompt.emoji}</span>
      </div>

      {/* Prompt card */}
      <div className="bg-white rounded-3xl shadow-card p-6 mb-4 border border-indigo-100">
        <p className="text-gray-500 font-semibold text-sm mb-2">{prompt.prompt}</p>
        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 mb-0">
          <p className="text-sm font-semibold text-indigo-700">💡 {prompt.tip}</p>
        </div>
      </div>

      {/* Writing area */}
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={prompt.type === "fill-blank" ? 3 : prompt.type === "paragraph" ? 10 : 6}
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-gray-800 text-base font-medium leading-relaxed resize-none transition-colors"
          placeholder={prompt.type === "fill-blank" ? "Complete the sentence above…" : "Start writing here…"}
          aria-label="Your writing"
          spellCheck={true}
        />
        <div className="flex justify-between mt-1 px-1">
          <span className={`text-xs font-semibold ${ready ? "text-green-600" : "text-gray-400"}`}>
            {words} / {prompt.minWords} words minimum {ready ? "✓" : ""}
          </span>
          {!ready && (
            <span className="text-xs text-gray-400">{prompt.minWords - words} more to go!</span>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!ready || submitted}
        className="btn-primary w-full text-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitted ? "Submitting…" : ready ? "Submit My Writing! 🚀" : `Write at least ${prompt.minWords} words first`}
      </button>
    </div>
  );
}
