"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MathMission {
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

// ── Mission banks ─────────────────────────────────────────────────────────────

function makeChoices(answer: number, range: number): number[] {
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const delta = Math.floor(Math.random() * range) + 1;
    const w = Math.random() < 0.5 ? answer + delta : Math.max(0, answer - delta);
    if (w !== answer) wrongs.add(w);
  }
  return Array.from(wrongs).concat(answer).sort(() => Math.random() - 0.5);
}

function buildMissions(age: number): MathMission[] {
  const easy = age <= 6;
  const hard  = age >= 9;

  const bank: Array<Omit<MathMission, "choices">> = easy ? [
    {
      character:"Steve", characterEmoji:"🧑‍🌾", characterColor:"#4CAF50",
      setting:"The Farm", settingEmoji:"🌾",
      story:"Steve planted 3 rows of wheat. Each row has 2 crops.",
      question:"How many crops did Steve plant in total?",
      answer: 6,
      successLine:"Steve harvested enough wheat to bake a whole stack of bread! 🍞",
    },
    {
      character:"Alex", characterEmoji:"🧑‍🦰", characterColor:"#FF9800",
      setting:"The Mine", settingEmoji:"⛏️",
      story:"Alex found 4 diamonds in one cave and 3 in another.",
      question:"How many diamonds did Alex find altogether?",
      answer: 7,
      successLine:"Alex crafted a shiny diamond sword! ⚔️",
    },
    {
      character:"Creeper", characterEmoji:"💚", characterColor:"#2E7D32",
      setting:"The Forest", settingEmoji:"🌲",
      story:"A Creeper walks past 5 trees and explodes 2 of them.",
      question:"How many trees are still standing?",
      answer: 3,
      successLine:"Phew! The remaining trees are safe… for now! 💥",
    },
    {
      character:"Steve", characterEmoji:"🧑‍🌾", characterColor:"#4CAF50",
      setting:"The Crafting Table", settingEmoji:"🪵",
      story:"Steve needs 8 wooden planks. He has 5 already.",
      question:"How many more planks does Steve need?",
      answer: 3,
      successLine:"Steve built a perfect crafting table! 🔨",
    },
    {
      character:"Alex", characterEmoji:"🧑‍🦰", characterColor:"#FF9800",
      setting:"The Nether", settingEmoji:"🔥",
      story:"Alex collected 6 blaze rods and used 2 for potions.",
      question:"How many blaze rods does Alex have left?",
      answer: 4,
      successLine:"Alex brewed powerful fire resistance potions! 🧪",
    },
  ] : hard ? [
    {
      character:"Steve", characterEmoji:"🧑‍🌾", characterColor:"#4CAF50",
      setting:"The Mine", settingEmoji:"⛏️",
      story:"Steve mines 9 blocks per minute for 7 minutes.",
      question:"How many blocks did Steve mine?",
      answer: 63,
      successLine:"Steve reached bedrock and found an ancient city! 🏰",
    },
    {
      character:"Alex", characterEmoji:"🧑‍🦰", characterColor:"#FF9800",
      setting:"The Nether Fortress", settingEmoji:"🏯",
      story:"Alex defeats 8 blazes. Each drops 2 blaze rods.",
      question:"How many blaze rods did Alex get?",
      answer: 16,
      successLine:"Alex unlocked the End Portal! 🌀",
    },
    {
      character:"Enderman", characterEmoji:"🖤", characterColor:"#212121",
      setting:"The End", settingEmoji:"🌌",
      story:"An Enderman teleports 12 times in 4 minutes.",
      question:"How many times does it teleport every minute?",
      answer: 3,
      successLine:"The Enderman vanished into the shadows! 👁️",
    },
    {
      character:"Steve", characterEmoji:"🧑‍🌾", characterColor:"#4CAF50",
      setting:"The Stronghold", settingEmoji:"🗝️",
      story:"Steve needs 12 Eyes of Ender. He has 5 already.",
      question:"How many more Eyes does he need to find?",
      answer: 7,
      successLine:"The End Portal opened with a roar! 🐉",
    },
    {
      character:"Alex", characterEmoji:"🧑‍🦰", characterColor:"#FF9800",
      setting:"The Village", settingEmoji:"🏘️",
      story:"Alex trades with 6 villagers. Each gives 4 emeralds.",
      question:"How many emeralds did Alex earn?",
      answer: 24,
      successLine:"Alex is the richest trader in all of Minecraft! 💎",
    },
  ] : [
    {
      character:"Steve", characterEmoji:"🧑‍🌾", characterColor:"#4CAF50",
      setting:"The Mine", settingEmoji:"⛏️",
      story:"Steve digs 4 tunnels. Each tunnel is 6 blocks long.",
      question:"How many blocks long are all tunnels combined?",
      answer: 24,
      successLine:"Steve found a massive vein of iron! ⛏️",
    },
    {
      character:"Alex", characterEmoji:"🧑‍🦰", characterColor:"#FF9800",
      setting:"The Crafting Table", settingEmoji:"🪵",
      story:"Alex needs 7 iron ingots per sword. She wants 3 swords.",
      question:"How many iron ingots does Alex need?",
      answer: 21,
      successLine:"Alex crafted three gleaming swords! ⚔️",
    },
    {
      character:"Villager", characterEmoji:"👨‍🌾", characterColor:"#795548",
      setting:"The Market", settingEmoji:"🏪",
      story:"A villager has 36 carrots to share equally into 4 stacks.",
      question:"How many carrots are in each stack?",
      answer: 9,
      successLine:"Every rabbit in the village got their carrots! 🐇",
    },
    {
      character:"Steve", characterEmoji:"🧑‍🌾", characterColor:"#4CAF50",
      setting:"The Jungle", settingEmoji:"🌴",
      story:"Steve collects 5 cocoa beans per tree from 8 trees.",
      question:"How many cocoa beans did Steve collect?",
      answer: 40,
      successLine:"Steve baked the world's biggest chocolate cake! 🎂",
    },
    {
      character:"Alex", characterEmoji:"🧑‍🦰", characterColor:"#FF9800",
      setting:"The Ocean Monument", settingEmoji:"🌊",
      story:"Alex finds 48 prismarine shards and puts them in 6 chests equally.",
      question:"How many shards go in each chest?",
      answer: 8,
      successLine:"Alex decorated her underwater mansion! 🏠",
    },
  ];

  const range = easy ? 3 : hard ? 10 : 6;
  return bank.map(m => ({ ...m, choices: makeChoices(m.answer, range) }))
    .sort(() => Math.random() - 0.5);
}

// ── Block pixel art scene ─────────────────────────────────────────────────────

function MinecraftScene({ settingEmoji }: { settingEmoji: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      {/* Sky */}
      <div className="absolute inset-0" style={{background:"linear-gradient(180deg,#87CEEB 0%,#B8E4F7 50%,#E0F4FF 100%)"}}/>
      {/* Pixel sun */}
      <div className="absolute top-4 right-8 w-10 h-10 rounded-sm" style={{background:"#FFD700", boxShadow:"0 0 0 3px #FFA000"}}/>
      {/* Clouds — blocky */}
      <div className="absolute top-6 left-4 flex gap-0">
        {[16,24,16].map((w,i) => <div key={i} className="h-6 rounded-none" style={{width:w, background:"white", opacity:0.9}}/>)}
      </div>
      <div className="absolute top-10 right-20 flex gap-0">
        {[12,20,12].map((w,i) => <div key={i} className="h-5 rounded-none" style={{width:w, background:"white", opacity:0.85}}/>)}
      </div>
      {/* Grass blocks row */}
      <div className="absolute bottom-0 left-0 right-0 h-20 flex">
        {Array.from({length:12}).map((_,i) => (
          <div key={i} className="flex-1 flex flex-col">
            <div className="h-5" style={{background:"#5AAD3C"}}/>
            <div className="flex-1" style={{background:"#8B6914"}}/>
          </div>
        ))}
      </div>
      {/* Stone blocks peeking */}
      {[20, 45, 65].map((l, i) => (
        <div key={i} className="absolute bottom-14 w-8 h-8 rounded-sm"
          style={{left:`${l}%`, background:"#9E9E9E", border:"2px solid #757575"}}/>
      ))}
      {/* Location badge */}
      <div className="absolute bottom-16 right-6 text-5xl">{settingEmoji}</div>
      {/* Pixel heart icons */}
      <div className="absolute top-4 left-4 flex gap-1">
        {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-none text-xs flex items-center justify-center" style={{background:"#E53935"}}>❤️</div>)}
      </div>
    </div>
  );
}

// ── Completion screen ─────────────────────────────────────────────────────────

function CompletionScreen({ score, total, onRetry, onBack }: { score: number; total: number; onRetry: () => void; onBack: () => void }) {
  const stars = score >= total * 0.9 ? 3 : score >= total * 0.6 ? 2 : 1;
  const diamonds = Math.round((score / total) * 12);
  return (
    <div className="max-w-md mx-auto text-center py-8 px-4">
      <div className="text-6xl mb-2 animate-bounce">💎</div>
      <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">Mission Complete!</h2>
      <p className="text-gray-500 mb-4">Steve and Alex are impressed!</p>
      <div className="flex justify-center gap-2 text-5xl mb-6">
        {Array.from({length:3}).map((_,i) => (
          <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>⭐</span>
        ))}
      </div>
      <div className="rounded-[20px] p-5 mb-6"
        style={{background:"linear-gradient(135deg,#E8F5E9,#C8E6C9)", border:"3px solid #4CAF50", boxShadow:"0 5px 0 #4CAF5060"}}>
        <p className="font-baloo text-4xl font-extrabold text-green-800">{score}/{total} correct!</p>
        <div className="flex justify-center gap-0.5 mt-2 flex-wrap">
          {Array.from({length:12}).map((_,i) => (
            <div key={i} className="w-5 h-5 rounded-sm"
              style={{background: i < diamonds ? "#00ACC1" : "#B0BEC5"}}/>
          ))}
        </div>
        <p className="text-green-600 font-bold text-sm mt-2">{diamonds} diamonds earned!</p>
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={onBack} className="btn-secondary px-6">Back to Hub</button>
        <button onClick={onRetry} className="btn-primary px-6" style={{background:"#4CAF50", boxShadow:"0 4px 0 #388E3C"}}>
          More Missions!
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function MinecraftMathMission({ age, childId }: Props) {
  const router = useRouter();
  const [missions, setMissions] = useState<MathMission[]>([]);
  const [idx, setIdx]               = useState(0);
  const [phase, setPhase]           = useState<"story"|"question"|"result">("story");
  const [selected, setSelected]     = useState<number | null>(null);
  const [score, setScore]           = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => { setMissions(buildMissions(age)); }, [age]);

  if (!missions.length) return null;

  const mission = missions[idx];
  const TOTAL   = missions.length;
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
        body: JSON.stringify({ childId, module: "MATH", score: Math.round((score / TOTAL) * 100), timeTaken: 90 }),
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

  // ── Story phase ──
  if (phase === "story") return (
    <div className="max-w-md mx-auto px-2">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {Array.from({length:TOTAL}).map((_,i) => (
            <div key={i} className="w-8 h-2 rounded-none transition-all"
              style={{background: i < idx ? "#4CAF50" : i === idx ? "#8BC34A" : "#C8E6C9"}}/>
          ))}
        </div>
        <span className="text-xs font-bold text-green-700">Mission {idx+1}/{TOTAL}</span>
      </div>

      {/* Scene */}
      <div className="relative rounded-[24px] overflow-hidden mb-4" style={{minHeight:200}}>
        <MinecraftScene settingEmoji={mission.settingEmoji}/>
        <div className="relative z-10 p-5 pb-24">
          <div className="inline-flex items-center gap-2 rounded-sm px-4 py-2 mb-4 font-bold text-white text-sm"
            style={{background: mission.characterColor}}>
            {mission.characterEmoji} {mission.character} needs your help!
          </div>
          <div className="bg-white rounded-[16px] p-4 shadow-lg max-w-xs"
            style={{border:`3px solid ${mission.characterColor}`, borderRadius:"4px"}}>
            <p className="font-bold text-gray-700 text-sm leading-relaxed">{mission.story}</p>
          </div>
        </div>
      </div>

      {/* Mission card */}
      <div className="rounded-sm p-4 mb-5"
        style={{background:"#E8F5E9", border:"3px solid #4CAF50", boxShadow:"0 4px 0 #4CAF5040"}}>
        <p className="font-baloo text-base font-extrabold text-green-800">🪓 Craft the answer:</p>
        <p className="text-green-700 font-bold text-sm">{mission.question}</p>
      </div>

      <button
        onClick={() => setPhase("question")}
        className="btn-primary w-full text-lg rounded-sm"
        style={{background: mission.characterColor, boxShadow:`0 5px 0 ${mission.characterColor}80`, borderRadius:"4px"}}
      >
        Start Crafting! ⛏️
      </button>
    </div>
  );

  // ── Question phase ──
  if (phase === "question") return (
    <div className="max-w-md mx-auto px-2">
      <div className="rounded-sm px-4 py-3 mb-5 flex items-center gap-3"
        style={{background: mission.characterColor + "15", border:`2px solid ${mission.characterColor}40`}}>
        <span className="text-2xl">{mission.characterEmoji}</span>
        <p className="font-bold text-sm text-gray-700">{mission.question}</p>
      </div>

      {/* Minecraft-style choice grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {mission.choices.map((c) => (
          <button
            key={c}
            onClick={() => handleAnswer(c)}
            className="rounded-sm py-6 font-baloo text-3xl font-extrabold transition-all hover:-translate-y-1"
            style={{
              background:"#8D6E63",
              border:"3px solid #5D4037",
              boxShadow:"0 5px 0 #3E2723",
              color:"white",
              textShadow:"0 2px 4px rgba(0,0,0,0.5)",
              borderRadius:"4px",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-gray-400 font-medium">
        Pick the right block to craft the answer!
      </div>
    </div>
  );

  // ── Result phase ──
  return (
    <div className="max-w-md mx-auto px-2">
      <div className="relative rounded-[24px] overflow-hidden mb-5" style={{minHeight:200}}>
        <MinecraftScene settingEmoji={mission.settingEmoji}/>
        <div className="relative z-10 p-6 flex flex-col items-center justify-center" style={{minHeight:200}}>
          {correct ? (
            <div className="bg-white rounded-sm p-4 shadow-lg text-center max-w-xs"
              style={{border:`3px solid ${mission.characterColor}`, borderRadius:"4px"}}>
              <div className="text-5xl mb-2 animate-bounce">{mission.characterEmoji}</div>
              <p className="font-baloo text-xl font-extrabold mb-1" style={{color: mission.characterColor}}>
                Crafted! ✅
              </p>
              <p className="text-gray-600 text-sm font-medium">{mission.successLine}</p>
              <div className="flex justify-center gap-1 mt-2">
                {[1,2,3].map(i => <span key={i} className="text-2xl">⭐</span>)}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-sm p-4 shadow-lg text-center max-w-xs"
              style={{border:"3px solid #E53935", borderRadius:"4px"}}>
              <div className="text-5xl mb-2">💥</div>
              <p className="font-baloo text-lg font-extrabold text-red-600 mb-1">
                Creeper got it! Try again next time!
              </p>
              <p className="text-gray-500 text-sm">The answer was <strong>{mission.answer}</strong></p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={next}
        className="btn-primary w-full text-lg rounded-sm"
        style={{background: mission.characterColor, boxShadow:`0 5px 0 ${mission.characterColor}80`, borderRadius:"4px"}}
      >
        {idx + 1 >= TOTAL ? "See Results! 🏆" : "Next Mission! →"}
      </button>
    </div>
  );
}
