"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────────

interface Mission {
  pup: string;
  pupEmoji: string;
  pupColor: string;
  location: string;
  locationEmoji: string;
  story: string;
  taskText: string;
  hours: number;
  minutes: number;
  label: string;
  successLine: string;
}

interface Props { age: number; childId: string; }

// ── Mission bank ─────────────────────────────────────────────────────────────

const EASY_MISSIONS: Mission[] = [
  {
    pup:"Chase", pupEmoji:"🐕", pupColor:"#1565C0", location:"Town Hall", locationEmoji:"🏛️",
    story:"Mayor Goodway is STUCK in the elevator! She needs Chase there at exactly…",
    taskText:"Set the clock to rescue time!",
    hours:3, minutes:0, label:"3:00",
    successLine:"Chase zoomed to Town Hall and saved Mayor Goodway! 🚔",
  },
  {
    pup:"Marshall", pupEmoji:"🐶", pupColor:"#C62828", location:"Farmer Yumi's Farm", locationEmoji:"🐄",
    story:"A calf got stuck in the mud! Marshall's fire hose can reach by…",
    taskText:"Show Marshall when to leave!",
    hours:6, minutes:0, label:"6:00",
    successLine:"Marshall's hose saved the calf! Everyone cheered! 🚒",
  },
  {
    pup:"Skye", pupEmoji:"🐩", pupColor:"#E91E8C", location:"Seal Island", locationEmoji:"🏝️",
    story:"Wally the walrus is stranded! Skye's helicopter must arrive by…",
    taskText:"Help Skye set her flight time!",
    hours:9, minutes:0, label:"9:00",
    successLine:"Skye spotted Wally from the sky and flew him home! 🚁",
  },
  {
    pup:"Rubble", pupEmoji:"🐾", pupColor:"#F57F17", location:"Jake's Mountain", locationEmoji:"⛰️",
    story:"A snowboard ramp collapsed! Rubble must bulldoze a new path by…",
    taskText:"Set the clock to Rubble's start time!",
    hours:2, minutes:0, label:"2:00",
    successLine:"Rubble rebuilt the ramp — snowboarding is back on! 🏗️",
  },
  {
    pup:"Rocky", pupEmoji:"🐕‍🦺", pupColor:"#2E7D32", location:"Jungle", locationEmoji:"🌿",
    story:"A baby monkey got tangled in vines! Rocky's tools can reach by…",
    taskText:"Tell Rocky when to head out!",
    hours:11, minutes:0, label:"11:00",
    successLine:"Rocky freed the monkey with his claw tool! 🔧",
  },
];

const MEDIUM_MISSIONS: Mission[] = [
  {
    pup:"Chase", pupEmoji:"🐕", pupColor:"#1565C0", location:"Foggy Bottom", locationEmoji:"🌫️",
    story:"Mayor Humdinger stole the gold trophies! Chase must catch him by…",
    taskText:"Set the clock to catch time!",
    hours:4, minutes:30, label:"4:30",
    successLine:"Chase cornered Humdinger and returned every trophy! 🏆",
  },
  {
    pup:"Marshall", pupEmoji:"🐶", pupColor:"#C62828", location:"The Forest", locationEmoji:"🌲",
    story:"Alex is lost in the forest! Marshall's jeep can reach the forest by…",
    taskText:"Help Marshall plan his rescue!",
    hours:7, minutes:30, label:"7:30",
    successLine:"Marshall found Alex by following his flashlight! 💡",
  },
  {
    pup:"Skye", pupEmoji:"🐩", pupColor:"#E91E8C", location:"Adventure Bay Lighthouse", locationEmoji:"🏠",
    story:"The lighthouse light went out! Ships need it back on by…",
    taskText:"Set Skye's mission time!",
    hours:8, minutes:30, label:"8:30",
    successLine:"Skye repaired the lighthouse and saved three ships! ⚓",
  },
  {
    pup:"Zuma", pupEmoji:"🐕", pupColor:"#EF6C00", location:"The Lake", locationEmoji:"🌊",
    story:"Captain Turbot's boat is sinking! Zuma's hovercraft must arrive by…",
    taskText:"Set Zuma's rescue time!",
    hours:1, minutes:30, label:"1:30",
    successLine:"Zuma pulled the boat to safety just in time! 🛶",
  },
  {
    pup:"Rocky", pupEmoji:"🐕‍🦺", pupColor:"#2E7D32", location:"Jake's Snowboard Shop", locationEmoji:"🏂",
    story:"The snowboard machine is broken! Rocky needs to fix it by…",
    taskText:"Tell Rocky when the shop closes!",
    hours:5, minutes:30, label:"5:30",
    successLine:"Rocky's screwdriver saved the whole shop! ⚙️",
  },
];

const HARD_MISSIONS: Mission[] = [
  {
    pup:"Chase", pupEmoji:"🐕", pupColor:"#1565C0", location:"Dino Wilds", locationEmoji:"🦕",
    story:"A baby dino escaped the park! Chase needs to radio Tracker by…",
    taskText:"Set the exact rescue time!",
    hours:10, minutes:15, label:"10:15",
    successLine:"Chase wrangled the dino safely back! 🦖",
  },
  {
    pup:"Marshall", pupEmoji:"🐶", pupColor:"#C62828", location:"Adventure Bay Hospital", locationEmoji:"🏥",
    story:"Three kittens need checkups! Marshall's ambulance departs at…",
    taskText:"Set Marshall's departure time!",
    hours:2, minutes:45, label:"2:45",
    successLine:"Marshall gave every kitten a clean bill of health! 🐱",
  },
  {
    pup:"Skye", pupEmoji:"🐩", pupColor:"#E91E8C", location:"Parrot Island", locationEmoji:"🦜",
    story:"Arrby the pirate parrot is lost at sea! Skye's sub-wing departs at…",
    taskText:"Help Skye set her departure time!",
    hours:6, minutes:20, label:"6:20",
    successLine:"Skye found Arrby roosting on a coconut tree! 🌴",
  },
  {
    pup:"Everest", pupEmoji:"🐾", pupColor:"#4A148C", location:"Jake's Mountain Pass", locationEmoji:"🏔️",
    story:"A snow plough is blocking the road! Everest must clear it by…",
    taskText:"Set Everest's clearing time!",
    hours:8, minutes:50, label:"8:50",
    successLine:"Everest ploughed the pass and the race cars zoomed through! ❄️",
  },
  {
    pup:"Tracker", pupEmoji:"🐕", pupColor:"#33691E", location:"Monkey Temple", locationEmoji:"🛕",
    story:"A golden statue is trapped under vines! Tracker's jeep crane arrives by…",
    taskText:"Set the rescue time!",
    hours:11, minutes:40, label:"11:40",
    successLine:"Tracker lifted the statue and the monkeys celebrated! 🐒",
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

function timeToAngle(hours: number, minutes: number) {
  return {
    hourAngle: ((hours % 12) + minutes / 60) * 30,
    minAngle:  minutes * 6,
  };
}

// ── Interactive Clock ─────────────────────────────────────────────────────────

function InteractiveClock({
  hourAngle, minAngle,
  onDragStart,
}: {
  hourAngle: number; minAngle: number;
  onDragStart: (hand: "hour" | "min") => void;
}) {
  const C = 110;
  const toXY = (angle: number, len: number) => ({
    x: C + Math.sin((angle * Math.PI) / 180) * len,
    y: C - Math.cos((angle * Math.PI) / 180) * len,
  });
  const hourTip = toXY(hourAngle, 52);
  const minTip  = toXY(minAngle, 72);

  const numbers = [12,1,2,3,4,5,6,7,8,9,10,11];

  return (
    <svg viewBox="0 0 220 220" width="220" height="220" className="touch-none select-none drop-shadow-lg">
      {/* Paw Patrol themed clock face */}
      {/* Outer ring */}
      <circle cx={C} cy={C} r="105" fill="#1565C0" />
      <circle cx={C} cy={C} r="100" fill="#E3F2FD" />
      {/* Paw print tick marks */}
      {Array.from({length:12}).map((_,i) => {
        const a = i * 30;
        const inner = i % 3 === 0 ? 82 : 88;
        const outer = 95;
        const p1 = toXY(a, inner);
        const p2 = toXY(a, outer);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={i%3===0?"#1565C0":"#90CAF9"} strokeWidth={i%3===0?3:1.5} strokeLinecap="round"/>;
      })}
      {/* Numbers */}
      {numbers.map((n, i) => {
        const a = i * 30;
        const p = toXY(a, 74);
        return <text key={n} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
          fontSize="13" fontWeight="bold" fill="#1565C0" fontFamily="Arial">{n}</text>;
      })}
      {/* Paw badge center top */}
      <circle cx={C} cy="28" r="10" fill="#1565C0" opacity="0.15"/>
      <text x={C} y="32" textAnchor="middle" fontSize="12">🐾</text>

      {/* Hour hand */}
      <line
        x1={C} y1={C}
        x2={hourTip.x} y2={hourTip.y}
        stroke="#1565C0" strokeWidth="7" strokeLinecap="round"
        style={{ cursor: "grab" }}
        onMouseDown={() => onDragStart("hour")}
        onTouchStart={() => onDragStart("hour")}
      />
      {/* Minute hand */}
      <line
        x1={C} y1={C}
        x2={minTip.x} y2={minTip.y}
        stroke="#C62828" strokeWidth="4" strokeLinecap="round"
        style={{ cursor: "grab" }}
        onMouseDown={() => onDragStart("min")}
        onTouchStart={() => onDragStart("min")}
      />
      {/* Center dot */}
      <circle cx={C} cy={C} r="7" fill="#1565C0"/>
      <circle cx={C} cy={C} r="4" fill="white"/>

      {/* Drag hints */}
      <text x={C} y="200" textAnchor="middle" fontSize="9" fill="#90CAF9" fontFamily="Arial">drag the hands!</text>
    </svg>
  );
}

// ── Scene SVG backgrounds per mission ────────────────────────────────────────

function SceneBackground({ locationEmoji }: { locationEmoji: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      {/* Sky */}
      <div className="absolute inset-0" style={{background:"linear-gradient(180deg,#56CCF2 0%,#B3E5FC 60%,#E3F2FD 100%)"}}/>
      {/* Clouds */}
      <div className="absolute top-4 left-6 w-24 h-10 bg-white rounded-full opacity-80"/>
      <div className="absolute top-6 left-10 w-16 h-8 bg-white rounded-full opacity-70"/>
      <div className="absolute top-3 right-10 w-20 h-8 bg-white rounded-full opacity-75"/>
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-20 rounded-b-[20px]"
        style={{background:"linear-gradient(180deg,#81C784 0%,#388E3C 100%)"}}/>
      {/* Location badge */}
      <div className="absolute bottom-14 right-6 text-5xl">{locationEmoji}</div>
      {/* Paw prints on ground */}
      {[15,30,50,65].map((l,i) => (
        <div key={i} className="absolute bottom-5 text-xs opacity-40" style={{left:`${l}%`}}>🐾</div>
      ))}
    </div>
  );
}

// ── Star animation ────────────────────────────────────────────────────────────

function StarBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {["⭐","🌟","✨","⭐","🌟","✨","⭐"].map((s,i) => (
        <span key={i} className="absolute text-3xl animate-bounce"
          style={{
            left:`${15+i*12}%`, top:`${20+Math.sin(i)*30}%`,
            animationDelay:`${i*0.1}s`, animationDuration:"0.6s",
          }}>
          {s}
        </span>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function PawPatrolMission({ age, childId }: Props) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const missions = shuffle(getMissions(age)).slice(0, 5);
  const [missionIdx, setMissionIdx]     = useState(0);
  const [hourAngle, setHourAngle]       = useState(0);
  const [minAngle, setMinAngle]         = useState(0);
  const [dragging, setDragging]         = useState<"hour"|"min"|null>(null);
  const [phase, setPhase]               = useState<"story"|"clock"|"result">("story");
  const [correct, setCorrect]           = useState(false);
  const [score, setScore]               = useState(0);
  const [tries, setTries]               = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [hint, setHint]                 = useState("");

  const mission = missions[missionIdx];
  const TOTAL   = missions.length;

  // ── Drag handling ────────────────────────────────────────────────────────
  const getAngle = useCallback((e: MouseEvent | TouchEvent) => {
    const wrap = wrapRef.current;
    if (!wrap) return 0;
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    let angle = Math.atan2(clientX - cx, -(clientY - cy)) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  }, []);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    const angle = getAngle(e);
    if (dragging === "hour") setHourAngle(Math.round(angle / 30) * 30);
    else                     setMinAngle(Math.round(angle / 6) * 6);
  }, [dragging, getAngle]);

  const handleUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup",   handleUp);
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend",  handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup",   handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend",  handleUp);
    };
  }, [handleMove, handleUp]);

  // ── Check answer ──────────────────────────────────────────────────────────
  const checkAnswer = async () => {
    const { hourAngle: tH, minAngle: tM } = timeToAngle(mission.hours, mission.minutes);
    const hourOff = Math.abs(((hourAngle - tH + 540) % 360) - 180);
    const minOff  = Math.abs(((minAngle - tM + 540) % 360) - 180);
    const isCorrect = hourOff <= 15 && minOff <= 15;
    setTries(t => t + 1);
    setCorrect(isCorrect);
    setPhase("result");

    if (isCorrect) {
      setScore(s => s + (tries === 0 ? 3 : tries === 1 ? 2 : 1));
    } else {
      // Get AI hint
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childAge: age, module: "TIME_TELLING",
            context: `Paw Patrol mission. Target: ${mission.label}`,
            question: `I need to show ${mission.label} on a clock. Simple hint please, one sentence.`,
          }),
        });
        const data = await res.json();
        setHint(data.response ?? "");
      } catch { setHint(""); }
    }
  };

  // ── Next mission ──────────────────────────────────────────────────────────
  const nextMission = () => {
    if (missionIdx + 1 >= TOTAL) {
      // Save progress
      const finalScore = Math.round((score / (TOTAL * 3)) * 100);
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, module: "TIME_TELLING", score: finalScore, timeTaken: 120 }),
      }).catch(console.error);
      setShowComplete(true);
    } else {
      setMissionIdx(i => i + 1);
      setPhase("story");
      setHourAngle(0);
      setMinAngle(0);
      setTries(0);
      setHint("");
    }
  };

  // ── Retry ─────────────────────────────────────────────────────────────────
  const retry = () => {
    setPhase("clock");
    setHint("");
  };

  // ── Completion screen ─────────────────────────────────────────────────────
  if (showComplete) {
    const stars = score >= TOTAL * 2.5 ? 3 : score >= TOTAL * 1.5 ? 2 : 1;
    return (
      <div className="max-w-md mx-auto text-center py-8 px-4">
        <div className="text-6xl mb-2 animate-bounce">🏆</div>
        <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">Mission Complete!</h2>
        <p className="text-gray-500 mb-4">Ryder is proud of you!</p>
        <div className="flex justify-center gap-2 text-5xl mb-6">
          {Array.from({length:3}).map((_,i) => (
            <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>⭐</span>
          ))}
        </div>
        <div className="rounded-[20px] p-5 mb-6"
          style={{background:"linear-gradient(135deg,#E3F2FD,#BBDEFB)", border:"3px solid #1565C0", boxShadow:"0 5px 0 #1565C060"}}>
          <p className="font-baloo text-4xl font-extrabold text-blue-800">{score} paw points!</p>
          <p className="text-blue-600 font-bold text-sm mt-1">{TOTAL} missions completed · No job too big, no pup too small!</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/dashboard")}
            className="btn-secondary px-6">Back to HQ</button>
          <button onClick={() => {
            setMissionIdx(0); setScore(0); setPhase("story");
            setHourAngle(0); setMinAngle(0); setTries(0); setShowComplete(false);
          }}
            className="btn-primary px-6">More Missions!</button>
        </div>
      </div>
    );
  }

  // ── Story phase ───────────────────────────────────────────────────────────
  if (phase === "story") {
    return (
      <div className="max-w-md mx-auto px-2">
        {/* Mission counter */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {Array.from({length:TOTAL}).map((_,i) => (
              <div key={i} className="w-8 h-2 rounded-full transition-all"
                style={{background: i < missionIdx ? "#1565C0" : i === missionIdx ? "#42A5F5" : "#BBDEFB"}}/>
            ))}
          </div>
          <span className="text-xs font-bold text-blue-500">Mission {missionIdx+1}/{TOTAL}</span>
        </div>

        {/* Scene card */}
        <div className="relative rounded-[24px] overflow-hidden mb-4" style={{minHeight:200}}>
          <SceneBackground locationEmoji={mission.locationEmoji}/>
          {/* Pup badge */}
          <div className="relative z-10 p-5 pb-24">
            <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-4 font-bold text-white text-sm"
              style={{background: mission.pupColor, boxShadow:`0 3px 0 ${mission.pupColor}80`}}>
              {mission.pupEmoji} {mission.pup} needs your help!
            </div>
            {/* Speech bubble */}
            <div className="bg-white rounded-[16px] p-4 shadow-lg max-w-xs"
              style={{border:`3px solid ${mission.pupColor}`}}>
              <p className="font-bold text-gray-700 text-sm leading-relaxed">{mission.story}</p>
              <div className="mt-2 font-baloo text-2xl font-extrabold" style={{color: mission.pupColor}}>
                {mission.label}
              </div>
            </div>
          </div>
        </div>

        {/* Mission briefing */}
        <div className="rounded-[20px] p-4 mb-5 flex items-center gap-3"
          style={{background:"#E3F2FD", border:"3px solid #1565C0", boxShadow:"0 4px 0 #1565C040"}}>
          <span className="text-3xl">📋</span>
          <div>
            <p className="font-baloo text-base font-extrabold text-blue-800">Your mission:</p>
            <p className="text-blue-600 font-bold text-sm">{mission.taskText}</p>
          </div>
        </div>

        <button
          onClick={() => setPhase("clock")}
          className="btn-primary w-full text-lg"
          style={{background: mission.pupColor, boxShadow:`0 5px 0 ${mission.pupColor}80`}}
        >
          PAW PATROL IS ON A ROLL! 🐾
        </button>
      </div>
    );
  }

  // ── Clock phase ───────────────────────────────────────────────────────────
  if (phase === "clock") {
    return (
      <div className="max-w-md mx-auto px-2">
        {/* Mission reminder */}
        <div className="rounded-[16px] px-4 py-3 mb-4 flex items-center gap-3"
          style={{background: mission.pupColor + "15", border:`2px solid ${mission.pupColor}40`}}>
          <span className="text-2xl">{mission.pupEmoji}</span>
          <div>
            <p className="font-bold text-sm text-gray-700">{mission.pup} needs to be there at:</p>
            <p className="font-baloo text-2xl font-extrabold" style={{color: mission.pupColor}}>{mission.label}</p>
          </div>
        </div>

        {/* Hint from prev try */}
        {hint && (
          <div className="rounded-[16px] px-4 py-3 mb-4 text-sm font-medium text-blue-800"
            style={{background:"#E3F2FD", border:"2px solid #90CAF9"}}>
            💡 {hint}
          </div>
        )}

        {/* Clock */}
        <div className="flex justify-center mb-5" ref={wrapRef}>
          <InteractiveClock
            hourAngle={hourAngle}
            minAngle={minAngle}
            onDragStart={setDragging}
          />
        </div>

        {/* Instructions */}
        <p className="text-center text-sm font-bold text-gray-400 mb-4">
          🔵 Drag the <span className="text-blue-700">blue</span> hand for hours · 🔴 Drag the <span className="text-red-600">red</span> hand for minutes
        </p>

        <button
          onClick={checkAnswer}
          className="btn-primary w-full text-lg"
          style={{background: mission.pupColor, boxShadow:`0 5px 0 ${mission.pupColor}80`}}
        >
          Send {mission.pup}! 🐾
        </button>
      </div>
    );
  }

  // ── Result phase ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto px-2">
      <div className="relative rounded-[24px] overflow-hidden mb-5" style={{minHeight:220}}>
        <SceneBackground locationEmoji={mission.locationEmoji}/>
        {correct && <StarBurst/>}
        <div className="relative z-10 p-6 flex flex-col items-center justify-center" style={{minHeight:220}}>
          {correct ? (
            <>
              <div className="text-7xl mb-2 animate-bounce">{mission.pupEmoji}</div>
              <div className="bg-white rounded-[16px] p-4 shadow-lg text-center max-w-xs"
                style={{border:`3px solid ${mission.pupColor}`}}>
                <p className="font-baloo text-xl font-extrabold mb-1" style={{color: mission.pupColor}}>
                  Mission Accomplished! 🎉
                </p>
                <p className="text-gray-600 text-sm font-medium">{mission.successLine}</p>
                <div className="flex justify-center gap-1 mt-2 text-2xl">
                  {Array.from({length: tries === 0 ? 3 : tries === 1 ? 2 : 1}).map((_,i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-2">😅</div>
              <div className="bg-white rounded-[16px] p-4 shadow-lg text-center max-w-xs"
                style={{border:"3px solid #F57F17"}}>
                <p className="font-baloo text-lg font-extrabold text-orange-600 mb-1">
                  Not quite — try again!
                </p>
                <p className="text-gray-500 text-sm">The time was <strong>{mission.label}</strong></p>
                {hint && <p className="text-blue-600 text-xs mt-2 font-medium">💡 {hint}</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {correct ? (
        <button
          onClick={nextMission}
          className="btn-primary w-full text-lg"
          style={{background: mission.pupColor, boxShadow:`0 5px 0 ${mission.pupColor}80`}}
        >
          {missionIdx + 1 >= TOTAL ? "See Results! 🏆" : "Next Mission! →"}
        </button>
      ) : (
        <div className="flex gap-3">
          <button onClick={retry} className="btn-primary flex-1"
            style={{background: mission.pupColor, boxShadow:`0 4px 0 ${mission.pupColor}80`}}>
            Try Again! 💪
          </button>
          <button onClick={nextMission} className="btn-secondary flex-1">
            Skip Mission
          </button>
        </div>
      )}
    </div>
  );
}
