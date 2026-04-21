"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WritingMission {
  character: string;
  characterEmoji: string;
  characterColor: string;
  storyWorld: string;
  storyWorldEmoji: string;
  storySnippet: string;
  challenge: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  successLine: string;
}

interface Props { age: number; childId: string; }

// ── Mission banks ─────────────────────────────────────────────────────────────

function buildMissions(age: number): WritingMission[] {
  const easy   = age <= 6;
  const hard   = age >= 9;

  const easyBank: WritingMission[] = [
    {
      character: "Matilda",
      characterEmoji: "📖",
      characterColor: "#7C3AED",
      storyWorld: "The Cosy Library",
      storyWorldEmoji: "🏫",
      storySnippet: "Matilda loved books more than anything. She sat on the big red chair and began to ___.",
      challenge: "Complete the sentence",
      question: "Which word best completes the story?",
      options: ["read", "loud", "sky", "jump"],
      correctIndex: 0,
      successLine: "Matilda read all night long by the light of a tiny candle! ✨",
    },
    {
      character: "Hermione",
      characterEmoji: "📚",
      characterColor: "#C2185B",
      storyWorld: "The Enchanted Forest",
      storyWorldEmoji: "🌲",
      storySnippet: "Hermione found a sparkling potion behind the tall oak tree. The potion was a bright shade of ___.",
      challenge: "Complete the sentence",
      question: "Which word fits best in the story?",
      options: ["cold", "purple", "run", "door"],
      correctIndex: 1,
      successLine: "The purple potion made Hermione float above the treetops! 🌟",
    },
    {
      character: "The BFG",
      characterEmoji: "🌙",
      characterColor: "#0284C7",
      storyWorld: "Dream Country",
      storyWorldEmoji: "💭",
      storySnippet: "The BFG tiptoed through the sleeping village. He blew a dream into a child's window. The child smiled in her ___.",
      challenge: "Complete the sentence",
      question: "Which word completes the story?",
      options: ["shoe", "sleep", "bark", "swim"],
      correctIndex: 1,
      successLine: "The child dreamed of flying elephants and chocolate rivers! 🐘",
    },
    {
      character: "Aslan",
      characterEmoji: "🦁",
      characterColor: "#D97706",
      storyWorld: "The Snowy Kingdom",
      storyWorldEmoji: "❄️",
      storySnippet: "Aslan walked through the white snow. Everywhere his paws touched, flowers began to ___.",
      challenge: "Complete the sentence",
      question: "Which word fits the story best?",
      options: ["fly", "grow", "cook", "swim"],
      correctIndex: 1,
      successLine: "The whole kingdom burst into springtime colours! 🌸",
    },
    {
      character: "Gandalf",
      characterEmoji: "🧙",
      characterColor: "#4F7942",
      storyWorld: "The Misty Mountains",
      storyWorldEmoji: "⛰️",
      storySnippet: "Gandalf climbed the steep mountain path. At the top he sat and looked at the ___ stars.",
      challenge: "Complete the sentence",
      question: "Which describing word fits best?",
      options: ["angry", "bright", "wet", "sleepy"],
      correctIndex: 1,
      successLine: "Gandalf named every star in the sky by morning! 🌠",
    },
  ];

  const mediumBank: WritingMission[] = [
    {
      character: "Matilda",
      characterEmoji: "📖",
      characterColor: "#7C3AED",
      storyWorld: "The Magic School",
      storyWorldEmoji: "🏫",
      storySnippet: "Matilda stared at the chalkboard. Slowly, the chalk began to move on its own. Matilda smiled ___",
      challenge: "Fix the punctuation",
      question: "Which ending gives this sentence the right punctuation?",
      options: ["Matilda smiled.", "Matilda smiled?", "Matilda smiled!", "Matilda smiled,"],
      correctIndex: 2,
      successLine: "Matilda's powers filled the entire school with wonder! ✨",
    },
    {
      character: "Hermione",
      characterEmoji: "📚",
      characterColor: "#C2185B",
      storyWorld: "The Grand Library",
      storyWorldEmoji: "📜",
      storySnippet: "Hermione gasped when she opened the ancient book. The pages glowed with a ___ golden light.",
      challenge: "Choose the best describing word",
      question: "Which adjective makes the scene most vivid?",
      options: ["little", "dazzling", "plain", "boring"],
      correctIndex: 1,
      successLine: "The dazzling light revealed a map to the lost library of wizards! 🗺️",
    },
    {
      character: "The BFG",
      characterEmoji: "🌙",
      characterColor: "#0284C7",
      storyWorld: "Giant Country",
      storyWorldEmoji: "🌍",
      storySnippet: "The BFG caught a dream in his net. It was the most ___ dream he had ever found.",
      challenge: "Choose the best describing word",
      question: "Which adjective fits the story best?",
      options: ["dull", "tiny", "magnificent", "broken"],
      correctIndex: 2,
      successLine: "The BFG bottled it and kept it safe for a special child! 🌛",
    },
    {
      character: "Aslan",
      characterEmoji: "🦁",
      characterColor: "#D97706",
      storyWorld: "Cair Paravel",
      storyWorldEmoji: "🏰",
      storySnippet: "The children stood at the gate of the great castle. They had never seen anything so ___",
      challenge: "Fix the punctuation",
      question: "Which ending punctuates the sentence correctly?",
      options: ["so beautiful!", "so beautiful,", "so beautiful", "so beautiful?"],
      correctIndex: 0,
      successLine: "The doors swung open and a feast was waiting inside! 🎉",
    },
    {
      character: "Gandalf",
      characterEmoji: "🧙",
      characterColor: "#4F7942",
      storyWorld: "The Shire",
      storyWorldEmoji: "🌿",
      storySnippet: "Gandalf knocked on the ___ wooden door of Bilbo's home.",
      challenge: "Choose the best describing word",
      question: "Which adjective adds the most detail to the story?",
      options: ["round", "square", "invisible", "broken"],
      correctIndex: 0,
      successLine: "Bilbo's round green door swung open to a grand adventure! 🗡️",
    },
  ];

  const hardBank: WritingMission[] = [
    {
      character: "Hermione",
      characterEmoji: "📚",
      characterColor: "#C2185B",
      storyWorld: "The Potions Dungeon",
      storyWorldEmoji: "🧪",
      storySnippet: "Yesterday, Hermione ___ the most difficult potion she had ever attempted.",
      challenge: "Pick the correct verb tense",
      question: "Which verb form is correct for something that happened yesterday?",
      options: ["brew", "brews", "brewed", "brewing"],
      correctIndex: 2,
      successLine: "The perfectly brewed potion turned Hermione's quill into a hummingbird! 🐦",
    },
    {
      character: "Matilda",
      characterEmoji: "📖",
      characterColor: "#7C3AED",
      storyWorld: "The Wormwood House",
      storyWorldEmoji: "🏠",
      storySnippet: "Matilda wanted to read, ___ her parents insisted she watch television instead.",
      challenge: "Choose the connective",
      question: "Which connective word links these two ideas best?",
      options: ["so", "because", "but", "then"],
      correctIndex: 2,
      successLine: "Matilda sneaked a book under her pillow and read by torchlight! 🔦",
    },
    {
      character: "Gandalf",
      characterEmoji: "🧙",
      characterColor: "#4F7942",
      storyWorld: "The Road to Mordor",
      storyWorldEmoji: "🌋",
      storySnippet: "The fellowship ___ through the Mines of Moria for three days before they saw light again.",
      challenge: "Pick the correct verb tense",
      question: "Which verb form correctly describes their completed journey?",
      options: ["travel", "travels", "travelled", "will travel"],
      correctIndex: 2,
      successLine: "They emerged into sunlight and heard Gandalf cry 'You shall not pass!' 🔥",
    },
    {
      character: "The BFG",
      characterEmoji: "🌙",
      characterColor: "#0284C7",
      storyWorld: "Buckingham Palace",
      storyWorldEmoji: "👑",
      storySnippet: "Which of these sentences makes the most sense?",
      challenge: "Identify the sentence that makes sense",
      question: "Which sentence is written correctly?",
      options: [
        "The BFG the Queen blew dream a.",
        "The BFG blew a dream into the Queen's window.",
        "Blew dream BFG window the The Queen.",
        "A dream the the into BFG blew Queen window.",
      ],
      correctIndex: 1,
      successLine: "The Queen woke up laughing and invited the BFG to breakfast! 🍳",
    },
    {
      character: "Aslan",
      characterEmoji: "🦁",
      characterColor: "#D97706",
      storyWorld: "The Stone Table",
      storyWorldEmoji: "🪨",
      storySnippet: "The sun rose ___ the stone table cracked, and Aslan returned with a mighty roar.",
      challenge: "Choose the connective",
      question: "Which connective best joins these two events in the story?",
      options: ["but", "or", "although", "and"],
      correctIndex: 3,
      successLine: "Aslan's roar shook the mountains and melted the last traces of winter! 🌅",
    },
  ];

  const bank = easy ? easyBank : hard ? hardBank : mediumBank;
  // Shuffle using sort — no Set spreading
  return bank.slice().sort(() => Math.random() - 0.5);
}

// ── Magical book scene ────────────────────────────────────────────────────────

function Sparkle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <div
      className="absolute animate-pulse pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s`, fontSize: size }}
    >
      ✨
    </div>
  );
}

const SPARKLES = [
  { x: 5,  y: 10, delay: 0,    size: 16 },
  { x: 88, y: 8,  delay: 0.4,  size: 14 },
  { x: 15, y: 75, delay: 0.8,  size: 12 },
  { x: 80, y: 70, delay: 1.2,  size: 18 },
  { x: 50, y: 5,  delay: 0.6,  size: 13 },
  { x: 35, y: 85, delay: 1.6,  size: 10 },
  { x: 70, y: 15, delay: 1.0,  size: 15 },
];

function MagicalBookScene({ storyWorldEmoji }: { storyWorldEmoji: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none"
      aria-hidden
      style={{ background: "linear-gradient(160deg,#1e004d 0%,#3b0081 45%,#1a0040 100%)" }}
    >
      {/* Stars */}
      {[8, 18, 28, 42, 55, 65, 73, 83, 92, 12, 47, 78].map((x, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${x}%`,
            top: `${[12, 20, 8, 25, 15, 30, 6, 18, 22, 35, 10, 28][i]}%`,
            width: [2, 3, 2, 4, 2, 3, 2, 3, 2, 4, 2, 3][i],
            height: [2, 3, 2, 4, 2, 3, 2, 3, 2, 4, 2, 3][i],
            background: "white",
            opacity: 0.7,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} x={s.x} y={s.y} delay={s.delay} size={s.size} />
      ))}

      {/* Open book silhouette */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-0">
        {/* Left page */}
        <div
          className="w-20 h-14 rounded-bl-[4px] rounded-tl-[8px]"
          style={{
            background: "linear-gradient(135deg,#fffde7,#fff9c4)",
            border: "2px solid #f0cc6a",
            borderRight: "none",
            boxShadow: "-3px 3px 8px rgba(0,0,0,0.4)",
            transform: "perspective(300px) rotateY(15deg)",
          }}
        >
          {[1, 2, 3].map(l => (
            <div key={l} className="mx-2 mt-2 h-1 rounded" style={{ background: "#d4a", opacity: 0.4 }} />
          ))}
        </div>
        {/* Spine */}
        <div className="w-2 h-14 rounded-none" style={{ background: "#8B6914", boxShadow: "0 3px 6px rgba(0,0,0,0.5)" }} />
        {/* Right page */}
        <div
          className="w-20 h-14 rounded-br-[4px] rounded-tr-[8px]"
          style={{
            background: "linear-gradient(225deg,#fffde7,#fff9c4)",
            border: "2px solid #f0cc6a",
            borderLeft: "none",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.4)",
            transform: "perspective(300px) rotateY(-15deg)",
          }}
        >
          {[1, 2, 3].map(l => (
            <div key={l} className="mx-2 mt-2 h-1 rounded" style={{ background: "#d4a", opacity: 0.4 }} />
          ))}
        </div>
      </div>

      {/* Quill pen */}
      <div
        className="absolute bottom-16 right-8 text-3xl"
        style={{ transform: "rotate(-30deg)", filter: "drop-shadow(0 0 6px #fff9)" }}
      >
        🪶
      </div>

      {/* World badge */}
      <div className="absolute bottom-20 left-6 text-4xl" style={{ filter: "drop-shadow(0 0 8px #a78bfa)" }}>
        {storyWorldEmoji}
      </div>

      {/* Magic glow ring behind book */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-44 h-6 rounded-full"
        style={{ background: "radial-gradient(ellipse,#a78bfa55 0%,transparent 80%)" }}
      />
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
  const quills = Math.round((score / total) * 5);

  return (
    <div className="max-w-md mx-auto text-center py-8 px-4">
      <div className="text-6xl mb-2 animate-bounce">📜</div>
      <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">Quest Complete!</h2>
      <p className="text-gray-500 mb-1">The magical book glows with pride!</p>

      {/* Author Badge */}
      <div
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-4 font-bold text-white text-sm"
        style={{
          background: "linear-gradient(135deg,#7C3AED,#C2185B)",
          boxShadow: "0 4px 12px #7C3AED60",
        }}
      >
        🏅 Author Badge Earned!
      </div>

      <div className="flex justify-center gap-2 text-5xl mb-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>
            ⭐
          </span>
        ))}
      </div>

      <div
        className="rounded-[20px] p-5 mb-6"
        style={{
          background: "linear-gradient(135deg,#ede9fe,#fce7f3)",
          border: "3px solid #7C3AED",
          boxShadow: "0 5px 0 #7C3AED40",
        }}
      >
        <p className="font-baloo text-4xl font-extrabold" style={{ color: "#7C3AED" }}>
          {score}/{total} correct!
        </p>
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-2xl" style={{ opacity: i < quills ? 1 : 0.2 }}>
              🪶
            </span>
          ))}
        </div>
        <p className="font-bold text-sm mt-2" style={{ color: "#7C3AED" }}>
          {quills} magical quills earned!
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
          New Quest! 📖
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function StoryWritingMission({ age, childId }: Props) {
  const router = useRouter();
  const [missions, setMissions]         = useState<WritingMission[]>([]);
  const [idx, setIdx]                   = useState(0);
  const [phase, setPhase]               = useState<"story" | "question" | "result">("story");
  const [selected, setSelected]         = useState<number | null>(null);
  const [score, setScore]               = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => { setMissions(buildMissions(age)); }, [age]);

  if (!missions.length) return null;

  const mission = missions[idx];
  const TOTAL   = missions.length;
  const isCorrect = selected === mission.correctIndex;

  const handleAnswer = (optionIdx: number) => {
    if (selected !== null) return;
    setSelected(optionIdx);
    if (optionIdx === mission.correctIndex) setScore(s => s + 1);
    setPhase("result");
  };

  const next = () => {
    if (idx + 1 >= TOTAL) {
      const finalScore = isCorrect ? score : score; // score already updated via setState
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          module: "WRITING",
          score: Math.round((score / TOTAL) * 100),
          timeTaken: 90,
        }),
      }).catch(console.error);
      setShowComplete(true);
    } else {
      setIdx(i => i + 1);
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

  // ── Progress bar shared ──
  const ProgressBar = () => (
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
                  ? "#7C3AED"
                  : i === idx
                  ? "#A78BFA"
                  : "#DDD6FE",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-bold" style={{ color: "#7C3AED" }}>
        Quest {idx + 1}/{TOTAL}
      </span>
    </div>
  );

  // ── Story phase ──
  if (phase === "story") {
    return (
      <div className="max-w-md mx-auto px-2">
        <ProgressBar />

        {/* Scene */}
        <div className="relative rounded-[24px] overflow-hidden mb-4" style={{ minHeight: 210 }}>
          <MagicalBookScene storyWorldEmoji={mission.storyWorldEmoji} />
          <div className="relative z-10 p-5 pb-24">
            {/* Character badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 font-bold text-white text-sm"
              style={{ background: mission.characterColor, boxShadow: `0 3px 8px ${mission.characterColor}60` }}
            >
              {mission.characterEmoji} {mission.character} invites you in!
            </div>

            {/* Story snippet */}
            <div
              className="rounded-[16px] p-4 shadow-lg max-w-xs"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: `3px solid ${mission.characterColor}`,
                backdropFilter: "blur(4px)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: mission.characterColor }}>
                {mission.storyWorld} {mission.storyWorldEmoji}
              </p>
              <p className="font-bold text-gray-700 text-sm leading-relaxed italic">"{mission.storySnippet}"</p>
            </div>
          </div>
        </div>

        {/* Challenge card */}
        <div
          className="rounded-[16px] p-4 mb-5"
          style={{
            background: "linear-gradient(135deg,#ede9fe,#fce7f3)",
            border: "3px solid #7C3AED",
            boxShadow: "0 4px 0 #7C3AED40",
          }}
        >
          <p className="font-baloo text-base font-extrabold" style={{ color: "#7C3AED" }}>
            🪶 Your challenge:
          </p>
          <p className="text-purple-700 font-bold text-sm">{mission.challenge} — {mission.question}</p>
        </div>

        <button
          onClick={() => setPhase("question")}
          className="btn-primary w-full text-lg rounded-full"
          style={{ background: mission.characterColor, boxShadow: `0 5px 0 ${mission.characterColor}80` }}
        >
          Open the Story Book! 📖
        </button>
      </div>
    );
  }

  // ── Question phase ──
  if (phase === "question") {
    return (
      <div className="max-w-md mx-auto px-2">
        <ProgressBar />

        {/* Story snippet */}
        <div
          className="rounded-[16px] p-4 mb-4"
          style={{
            background: "linear-gradient(160deg,#1e004d,#3b0081)",
            border: `3px solid ${mission.characterColor}`,
            boxShadow: `0 4px 12px ${mission.characterColor}50`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{mission.characterEmoji}</span>
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wide">
              {mission.storyWorld} {mission.storyWorldEmoji}
            </span>
          </div>
          <p className="text-white font-bold text-sm leading-relaxed italic">
            "{mission.storySnippet}"
          </p>
        </div>

        {/* Question */}
        <div
          className="rounded-[12px] px-4 py-3 mb-4 flex items-center gap-3"
          style={{ background: `${mission.characterColor}18`, border: `2px solid ${mission.characterColor}50` }}
        >
          <span className="text-2xl">🪶</span>
          <p className="font-bold text-sm text-gray-700">{mission.question}</p>
        </div>

        {/* 2×2 option grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {mission.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="rounded-[14px] py-5 font-baloo text-lg font-extrabold transition-all hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
              style={{
                background: "linear-gradient(160deg,#2d006b,#4a0099)",
                border: "3px solid #7C3AED",
                boxShadow: "0 5px 0 #3b0081",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="text-center text-xs text-gray-400 font-medium">
          Pick the magic word to continue the story!
        </div>
      </div>
    );
  }

  // ── Result phase ──
  return (
    <div className="max-w-md mx-auto px-2">
      <ProgressBar />

      {/* Scene with result overlay */}
      <div className="relative rounded-[24px] overflow-hidden mb-5" style={{ minHeight: 210 }}>
        <MagicalBookScene storyWorldEmoji={mission.storyWorldEmoji} />
        <div className="relative z-10 p-6 flex flex-col items-center justify-center" style={{ minHeight: 210 }}>
          {isCorrect ? (
            <div
              className="bg-white rounded-[16px] p-5 shadow-xl text-center max-w-xs w-full"
              style={{ border: `3px solid ${mission.characterColor}` }}
            >
              <div className="text-5xl mb-2 animate-bounce">{mission.characterEmoji}</div>
              <p className="font-baloo text-xl font-extrabold mb-1" style={{ color: mission.characterColor }}>
                Magical! ✅
              </p>
              <p className="text-gray-600 text-sm font-medium leading-snug">{mission.successLine}</p>
              <div className="flex justify-center gap-1 mt-3">
                {[1, 2, 3].map(i => (
                  <span key={i} className="text-2xl">⭐</span>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="bg-white rounded-[16px] p-5 shadow-xl text-center max-w-xs w-full"
              style={{ border: "3px solid #DC2626" }}
            >
              <div className="text-5xl mb-2">📕</div>
              <p className="font-baloo text-lg font-extrabold text-red-600 mb-1">
                Not quite — keep writing!
              </p>
              <p className="text-gray-500 text-sm">
                The answer was{" "}
                <strong className="text-purple-700">"{mission.options[mission.correctIndex]}"</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Colour-coded answer review */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {mission.options.map((opt, i) => {
          const isChosen  = i === selected;
          const isCorrectOpt = i === mission.correctIndex;
          let bg     = "#F3F4F6";
          let border = "#E5E7EB";
          let color  = "#374151";
          if (isCorrectOpt) { bg = "#D1FAE5"; border = "#10B981"; color = "#065F46"; }
          if (isChosen && !isCorrectOpt) { bg = "#FEE2E2"; border = "#DC2626"; color = "#991B1B"; }
          return (
            <div
              key={i}
              className="rounded-[12px] py-3 px-4 text-center font-bold text-sm"
              style={{ background: bg, border: `2px solid ${border}`, color }}
            >
              {isCorrectOpt && "✅ "}
              {isChosen && !isCorrectOpt && "❌ "}
              {opt}
            </div>
          );
        })}
      </div>

      <button
        onClick={next}
        className="btn-primary w-full text-lg rounded-full"
        style={{ background: mission.characterColor, boxShadow: `0 5px 0 ${mission.characterColor}80` }}
      >
        {idx + 1 >= TOTAL ? "See Results! 🏆" : "Next Page! →"}
      </button>
    </div>
  );
}
