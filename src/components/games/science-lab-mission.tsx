"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ScienceMission {
  scientist: string;
  scientistEmoji: string;
  scientistColor: string;
  lab: string;
  labEmoji: string;
  story: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  successLine: string;
  funFact: string;
}

interface Props { age: number; childId: string; }

// ── Mission banks ─────────────────────────────────────────────────────────────

const easyMissions: ScienceMission[] = [
  {
    scientist: "Professor Oak",
    scientistEmoji: "🌿",
    scientistColor: "#2E7D32",
    lab: "The Plant Lab",
    labEmoji: "🌱",
    story: "Professor Oak spilled a mystery liquid on his plants! He needs to remember what plants need to survive or they'll wilt before we can escape!",
    question: "Which of these do plants NOT need to grow?",
    options: ["Sunlight", "Water", "Rocks", "Soil"],
    correctIndex: 2,
    successLine: "The plants shot up through the ceiling — our escape route is open! 🌿",
    funFact: "Plants use sunlight, water, and soil nutrients to make their own food through photosynthesis!",
  },
  {
    scientist: "Doc Brown",
    scientistEmoji: "⚡",
    scientistColor: "#F57F17",
    lab: "The Weather Chamber",
    labEmoji: "🌦️",
    story: "Doc Brown's weather machine is stuck! It only opens when someone correctly identifies rain clouds. Quick, choose before the pressure builds!",
    question: "What type of cloud brings heavy rain?",
    options: ["Cirrus", "Cumulus", "Stratus", "Cumulonimbus"],
    correctIndex: 3,
    successLine: "The rain doors blasted open — we're free from the storm lab! ⛈️",
    funFact: "Cumulonimbus clouds are giant storm clouds that can grow up to 12 miles tall!",
  },
  {
    scientist: "Einstein",
    scientistEmoji: "💡",
    scientistColor: "#6A1B9A",
    lab: "The Animal Lab",
    labEmoji: "🐾",
    story: "Einstein mixed up all the animal cards! The door unlocks only when you find the animal that lays eggs. Solve it fast!",
    question: "Which animal lays eggs?",
    options: ["Dog", "Cow", "Duck", "Cat"],
    correctIndex: 2,
    successLine: "The egg vault cracked open and revealed the exit! 🥚",
    funFact: "Ducks lay eggs and are birds — birds are actually the closest living relatives of dinosaurs!",
  },
  {
    scientist: "Marie Curie",
    scientistEmoji: "🔬",
    scientistColor: "#AD1457",
    lab: "The Senses Lab",
    labEmoji: "👁️",
    story: "Marie Curie's experiment mixed up the five senses! The escape hatch opens only when you identify the correct sense for seeing. Hurry!",
    question: "Which body part do we use to see?",
    options: ["Ears", "Nose", "Eyes", "Tongue"],
    correctIndex: 2,
    successLine: "The vision scanner confirmed your answer — the lab door swings open! 👀",
    funFact: "Your eyes can detect over 10 million different colors and process images faster than any camera!",
  },
  {
    scientist: "Newton",
    scientistEmoji: "🍎",
    scientistColor: "#BF360C",
    lab: "The Sky Lab",
    labEmoji: "☀️",
    story: "Newton's sky observation device is jammed! It resets only when someone correctly names the star closest to Earth. Answer quickly!",
    question: "Which star is closest to Earth?",
    options: ["Sirius", "The Sun", "Polaris", "Betelgeuse"],
    correctIndex: 1,
    successLine: "The solar panel recharged and blew the escape hatch wide open! ☀️",
    funFact: "The Sun is about 93 million miles away, but its light still reaches Earth in just 8 minutes!",
  },
];

const mediumMissions: ScienceMission[] = [
  {
    scientist: "Professor Oak",
    scientistEmoji: "🌿",
    scientistColor: "#2E7D32",
    lab: "The Matter Lab",
    labEmoji: "🧊",
    story: "Professor Oak accidentally froze the exit lock! The control panel needs the correct state of matter typed in to melt the ice. Choose wisely!",
    question: "What state of matter is ice?",
    options: ["Gas", "Liquid", "Solid", "Plasma"],
    correctIndex: 2,
    successLine: "The thermal laser melted the lock — the door is open! 🔥",
    funFact: "Water is one of the few substances on Earth that expands when it freezes — that's why ice floats!",
  },
  {
    scientist: "Doc Brown",
    scientistEmoji: "⚡",
    scientistColor: "#F57F17",
    lab: "The Food Chain Lab",
    labEmoji: "🌿",
    story: "Doc Brown's food chain model exploded and the animals need sorting! The blast door only unlocks when the correct prey is identified. Think fast!",
    question: "In a food chain: grass → rabbit → fox. What does the fox eat?",
    options: ["Grass", "Berries", "Rabbit", "Leaves"],
    correctIndex: 2,
    successLine: "The food chain restored — the lab's power grid rebooted and the door opened! 🦊",
    funFact: "Foxes are omnivores and will eat rabbits, berries, and even insects depending on what's available!",
  },
  {
    scientist: "Einstein",
    scientistEmoji: "💡",
    scientistColor: "#6A1B9A",
    lab: "The Body Lab",
    labEmoji: "❤️",
    story: "Einstein's anatomy model scrambled the organ labels! The lab door only releases when the heart is correctly described. You've got this!",
    question: "What is the main job of the heart?",
    options: ["Digest food", "Filter air", "Pump blood", "Store energy"],
    correctIndex: 2,
    successLine: "Your answer powered up the bio-scanner and the exit door burst open! 💓",
    funFact: "Your heart beats about 100,000 times every single day — that's over 2.5 billion times in a lifetime!",
  },
  {
    scientist: "Marie Curie",
    scientistEmoji: "🔬",
    scientistColor: "#AD1457",
    lab: "The Weather Lab",
    labEmoji: "🌡️",
    story: "Marie Curie's weather experiment went haywire! The temperature gauge is broken and only the right answer about water will reset it. Pick correctly!",
    question: "At what temperature does water boil (in Celsius)?",
    options: ["50°C", "75°C", "100°C", "150°C"],
    correctIndex: 2,
    successLine: "Steam pressure reset the gauge and blew the escape hatch open! ♨️",
    funFact: "Water boils at 100°C at sea level, but on top of Mount Everest it boils at just 70°C because of lower air pressure!",
  },
  {
    scientist: "Newton",
    scientistEmoji: "🍎",
    scientistColor: "#BF360C",
    lab: "The Habitat Lab",
    labEmoji: "🌊",
    story: "Newton's habitat sorter went haywire! Animals got mixed up and the lab is in chaos. Match the correct animal to water habitat to restore order!",
    question: "Which animal lives in the ocean?",
    options: ["Elephant", "Eagle", "Dolphin", "Cheetah"],
    correctIndex: 2,
    successLine: "The habitat sorter whirred back to life and the door creaked open! 🐬",
    funFact: "Dolphins breathe air just like humans and must surface every few minutes — they're mammals, not fish!",
  },
];

const hardMissions: ScienceMission[] = [
  {
    scientist: "Professor Oak",
    scientistEmoji: "🌿",
    scientistColor: "#2E7D32",
    lab: "The Force Lab",
    labEmoji: "⚖️",
    story: "Professor Oak's gravity experiment launched everything into the air! The magnetic lock needs the correct force answer to pull the door back down. Solve it!",
    question: "What force pulls objects toward Earth?",
    options: ["Magnetism", "Friction", "Gravity", "Tension"],
    correctIndex: 2,
    successLine: "The gravity anchor slammed down and the door sprung open! 🌍",
    funFact: "Gravity is so strong that it keeps the Moon orbiting Earth and Earth orbiting the Sun — it reaches across space!",
  },
  {
    scientist: "Doc Brown",
    scientistEmoji: "⚡",
    scientistColor: "#F57F17",
    lab: "The Electricity Lab",
    labEmoji: "⚡",
    story: "Doc Brown's generator overloaded! The circuit breaker only resets when someone identifies the correct component. Pick the right part to restore power!",
    question: "What does a circuit need to allow electricity to flow?",
    options: ["A break in the wire", "A complete loop", "A plastic block", "An air gap"],
    correctIndex: 1,
    successLine: "The circuit completed — lights blazed on and the escape door slid open! ⚡",
    funFact: "Electricity travels through wires at nearly the speed of light — about 186,000 miles per second!",
  },
  {
    scientist: "Einstein",
    scientistEmoji: "💡",
    scientistColor: "#6A1B9A",
    lab: "The Planetary Lab",
    labEmoji: "🪐",
    story: "Einstein's solar system model collapsed and the planets are floating everywhere! The lab door unlocks when you correctly name the largest planet. Think big!",
    question: "Which is the largest planet in our solar system?",
    options: ["Saturn", "Earth", "Neptune", "Jupiter"],
    correctIndex: 3,
    successLine: "The planetary aligner locked on Jupiter and the escape pod launched! 🪐",
    funFact: "Jupiter is so huge that over 1,300 Earths could fit inside it — its Great Red Spot is a storm bigger than Earth!",
  },
  {
    scientist: "Marie Curie",
    scientistEmoji: "🔬",
    scientistColor: "#AD1457",
    lab: "The Life Cycle Lab",
    labEmoji: "🦋",
    story: "Marie Curie's butterfly tank malfunctioned and the lifecycle stages got mixed up! Sort out the correct next stage to unlock the greenhouse exit. Hurry!",
    question: "What stage comes AFTER a caterpillar in a butterfly's life cycle?",
    options: ["Egg", "Adult butterfly", "Chrysalis", "Larva"],
    correctIndex: 2,
    successLine: "The greenhouse doors burst open as the butterfly emerged — you're free! 🦋",
    funFact: "Inside a chrysalis, a caterpillar basically dissolves into a soup of cells before reorganizing into a butterfly!",
  },
  {
    scientist: "Newton",
    scientistEmoji: "🍎",
    scientistColor: "#BF360C",
    lab: "The Motion Lab",
    labEmoji: "🎯",
    story: "Newton's motion detector locked the escape door! It measures force and only resets when the correct law of motion is identified. You've studied this — go!",
    question: "Which best describes Newton's First Law of Motion?",
    options: [
      "Every action has a reaction",
      "Force equals mass times acceleration",
      "Objects stay still or moving unless a force acts",
      "Gravity pulls all objects equally",
    ],
    correctIndex: 2,
    successLine: "The motion detector registered your answer and the lab exit shot open! 🚀",
    funFact: "Newton's First Law is also called the Law of Inertia — it explains why you feel pushed back in your seat when a car accelerates!",
  },
];

function buildMissions(age: number): ScienceMission[] {
  const bank = age <= 6 ? easyMissions : age <= 8 ? mediumMissions : hardMissions;
  // Shuffle using index swap (no Set spreading)
  const copy = bank.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy.slice(0, 5);
}

// ── Lab Scene Background ───────────────────────────────────────────────────────

function LabScene({ labEmoji }: { labEmoji: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      {/* Purple-green gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg,#1a0033 0%,#2d0060 30%,#003320 70%,#001a0d 100%)",
        }}
      />

      {/* Stars scattered */}
      {[
        { top: "8%", left: "12%" },
        { top: "15%", left: "60%" },
        { top: "5%", left: "80%" },
        { top: "22%", left: "35%" },
        { top: "10%", left: "50%" },
        { top: "18%", left: "90%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute text-yellow-200 opacity-80"
          style={{ top: pos.top, left: pos.left, fontSize: i % 2 === 0 ? 10 : 14 }}
        >
          ✦
        </div>
      ))}

      {/* Lightning bolts */}
      <div
        className="absolute text-yellow-400 opacity-70 text-2xl"
        style={{ top: "12%", right: "10%" }}
      >
        ⚡
      </div>
      <div
        className="absolute text-yellow-300 opacity-50 text-lg"
        style={{ top: "28%", left: "6%" }}
      >
        ⚡
      </div>

      {/* Bubbling flasks */}
      <div className="absolute bottom-16 left-4 flex flex-col items-center gap-0">
        <div className="flex gap-1 mb-0.5">
          {["#00ff88", "#ff00ff", "#00ffff"].map((color, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full opacity-80"
              style={{ background: color }}
            />
          ))}
        </div>
        <div
          className="w-8 h-10 rounded-b-lg border-2"
          style={{
            background:
              "linear-gradient(180deg,rgba(0,255,136,0.4) 0%,rgba(0,200,100,0.7) 100%)",
            borderColor: "#00ff88",
          }}
        />
        <div className="w-4 h-4 rounded-b-sm" style={{ background: "#006630", borderTop: "none" }} />
      </div>

      <div className="absolute bottom-16 left-16 flex flex-col items-center">
        <div className="flex gap-1 mb-0.5">
          {["#ff44ff", "#cc00cc"].map((color, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full opacity-75"
              style={{ background: color }}
            />
          ))}
        </div>
        <div
          className="w-7 h-12 rounded-b-lg border-2"
          style={{
            background:
              "linear-gradient(180deg,rgba(255,68,255,0.35) 0%,rgba(180,0,180,0.65) 100%)",
            borderColor: "#ff44ff",
          }}
        />
        <div className="w-3 h-3 rounded-b-sm" style={{ background: "#5a0060" }} />
      </div>

      {/* Glow orbs */}
      <div
        className="absolute rounded-full opacity-20"
        style={{
          width: 80,
          height: 80,
          background: "radial-gradient(circle,#00ff88,transparent)",
          bottom: "30%",
          right: "8%",
        }}
      />
      <div
        className="absolute rounded-full opacity-15"
        style={{
          width: 60,
          height: 60,
          background: "radial-gradient(circle,#aa00ff,transparent)",
          top: "20%",
          left: "20%",
        }}
      />

      {/* Lab emoji badge */}
      <div className="absolute bottom-16 right-6 text-5xl">{labEmoji}</div>

      {/* Danger strip at top */}
      <div className="absolute top-0 left-0 right-0 h-2 flex overflow-hidden rounded-t-[20px]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{ background: i % 2 === 0 ? "#FFD700" : "#1a1a1a" }}
          />
        ))}
      </div>

      {/* Ground / lab floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background:
            "linear-gradient(180deg,#1a1a2e 0%,#0d0d1a 100%)",
          borderTop: "2px solid #333366",
        }}
      />
    </div>
  );
}

// ── Completion Screen ─────────────────────────────────────────────────────────

function CompletionScreen({
  score,
  total,
  onRetry,
  onBack,
}: {
  score: number;
  total: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const stars = score >= total * 0.9 ? 3 : score >= total * 0.6 ? 2 : 1;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="max-w-md mx-auto text-center py-8 px-4">
      <div className="text-6xl mb-2 animate-bounce">🔬</div>
      <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">
        Lab Escaped! 🎉
      </h2>
      <p className="text-gray-500 mb-4">You helped the scientists save the day!</p>

      {/* Stars */}
      <div className="flex justify-center gap-2 text-5xl mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>
            ⭐
          </span>
        ))}
      </div>

      {/* Badge */}
      <div
        className="rounded-[20px] p-5 mb-4"
        style={{
          background: "linear-gradient(135deg,#f3e5f5,#e1bee7)",
          border: "3px solid #8E24AA",
          boxShadow: "0 5px 0 #8E24AA60",
        }}
      >
        <div className="text-4xl mb-1">🏅</div>
        <p
          className="font-baloo text-xl font-extrabold"
          style={{ color: "#6A1B9A" }}
        >
          Junior Scientist Badge Earned!
        </p>
        <p className="text-purple-600 text-sm font-medium mt-1">
          {score}/{total} experiments solved — {pct}% success rate
        </p>
      </div>

      {/* Score bar */}
      <div
        className="rounded-[16px] p-4 mb-6"
        style={{
          background: "linear-gradient(135deg,#e8f5e9,#c8e6c9)",
          border: "3px solid #43A047",
          boxShadow: "0 4px 0 #43A04760",
        }}
      >
        <p className="font-baloo text-3xl font-extrabold text-green-800">
          {score}/{total} correct!
        </p>
        <div className="flex justify-center gap-0.5 mt-2 flex-wrap">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-3 rounded-full"
              style={{ background: i < score ? "#8E24AA" : "#B0BEC5" }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onBack} className="btn-secondary px-6">
          Back to Hub
        </button>
        <button
          onClick={onRetry}
          className="btn-primary px-6"
          style={{ background: "#8E24AA", boxShadow: "0 4px 0 #6A1B9A" }}
        >
          New Mission! 🧪
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ScienceLabMission({ age, childId }: Props) {
  const router = useRouter();
  const [missions, setMissions] = useState<ScienceMission[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"story" | "question" | "result">("story");
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    setMissions(buildMissions(age));
  }, [age]);

  if (!missions.length) return null;

  const mission = missions[idx];
  const TOTAL = missions.length;
  const isCorrect = selected === mission.correctIndex;

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === mission.correctIndex) setScore((s) => s + 1);
    setPhase("result");
  };

  const next = () => {
    if (idx + 1 >= TOTAL) {
      const finalScore = isCorrect ? score : score; // already updated via setState
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          module: "SCIENCE",
          score: Math.round((score / TOTAL) * 100),
          timeTaken: 120,
        }),
      }).catch(console.error);
      setShowComplete(true);
    } else {
      setIdx((i) => i + 1);
      setPhase("story");
      setSelected(null);
    }
  };

  const retry = () => {
    setMissions(buildMissions(age));
    setIdx(0);
    setScore(0);
    setPhase("story");
    setSelected(null);
    setShowComplete(false);
  };

  if (showComplete) {
    return (
      <CompletionScreen
        score={score}
        total={TOTAL}
        onRetry={retry}
        onBack={() => router.push("/dashboard")}
      />
    );
  }

  // ── Story Phase ──────────────────────────────────────────────────────────────
  if (phase === "story") {
    return (
      <div className="max-w-md mx-auto px-2">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full transition-all"
                style={{
                  width: 32,
                  background:
                    i < idx
                      ? "#8E24AA"
                      : i === idx
                      ? "#CE93D8"
                      : "#E1BEE7",
                }}
              />
            ))}
          </div>
          <span className="text-xs font-bold" style={{ color: "#6A1B9A" }}>
            Mission {idx + 1}/{TOTAL}
          </span>
        </div>

        {/* Lab Scene */}
        <div
          className="relative rounded-[24px] overflow-hidden mb-4"
          style={{ minHeight: 210 }}
        >
          <LabScene labEmoji={mission.labEmoji} />
          <div className="relative z-10 p-5 pb-24">
            {/* Scientist badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 font-bold text-white text-sm shadow-lg"
              style={{ background: mission.scientistColor }}
            >
              {mission.scientistEmoji} {mission.scientist} needs your help!
            </div>
            {/* Story bubble */}
            <div
              className="bg-white rounded-[16px] p-4 shadow-xl max-w-xs"
              style={{ border: `3px solid ${mission.scientistColor}` }}
            >
              <p className="font-bold text-gray-700 text-sm leading-relaxed">
                {mission.story}
              </p>
            </div>
          </div>
        </div>

        {/* Mission card */}
        <div
          className="rounded-[16px] p-4 mb-5"
          style={{
            background: "linear-gradient(135deg,#f3e5f5,#ede7f6)",
            border: "3px solid #9C27B0",
            boxShadow: "0 4px 0 #9C27B040",
          }}
        >
          <p className="font-baloo text-base font-extrabold" style={{ color: "#6A1B9A" }}>
            🧪 Solve the experiment:
          </p>
          <p className="font-bold text-sm mt-1" style={{ color: "#7B1FA2" }}>
            {mission.question}
          </p>
        </div>

        <button
          onClick={() => setPhase("question")}
          className="btn-primary w-full text-lg rounded-full"
          style={{
            background: mission.scientistColor,
            boxShadow: `0 5px 0 ${mission.scientistColor}99`,
          }}
        >
          Start Experiment! ⚗️
        </button>
      </div>
    );
  }

  // ── Question Phase ───────────────────────────────────────────────────────────
  if (phase === "question") {
    return (
      <div className="max-w-md mx-auto px-2">
        {/* Question banner */}
        <div
          className="rounded-[16px] px-4 py-4 mb-5 flex items-start gap-3"
          style={{
            background: mission.scientistColor + "18",
            border: `2px solid ${mission.scientistColor}50`,
          }}
        >
          <span className="text-3xl mt-0.5">{mission.scientistEmoji}</span>
          <div>
            <p className="font-bold text-xs text-gray-400 uppercase tracking-wide mb-1">
              {mission.scientist} asks:
            </p>
            <p className="font-bold text-sm text-gray-800 leading-snug">
              {mission.question}
            </p>
          </div>
        </div>

        {/* 2×2 option grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {mission.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="rounded-[14px] py-5 px-3 font-baloo font-extrabold text-base transition-all hover:-translate-y-1 hover:shadow-lg text-white text-center leading-tight"
              style={{
                background:
                  "linear-gradient(135deg,#4A148C,#7B1FA2)",
                border: "3px solid #CE93D8",
                boxShadow: "0 5px 0 #4A148C",
              }}
            >
              <span className="block text-2xl mb-1">
                {["🅰️", "🅱️", "🇨", "🇩"][i]}
              </span>
              {opt}
            </button>
          ))}
        </div>

        <div className="text-center text-xs text-gray-400 font-medium">
          Pick the correct answer to help the scientist escape! 🔬
        </div>
      </div>
    );
  }

  // ── Result Phase ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto px-2">
      {/* Result scene */}
      <div
        className="relative rounded-[24px] overflow-hidden mb-4"
        style={{ minHeight: 210 }}
      >
        <LabScene labEmoji={mission.labEmoji} />
        <div
          className="relative z-10 p-5 flex flex-col items-center justify-center"
          style={{ minHeight: 210 }}
        >
          {isCorrect ? (
            <div
              className="bg-white rounded-[16px] p-5 shadow-xl text-center max-w-xs"
              style={{ border: `3px solid ${mission.scientistColor}` }}
            >
              <div className="text-5xl mb-2 animate-bounce">
                {mission.scientistEmoji}
              </div>
              <p
                className="font-baloo text-xl font-extrabold mb-1"
                style={{ color: mission.scientistColor }}
              >
                Brilliant! ✅
              </p>
              <p className="text-gray-600 text-sm font-medium leading-snug">
                {mission.successLine}
              </p>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="text-xl">
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="bg-white rounded-[16px] p-5 shadow-xl text-center max-w-xs"
              style={{ border: "3px solid #E53935" }}
            >
              <div className="text-5xl mb-2">💥</div>
              <p className="font-baloo text-lg font-extrabold text-red-600 mb-1">
                Experiment failed! Almost!
              </p>
              <p className="text-gray-500 text-sm">
                The answer was:{" "}
                <strong className="text-red-600">
                  {mission.options[mission.correctIndex]}
                </strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Answer reveal grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {mission.options.map((opt, i) => {
          const isRight = i === mission.correctIndex;
          const wasPicked = i === selected;
          const showGreen = isRight;
          const showRed = wasPicked && !isRight;
          return (
            <div
              key={i}
              className="rounded-[12px] py-3 px-3 text-center font-bold text-sm"
              style={{
                background: showGreen
                  ? "#E8F5E9"
                  : showRed
                  ? "#FFEBEE"
                  : "#F5F5F5",
                border: showGreen
                  ? "2px solid #43A047"
                  : showRed
                  ? "2px solid #E53935"
                  : "2px solid #E0E0E0",
                color: showGreen
                  ? "#1B5E20"
                  : showRed
                  ? "#B71C1C"
                  : "#757575",
              }}
            >
              {showGreen ? "✅ " : showRed ? "❌ " : ""}
              {opt}
            </div>
          );
        })}
      </div>

      {/* Fun fact */}
      {isCorrect && (
        <div
          className="rounded-[16px] p-4 mb-4 flex items-start gap-3"
          style={{
            background: "linear-gradient(135deg,#FFF8E1,#FFF3CD)",
            border: "2px solid #FFA000",
          }}
        >
          <span className="text-2xl">🌟</span>
          <div>
            <p className="font-bold text-xs text-amber-700 uppercase tracking-wide mb-0.5">
              Fun Science Fact!
            </p>
            <p className="text-amber-900 text-sm font-medium leading-snug">
              {mission.funFact}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={next}
        className="btn-primary w-full text-lg rounded-full"
        style={{
          background: mission.scientistColor,
          boxShadow: `0 5px 0 ${mission.scientistColor}90`,
        }}
      >
        {idx + 1 >= TOTAL ? "See Results! 🏆" : "Next Experiment! →"}
      </button>
    </div>
  );
}
