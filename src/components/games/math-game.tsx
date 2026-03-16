"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Question { question: string; answer: number; choices: number[]; }

function generateQuestion(age: number): Question {
  let a: number, b: number, question: string, answer: number;

  if (age <= 6) {
    // Count / add within 10
    a = Math.floor(Math.random() * 6);
    b = Math.floor(Math.random() * (10 - a));
    question = `${a} + ${b} = ?`;
    answer = a + b;
  } else if (age <= 7) {
    // +/- within 20
    const op = Math.random() > 0.5 ? "+" : "-";
    a = Math.floor(Math.random() * 15) + 1;
    b = op === "+" ? Math.floor(Math.random() * (20 - a)) : Math.floor(Math.random() * a);
    answer = op === "+" ? a + b : a - b;
    question = `${a} ${op} ${b} = ?`;
  } else if (age <= 9) {
    // Multiplication
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    question = `${a} × ${b} = ?`;
    answer = a * b;
  } else {
    // Division
    b = Math.floor(Math.random() * 9) + 2;
    answer = Math.floor(Math.random() * 10) + 1;
    a = b * answer;
    question = `${a} ÷ ${b} = ?`;
  }

  // Generate 3 wrong choices close to the answer
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const w = answer + offset;
    if (w !== answer && w >= 0) wrong.add(w);
  }
  const choices = Array.from(wrong).concat(answer).sort(() => Math.random() - 0.5);
  return { question, answer, choices };
}

interface MathGameProps { age: number; childId: string; questionCount?: number; }

export function MathGame({ age, childId, questionCount = 5 }: MathGameProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hint, setHint] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  useEffect(() => {
    setQuestions(Array.from({ length: questionCount }, () => generateQuestion(age)));
  }, [age, questionCount]);

  const handleAnswer = useCallback(async (choice: number) => {
    if (selected !== null) return;
    setSelected(choice);
    const q = questions[current];
    const isCorrect = choice === q.answer;

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setConsecutiveWrong(0);
      setHint("✅ Amazing! That's correct! 🌟");
    } else {
      const newWrong = consecutiveWrong + 1;
      setConsecutiveWrong(newWrong);
      // Fetch AI hint after wrong answer
      setLoadingHint(true);
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childAge: age,
            module: "MATH",
            context: `Question: ${q.question}, Child answered: ${choice}, Correct answer: ${q.answer}`,
            question: `I answered ${choice} but the right answer is ${q.answer}. Can you help me understand?`,
          }),
        });
        const data = await res.json();
        setHint(data.response ?? "Not quite — try to think it through! You've got this! 💪");
      } catch {
        setHint(`Not quite! The answer is ${q.answer}. You've got this! 💪`);
      } finally {
        setLoadingHint(false);
      }
    }

    setTimeout(() => {
      setSelected(null);
      setHint("");
      if (current + 1 >= questionCount) {
        setShowResult(true);
        // Save progress
        const score = Math.round(((isCorrect ? correct + 1 : correct) / questionCount) * 100);
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, module: "MATH", score, timeTaken: 60 }),
        }).catch(console.error);
      } else {
        setCurrent((c) => c + 1);
      }
    }, isCorrect ? 1200 : 2500);
  }, [selected, questions, current, correct, consecutiveWrong, age, childId, questionCount]);

  if (!questions.length) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-5xl animate-bounce-slow">🔢</div>
    </div>
  );

  if (showResult) {
    const score = Math.round((correct / questionCount) * 100);
    const stars = score === 100 ? 3 : score >= 80 ? 2 : 1;
    return (
      <div className="text-center py-10">
        <div className="text-7xl mb-4">{score >= 80 ? "🏆" : score >= 60 ? "🌟" : "💪"}</div>
        <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">
          {score >= 80 ? "Amazing!" : score >= 60 ? "Good job!" : "Keep going!"}
        </h2>
        <p className="text-xl text-gray-500 mb-4">{correct} out of {questionCount} correct</p>
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-4xl ${i < stars ? "opacity-100" : "opacity-20"}`}>⭐</span>
          ))}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">Back to Home</button>
          <button onClick={() => { setQuestions(Array.from({ length: questionCount }, () => generateQuestion(age))); setCurrent(0); setCorrect(0); setShowResult(false); }} className="btn-primary">
            Play Again 🎮
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current) / questionCount) * 100;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
          <span>Question {current + 1} of {questionCount}</span>
          <span>{correct} correct ⭐</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-card p-10 text-center mb-6 border border-orange-100">
        <p className="font-fredoka text-5xl md:text-6xl font-bold text-gray-800">{q.question}</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-4 mb-6" role="group" aria-label="Answer choices">
        {q.choices.map((choice) => {
          let style = "bg-white border-2 border-gray-200 text-gray-800 hover:border-orange-400 hover:bg-orange-50";
          if (selected !== null) {
            if (choice === q.answer) style = "bg-green-500 border-green-500 text-white scale-105";
            else if (choice === selected) style = "bg-red-400 border-red-400 text-white";
            else style = "bg-white border-2 border-gray-100 text-gray-400 opacity-60";
          }
          return (
            <button key={choice} onClick={() => handleAnswer(choice)} disabled={selected !== null}
              className={`${style} rounded-2xl p-5 font-fredoka text-4xl font-bold transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300`}
              aria-label={`Answer: ${choice}`}>
              {choice}
            </button>
          );
        })}
      </div>

      {/* Hint */}
      {(hint || loadingHint) && (
        <div className={`rounded-2xl p-4 text-center font-semibold text-base ${hint.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}
          role="status" aria-live="polite">
          {loadingHint ? "🤔 Thinking of a hint…" : hint}
        </div>
      )}
    </div>
  );
}
