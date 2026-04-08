"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Level } from "./level-picker";

interface SpanishQuestion {
  type: "translate-to-spanish" | "translate-to-english" | "match-phrase";
  question: string;
  answer: string;
  choices: string[];
  emoji: string;
  tip?: string;
}

// Level 1 — colours, numbers, greetings, family (ages 5-6 / Easy)
const Q_EASY: SpanishQuestion[] = [
  { type: "translate-to-spanish", question: "How do you say 'Hello' in Spanish?", answer: "Hola", choices: ["Hola", "Bonjour", "Ciao", "Merhaba"], emoji: "👋", tip: "This one you probably already know!" },
  { type: "translate-to-spanish", question: "How do you say 'Goodbye' in Spanish?", answer: "Adiós", choices: ["Adiós", "Merci", "Salut", "Arrivederci"], emoji: "👋" },
  { type: "translate-to-spanish", question: "What does 'Gato' mean in English?", answer: "Cat", choices: ["Cat", "Dog", "Bird", "Fish"], emoji: "🐱" },
  { type: "translate-to-spanish", question: "What does 'Perro' mean in English?", answer: "Dog", choices: ["Dog", "Cat", "Horse", "Rabbit"], emoji: "🐶" },
  { type: "translate-to-spanish", question: "How do you say 'Thank you' in Spanish?", answer: "Gracias", choices: ["Gracias", "Por favor", "Hola", "Bien"], emoji: "🙏" },
  { type: "translate-to-spanish", question: "What does 'Rojo' mean in English?", answer: "Red", choices: ["Red", "Blue", "Green", "Yellow"], emoji: "🔴" },
  { type: "translate-to-spanish", question: "What does 'Azul' mean in English?", answer: "Blue", choices: ["Blue", "Red", "Black", "White"], emoji: "🔵" },
  { type: "translate-to-spanish", question: "How do you say 'Yes' in Spanish?", answer: "Sí", choices: ["Sí", "No", "Tal vez", "Nunca"], emoji: "✅" },
  { type: "translate-to-spanish", question: "What does 'Uno, dos, tres' mean?", answer: "One, two, three", choices: ["One, two, three", "Four, five, six", "Red, blue, green", "Yes, no, maybe"], emoji: "🔢" },
  { type: "translate-to-spanish", question: "How do you say 'Please' in Spanish?", answer: "Por favor", choices: ["Por favor", "Gracias", "De nada", "Buenos días"], emoji: "🙏" },
  { type: "translate-to-spanish", question: "What does 'Madre' mean in English?", answer: "Mother", choices: ["Mother", "Father", "Sister", "Brother"], emoji: "👩" },
  { type: "translate-to-spanish", question: "What does 'Sol' mean in English?", answer: "Sun", choices: ["Sun", "Moon", "Star", "Cloud"], emoji: "☀️" },
];

// Level 2 — food, animals, classroom, common phrases (ages 7-9 / Medium)
const Q_MEDIUM: SpanishQuestion[] = [
  { type: "translate-to-spanish", question: "How do you say 'I am hungry' in Spanish?", answer: "Tengo hambre", choices: ["Tengo hambre", "Tengo sed", "Tengo frío", "Tengo calor"], emoji: "🍽️" },
  { type: "translate-to-spanish", question: "What does 'Biblioteca' mean?", answer: "Library", choices: ["Library", "School", "Hospital", "Market"], emoji: "📚" },
  { type: "translate-to-spanish", question: "How do you say 'My name is...' in Spanish?", answer: "Me llamo...", choices: ["Me llamo...", "Soy de...", "Tengo...", "Vivo en..."], emoji: "🏷️" },
  { type: "translate-to-spanish", question: "What does 'Manzana' mean in English?", answer: "Apple", choices: ["Apple", "Orange", "Banana", "Grape"], emoji: "🍎" },
  { type: "translate-to-spanish", question: "What does 'Escuela' mean in English?", answer: "School", choices: ["School", "Home", "Park", "Shop"], emoji: "🏫" },
  { type: "translate-to-spanish", question: "How do you say 'How are you?' in Spanish?", answer: "¿Cómo estás?", choices: ["¿Cómo estás?", "¿Dónde estás?", "¿Qué hora es?", "¿Cuántos años tienes?"], emoji: "🤝" },
  { type: "translate-to-spanish", question: "What does 'Agua' mean in English?", answer: "Water", choices: ["Water", "Fire", "Earth", "Air"], emoji: "💧" },
  { type: "translate-to-spanish", question: "How do you say 'I like football' in Spanish?", answer: "Me gusta el fútbol", choices: ["Me gusta el fútbol", "Juego al tenis", "Quiero pizza", "Tengo un perro"], emoji: "⚽" },
  { type: "translate-to-spanish", question: "What does 'Hermano' mean in English?", answer: "Brother", choices: ["Brother", "Sister", "Father", "Cousin"], emoji: "👦" },
  { type: "translate-to-spanish", question: "What does 'Casa' mean in English?", answer: "House", choices: ["House", "Car", "Tree", "Road"], emoji: "🏠" },
  { type: "translate-to-spanish", question: "How do you say 'Good morning' in Spanish?", answer: "Buenos días", choices: ["Buenos días", "Buenas noches", "Buenas tardes", "Hasta luego"], emoji: "🌅" },
  { type: "translate-to-spanish", question: "What does 'Feliz' mean in English?", answer: "Happy", choices: ["Happy", "Sad", "Angry", "Tired"], emoji: "😊" },
];

// Level 3 — verbs, tenses, opinions, longer phrases (ages 10+ / Advanced)
const Q_HARD: SpanishQuestion[] = [
  { type: "translate-to-spanish", question: "How do you say 'I want to go to the cinema' in Spanish?", answer: "Quiero ir al cine", choices: ["Quiero ir al cine", "Me gusta la música", "Tengo que estudiar", "Voy al mercado"], emoji: "🎬" },
  { type: "translate-to-spanish", question: "What does 'Hace calor' mean?", answer: "It is hot", choices: ["It is hot", "It is cold", "It is raining", "It is windy"], emoji: "☀️" },
  { type: "translate-to-spanish", question: "How do you say 'I was born in...' in Spanish?", answer: "Nací en...", choices: ["Nací en...", "Vivo en...", "Soy de...", "Estudio en..."], emoji: "🎂" },
  { type: "translate-to-spanish", question: "What does 'Ayer fui al parque' mean?", answer: "Yesterday I went to the park", choices: ["Yesterday I went to the park", "Tomorrow I will go to school", "Today I am at home", "Last week I played football"], emoji: "🌳" },
  { type: "translate-to-spanish", question: "How do you say 'In my opinion' in Spanish?", answer: "En mi opinión", choices: ["En mi opinión", "Sin embargo", "Por lo tanto", "Aunque"], emoji: "💭" },
  { type: "translate-to-spanish", question: "What does 'Tengo que hacer mis deberes' mean?", answer: "I have to do my homework", choices: ["I have to do my homework", "I want to play outside", "I like reading books", "I finished my work"], emoji: "📚" },
  { type: "translate-to-spanish", question: "How do you say 'The weather is nice today' in Spanish?", answer: "Hace buen tiempo hoy", choices: ["Hace buen tiempo hoy", "Llueve mucho aquí", "Hace frío en invierno", "El sol brilla siempre"], emoji: "🌤️" },
  { type: "translate-to-spanish", question: "What does 'Me gustaría visitar España' mean?", answer: "I would like to visit Spain", choices: ["I would like to visit Spain", "I visited Spain last year", "Spain is a beautiful country", "I live in Spain"], emoji: "🇪🇸" },
  { type: "translate-to-spanish", question: "How do you say 'I prefer...' in Spanish?", answer: "Prefiero...", choices: ["Prefiero...", "Quiero...", "Puedo...", "Debo..."], emoji: "⚖️" },
  { type: "translate-to-spanish", question: "What does 'El año que viene' mean?", answer: "Next year", choices: ["Next year", "Last year", "This year", "Every year"], emoji: "📅" },
];

function getQuestions(age: number, level: Level): SpanishQuestion[] {
  let pool: SpanishQuestion[];
  if (level === "easy" || age <= 6)       pool = Q_EASY;
  else if (level === "advanced" || age >= 10) pool = Q_HARD;
  else                                    pool = Q_MEDIUM;
  if (level === "advanced" && age < 9)    pool = Q_MEDIUM;
  if (level === "easy"     && age > 7)    pool = Q_EASY;

  const count = level === "easy" ? 5 : level === "medium" ? 8 : 10;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}

interface SpanishGameProps { age: number; childId: string; level?: Level; }

export function SpanishGame({ age, childId, level = "medium" }: SpanishGameProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<SpanishQuestion[]>([]);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<string | null>(null);
  const [correct, setCorrect]     = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hint, setHint]           = useState("");
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => { setQuestions(getQuestions(age, level)); }, [age, level]);

  const totalQ = questions.length;
  const levelBadge: Record<Level, string> = { easy: "🌱 Easy", medium: "⭐ Medium", advanced: "🔥 Advanced" };

  const speak = (text: string, lang = "es-ES") => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const handleAnswer = useCallback(async (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    const q = questions[current];
    const isCorrect = choice === q.answer;

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setHint("✅ ¡Muy bien! Excellent! 🌟");
      // Speak the Spanish answer aloud
      const spanishWord = q.type === "translate-to-spanish" ? q.answer : q.question;
      setTimeout(() => speak(spanishWord), 300);
    } else {
      setLoadingHint(true);
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childAge: age,
            module: "SPANISH",
            context: `Spanish question: "${q.question}". Correct answer: "${q.answer}". Child answered: "${choice}".`,
            question: `I thought the answer was "${choice}" but it's "${q.answer}". Can you give me a simple memory trick to remember this Spanish word or phrase?`,
          }),
        });
        const data = await res.json();
        setHint(data.response ?? `The answer is "${q.answer}". ¡Tú puedes! (You can do it!) 💪`);
      } catch {
        setHint(`The answer is "${q.answer}". Keep practising! 💪`);
      } finally {
        setLoadingHint(false);
      }
    }

    setTimeout(() => {
      setSelected(null); setHint("");
      if (current + 1 >= totalQ) {
        setShowResult(true);
        const score = Math.round(((isCorrect ? correct + 1 : correct) / totalQ) * 100);
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, module: "SPANISH", score, timeTaken: 90 }),
        }).catch(console.error);
      } else {
        setCurrent((c) => c + 1);
      }
    }, isCorrect ? 1800 : 3200);
  }, [selected, questions, current, correct, age, childId, totalQ]);

  if (!questions.length) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-5xl animate-bounce-slow">🇪🇸</div>
    </div>
  );

  if (showResult) {
    const score = Math.round((correct / totalQ) * 100);
    const stars = score === 100 ? 3 : score >= 80 ? 2 : 1;
    return (
      <div className="text-center py-10">
        <div className="text-7xl mb-4">{score >= 80 ? "🏆" : score >= 60 ? "🇪🇸" : "💪"}</div>
        <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-1">
          {score >= 80 ? "¡Fantástico!" : score >= 60 ? "¡Bien hecho!" : "¡Sigue intentando!"}
        </h2>
        <p className="text-gray-500 mb-1">{score >= 80 ? "Fantastic!" : score >= 60 ? "Well done!" : "Keep trying!"}</p>
        <p className="text-xl text-gray-500 mb-4">{correct} out of {totalQ} correct</p>
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-4xl ${i < stars ? "opacity-100" : "opacity-20"}`}>⭐</span>
          ))}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">Back to Home</button>
          <button onClick={() => { setQuestions(getQuestions(age, level)); setCurrent(0); setCorrect(0); setShowResult(false); }} className="btn-primary">
            Play Again 🇪🇸
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = (current / totalQ) * 100;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
          {levelBadge[level]}
        </span>
        <span className="text-sm font-semibold text-gray-500">{correct} correct ⭐</span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
          <span>Question {current + 1} of {totalQ}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #EF4444, #F97316)" }}
            role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl shadow-card p-8 text-center mb-6 border border-red-100">
        <div className="text-5xl mb-4">{q.emoji}</div>
        <p className="font-fredoka text-2xl md:text-3xl font-bold text-gray-800 leading-snug mb-3">{q.question}</p>
        {q.tip && <p className="text-sm text-gray-400 italic">{q.tip}</p>}
        {/* Speak button for Spanish answers */}
        <button
          onClick={() => speak(q.answer)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
          aria-label="Hear the answer in Spanish"
        >
          🔊 Hear it in Spanish
        </button>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 gap-3 mb-6" role="group" aria-label="Answer choices">
        {q.choices.map((choice) => {
          let style = "bg-white border-2 border-gray-200 text-gray-800 hover:border-red-400 hover:bg-red-50 text-left";
          if (selected !== null) {
            if (choice === q.answer) style = "bg-green-500 border-green-500 text-white text-left";
            else if (choice === selected) style = "bg-red-400 border-red-400 text-white text-left";
            else style = "bg-white border-2 border-gray-100 text-gray-400 opacity-60 text-left";
          }
          return (
            <button key={choice} onClick={() => handleAnswer(choice)} disabled={selected !== null}
              className={`${style} rounded-2xl px-6 py-4 font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300`}
              aria-label={`Answer: ${choice}`}>
              {choice}
            </button>
          );
        })}
      </div>

      {(hint || loadingHint) && (
        <div className={`rounded-2xl p-4 text-center font-semibold text-base ${hint.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}
          role="status" aria-live="polite">
          {loadingHint ? "🤔 Getting a memory trick…" : hint}
        </div>
      )}
    </div>
  );
}
