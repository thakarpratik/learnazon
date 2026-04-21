"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────────

interface Mission {
  hero: string;
  heroEmoji: string;
  heroColor: string;
  setting: string;
  settingEmoji: string;
  story: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  successLine: string;
  explanation: string;
}

interface Props { age: number; childId: string; }

// ── Mission bank ─────────────────────────────────────────────────────────────

const EASY_MISSIONS: Mission[] = [
  {
    hero: "Spider-Man", heroEmoji: "🕷️", heroColor: "#C62828",
    setting: "School Crossing", settingEmoji: "🏫",
    story: "Spider-Man is helping kids get to school safely. The traffic light turns GREEN!",
    question: "What should you do at a green traffic light?",
    options: ["Cross the road quickly", "Wait and look both ways, then cross", "Run as fast as you can", "Close your eyes and go"],
    correctIndex: 1,
    successLine: "Great job! Spider-Man is proud — you crossed safely! 🕷️",
    explanation: "Always look left and right before crossing, even on green, to make sure all cars have stopped.",
  },
  {
    hero: "Wonder Woman", heroEmoji: "⭐", heroColor: "#C2185B",
    setting: "Kitchen", settingEmoji: "🍽️",
    story: "Wonder Woman is teaching kids about staying healthy. It's time for lunch!",
    question: "What should you do before you eat your food?",
    options: ["Wipe hands on trousers", "Wash hands with soap and water", "Just use a napkin", "Start eating right away"],
    correctIndex: 1,
    successLine: "Excellent! Wonder Woman says clean hands keep germs away! ⭐",
    explanation: "Washing hands with soap and water for 20 seconds removes germs that can make you sick.",
  },
  {
    hero: "Batman", heroEmoji: "🦇", heroColor: "#212121",
    setting: "Playground", settingEmoji: "🛝",
    story: "Batman is watching over the playground. You fall and scrape your knee.",
    question: "What should you do when you get hurt at the playground?",
    options: ["Hide so no one sees", "Tell a grown-up or teacher", "Pretend nothing happened", "Run home alone"],
    correctIndex: 1,
    successLine: "Batman agrees — telling an adult is always the bravest thing! 🦇",
    explanation: "Telling a trusted adult means you get proper help and they can make sure you're safe.",
  },
  {
    hero: "Captain Marvel", heroEmoji: "⚡", heroColor: "#1565C0",
    setting: "Supermarket", settingEmoji: "🛒",
    story: "Captain Marvel is shopping with you. You realise you are lost and can't see your parent!",
    question: "What is the BEST thing to do when you are lost in a shop?",
    options: ["Walk outside to look for them", "Go with any adult who offers help", "Stay where you are and call out for your parent", "Sit down and cry"],
    correctIndex: 2,
    successLine: "Captain Marvel says staying put is the smartest power move! ⚡",
    explanation: "Staying in one place helps your parent find you — moving around makes it harder for them to locate you.",
  },
  {
    hero: "Iron Man", heroEmoji: "🤖", heroColor: "#B71C1C",
    setting: "Dining Table", settingEmoji: "🥦",
    story: "Iron Man is powering up with healthy food. He wants you to fuel up too!",
    question: "Which food gives you the most energy and keeps you healthy?",
    options: ["A bag of crisps", "A chocolate bar", "Fruits and vegetables", "Fizzy drinks"],
    correctIndex: 2,
    successLine: "Iron Man's suit runs on good fuel — and so do you! 🤖",
    explanation: "Fruits and vegetables contain vitamins and minerals that give your body real energy and keep you strong.",
  },
];

const MEDIUM_MISSIONS: Mission[] = [
  {
    hero: "Spider-Man", heroEmoji: "🕷️", heroColor: "#C62828",
    setting: "Park", settingEmoji: "🌳",
    story: "Spider-Man is nearby. A stranger you've never met offers you sweets and asks you to come with them.",
    question: "What should you do?",
    options: ["Take the sweets and follow them", "Say NO loudly and run to a trusted adult", "Ask them their name first", "Think about it for a while"],
    correctIndex: 1,
    successLine: "Spider-Man webs the danger away — your instinct was right! 🕷️",
    explanation: "Trusted strangers never pressure children for company — saying no loudly and finding help is always correct.",
  },
  {
    hero: "Wonder Woman", heroEmoji: "⭐", heroColor: "#C2185B",
    setting: "School Building", settingEmoji: "🔔",
    story: "Wonder Woman is visiting your school. The fire alarm goes off during class!",
    question: "What should you do when the fire alarm rings at school?",
    options: ["Hide under your desk", "Grab your bag and run", "Walk calmly with your class to the exit", "Stay and wait to see if it's real"],
    correctIndex: 2,
    successLine: "Wonder Woman leads the way — calm and safe every time! ⭐",
    explanation: "Walking calmly in line with your teacher keeps everyone together and prevents dangerous crowding at exits.",
  },
  {
    hero: "Batman", heroEmoji: "🦇", heroColor: "#212121",
    setting: "Road", settingEmoji: "🚗",
    story: "Batman is on patrol. Your ball rolls into a busy road.",
    question: "What should you do?",
    options: ["Run straight onto the road to get it", "Ask a grown-up nearby to help you", "Wait for cars to slow down then dash", "Leave it and walk on"],
    correctIndex: 1,
    successLine: "Batman would do the same — your safety is worth more than any ball! 🦇",
    explanation: "A ball can be replaced but you cannot — always ask a grown-up because drivers may not see a small child.",
  },
  {
    hero: "Captain Marvel", heroEmoji: "⚡", heroColor: "#1565C0",
    setting: "Home", settingEmoji: "🏠",
    story: "Captain Marvel is on duty. You smell smoke in the house but don't see fire.",
    question: "What should you do FIRST?",
    options: ["Look around to find where the smoke is from", "Tell an adult immediately and leave the building", "Open windows to let smoke out", "Go back to sleep"],
    correctIndex: 1,
    successLine: "Captain Marvel fires up — you acted fast and that saves lives! ⚡",
    explanation: "Smoke means danger — telling an adult and leaving straight away gives everyone the best chance to be safe.",
  },
  {
    hero: "Iron Man", heroEmoji: "🤖", heroColor: "#B71C1C",
    setting: "Online World", settingEmoji: "💻",
    story: "Iron Man uses technology safely. Someone online you've never met asks for your home address.",
    question: "What should you do?",
    options: ["Share it — they seem friendly", "Tell a parent or trusted adult right away", "Give a fake address", "Ask why they want it first"],
    correctIndex: 1,
    successLine: "Iron Man's security systems are on — great call telling a grown-up! 🤖",
    explanation: "Personal information like your address should never be shared online — always tell an adult if a stranger asks.",
  },
];

const HARD_MISSIONS: Mission[] = [
  {
    hero: "Spider-Man", heroEmoji: "🕷️", heroColor: "#C62828",
    setting: "School Corridor", settingEmoji: "🚶",
    story: "Spider-Man needs your wisdom. Your friends dare you to sneak out of school at lunch to buy sweets — if you don't, they'll call you a coward.",
    question: "What should a true superhero do?",
    options: ["Sneak out to prove you're brave", "Laugh it off and say 'real heroes follow school rules'", "Agree but tell a teacher secretly", "Go along to keep the peace"],
    correctIndex: 1,
    successLine: "Spider-Man says refusing peer pressure IS the superpower! 🕷️",
    explanation: "Real bravery is standing by your values even when friends tease — breaking school rules puts you in danger and trouble.",
  },
  {
    hero: "Wonder Woman", heroEmoji: "⭐", heroColor: "#C2185B",
    setting: "Home Alone", settingEmoji: "🔑",
    story: "Wonder Woman trusts you. You're home alone and there is a knock at the door. You don't know who it is.",
    question: "What should you do?",
    options: ["Open the door to check who it is", "Don't open the door — call a parent and tell them", "Shout 'go away' through the door", "Peek through the window and decide"],
    correctIndex: 1,
    successLine: "Wonder Woman stands with you — protecting yourself is true strength! ⭐",
    explanation: "Never open the door to strangers when alone — contacting a trusted adult gives you safety and backup.",
  },
  {
    hero: "Batman", heroEmoji: "🦇", heroColor: "#212121",
    setting: "Online Gaming", settingEmoji: "🎮",
    story: "Batman monitors the digital world. A player in your online game sends you a friend request and asks to meet you in person to 'team up'.",
    question: "What is the safest response?",
    options: ["Agree — you've been playing together for weeks", "Decline and show the message to a parent", "Ask them to prove they're a real kid first", "Tell your school friends about it"],
    correctIndex: 1,
    successLine: "Batman's detective instincts were right — you made the safe call! 🦇",
    explanation: "Online friends are strangers in real life — meeting someone from the internet without a parent's knowledge is dangerous.",
  },
  {
    hero: "Captain Marvel", heroEmoji: "⚡", heroColor: "#1565C0",
    setting: "Park", settingEmoji: "🩹",
    story: "Captain Marvel needs a medic! Your friend trips and cuts their hand badly — there's a lot of blood.",
    question: "What should you do FIRST?",
    options: ["Run and get help from a nearby adult immediately", "Pour water over the cut straight away", "Tie a tight band above the wound", "Tell your friend to press on it and wait"],
    correctIndex: 0,
    successLine: "Captain Marvel flies in — getting an adult fast was the power move! ⚡",
    explanation: "For serious bleeding in children, getting a responsible adult immediately is safest — they can apply proper first aid.",
  },
  {
    hero: "Iron Man", heroEmoji: "🤖", heroColor: "#B71C1C",
    setting: "Social Media", settingEmoji: "📱",
    story: "Iron Man scans the digital realm. You see a post online that makes fun of a classmate and lots of kids are sharing it and laughing.",
    question: "What should a hero do?",
    options: ["Share it — everyone else is doing it", "Like it but don't share", "Don't share it; tell a trusted adult and check on your classmate", "Post a comment defending yourself"],
    correctIndex: 2,
    successLine: "Iron Man powers down the bullying — your kindness is a real superpower! 🤖",
    explanation: "Cyberbullying hurts real people — not sharing, reporting it, and supporting the person affected is always the hero's choice.",
  },
];

function getMissions(age: number): Mission[] {
  if (age <= 6) return EASY_MISSIONS;
  if (age <= 8) return MEDIUM_MISSIONS;
  return HARD_MISSIONS;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── City Skyline Scene ────────────────────────────────────────────────────────

function CityScene({ heroEmoji, settingEmoji }: { heroEmoji: string; settingEmoji: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      {/* Night-sky gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0D0D2B 0%,#1A1A4E 50%,#2D2D70 100%)" }} />

      {/* Stars */}
      {[
        { left: "8%",  top: "8%",  size: 4 },
        { left: "18%", top: "5%",  size: 3 },
        { left: "30%", top: "12%", size: 4 },
        { left: "45%", top: "6%",  size: 3 },
        { left: "58%", top: "10%", size: 4 },
        { left: "70%", top: "4%",  size: 3 },
        { left: "82%", top: "9%",  size: 4 },
        { left: "92%", top: "14%", size: 3 },
        { left: "12%", top: "22%", size: 3 },
        { left: "38%", top: "20%", size: 3 },
        { left: "62%", top: "18%", size: 4 },
        { left: "88%", top: "22%", size: 3 },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left, top: star.top,
            width: star.size, height: star.size,
            opacity: 0.7 + (i % 3) * 0.1,
            animation: `pulse ${1.5 + (i % 4) * 0.4}s ease-in-out infinite alternate`,
          }}
        />
      ))}

      {/* Moon */}
      <div className="absolute" style={{ top: "8%", right: "12%", fontSize: 28, opacity: 0.9 }}>🌙</div>

      {/* Buildings — back layer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-2">
        {[
          { w: 36, h: 80, bg: "#1B1B3A" },
          { w: 28, h: 60, bg: "#16213E" },
          { w: 44, h: 100, bg: "#1B1B3A" },
          { w: 32, h: 70, bg: "#0F3460" },
          { w: 50, h: 90, bg: "#1B1B3A" },
          { w: 30, h: 55, bg: "#16213E" },
          { w: 40, h: 85, bg: "#0F3460" },
          { w: 36, h: 75, bg: "#1B1B3A" },
          { w: 28, h: 50, bg: "#16213E" },
          { w: 44, h: 95, bg: "#1B1B3A" },
        ].map((b, i) => (
          <div
            key={i}
            style={{ width: b.w, height: b.h, backgroundColor: b.bg, borderRadius: "3px 3px 0 0", position: "relative", flexShrink: 0 }}
          >
            {/* Windows */}
            {Array.from({ length: Math.floor(b.h / 20) }).map((_, row) => (
              <div key={row} className="flex gap-1 justify-center mt-2">
                {Array.from({ length: 2 }).map((_, col) => (
                  <div
                    key={col}
                    style={{
                      width: 6, height: 8,
                      backgroundColor: Math.random() > 0.4 ? "#FFD700" : "#1A1A4E",
                      borderRadius: 1, opacity: 0.9,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Cape flying across sky */}
      <div
        className="absolute"
        style={{ top: "28%", left: "10%", fontSize: 36, transform: "scaleX(-1)", opacity: 0.85 }}
      >
        🦸
      </div>
      <div
        className="absolute"
        style={{ top: "30%", left: "20%", fontSize: 20, opacity: 0.6 }}
      >
        💨
      </div>

      {/* Setting badge bottom-right */}
      <div className="absolute bottom-16 right-4 text-4xl">{settingEmoji}</div>
    </div>
  );
}

// ── Star burst animation ───────────────────────────────────────────────────────

function StarBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {["⭐", "🌟", "✨", "⭐", "🌟", "✨", "⭐"].map((s, i) => (
        <span
          key={i}
          className="absolute text-3xl animate-bounce"
          style={{
            left: `${12 + i * 12}%`,
            top: `${18 + Math.sin(i) * 28}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

// ── Badge Completion screen ────────────────────────────────────────────────────

function HeroBadge({ score, total, onReplay, onHome }: { score: number; total: number; onReplay: () => void; onHome: () => void }) {
  const pct = Math.round((score / total) * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

  return (
    <div className="max-w-md mx-auto text-center py-8 px-4">
      {/* Badge */}
      <div className="relative inline-block mb-4">
        <div
          className="w-36 h-36 rounded-full flex flex-col items-center justify-center mx-auto shadow-2xl"
          style={{ background: "linear-gradient(135deg,#FFD700,#FFA000)", border: "5px solid #FF6F00", boxShadow: "0 0 30px #FFD70080" }}
        >
          <span style={{ fontSize: 48 }}>🦸</span>
          <span className="text-xs font-extrabold text-orange-900 mt-1">HERO BADGE</span>
        </div>
        <div className="absolute -top-2 -right-2 text-3xl animate-bounce">⭐</div>
        <div className="absolute -bottom-1 -left-2 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>✨</div>
      </div>

      <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">Hero Badge Earned!</h2>
      <p className="text-gray-500 mb-4 font-medium">You completed all 5 Life Skills Missions!</p>

      <div className="flex justify-center gap-2 text-5xl mb-6">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>⭐</span>
        ))}
      </div>

      <div
        className="rounded-[20px] p-5 mb-6"
        style={{ background: "linear-gradient(135deg,#1A1A4E,#0F3460)", border: "3px solid #FFD700", boxShadow: "0 5px 0 #FFD70060" }}
      >
        <p className="font-baloo text-4xl font-extrabold text-yellow-300">{score}/{total} Correct!</p>
        <p className="text-yellow-100 font-bold text-sm mt-1">{total} missions completed · You are a Life Skills Hero!</p>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onHome} className="btn-secondary px-6">Back to Base</button>
        <button onClick={onReplay} className="btn-primary px-6">Play Again! 🦸</button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function SuperheroLifeSkillsMission({ age, childId }: Props) {
  const router = useRouter();

  const [missions] = useState<Mission[]>(() => shuffle(getMissions(age)).slice(0, 5));
  const [missionIdx, setMissionIdx]         = useState(0);
  const [phase, setPhase]                   = useState<"story" | "answer" | "result">("story");
  const [selectedIdx, setSelectedIdx]       = useState<number | null>(null);
  const [score, setScore]                   = useState(0);
  const [showComplete, setShowComplete]     = useState(false);

  const mission = missions[missionIdx];
  const TOTAL = missions.length;

  // Reset on mission change
  useEffect(() => {
    setPhase("story");
    setSelectedIdx(null);
  }, [missionIdx]);

  // ── Handle option selection ──────────────────────────────────────────────────
  const handleSelect = (idx: number) => {
    if (phase === "result") return; // already answered
    setSelectedIdx(idx);
    setPhase("result");
    if (idx === mission.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  // ── Next mission / complete ──────────────────────────────────────────────────
  const nextMission = () => {
    if (missionIdx + 1 >= TOTAL) {
      const finalScore = Math.round(((score + (selectedIdx === mission.correctIndex ? 0 : 0)) / TOTAL) * 100);
      // score is already updated before this call via setState — calculate correctly
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, module: "LIFE_SKILLS", score: Math.round((score / TOTAL) * 100), timeTaken: 180 }),
      }).catch(console.error);
      setShowComplete(true);
    } else {
      setMissionIdx((i) => i + 1);
    }
  };

  const handleReplay = () => {
    setMissionIdx(0);
    setScore(0);
    setPhase("story");
    setSelectedIdx(null);
    setShowComplete(false);
  };

  // ── Completion screen ────────────────────────────────────────────────────────
  if (showComplete) {
    return (
      <HeroBadge
        score={score}
        total={TOTAL}
        onReplay={handleReplay}
        onHome={() => router.push("/dashboard")}
      />
    );
  }

  // ── Progress bar ─────────────────────────────────────────────────────────────
  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex gap-1">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all"
            style={{
              width: 36,
              background: i < missionIdx ? "#FFD700" : i === missionIdx ? "#FFA000" : "#1A1A4E",
              border: i === missionIdx ? "2px solid #FFD700" : "none",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-bold" style={{ color: "#FFD700" }}>
        Mission {missionIdx + 1}/{TOTAL}
      </span>
    </div>
  );

  // ── Story phase ──────────────────────────────────────────────────────────────
  if (phase === "story") {
    return (
      <div className="max-w-md mx-auto px-2">
        <ProgressBar />

        {/* Scene card */}
        <div className="relative rounded-[24px] overflow-hidden mb-4" style={{ minHeight: 220 }}>
          <CityScene heroEmoji={mission.heroEmoji} settingEmoji={mission.settingEmoji} />
          <div className="relative z-10 p-5 pb-28">
            {/* Hero badge */}
            <div
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-4 font-bold text-white text-sm"
              style={{ background: mission.heroColor, boxShadow: `0 3px 0 ${mission.heroColor}80` }}
            >
              {mission.heroEmoji} {mission.hero} needs your wisdom!
            </div>
            {/* Story bubble */}
            <div
              className="bg-white rounded-[16px] p-4 shadow-lg max-w-xs"
              style={{ border: `3px solid ${mission.heroColor}` }}
            >
              <p className="font-bold text-gray-700 text-sm leading-relaxed">{mission.story}</p>
            </div>
          </div>
        </div>

        {/* Mission briefing */}
        <div
          className="rounded-[20px] p-4 mb-5 flex items-center gap-3"
          style={{ background: "#1A1A4E", border: "3px solid #FFD700", boxShadow: "0 4px 0 #FFD70040" }}
        >
          <span className="text-3xl">🦸</span>
          <div>
            <p className="font-baloo text-base font-extrabold text-yellow-300">Your mission:</p>
            <p className="text-yellow-100 font-bold text-sm">{mission.question}</p>
          </div>
        </div>

        <button
          onClick={() => setPhase("answer")}
          className="btn-primary w-full text-lg"
          style={{ background: mission.heroColor, boxShadow: `0 5px 0 ${mission.heroColor}80` }}
        >
          ACCEPT MISSION! {mission.heroEmoji}
        </button>
      </div>
    );
  }

  // ── Answer / Result phase (shared — options always visible) ──────────────────
  const isAnswered = phase === "result";
  const isCorrect = selectedIdx === mission.correctIndex;

  function getOptionStyle(idx: number): React.CSSProperties {
    if (!isAnswered) {
      return {
        background: "#1A1A4E",
        border: "3px solid #2D2D70",
        color: "#E0E0FF",
        cursor: "pointer",
        transition: "transform 0.1s, box-shadow 0.1s",
      };
    }
    if (idx === mission.correctIndex) {
      return {
        background: "#1B5E20",
        border: "3px solid #4CAF50",
        color: "#FFFFFF",
        boxShadow: "0 0 12px #4CAF5080",
      };
    }
    if (idx === selectedIdx) {
      return {
        background: "#B71C1C",
        border: "3px solid #EF5350",
        color: "#FFFFFF",
        boxShadow: "0 0 12px #EF535080",
      };
    }
    return {
      background: "#1A1A4E",
      border: "3px solid #2D2D70",
      color: "#606090",
      opacity: 0.5,
    };
  }

  function getOptionIcon(idx: number): string {
    if (!isAnswered) return "";
    if (idx === mission.correctIndex) return " ✅";
    if (idx === selectedIdx) return " ❌";
    return "";
  }

  return (
    <div className="max-w-md mx-auto px-2">
      <ProgressBar />

      {/* Scene card — shown during answer too */}
      <div className="relative rounded-[24px] overflow-hidden mb-4" style={{ minHeight: isAnswered ? 180 : 140 }}>
        <CityScene heroEmoji={mission.heroEmoji} settingEmoji={mission.settingEmoji} />
        {isAnswered && isCorrect && <StarBurst />}
        <div className="relative z-10 p-5">
          {/* Hero badge */}
          <div
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-3 font-bold text-white text-sm"
            style={{ background: mission.heroColor, boxShadow: `0 3px 0 ${mission.heroColor}80` }}
          >
            {mission.heroEmoji} {mission.hero}
          </div>

          {isAnswered ? (
            /* Feedback bubble */
            <div
              className="bg-white rounded-[16px] p-3 shadow-lg max-w-xs"
              style={{ border: `3px solid ${isCorrect ? "#4CAF50" : "#EF5350"}` }}
            >
              {isCorrect ? (
                <>
                  <p className="font-baloo text-base font-extrabold mb-1" style={{ color: "#2E7D32" }}>
                    Amazing! Mission Accomplished! 🎉
                  </p>
                  <p className="text-gray-600 text-xs font-medium">{mission.successLine}</p>
                </>
              ) : (
                <>
                  <p className="font-baloo text-base font-extrabold mb-1 text-red-600">
                    Not quite — but now you know! 💪
                  </p>
                  <p className="text-gray-600 text-xs font-medium">{mission.successLine}</p>
                </>
              )}
            </div>
          ) : (
            /* Question reminder */
            <div
              className="bg-white rounded-[16px] p-3 shadow-lg max-w-xs"
              style={{ border: `3px solid ${mission.heroColor}` }}
            >
              <p className="font-bold text-gray-700 text-sm">{mission.question}</p>
            </div>
          )}
        </div>
      </div>

      {/* 2×2 choice grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {mission.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={isAnswered}
            className="rounded-[16px] p-3 text-left text-sm font-bold leading-snug"
            style={getOptionStyle(idx)}
          >
            <span
              className="inline-block w-6 h-6 rounded-full text-center mr-1 font-extrabold text-xs leading-6 shrink-0"
              style={{
                background: isAnswered && idx === mission.correctIndex ? "#4CAF50"
                  : isAnswered && idx === selectedIdx ? "#EF5350"
                  : mission.heroColor,
                color: "white",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {["A", "B", "C", "D"][idx]}
            </span>
            {opt}{getOptionIcon(idx)}
          </button>
        ))}
      </div>

      {/* Explanation box (shown after answering) */}
      {isAnswered && (
        <div
          className="rounded-[16px] p-4 mb-4 flex items-start gap-3"
          style={{
            background: isCorrect ? "#1B5E2020" : "#B71C1C15",
            border: `2px solid ${isCorrect ? "#4CAF50" : "#EF5350"}`,
          }}
        >
          <span className="text-2xl shrink-0">{isCorrect ? "💡" : "📖"}</span>
          <div>
            <p className="font-baloo text-sm font-extrabold mb-1" style={{ color: isCorrect ? "#4CAF50" : "#EF5350" }}>
              {isCorrect ? "Why this works:" : "Here's what to remember:"}
            </p>
            <p className="text-sm font-medium" style={{ color: "#C0C0E0" }}>{mission.explanation}</p>
          </div>
        </div>
      )}

      {/* Next / action button */}
      {isAnswered && (
        <button
          onClick={nextMission}
          className="btn-primary w-full text-lg"
          style={{ background: mission.heroColor, boxShadow: `0 5px 0 ${mission.heroColor}80` }}
        >
          {missionIdx + 1 >= TOTAL ? "Claim Your Badge! 🏅" : "Next Mission! →"}
        </button>
      )}
    </div>
  );
}
