"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

function timeToAngle(hours: number, minutes: number) {
  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minAngle = minutes * 6;
  return { hourAngle, minAngle };
}

function generateTarget(age: number): { hours: number; minutes: number; label: string } {
  if (age <= 6) {
    const hours = Math.floor(Math.random() * 12) + 1;
    return { hours, minutes: 0, label: `${hours}:00` };
  } else if (age <= 7) {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.random() > 0.5 ? 30 : 0;
    return { hours, minutes, label: `${hours}:${minutes === 0 ? "00" : "30"}` };
  } else if (age <= 9) {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 12)];
    return { hours, minutes, label: `${hours}:${String(minutes).padStart(2, "0")}` };
  } else {
    const hours = Math.floor(Math.random() * 12) + 1;
    const isPM = Math.random() > 0.5;
    const minutes = Math.floor(Math.random() * 12) * 5;
    return { hours: isPM ? hours + 12 : hours, minutes, label: `${isPM ? hours : hours}:${String(minutes).padStart(2, "0")} ${isPM ? "PM" : "AM"}` };
  }
}

interface ClockGameProps { age: number; childId: string; }

export function ClockGame({ age, childId }: ClockGameProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [target, setTarget] = useState(() => generateTarget(age));
  const [hourAngle, setHourAngle] = useState(0);
  const [minAngle, setMinAngle] = useState(0);
  const [dragging, setDragging] = useState<"hour" | "min" | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [hint, setHint] = useState("");
  const [showComplete, setShowComplete] = useState(false);
  const TOTAL_ROUNDS = 5;
  const CENTER = 100;

  const getAngleFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 200 - CENTER;
    const y = ((clientY - rect.top) / rect.height) * 200 - CENTER;
    let angle = Math.atan2(x, -y) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    const angle = getAngleFromEvent(e);
    if (dragging === "hour") setHourAngle(Math.round(angle / 30) * 30);
    else setMinAngle(Math.round(angle / 6) * 6);
  }, [dragging, getAngleFromEvent]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const checkAnswer = async () => {
    const { hourAngle: tH, minAngle: tM } = timeToAngle(target.hours, target.minutes);
    const hourOff = Math.abs(((hourAngle - tH + 540) % 360) - 180);
    const minOff = Math.abs(((minAngle - tM + 540) % 360) - 180);
    const isCorrect = hourOff <= 15 && minOff <= 15;

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("✅ Perfect! You set the right time!");
    } else {
      setFeedback(`Not quite! The time should be ${target.label} 💪`);
      setHint("");
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childAge: age, module: "TIME_TELLING",
            context: `Target time: ${target.label}`,
            question: `I'm trying to show ${target.label} on a clock. Can you give me a simple hint?`,
          }),
        });
        const data = await res.json();
        setHint(data.response ?? "");
      } catch { setHint(""); }
    }

    setTimeout(() => {
      setFeedback("");
      setHint("");
      if (round >= TOTAL_ROUNDS) {
        setShowComplete(true);
        const finalScore = Math.round(((isCorrect ? score + 1 : score) / TOTAL_ROUNDS) * 100);
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, module: "TIME_TELLING", score: finalScore, timeTaken: 90 }),
        }).catch(console.error);
      } else {
        setRound((r) => r + 1);
        setTarget(generateTarget(age));
        setHourAngle(0);
        setMinAngle(0);
      }
    }, isCorrect ? 1500 : 3000);
  };

  // Hand positions
  const toXY = (angle: number, length: number) => ({
    x: CENTER + Math.sin((angle * Math.PI) / 180) * length,
    y: CENTER - Math.cos((angle * Math.PI) / 180) * length,
  });
  const hourTip = toXY(hourAngle, 50);
  const minTip = toXY(minAngle, 70);

  if (showComplete) {
    const pct = Math.round((score / TOTAL_ROUNDS) * 100);
    const stars = pct === 100 ? 3 : pct >= 80 ? 2 : 1;
    return (
      <div className="text-center py-10">
        <div className="text-7xl mb-4">{pct >= 80 ? "🕐🏆" : "💪"}</div>
        <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">{pct >= 80 ? "Time Master!" : "Keep Practicing!"}</h2>
        <p className="text-xl text-gray-500 mb-4">{score} of {TOTAL_ROUNDS} times correct</p>
        <div className="flex justify-center gap-2 mb-8">{Array.from({ length: 3 }).map((_, i) => <span key={i} className={`text-4xl ${i < stars ? "" : "opacity-20"}`}>⭐</span>)}</div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">Home</button>
          <button onClick={() => { setRound(1); setScore(0); setShowComplete(false); setTarget(generateTarget(age)); setHourAngle(0); setMinAngle(0); }} className="btn-primary">Play Again 🎮</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex justify-between text-sm font-semibold text-gray-500 mb-4">
        <span>Round {round} of {TOTAL_ROUNDS}</span>
        <span>{score} correct ⭐</span>
      </div>

      {/* Target time */}
      <div className="bg-white rounded-3xl shadow-card p-6 text-center mb-6 border border-blue-100">
        <p className="text-gray-500 font-semibold mb-2">Set the clock to show:</p>
        <p className="font-fredoka text-5xl font-bold text-blue-500">{target.label}</p>
      </div>

      {/* Clock SVG */}
      <div className="flex justify-center mb-6">
        <svg ref={svgRef} viewBox="0 0 200 200" className="w-64 h-64 cursor-grab active:cursor-grabbing select-none"
          aria-label={`Interactive clock — set to ${target.label}`}>
          {/* Face */}
          <circle cx="100" cy="100" r="95" fill="white" stroke="#E8E0F0" strokeWidth="3" />
          <circle cx="100" cy="100" r="90" fill="#F8F4FF" />
          {/* Hour marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const x1 = 100 + Math.sin(a) * 78; const y1 = 100 - Math.cos(a) * 78;
            const x2 = 100 + Math.sin(a) * 88; const y2 = 100 - Math.cos(a) * 88;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#845EC2" strokeWidth="2.5" strokeLinecap="round" />;
          })}
          {/* Numbers */}
          {[12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return <text key={n} x={100 + Math.sin(a) * 68} y={100 - Math.cos(a) * 68 + 4}
              textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1A1A2E" fontFamily="sans-serif">{n}</text>;
          })}
          {/* Hour hand */}
          <line x1="100" y1="100" x2={hourTip.x} y2={hourTip.y}
            stroke="#FF6B35" strokeWidth="6" strokeLinecap="round"
            onMouseDown={() => setDragging("hour")} onTouchStart={() => setDragging("hour")}
            style={{ cursor: "grab" }} />
          {/* Minute hand */}
          <line x1="100" y1="100" x2={minTip.x} y2={minTip.y}
            stroke="#118AB2" strokeWidth="4" strokeLinecap="round"
            onMouseDown={() => setDragging("min")} onTouchStart={() => setDragging("min")}
            style={{ cursor: "grab" }} />
          {/* Center dot */}
          <circle cx="100" cy="100" r="6" fill="#1A1A2E" />
        </svg>
      </div>

      <p className="text-center text-sm text-gray-400 mb-4 font-medium">
        Drag the <span className="text-orange-500 font-bold">orange hand</span> (hours) and <span className="text-blue-500 font-bold">blue hand</span> (minutes)
      </p>

      <button onClick={checkAnswer} disabled={!!feedback}
        className="btn-primary w-full text-xl disabled:opacity-60">
        {feedback ? "…" : "Check My Answer! ✓"}
      </button>

      {feedback && (
        <div className={`mt-4 rounded-2xl p-4 text-center font-semibold ${feedback.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
          role="status" aria-live="polite">
          {feedback}
          {hint && <p className="mt-2 text-blue-600 text-sm font-normal">{hint}</p>}
        </div>
      )}
    </div>
  );
}
