"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MovieMission {
  director: string;
  directorEmoji: string;
  directorColor: string;
  studio: string;
  studioEmoji: string;
  clue: string;
  question: string;
  options: string[];
  correctIndex: number;
  successLine: string;
}

interface Props { age: number; childId: string; }

// ── Mission banks ─────────────────────────────────────────────────────────────

function buildMissions(age: number): MovieMission[] {
  const easy = age <= 6;
  const hard  = age >= 9;

  const easyBank: MovieMission[] = [
    {
      director: "Director Leo",
      directorEmoji: "🦁",
      directorColor: "#F59E0B",
      studio: "Pride Rock Studios",
      studioEmoji: "🌅",
      clue: "A young lion prince must grow up and take his rightful place as king after his father dies. His wise father's spirit tells him to remember who he is.",
      question: "What is the name of the young lion who becomes king?",
      options: ["Simba", "Mufasa", "Pumba", "Timon"],
      correctIndex: 0,
      successLine: "Hakuna Matata! You nailed it, future director! 🦁",
    },
    {
      director: "Director Elsa",
      directorEmoji: "❄️",
      directorColor: "#60A5FA",
      studio: "Arendelle Films",
      studioEmoji: "🏔️",
      clue: "A queen with ice powers accidentally freezes her whole kingdom. Only her brave sister's love can break the spell and save everyone.",
      question: "What is the ice queen's name in this movie?",
      options: ["Anna", "Elsa", "Olaf", "Kristoff"],
      correctIndex: 1,
      successLine: "Let it go — you got it right! The kingdom is saved! ❄️",
    },
    {
      director: "Director Woody",
      directorEmoji: "🤠",
      directorColor: "#EF4444",
      studio: "Cowboy Toy Productions",
      studioEmoji: "🧸",
      clue: "A cowboy toy and a space ranger toy become friends after they get lost and must find their way back to the boy who loves them.",
      question: "What is the space ranger toy's name?",
      options: ["Rex", "Buzz Lightyear", "Hamm", "Slinky"],
      correctIndex: 1,
      successLine: "To infinity and beyond — what a great answer! 🚀",
    },
    {
      director: "Director Cindy",
      directorEmoji: "👗",
      directorColor: "#A78BFA",
      studio: "Fairy Tale Studios",
      studioEmoji: "🏰",
      clue: "A kind girl who is treated badly by her stepmother gets to go to a royal ball with help from her fairy godmother. She must leave before midnight!",
      question: "What does the girl leave behind at the ball?",
      options: ["Her crown", "Her glove", "Her glass slipper", "Her magic wand"],
      correctIndex: 2,
      successLine: "Bibbidi-Bobbidi-Boo — perfect answer, superstar! 👠",
    },
    {
      director: "Director Dumbo",
      directorEmoji: "🐘",
      directorColor: "#34D399",
      studio: "Big Top Pictures",
      studioEmoji: "🎪",
      clue: "A baby elephant with very big ears is laughed at by everyone. But those giant ears turn out to be his superpower — he can fly!",
      question: "How does this elephant fly?",
      options: ["With a magic hat", "With a jet pack", "With his big ears", "With fairy dust"],
      correctIndex: 2,
      successLine: "Ears up, wings out — you soared to the right answer! 🐘",
    },
  ];

  const mediumBank: MovieMission[] = [
    {
      director: "Director Nemo",
      directorEmoji: "🐠",
      directorColor: "#F97316",
      studio: "Deep Blue Cinema",
      studioEmoji: "🌊",
      clue: "An overprotective clownfish crosses the entire ocean to rescue his son who was taken by a scuba diver and placed in a dentist's fish tank.",
      question: "What lesson does this movie teach about parents?",
      options: [
        "Parents should never worry",
        "Love means letting go and trusting your child",
        "Fish should stay in the ocean always",
        "Dentists are always bad",
      ],
      correctIndex: 1,
      successLine: "Just keep swimming — and just keep learning! 🐠",
    },
    {
      director: "Director Moana",
      directorEmoji: "🌺",
      directorColor: "#10B981",
      studio: "Oceania Productions",
      studioEmoji: "⛵",
      clue: "A brave island girl chosen by the ocean itself must sail beyond the reef to restore the heart of a goddess and save her people from a creeping darkness.",
      question: "Who does Moana sail with to complete her quest?",
      options: ["Her father the chief", "Maui the demigod", "Her grandmother's spirit", "A talking dolphin"],
      correctIndex: 1,
      successLine: "You know who you are — and you know the right answer! 🌺",
    },
    {
      director: "Director Violet",
      directorEmoji: "🦸",
      directorColor: "#7C3AED",
      studio: "Supers Inc.",
      studioEmoji: "💥",
      clue: "A family of superheroes must hide their powers and pretend to be normal. But when a villain threatens the world, they must come together as a family to stop him.",
      question: "What is the theme of this movie about superheroes hiding who they are?",
      options: [
        "Powers are dangerous and should always be hidden",
        "Being yourself and using your gifts is important",
        "Villains always win in the end",
        "Families should never work together",
      ],
      correctIndex: 1,
      successLine: "Incredible answer! You're a true super-thinker! 💥",
    },
    {
      director: "Director Remy",
      directorEmoji: "🐀",
      directorColor: "#DC2626",
      studio: "Gourmet Mouse Films",
      studioEmoji: "🍽️",
      clue: "A rat with an extraordinary sense of taste dreams of becoming a chef in Paris's finest restaurant. He secretly controls a young chef by hiding under his hat.",
      question: "What big idea does the movie share about creativity?",
      options: [
        "Only animals can be great chefs",
        "Anyone, even a rat, can be great at something unexpected",
        "You must go to cooking school to cook well",
        "Paris is the only place with good food",
      ],
      correctIndex: 1,
      successLine: "Anyone can cook — and anyone can answer well! Magnifique! 🐀",
    },
    {
      director: "Director Mulan",
      directorEmoji: "⚔️",
      directorColor: "#BE185D",
      studio: "Imperial Dragon Studios",
      studioEmoji: "🐉",
      clue: "A young woman disguises herself as a male soldier to take her elderly father's place in the army. She proves herself a hero through cleverness, not strength.",
      question: "Why does Mulan disguise herself as a man?",
      options: [
        "She wants adventure and travel",
        "To protect her aging father from going to war",
        "She wants to steal the emperor's treasure",
        "Her family sends her away",
      ],
      correctIndex: 1,
      successLine: "A girl worth fighting for — and an answer worth celebrating! ⚔️",
    },
  ];

  const hardBank: MovieMission[] = [
    {
      director: "Director Carl",
      directorEmoji: "🎈",
      directorColor: "#EAB308",
      studio: "Paradise Falls Films",
      studioEmoji: "🏠",
      clue: "An old man ties thousands of balloons to his house and floats to South America to fulfil his late wife's dream. A young wilderness explorer accidentally comes along.",
      question: "What does Carl's adventure ultimately teach him?",
      options: [
        "Adventures are only for the young",
        "His house and past memories are more important than people",
        "The real adventure is the love and friendship he finds, not the destination",
        "South America is a dangerous place to visit",
      ],
      correctIndex: 2,
      successLine: "Adventure is out there — and so is a brilliant answer! 🎈",
    },
    {
      director: "Director Miguel",
      directorEmoji: "🎸",
      directorColor: "#F97316",
      studio: "Día de Muertos Cinema",
      studioEmoji: "💀",
      clue: "A boy who loves music is transported to the magical Land of the Dead on Día de Muertos and must get his great-great-grandfather's blessing before sunrise to return home.",
      question: "What keeps a person alive in the Land of the Dead in this film?",
      options: [
        "Singing their favourite song",
        "Being remembered by loved ones still living",
        "Finding buried treasure",
        "Eating special spirit food",
      ],
      correctIndex: 1,
      successLine: "Remember me — and remember that was a fantastic answer! 🎸",
    },
    {
      director: "Director Joy",
      directorEmoji: "😊",
      directorColor: "#FCD34D",
      studio: "Headquarters Pictures",
      studioEmoji: "🧠",
      clue: "The emotions inside an 11-year-old girl's mind — Joy, Sadness, Fear, Disgust, and Anger — go on a wild journey through memory and imagination when the girl moves to a new city.",
      question: "What does Joy eventually realise about Sadness in this film?",
      options: [
        "Sadness is useless and should be kept away",
        "Sadness helps people process difficult feelings and lets others know they need help",
        "Sadness is the most powerful emotion of all",
        "Sadness always ruins happy memories",
      ],
      correctIndex: 1,
      successLine: "Emotional genius alert — that answer made Core Memory! 😊",
    },
    {
      director: "Director Chihiro",
      directorEmoji: "🏮",
      directorColor: "#6D28D9",
      studio: "Spirit World Productions",
      studioEmoji: "🌸",
      clue: "A young girl's parents are turned into pigs after they eat food meant for spirits. She must work at a magical bathhouse for spirits to earn enough courage to rescue them.",
      question: "What quality does Chihiro show throughout the whole film?",
      options: [
        "Anger and stubbornness",
        "Bravery and hard work even when things are very scary",
        "Magical powers that defeat all enemies",
        "Cleverness at playing tricks on spirits",
      ],
      correctIndex: 1,
      successLine: "No face, no problem — that was a spirited correct answer! 🏮",
    },
    {
      director: "Director Coraline",
      directorEmoji: "🪡",
      directorColor: "#1D4ED8",
      studio: "Other World Films",
      studioEmoji: "🔵",
      clue: "A curious girl discovers a secret door in her new house that leads to a parallel world where everything seems perfect — but her 'other mother' wants to keep her there forever by sewing buttons over her eyes.",
      question: "What is the main message of this story?",
      options: [
        "Always explore secret doors when you find them",
        "Perfect-seeming things can hide real danger; real love is honest even when imperfect",
        "Buttons are very dangerous objects",
        "Parents who are too busy should be replaced",
      ],
      correctIndex: 1,
      successLine: "You saw right through the illusion — brilliant, brave thinking! 🪡",
    },
  ];

  const bank = easy ? easyBank : hard ? hardBank : mediumBank;
  // Shuffle without Set spreading
  const shuffled = bank.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

// ── Clapperboard scene ────────────────────────────────────────────────────────

function MovieScene({ studioEmoji }: { studioEmoji: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      {/* Dark cinema background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg,#0F0F1A 0%,#1A1033 50%,#0D1B2A 100%)" }}
      />
      {/* Spotlight cone */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "90px solid transparent",
          borderRight: "90px solid transparent",
          borderTop: "220px solid rgba(255,240,180,0.12)",
        }}
      />
      {/* Spotlight bright circle at top */}
      <div
        className="absolute"
        style={{
          top: -24,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(circle,#FFF9C4 0%,#FFE082 60%,transparent 100%)",
          boxShadow: "0 0 30px 20px rgba(255,240,150,0.25)",
        }}
      />
      {/* Stars scattered */}
      {[
        { top: "8%", left: "10%" },
        { top: "12%", left: "82%" },
        { top: "22%", left: "6%" },
        { top: "18%", left: "90%" },
        { top: "35%", left: "4%" },
        { top: "30%", left: "94%" },
        { top: "5%", left: "35%" },
        { top: "6%", left: "65%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute text-yellow-200 text-xs opacity-70"
          style={{ top: pos.top, left: pos.left }}
        >
          ★
        </div>
      ))}
      {/* Film reel left */}
      <div
        className="absolute bottom-20 left-4 text-4xl opacity-40"
        style={{ filter: "grayscale(30%)" }}
      >
        🎞️
      </div>
      {/* Popcorn right */}
      <div className="absolute bottom-20 right-4 text-4xl opacity-50">🍿</div>
      {/* Film strip bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 h-14 flex items-center overflow-hidden opacity-30">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex flex-col items-center"
            style={{ width: "7.14%" }}
          >
            <div
              className="w-2 h-2 rounded-sm mb-1"
              style={{ background: "#333", border: "1px solid #555" }}
            />
            <div className="w-full h-8" style={{ background: "#222", border: "1px solid #444" }} />
            <div
              className="w-2 h-2 rounded-sm mt-1"
              style={{ background: "#333", border: "1px solid #555" }}
            />
          </div>
        ))}
      </div>
      {/* Studio emoji badge */}
      <div className="absolute bottom-16 right-6 text-4xl">{studioEmoji}</div>
    </div>
  );
}

// ── Completion screen ─────────────────────────────────────────────────────────

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
  const label =
    stars === 3 ? "Oscar Winner!" : stars === 2 ? "Rising Star!" : "Debut Director!";

  return (
    <div className="max-w-md mx-auto text-center py-8 px-4">
      <div className="text-6xl mb-2 animate-bounce">🏆</div>
      <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">
        {label}
      </h2>
      <p className="text-gray-500 mb-4">The crowd gives you a standing ovation!</p>

      {/* Stars */}
      <div className="flex justify-center gap-2 text-5xl mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>
            ⭐
          </span>
        ))}
      </div>

      {/* Score card */}
      <div
        className="rounded-[20px] p-5 mb-6"
        style={{
          background: "linear-gradient(135deg,#1A1033,#2D1B69)",
          border: "3px solid #7C3AED",
          boxShadow: "0 5px 0 #4C1D9560",
        }}
      >
        <p className="font-baloo text-4xl font-extrabold text-yellow-300">
          {score}/{total} correct!
        </p>
        {/* Oscar trophy row */}
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className="text-2xl" style={{ opacity: i < score ? 1 : 0.2 }}>
              🏆
            </span>
          ))}
        </div>
        <p className="text-purple-300 font-bold text-sm mt-2">
          {score === total
            ? "Perfect score — you belong in Hollywood!"
            : score >= 3
            ? "Fantastic directing debut!"
            : "Every great director starts somewhere!"}
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onBack} className="btn-secondary px-6">
          Back to Hub
        </button>
        <button
          onClick={onRetry}
          className="btn-primary px-6"
          style={{ background: "#7C3AED", boxShadow: "0 4px 0 #5B21B6" }}
        >
          New Session! 🎬
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function MovieStudioMission({ age, childId }: Props) {
  const router = useRouter();
  const [missions, setMissions] = useState<MovieMission[]>([]);
  const [idx, setIdx]               = useState(0);
  const [phase, setPhase]           = useState<"clue" | "question" | "result">("clue");
  const [selected, setSelected]     = useState<number | null>(null);
  const [score, setScore]           = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    setMissions(buildMissions(age));
  }, [age]);

  if (!missions.length) return null;

  const mission = missions[idx];
  const TOTAL   = missions.length;
  const correct = selected === mission.correctIndex;

  const handleAnswer = (optionIdx: number) => {
    if (selected !== null) return;
    setSelected(optionIdx);
    if (optionIdx === mission.correctIndex) setScore((s) => s + 1);
    setPhase("result");
  };

  const next = () => {
    if (idx + 1 >= TOTAL) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          module: "MOVIES",
          score: Math.round((score / TOTAL) * 100),
          timeTaken: 90,
        }),
      }).catch(console.error);
      setShowComplete(true);
    } else {
      setIdx((i) => i + 1);
      setPhase("clue");
      setSelected(null);
    }
  };

  const retry = () => {
    setMissions(buildMissions(age));
    setIdx(0);
    setScore(0);
    setPhase("clue");
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

  // ── Clue phase ──
  if (phase === "clue") return (
    <div className="max-w-md mx-auto px-2">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-2 rounded-full transition-all"
              style={{
                background:
                  i < idx ? "#7C3AED" : i === idx ? "#A78BFA" : "#DDD6FE",
              }}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-purple-700">
          Scene {idx + 1}/{TOTAL}
        </span>
      </div>

      {/* Scene backdrop */}
      <div
        className="relative rounded-[24px] overflow-hidden mb-4"
        style={{ minHeight: 200 }}
      >
        <MovieScene studioEmoji={mission.studioEmoji} />
        <div className="relative z-10 p-5 pb-24">
          {/* Director badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 font-bold text-white text-sm"
            style={{ background: mission.directorColor }}
          >
            {mission.directorEmoji} {mission.director}
          </div>

          {/* Clapperboard / movie teaser */}
          <div
            className="rounded-[16px] p-4 shadow-xl"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: `3px solid ${mission.directorColor}`,
              backdropFilter: "blur(4px)",
            }}
          >
            {/* Clapperboard top stripe */}
            <div
              className="flex mb-3 rounded-t-lg overflow-hidden"
              style={{ height: 18 }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{
                    background: i % 2 === 0 ? "#1A1033" : mission.directorColor,
                  }}
                />
              ))}
            </div>
            <p className="text-white font-bold text-sm leading-relaxed">
              🎬 <span className="text-yellow-300 font-extrabold">Movie Teaser:</span>{" "}
              {mission.clue}
            </p>
          </div>
        </div>
      </div>

      {/* Studio label */}
      <div
        className="rounded-[16px] p-4 mb-5"
        style={{
          background: "linear-gradient(135deg,#1A1033,#2D1B69)",
          border: `3px solid ${mission.directorColor}`,
          boxShadow: `0 4px 0 ${mission.directorColor}50`,
        }}
      >
        <p className="font-baloo text-base font-extrabold text-yellow-300">
          {mission.studioEmoji} {mission.studio}
        </p>
        <p className="text-purple-200 font-bold text-sm mt-1">
          🎥 Can you guess this movie? Answer the question to unlock the next scene!
        </p>
      </div>

      <button
        onClick={() => setPhase("question")}
        className="btn-primary w-full text-lg rounded-[14px]"
        style={{
          background: mission.directorColor,
          boxShadow: `0 5px 0 ${mission.directorColor}80`,
        }}
      >
        Lights, Camera, Answer! 🎬
      </button>
    </div>
  );

  // ── Question phase ──
  if (phase === "question") return (
    <div className="max-w-md mx-auto px-2">
      {/* Mini clue recall */}
      <div
        className="rounded-[14px] px-4 py-3 mb-4 flex items-start gap-3"
        style={{
          background: `${mission.directorColor}15`,
          border: `2px solid ${mission.directorColor}40`,
        }}
      >
        <span className="text-2xl flex-shrink-0">{mission.directorEmoji}</span>
        <p className="font-bold text-sm text-gray-700 italic">&ldquo;{mission.clue}&rdquo;</p>
      </div>

      {/* Question */}
      <div
        className="rounded-[14px] px-4 py-3 mb-5"
        style={{
          background: "linear-gradient(135deg,#1A1033,#2D1B69)",
          border: `2px solid ${mission.directorColor}`,
        }}
      >
        <p className="font-baloo text-base font-extrabold text-yellow-300">
          🎬 Director&apos;s Question:
        </p>
        <p className="text-white font-bold text-sm mt-1">{mission.question}</p>
      </div>

      {/* 2x2 choice grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {mission.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="rounded-[14px] py-4 px-3 font-bold text-sm text-left leading-snug transition-all hover:-translate-y-1 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg,#1E1B4B,#312E81)",
              border: `2px solid ${mission.directorColor}60`,
              boxShadow: `0 4px 0 ${mission.directorColor}40`,
              color: "white",
            }}
          >
            <span
              className="inline-block w-6 h-6 rounded-full text-xs font-extrabold text-center leading-6 mr-2 flex-shrink-0"
              style={{ background: mission.directorColor }}
            >
              {["A", "B", "C", "D"][i]}
            </span>
            {opt}
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-gray-400 font-medium">
        Pick the answer that fits the movie teaser!
      </div>
    </div>
  );

  // ── Result phase ──
  return (
    <div className="max-w-md mx-auto px-2">
      <div
        className="relative rounded-[24px] overflow-hidden mb-5"
        style={{ minHeight: 220 }}
      >
        <MovieScene studioEmoji={mission.studioEmoji} />
        <div
          className="relative z-10 p-6 flex flex-col items-center justify-center"
          style={{ minHeight: 220 }}
        >
          {correct ? (
            <div
              className="rounded-[18px] p-5 shadow-xl text-center max-w-xs w-full"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: `3px solid ${mission.directorColor}`,
              }}
            >
              <div className="text-5xl mb-2 animate-bounce">
                {mission.directorEmoji}
              </div>
              <p
                className="font-baloo text-xl font-extrabold mb-1"
                style={{ color: mission.directorColor }}
              >
                Cut! Perfect take! ✅
              </p>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">
                {mission.successLine}
              </p>
              <div className="flex justify-center gap-1 mt-3">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="text-2xl">
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-[18px] p-5 shadow-xl text-center max-w-xs w-full"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "3px solid #EF4444",
              }}
            >
              <div className="text-5xl mb-2">🎬</div>
              <p className="font-baloo text-lg font-extrabold text-red-600 mb-1">
                That&apos;s a wrap on that one!
              </p>
              <p className="text-gray-500 text-sm">
                The right answer was:{" "}
                <strong className="text-gray-800">
                  {mission.options[mission.correctIndex]}
                </strong>
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Every great director learns from every scene! 🎥
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={next}
        className="btn-primary w-full text-lg rounded-[14px]"
        style={{
          background: mission.directorColor,
          boxShadow: `0 5px 0 ${mission.directorColor}80`,
        }}
      >
        {idx + 1 >= TOTAL ? "See Results! 🏆" : "Next Scene! →"}
      </button>
    </div>
  );
}
