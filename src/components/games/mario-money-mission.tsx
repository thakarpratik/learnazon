"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MoneyMission {
  character: string;
  characterEmoji: string;
  characterColor: string;
  setting: string;
  settingEmoji: string;
  story: string;
  question: string;
  answer: number;
  choices: number[];
  successLine: string;
}

interface Props { age: number; childId: string; }

function makeChoices(answer: number, range: number): number[] {
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const delta = Math.floor(Math.random() * range) + 1;
    const w = Math.random() < 0.5 ? answer + delta : Math.max(0, answer - delta);
    if (w !== answer) wrongs.add(w);
  }
  return Array.from(wrongs).concat(answer).sort(() => Math.random() - 0.5);
}

function buildMissions(age: number): MoneyMission[] {
  const easy = age <= 6;
  const hard = age >= 9;

  const bank: Array<Omit<MoneyMission, "choices">> = easy ? [
    {
      character: "Mario", characterEmoji: "🍄", characterColor: "#E53935",
      setting: "Mushroom Kingdom", settingEmoji: "🌟",
      story: "Mario jumped over 3 Goombas and collected 2 gold coins each time!",
      question: "How many coins did Mario collect in total?",
      answer: 6,
      successLine: "Yahoo! Mario's coin bag is jingling! 🪙",
    },
    {
      character: "Luigi", characterEmoji: "👻", characterColor: "#388E3C",
      setting: "Ghost House", settingEmoji: "🏚️",
      story: "Luigi found 5 coins on the floor and 4 coins hidden in a brick block.",
      question: "How many coins does Luigi have altogether?",
      answer: 9,
      successLine: "Mama mia! Luigi beat the ghost! 👻",
    },
    {
      character: "Princess Peach", characterEmoji: "👸", characterColor: "#F06292",
      setting: "Peach's Castle", settingEmoji: "🏰",
      story: "Princess Peach had 8 gold coins. She gave 3 to Toad to buy mushrooms.",
      question: "How many coins does Peach have left?",
      answer: 5,
      successLine: "Thank you so much! Peach saved the mushrooms! 🍄",
    },
    {
      character: "Toad", characterEmoji: "🍄", characterColor: "#1565C0",
      setting: "Toad's Shop", settingEmoji: "🏪",
      story: "Toad has 4 red coins and 6 yellow coins in his little shop.",
      question: "How many coins does Toad have altogether?",
      answer: 10,
      successLine: "Wahoo! Toad's shop is open for business! 🛍️",
    },
    {
      character: "Yoshi", characterEmoji: "🦎", characterColor: "#43A047",
      setting: "Yoshi's Island", settingEmoji: "🌴",
      story: "Yoshi ate 7 coins with his tongue but dropped 3 back on the ground.",
      question: "How many coins did Yoshi keep?",
      answer: 4,
      successLine: "Nom nom! Yoshi loves collecting coins! 🌟",
    },
  ] : hard ? [
    {
      character: "Mario", characterEmoji: "🍄", characterColor: "#E53935",
      setting: "Bowser's Castle", settingEmoji: "🏯",
      story: "Mario buys a Fire Flower for £3.50 and a Super Star for £4.75. He pays with a £10 note.",
      question: "How much change does Mario get back (in pence)?",
      answer: 175,
      successLine: "Let's-a go! Mario defeated Bowser with perfect change! 🔥",
    },
    {
      character: "Luigi", characterEmoji: "👻", characterColor: "#388E3C",
      setting: "Rainbow Road", settingEmoji: "🌈",
      story: "Luigi earns £2.40 per lap on Rainbow Road. He completes 5 laps.",
      question: "How much does Luigi earn in total (in pence)?",
      answer: 1200,
      successLine: "Wahoo! Luigi wins the Rainbow Road grand prize! 🏆",
    },
    {
      character: "Princess Peach", characterEmoji: "👸", characterColor: "#F06292",
      setting: "Peach's Castle", settingEmoji: "🏰",
      story: "Peach spends £6.30 on decorations and £8.45 on a party feast. She started with £20.",
      question: "How much money does Peach have left (in pence)?",
      answer: 525,
      successLine: "Lovely! Peach threw the most beautiful party in the kingdom! 🎉",
    },
    {
      character: "Toad", characterEmoji: "🍄", characterColor: "#1565C0",
      setting: "Toad's Market", settingEmoji: "🏪",
      story: "Toad sells mushrooms for £1.25 each. A customer buys 8 mushrooms.",
      question: "How much does the customer pay in total (in pence)?",
      answer: 1000,
      successLine: "Incredible! Toad sold every single mushroom! 🍄",
    },
    {
      character: "Yoshi", characterEmoji: "🦎", characterColor: "#43A047",
      setting: "Yoshi's Valley", settingEmoji: "🌴",
      story: "Yoshi collects coins worth 75p, £1.50, and £2.25 in three stages.",
      question: "What is the total amount Yoshi collected (in pence)?",
      answer: 450,
      successLine: "Amazing! Yoshi collected the biggest coin treasure ever! 💰",
    },
  ] : [
    {
      character: "Mario", characterEmoji: "🍄", characterColor: "#E53935",
      setting: "Mushroom Kingdom", settingEmoji: "🌟",
      story: "Mario wants to buy a cape for £2.50 and boots for £1.75.",
      question: "How much does Mario need to spend in total (in pence)?",
      answer: 425,
      successLine: "Wahoo! Mario is looking super stylish! 🎩",
    },
    {
      character: "Luigi", characterEmoji: "👻", characterColor: "#388E3C",
      setting: "Coin Heaven", settingEmoji: "⭐",
      story: "Luigi has £5.00 and buys a Green Shell for £2.30.",
      question: "How much change does Luigi get back (in pence)?",
      answer: 270,
      successLine: "Excellent! Luigi is ready for the next race! 🐢",
    },
    {
      character: "Princess Peach", characterEmoji: "👸", characterColor: "#F06292",
      setting: "Peach's Garden", settingEmoji: "🌸",
      story: "Peach buys 3 flower pots at 80p each for her garden.",
      question: "How much does Peach spend in total (in pence)?",
      answer: 240,
      successLine: "How lovely! Peach's garden is blooming beautifully! 🌺",
    },
    {
      character: "Toad", characterEmoji: "🍄", characterColor: "#1565C0",
      setting: "Toad's Stall", settingEmoji: "🛒",
      story: "Toad sells Super Mushrooms for 45p each. He sold 6 today.",
      question: "How much money did Toad make today (in pence)?",
      answer: 270,
      successLine: "Yahoo! Toad had his best sales day ever! 💰",
    },
    {
      character: "Yoshi", characterEmoji: "🦎", characterColor: "#43A047",
      setting: "Yoshi's Fruit Stand", settingEmoji: "🍉",
      story: "Yoshi has £3.00. He buys a melon for £1.65.",
      question: "How much money does Yoshi have left (in pence)?",
      answer: 135,
      successLine: "Yoshi enjoyed the juiciest melon in the whole island! 🌴",
    },
  ];

  const range = easy ? 3 : hard ? 50 : 20;
  return bank.map(m => ({ ...m, choices: makeChoices(m.answer, range) }))
    .sort(() => Math.random() - 0.5);
}

function MarioScene({ settingEmoji }: { settingEmoji: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#87CEEB 0%,#B8D4FF 60%,#C8E8FF 100%)" }} />

      <div className="absolute top-3 left-6 w-12 h-12 rounded-full" style={{ background: "#FFD700", boxShadow: "0 0 0 4px #FFA000, 0 0 20px #FFD70080" }} />

      <div className="absolute top-5 left-24" style={{ display: "flex", gap: 0 }}>
        {[14, 22, 14].map((w, i) => <div key={i} style={{ width: w, height: 14, background: "white", opacity: 0.92 }} />)}
      </div>
      <div className="absolute top-3 right-16" style={{ display: "flex", gap: 0 }}>
        {[10, 18, 10].map((w, i) => <div key={i} style={{ width: w, height: 12, background: "white", opacity: 0.85 }} />)}
      </div>

      <div className="absolute" style={{ top: 40, left: "18%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 32, height: 32, background: "#E65100", border: "3px solid #BF360C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold", color: "#FFD700" }}>?</div>
        <div style={{ width: 8, height: 8, background: "#5D4037" }} />
      </div>
      <div className="absolute" style={{ top: 40, left: "42%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 32, height: 32, background: "#FFB300", border: "3px solid #E65100", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🪙</div>
        <div style={{ width: 8, height: 8, background: "#5D4037" }} />
      </div>
      <div className="absolute" style={{ top: 40, right: "15%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 32, height: 32, background: "#E65100", border: "3px solid #BF360C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold", color: "#FFD700" }}>?</div>
        <div style={{ width: 8, height: 8, background: "#5D4037" }} />
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ display: "flex" }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ height: 6, background: "#8BC34A" }} />
            <div style={{ height: 18, background: "#C8913A", border: "1px solid #A0522D" }} />
          </div>
        ))}
      </div>

      <div className="absolute" style={{ bottom: 24, left: "8%" }}>
        <div style={{ width: 16, height: 20, background: "#D32F2F", borderRadius: "50% 50% 0 0" }} />
        <div style={{ width: 20, height: 14, background: "#4CAF50", marginLeft: -2 }} />
        <div style={{ width: 6, height: 6, background: "#8B4513", marginLeft: 2 }} />
        <div style={{ width: 6, height: 6, background: "#8B4513", marginLeft: 8 }} />
      </div>

      <div className="absolute" style={{ bottom: 24, right: "10%" }}>
        <div style={{ width: 14, height: 18, background: "#F48FB1", borderRadius: "50% 50% 0 0" }} />
        <div style={{ width: 18, height: 12, background: "#E65100", marginLeft: -2 }} />
      </div>

      <div className="absolute" style={{ bottom: 20, right: "30%", fontSize: 28 }}>{settingEmoji}</div>

      <div className="absolute top-3 right-4 flex gap-1">
        {[1, 2, 3].map(i => <div key={i} style={{ width: 16, height: 16, background: "#FFD700", borderRadius: 2, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>🪙</div>)}
      </div>
    </div>
  );
}

function CompletionScreen({ score, total, onRetry, onBack }: { score: number; total: number; onRetry: () => void; onBack: () => void }) {
  const stars = score >= total * 0.9 ? 3 : score >= total * 0.6 ? 2 : 1;
  const coins = Math.round((score / total) * 10);
  return (
    <div className="max-w-md mx-auto text-center py-8 px-4">
      <div className="text-6xl mb-2 animate-bounce">🏆</div>
      <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">Mission Complete!</h2>
      <p className="text-gray-500 mb-4">Mario and friends are cheering for you!</p>
      <div className="flex justify-center gap-2 text-5xl mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>⭐</span>
        ))}
      </div>
      <div className="rounded-[16px] p-5 mb-6"
        style={{ background: "linear-gradient(135deg,#FFF9C4,#FFE082)", border: "3px solid #FFB300", boxShadow: "0 5px 0 #E65C0060" }}>
        <p className="font-baloo text-4xl font-extrabold text-yellow-800">{score}/{total} correct!</p>
        <div className="flex justify-center gap-1 mt-3 flex-wrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-2xl" style={{ opacity: i < coins ? 1 : 0.2 }}>🪙</span>
          ))}
        </div>
        <p className="text-yellow-700 font-bold text-sm mt-2">{coins} coins earned! Let's-a go!</p>
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={onBack} className="btn-secondary px-6">Back to Hub</button>
        <button onClick={onRetry} className="btn-primary px-6"
          style={{ background: "#E53935", boxShadow: "0 4px 0 #B71C1C" }}>
          Play Again! 🍄
        </button>
      </div>
    </div>
  );
}

export function MarioMoneyMission({ age, childId }: Props) {
  const router = useRouter();
  const [missions, setMissions] = useState<MoneyMission[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"story" | "question" | "result">("story");
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => { setMissions(buildMissions(age)); }, [age]);

  if (!missions.length) return null;

  const mission = missions[idx];
  const TOTAL = missions.length;
  const correct = selected === mission.answer;

  const handleAnswer = (choice: number) => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === mission.answer) setScore(s => s + 1);
    setPhase("result");
  };

  const next = () => {
    if (idx + 1 >= TOTAL) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, module: "MONEY", score: Math.round((score / TOTAL) * 100), timeTaken: 90 }),
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
    setIdx(0); setScore(0); setPhase("story"); setSelected(null); setShowComplete(false);
  };

  if (showComplete) return (
    <CompletionScreen score={score} total={TOTAL} onRetry={retry} onBack={() => router.push("/dashboard")} />
  );

  if (phase === "story") return (
    <div className="max-w-md mx-auto px-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} className="w-8 h-2 transition-all"
              style={{ background: i < idx ? "#FFB300" : i === idx ? "#FFD700" : "#FFF9C4", border: "1px solid #E65C00", borderRadius: 2 }} />
          ))}
        </div>
        <span className="text-xs font-bold" style={{ color: "#E65C00" }}>Mission {idx + 1}/{TOTAL}</span>
      </div>

      <div className="relative rounded-[24px] overflow-hidden mb-4" style={{ minHeight: 200 }}>
        <MarioScene settingEmoji={mission.settingEmoji} />
        <div className="relative z-10 p-5 pb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 font-bold text-white text-sm"
            style={{ background: mission.characterColor, borderRadius: 4 }}>
            {mission.characterEmoji} {mission.character} needs your help!
          </div>
          <div className="bg-white p-4 shadow-lg max-w-xs"
            style={{ border: `3px solid ${mission.characterColor}`, borderRadius: 8 }}>
            <p className="font-bold text-gray-700 text-sm leading-relaxed">{mission.story}</p>
          </div>
        </div>
      </div>

      <div className="p-4 mb-5"
        style={{ background: "#FFF9C4", border: "3px solid #FFB300", boxShadow: "0 4px 0 #E65C0040", borderRadius: 6 }}>
        <p className="font-baloo text-base font-extrabold" style={{ color: "#E65C00" }}>🪙 Collect the coins — answer this:</p>
        <p className="font-bold text-sm mt-1" style={{ color: "#B8530A" }}>{mission.question}</p>
      </div>

      <button
        onClick={() => setPhase("question")}
        className="btn-primary w-full text-lg"
        style={{ background: mission.characterColor, boxShadow: `0 5px 0 ${mission.characterColor}90`, borderRadius: 6 }}
      >
        Start Mission! 🍄
      </button>
    </div>
  );

  if (phase === "question") return (
    <div className="max-w-md mx-auto px-2">
      <div className="px-4 py-3 mb-5 flex items-center gap-3"
        style={{ background: mission.characterColor + "18", border: `2px solid ${mission.characterColor}50`, borderRadius: 8 }}>
        <span className="text-2xl">{mission.characterEmoji}</span>
        <p className="font-bold text-sm text-gray-700">{mission.question}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {mission.choices.map((c) => (
          <button
            key={c}
            onClick={() => handleAnswer(c)}
            className="py-6 font-baloo text-3xl font-extrabold transition-all hover:-translate-y-1"
            style={{
              background: "#C62828",
              border: "3px solid #FFD700",
              boxShadow: "0 5px 0 #7B1A1A",
              color: "#FFD700",
              textShadow: "0 2px 4px rgba(0,0,0,0.6)",
              borderRadius: 6,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-gray-400 font-medium">
        Pick the right coin box to win the mission!
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-2">
      <div className="relative rounded-[24px] overflow-hidden mb-5" style={{ minHeight: 200 }}>
        <MarioScene settingEmoji={mission.settingEmoji} />
        <div className="relative z-10 p-6 flex flex-col items-center justify-center" style={{ minHeight: 200 }}>
          {correct ? (
            <div className="bg-white p-4 shadow-lg text-center max-w-xs"
              style={{ border: `3px solid ${mission.characterColor}`, borderRadius: 8 }}>
              <div className="text-5xl mb-2 animate-bounce">{mission.characterEmoji}</div>
              <p className="font-baloo text-xl font-extrabold mb-1" style={{ color: mission.characterColor }}>
                Yahoo! 🪙
              </p>
              <p className="text-gray-600 text-sm font-medium">{mission.successLine}</p>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3].map(i => <span key={i} className="text-2xl">⭐</span>)}
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 shadow-lg text-center max-w-xs"
              style={{ border: "3px solid #E53935", borderRadius: 8 }}>
              <div className="text-5xl mb-2">💀</div>
              <p className="font-baloo text-lg font-extrabold text-red-600 mb-1">
                Bowser stole that one! Try again!
              </p>
              <p className="text-gray-500 text-sm">The answer was <strong>{mission.answer}</strong></p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={next}
        className="btn-primary w-full text-lg"
        style={{ background: mission.characterColor, boxShadow: `0 5px 0 ${mission.characterColor}90`, borderRadius: 6 }}
      >
        {idx + 1 >= TOTAL ? "See Results! 🏆" : "Next Mission! →"}
      </button>
    </div>
  );
}
