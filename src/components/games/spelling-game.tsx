"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const WORDS: Record<number, { word: string; hint: string; emoji: string }[]> = {
  5: [{ word: "cat", hint: "A furry pet that meows", emoji: "🐱" }, { word: "dog", hint: "A pet that barks", emoji: "🐶" }, { word: "sun", hint: "It lights up the day", emoji: "☀️" }, { word: "red", hint: "The colour of a fire truck", emoji: "🔴" }, { word: "big", hint: "The opposite of small", emoji: "🐘" }],
  6: [{ word: "jump", hint: "What a frog does", emoji: "🐸" }, { word: "play", hint: "What kids do at recess", emoji: "🎮" }, { word: "blue", hint: "The colour of the sky", emoji: "🔵" }, { word: "fish", hint: "It lives in water", emoji: "🐟" }, { word: "tree", hint: "It has leaves and branches", emoji: "🌳" }],
  7: [{ word: "happy", hint: "How you feel on your birthday", emoji: "😊" }, { word: "water", hint: "You drink this every day", emoji: "💧" }, { word: "tiger", hint: "A big striped jungle cat", emoji: "🐯" }, { word: "bread", hint: "You make sandwiches with this", emoji: "🍞" }, { word: "music", hint: "You listen to this with ears", emoji: "🎵" }],
  8: [{ word: "friend", hint: "Someone you like to play with", emoji: "👫" }, { word: "garden", hint: "Where flowers grow", emoji: "🌸" }, { word: "planet", hint: "Earth is one of these", emoji: "🌍" }, { word: "silver", hint: "A shiny grey metal", emoji: "🪙" }, { word: "bottle", hint: "You drink from this", emoji: "🍶" }],
  9: [{ word: "beautiful", hint: "Very nice to look at", emoji: "💐" }, { word: "adventure", hint: "An exciting journey", emoji: "🗺️" }, { word: "wonderful", hint: "Really amazing and great", emoji: "✨" }, { word: "important", hint: "Matters a lot", emoji: "⭐" }, { word: "different", hint: "Not the same as others", emoji: "🦋" }],
  10: [{ word: "mysterious", hint: "Strange and hard to explain", emoji: "🔮" }, { word: "confident", hint: "Believing in yourself", emoji: "💪" }, { word: "challenge", hint: "Something hard to do", emoji: "🏆" }, { word: "knowledge", hint: "What you gain from learning", emoji: "📚" }, { word: "celebrate", hint: "What you do at a party", emoji: "🎉" }],
};

interface SpellingGameProps { age: number; childId: string; }
export function SpellingGame({ age, childId }: SpellingGameProps) {
  const router = useRouter();
  const wordSet = WORDS[age] ?? WORDS[7];
  const [queue] = useState(() => [...wordSet].sort(() => Math.random() - 0.5));
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"" | "correct" | "wrong">("");
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.8; u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  };

  useEffect(() => { if (queue[current]) speak(queue[current].word); }, [current, queue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = queue[current];
    const isCorrect = input.trim().toLowerCase() === word.word.toLowerCase();
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrect((c) => c + 1);
    else { setShake(true); setTimeout(() => setShake(false), 600); }

    setTimeout(() => {
      setFeedback(""); setInput("");
      if (current + 1 >= queue.length) {
        setDone(true);
        fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ childId, module: "SPELLING", score: Math.round(((isCorrect ? correct + 1 : correct) / queue.length) * 100), timeTaken: 60 }) }).catch(console.error);
      } else { setCurrent((c) => c + 1); }
    }, 1200);
  };

  if (done) {
    const pct = Math.round((correct / queue.length) * 100);
    return (
      <div className="text-center py-10">
        <div className="text-7xl mb-4">{pct >= 80 ? "📝🏆" : "💪"}</div>
        <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">{pct >= 80 ? "Spelling Star!" : "Keep Spelling!"}</h2>
        <p className="text-xl text-gray-500 mb-6">{correct} of {queue.length} correct</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">Home</button>
          <button onClick={() => { setDone(false); setCurrent(0); setCorrect(0); setInput(""); }} className="btn-primary">Try Again 📝</button>
        </div>
      </div>
    );
  }

  const word = queue[current];
  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between text-sm font-semibold text-gray-500 mb-4">
        <span>Word {current + 1} of {queue.length}</span><span>{correct} correct ⭐</span>
      </div>
      <div className="bg-white rounded-3xl shadow-card p-8 text-center mb-6 border border-purple-100">
        <div className="text-7xl mb-4">{word.emoji}</div>
        <p className="text-gray-500 font-medium mb-4">{word.hint}</p>
        <button onClick={() => speak(word.word)} className="inline-flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold px-6 py-3 rounded-full transition-colors" aria-label="Hear the word again">
          🔊 Hear the word
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={`mb-4 ${shake ? "animate-wiggle" : ""}`}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} autoFocus autoComplete="off" autoCorrect="off" spellCheck={false}
            className={`w-full text-center text-3xl font-bold px-6 py-5 rounded-2xl border-3 focus:outline-none transition-all ${feedback === "correct" ? "border-green-400 bg-green-50 text-green-700" : feedback === "wrong" ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 focus:border-purple-400"}`}
            placeholder="Type the word…" aria-label="Type the spelling" />
        </div>
        <button type="submit" disabled={!input.trim() || !!feedback} className="btn-primary w-full text-xl disabled:opacity-50">
          {feedback === "correct" ? "✅ Correct!" : feedback === "wrong" ? "❌ Try again soon!" : "Check Spelling ✓"}
        </button>
      </form>
      {/* Letter blanks hint */}
      <div className="mt-4 flex justify-center gap-2">
        {word.word.split("").map((_, i) => (
          <div key={i} className={`w-8 h-1 rounded-full ${i < input.length ? "bg-purple-400" : "bg-gray-200"}`} aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
