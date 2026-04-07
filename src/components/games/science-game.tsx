"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Level } from "./level-picker";

interface ScienceQuestion {
  question: string;
  answer: string;
  choices: string[];
  fact: string; // fun fact shown after answering
}

// Age 5-6: Nature & everyday science
const Q5: ScienceQuestion[] = [
  { question: "What colour is the sky on a sunny day?", answer: "Blue", choices: ["Blue", "Green", "Red", "Purple"], fact: "The sky looks blue because sunlight bounces off tiny air particles!" },
  { question: "What do plants need to grow?", answer: "Sunlight, water, and soil", choices: ["Sunlight, water, and soil", "Ice and darkness", "Sand and air only", "Rocks and salt"], fact: "Plants use sunlight to make their own food — they're like little solar panels!" },
  { question: "Which animal lays eggs?", answer: "Chicken", choices: ["Chicken", "Dog", "Cat", "Rabbit"], fact: "Almost all birds lay eggs! Dinosaurs did too, millions of years ago." },
  { question: "What falls from clouds when it rains?", answer: "Water", choices: ["Water", "Juice", "Sand", "Snow always"], fact: "Rain is water that evaporated from oceans and lakes, then fell back down!" },
  { question: "What do caterpillars turn into?", answer: "Butterflies or moths", choices: ["Butterflies or moths", "Spiders", "Bees", "Grasshoppers"], fact: "Inside the cocoon, the caterpillar's body completely transforms — it's like magic!" },
  { question: "How many legs does a spider have?", answer: "8", choices: ["8", "6", "4", "10"], fact: "Insects have 6 legs, but spiders are arachnids — they always have 8!" },
  { question: "What is ice made of?", answer: "Frozen water", choices: ["Frozen water", "Frozen milk", "Frozen air", "Frozen salt"], fact: "Water turns to ice at 0°C. It expands when it freezes — that's why pipes burst in winter!" },
  { question: "What do bees collect from flowers?", answer: "Nectar", choices: ["Nectar", "Leaves", "Soil", "Seeds"], fact: "Bees turn nectar into honey by adding enzymes and drying it out in the hive!" },
  { question: "Which is the closest star to Earth?", answer: "The Sun", choices: ["The Sun", "The Moon", "Mars", "Jupiter"], fact: "The Sun is 150 million kilometres away — but it's still the closest star to us!" },
  { question: "What covers most of the Earth's surface?", answer: "Water (oceans)", choices: ["Water (oceans)", "Land", "Ice", "Desert"], fact: "About 71% of Earth's surface is covered by water!" },
];

// Age 7-8: Basic concepts — gravity, planets, living things
const Q8: ScienceQuestion[] = [
  { question: "What force pulls things towards the ground?", answer: "Gravity", choices: ["Gravity", "Magnetism", "Friction", "Electricity"], fact: "Gravity is what keeps the Moon orbiting Earth and Earth orbiting the Sun!" },
  { question: "How many planets are in our solar system?", answer: "8", choices: ["8", "9", "7", "10"], fact: "Pluto was reclassified as a 'dwarf planet' in 2006 — so we went from 9 to 8!" },
  { question: "What gas do humans breathe in to survive?", answer: "Oxygen", choices: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], fact: "About 21% of the air is oxygen. We breathe out mostly carbon dioxide!" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter", choices: ["Jupiter", "Saturn", "Earth", "Neptune"], fact: "Jupiter is so big you could fit all the other planets inside it!" },
  { question: "What do we call animals that eat only plants?", answer: "Herbivores", choices: ["Herbivores", "Carnivores", "Omnivores", "Predators"], fact: "Cows, horses, and rabbits are herbivores. Humans are omnivores — we eat both!" },
  { question: "What is the boiling point of water in Celsius?", answer: "100°C", choices: ["100°C", "0°C", "50°C", "200°C"], fact: "Water boils at 100°C at sea level. On a mountain, it boils at a lower temperature!" },
  { question: "Which organ pumps blood around your body?", answer: "The heart", choices: ["The heart", "The lungs", "The brain", "The liver"], fact: "Your heart beats about 100,000 times every single day!" },
  { question: "What are the three states of matter?", answer: "Solid, liquid, gas", choices: ["Solid, liquid, gas", "Hot, warm, cold", "Hard, soft, fluffy", "Water, steam, ice"], fact: "Matter can change between states — water is liquid, ice is solid, steam is gas!" },
  { question: "What is the closest planet to the Sun?", answer: "Mercury", choices: ["Mercury", "Venus", "Mars", "Earth"], fact: "Mercury is so close to the Sun that a year there is only 88 Earth days long!" },
  { question: "What do we call the bones that protect your brain?", answer: "The skull", choices: ["The skull", "The spine", "The ribcage", "The femur"], fact: "The skull is made of 22 bones fused together to form a strong protective shell!" },
];

// Age 9-10: Deeper concepts — photosynthesis, ecosystems, forces, cells
const Q10: ScienceQuestion[] = [
  { question: "What process do plants use to make food from sunlight?", answer: "Photosynthesis", choices: ["Photosynthesis", "Respiration", "Digestion", "Evaporation"], fact: "During photosynthesis, plants take in CO₂ and water, and release oxygen — thank you, plants!" },
  { question: "What is the powerhouse of the cell?", answer: "Mitochondria", choices: ["Mitochondria", "Nucleus", "Cell wall", "Ribosome"], fact: "Mitochondria convert food and oxygen into energy (ATP) that powers everything a cell does!" },
  { question: "What causes the seasons on Earth?", answer: "Earth's tilt on its axis", choices: ["Earth's tilt on its axis", "Earth's distance from the Sun", "The Moon's gravity", "Solar flares"], fact: "Earth is tilted at 23.5° — when your hemisphere tilts toward the Sun, it's summer!" },
  { question: "What is the speed of light (approximately)?", answer: "300,000 km/s", choices: ["300,000 km/s", "3,000 km/s", "30,000 km/s", "1,000 km/s"], fact: "Light travels so fast it could circle Earth 7.5 times in just one second!" },
  { question: "What is Newton's first law of motion about?", answer: "Objects stay still or keep moving unless a force acts on them", choices: ["Objects stay still or keep moving unless a force acts on them", "Force equals mass times acceleration", "Every action has an equal and opposite reaction", "Gravity pulls all objects equally"], fact: "This is called inertia! That's why you lurch forward when a bus brakes suddenly." },
  { question: "What is the water cycle?", answer: "Water evaporates, forms clouds, and falls as rain", choices: ["Water evaporates, forms clouds, and falls as rain", "Water freezes and melts in rivers", "Water is made by plants during photosynthesis", "Water comes from underground volcanoes"], fact: "The same water has been cycling around Earth for billions of years — you may have drunk water a dinosaur drank!" },
  { question: "What is DNA?", answer: "The molecule that carries genetic instructions", choices: ["The molecule that carries genetic instructions", "A type of protein", "A sugar that gives energy", "A gas in the atmosphere"], fact: "If you uncoiled all the DNA in one human cell, it would stretch about 2 metres long!" },
  { question: "What is an ecosystem?", answer: "A community of living things and their environment", choices: ["A community of living things and their environment", "A type of weather system", "A chemical reaction", "A type of rock formation"], fact: "Ecosystems range from tiny rock pools to vast rainforests — all are equally important!" },
  { question: "What is the function of red blood cells?", answer: "Carry oxygen around the body", choices: ["Carry oxygen around the body", "Fight infection", "Digest food", "Control body temperature"], fact: "A red blood cell travels around your entire body in about 20 seconds!" },
  { question: "What layer of the atmosphere blocks harmful UV rays?", answer: "The ozone layer", choices: ["The ozone layer", "The troposphere", "The stratosphere (lower part)", "The exosphere"], fact: "The ozone layer is mostly in the stratosphere, about 15–35 km above Earth's surface." },
];

function getQuestions(age: number, level: Level): ScienceQuestion[] {
  let pool: ScienceQuestion[];

  if (level === "easy" || age <= 6) pool = Q5;
  else if (level === "advanced" || age >= 10) pool = Q10;
  else pool = Q8;

  // Advanced bumps up for younger kids
  if (level === "advanced" && age < 9) pool = Q8;
  if (level === "easy" && age > 7) pool = Q5;

  // Shuffle and pick based on level
  const count = level === "easy" ? 5 : level === "medium" ? 7 : 10;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}

interface ScienceGameProps { age: number; childId: string; level?: Level; }

export function ScienceGame({ age, childId, level = "medium" }: ScienceGameProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<ScienceQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hint, setHint] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [showFact, setShowFact] = useState(false);

  useEffect(() => {
    setQuestions(getQuestions(age, level));
  }, [age, level]);

  const totalQ = questions.length;
  const levelBadge: Record<Level, string> = { easy: "🌱 Easy", medium: "⭐ Medium", advanced: "🔥 Advanced" };

  const handleAnswer = useCallback(async (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    const q = questions[current];
    const isCorrect = choice === q.answer;
    setShowFact(true);

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setHint("✅ Correct! Great science brain! 🔬");
    } else {
      setLoadingHint(true);
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childAge: age,
            module: "SCIENCE",
            context: `Question: "${q.question}". Correct answer: ${q.answer}. Child answered: ${choice}.`,
            question: `I thought the answer was "${choice}" but it's "${q.answer}". Can you explain why in a simple, fun way?`,
          }),
        });
        const data = await res.json();
        setHint(data.response ?? `The correct answer is: ${q.answer}. Don't worry — science takes practice! 💪`);
      } catch {
        setHint(`The correct answer is: ${q.answer}. Keep going — you're learning! 💪`);
      } finally {
        setLoadingHint(false);
      }
    }

    setTimeout(() => {
      setSelected(null);
      setHint("");
      setShowFact(false);
      if (current + 1 >= totalQ) {
        setShowResult(true);
        const score = Math.round(((isCorrect ? correct + 1 : correct) / totalQ) * 100);
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, module: "SCIENCE", score, timeTaken: 90 }),
        }).catch(console.error);
      } else {
        setCurrent((c) => c + 1);
      }
    }, isCorrect ? 2000 : 3500);
  }, [selected, questions, current, correct, age, childId, totalQ]);

  if (!questions.length) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-5xl animate-bounce-slow">🔬</div>
    </div>
  );

  if (showResult) {
    const score = Math.round((correct / totalQ) * 100);
    const stars = score === 100 ? 3 : score >= 80 ? 2 : 1;
    return (
      <div className="text-center py-10">
        <div className="text-7xl mb-4">{score >= 80 ? "🏆" : score >= 60 ? "🔬" : "💪"}</div>
        <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">
          {score >= 80 ? "Science Star!" : score >= 60 ? "Good Scientist!" : "Keep Exploring!"}
        </h2>
        <p className="text-xl text-gray-500 mb-4">{correct} out of {totalQ} correct</p>
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-4xl ${i < stars ? "opacity-100" : "opacity-20"}`}>⭐</span>
          ))}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">Back to Home</button>
          <button onClick={() => {
            setQuestions(getQuestions(age, level));
            setCurrent(0); setCorrect(0); setShowResult(false);
          }} className="btn-primary">Play Again 🔬</button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = (current / totalQ) * 100;

  return (
    <div className="max-w-lg mx-auto">
      {/* Level badge + score */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200">
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
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #14B8A6, #06B6D4)" }}
            role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-card p-8 text-center mb-6 border border-teal-100">
        <div className="text-5xl mb-4">🔬</div>
        <p className="font-fredoka text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
          {q.question}
        </p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 gap-3 mb-6" role="group" aria-label="Answer choices">
        {q.choices.map((choice) => {
          let style = "bg-white border-2 border-gray-200 text-gray-800 hover:border-teal-400 hover:bg-teal-50 text-left";
          if (selected !== null) {
            if (choice === q.answer) style = "bg-green-500 border-green-500 text-white text-left";
            else if (choice === selected) style = "bg-red-400 border-red-400 text-white text-left";
            else style = "bg-white border-2 border-gray-100 text-gray-400 opacity-60 text-left";
          }
          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={selected !== null}
              className={`${style} rounded-2xl px-6 py-4 font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300`}
              aria-label={`Answer: ${choice}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* Fun fact (shown after answering) */}
      {showFact && selected && (
        <div className="rounded-2xl p-4 mb-3 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium" role="status" aria-live="polite">
          💡 <strong>Fun fact:</strong> {q.fact}
        </div>
      )}

      {/* AI hint or correct feedback */}
      {(hint || loadingHint) && (
        <div className={`rounded-2xl p-4 text-center font-semibold text-base ${hint.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}
          role="status" aria-live="polite">
          {loadingHint ? "🤔 Getting an explanation…" : hint}
        </div>
      )}
    </div>
  );
}
