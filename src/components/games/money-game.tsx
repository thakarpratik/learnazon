"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Proper coin display with SVG-style colored circles + labels
function CoinDisplay({ coin }: { coin: { name: string; value: number; color: string; label: string } }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md border-4"
        style={{ backgroundColor: coin.color, borderColor: "rgba(0,0,0,0.15)" }}
        aria-label={`${coin.name} worth ${coin.value} cents`}
      >
        {coin.value}¢
      </div>
      <span className="text-xs font-semibold text-gray-500 capitalize">{coin.name}</span>
    </div>
  );
}

const COINS = [
  { name: "penny",   value: 1,   color: "#b45309", label: "1¢"  },
  { name: "nickel",  value: 5,   color: "#6b7280", label: "5¢"  },
  { name: "dime",    value: 10,  color: "#9ca3af", label: "10¢" },
  { name: "quarter", value: 25,  color: "#d97706", label: "25¢" },
];

function generateQuestion(age: number) {
  if (age <= 6) {
    // Identify a coin — show its value and ask its name
    const coin = COINS[Math.floor(Math.random() * COINS.length)];
    return {
      type: "identify",
      coin,
      question: `What is this coin called?`,
      answer: coin.name,
      choices: COINS.map((c) => c.name),
      displayCoins: [coin],
    };
  } else if (age <= 8) {
    // Count a collection — show 2-4 coins with clear labels
    const coinPool = COINS.slice(0, 3); // penny, nickel, dime
    const displayCoins = Array.from(
      { length: Math.floor(Math.random() * 3) + 2 },
      () => coinPool[Math.floor(Math.random() * coinPool.length)]
    );
    const total = displayCoins.reduce((s, c) => s + c.value, 0);
    const wrong = new Set<number>();
    while (wrong.size < 3) {
      const w = total + [-5, -1, 1, 5, 10][Math.floor(Math.random() * 5)];
      if (w !== total && w > 0) wrong.add(w);
    }
    return {
      type: "count",
      question: "Add up all the coins. How many cents in total?",
      answer: total,
      choices: Array.from(wrong).concat(total).sort(() => Math.random() - 0.5),
      displayCoins,
    };
  } else {
    // Make change
    const price = Math.floor(Math.random() * 7) * 10 + 10; // 10–80¢
    const paid = price + [5, 10, 25, 50][Math.floor(Math.random() * 4)];
    const change = paid - price;
    const wrong = new Set<number>();
    while (wrong.size < 3) {
      const w = change + [-10, -5, 5, 10, 15][Math.floor(Math.random() * 5)];
      if (w !== change && w > 0) wrong.add(w);
    }
    return {
      type: "change",
      question: `A sticker costs ${price}¢. You pay ${paid}¢. How much change do you get?`,
      answer: change,
      choices: Array.from(wrong).concat(change).sort(() => Math.random() - 0.5),
      displayCoins: [] as typeof COINS,
    };
  }
}

interface MoneyGameProps { age: number; childId: string; }

export function MoneyGame({ age, childId }: MoneyGameProps) {
  const router = useRouter();
  const TOTAL = 5;
  const [questions, setQuestions] = useState<ReturnType<typeof generateQuestion>[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQuestions(Array.from({ length: TOTAL }, () => generateQuestion(age)));
  }, [age]);

  const handleAnswer = (choice: number | string) => {
    if (selected !== null) return;
    setSelected(choice);
    const q = questions[current];
    const isCorrect = choice === q.answer;
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setFeedback("✅ Correct! You're a money pro! 💰");
    } else {
      setFeedback(`Not quite! The answer is ${typeof q.answer === "number" ? q.answer + "¢" : q.answer} 💪`);
    }
    setTimeout(() => {
      setSelected(null);
      setFeedback("");
      if (current + 1 >= TOTAL) {
        setDone(true);
        const score = Math.round(((isCorrect ? correct + 1 : correct) / TOTAL) * 100);
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, module: "MONEY", score, timeTaken: 60 }),
        }).catch(console.error);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 1500);
  };

  if (!questions.length) {
    return <div className="flex justify-center py-20"><div className="text-5xl animate-bounce-slow">💰</div></div>;
  }

  if (done) {
    const pct = Math.round((correct / TOTAL) * 100);
    const stars = pct === 100 ? 3 : pct >= 80 ? 2 : 1;
    return (
      <div className="text-center py-10">
        <div className="text-7xl mb-4">{pct >= 80 ? "💰🏆" : "💪"}</div>
        <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">
          {pct >= 80 ? "Money Master!" : "Keep Counting!"}
        </h2>
        <p className="text-xl text-gray-500 mb-4">{correct} of {TOTAL} correct</p>
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-4xl ${i < stars ? "" : "opacity-20"}`}>⭐</span>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">Home</button>
          <button onClick={() => {
            setDone(false); setCurrent(0); setCorrect(0);
            setQuestions(Array.from({ length: TOTAL }, () => generateQuestion(age)));
          }} className="btn-primary">Play Again 🎮</button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex justify-between text-sm font-semibold text-gray-500 mb-4">
        <span>Question {current + 1} of {TOTAL}</span>
        <span>{correct} correct ⭐</span>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl shadow-card p-8 text-center mb-6 border border-yellow-100">
        <p className="font-fredoka text-2xl font-bold text-gray-800 mb-6">{q.question}</p>

        {/* Coin display */}
        {q.displayCoins && q.displayCoins.length > 0 && (
          <div className="flex items-end justify-center gap-4 mb-4 flex-wrap">
            {q.displayCoins.map((coin, i) => (
              <CoinDisplay key={i} coin={coin} />
            ))}
          </div>
        )}

        {/* Change problem visual */}
        {q.type === "change" && (
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 text-sm font-semibold text-yellow-800">
            💡 Change = Amount paid − Price of item
          </div>
        )}
      </div>

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-4 mb-4" role="group" aria-label="Answer choices">
        {q.choices.map((choice) => {
          let style = "bg-white border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 text-gray-800";
          if (selected !== null) {
            if (choice === q.answer) style = "bg-green-500 border-green-500 text-white scale-105";
            else if (choice === selected) style = "bg-red-400 border-red-400 text-white";
            else style = "bg-white border-2 border-gray-100 text-gray-400 opacity-60";
          }
          return (
            <button
              key={String(choice)}
              onClick={() => handleAnswer(choice)}
              disabled={selected !== null}
              className={`${style} rounded-2xl p-5 font-fredoka text-2xl font-bold transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300`}
              aria-label={`Answer: ${typeof choice === "number" ? choice + " cents" : choice}`}
            >
              {typeof choice === "number" ? `${choice}¢` : choice}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-2xl p-4 text-center font-semibold ${
            feedback.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
