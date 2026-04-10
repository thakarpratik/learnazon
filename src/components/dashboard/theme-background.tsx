"use client";

import { useMemo } from "react";

interface Props {
  gameId: string | null | undefined;
  favoriteColor: string;
}

// Each theme: bg gradient + floating particles defined as emoji + count + animation
const THEMES: Record<string, {
  gradient: string;
  particles: { emoji: string; count: number }[];
  animClass: string;
}> = {
  minecraft: {
    gradient: "linear-gradient(160deg, #2d5a1b 0%, #1a3a10 40%, #3d7a24 100%)",
    particles: [
      { emoji: "⛏️", count: 4 },
      { emoji: "💎", count: 5 },
      { emoji: "🪨", count: 5 },
      { emoji: "🌿", count: 4 },
    ],
    animClass: "animate-float-block",
  },
  roblox: {
    gradient: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    particles: [
      { emoji: "🎮", count: 5 },
      { emoji: "⭐", count: 6 },
      { emoji: "🏆", count: 3 },
      { emoji: "🎯", count: 4 },
    ],
    animClass: "animate-float-slow",
  },
  pokemon: {
    gradient: "linear-gradient(160deg, #ffd700 0%, #ff6b35 40%, #e91e8c 100%)",
    particles: [
      { emoji: "⚡", count: 6 },
      { emoji: "🔴", count: 5 },
      { emoji: "⭐", count: 5 },
      { emoji: "✨", count: 6 },
    ],
    animClass: "animate-float-spin",
  },
  paw_patrol: {
    gradient: "linear-gradient(160deg, #87ceeb 0%, #4fc3f7 50%, #0288d1 100%)",
    particles: [
      { emoji: "🐾", count: 7 },
      { emoji: "🦴", count: 5 },
      { emoji: "⭐", count: 5 },
      { emoji: "🚒", count: 2 },
    ],
    animClass: "animate-float-bounce",
  },
  frozen: {
    gradient: "linear-gradient(160deg, #e0f7fa 0%, #b2ebf2 40%, #80deea 100%)",
    particles: [
      { emoji: "❄️", count: 10 },
      { emoji: "⛄", count: 3 },
      { emoji: "💙", count: 5 },
      { emoji: "🌨️", count: 4 },
    ],
    animClass: "animate-float-snow",
  },
  superheroes: {
    gradient: "linear-gradient(160deg, #1a237e 0%, #283593 40%, #3949ab 100%)",
    particles: [
      { emoji: "⚡", count: 5 },
      { emoji: "💥", count: 4 },
      { emoji: "🦸", count: 3 },
      { emoji: "⭐", count: 6 },
    ],
    animClass: "animate-float-zap",
  },
  fortnite: {
    gradient: "linear-gradient(160deg, #0d1117 0%, #1c2526 40%, #2d3748 100%)",
    particles: [
      { emoji: "🏗️", count: 4 },
      { emoji: "💜", count: 5 },
      { emoji: "⭐", count: 5 },
      { emoji: "🎯", count: 3 },
    ],
    animClass: "animate-float-slow",
  },
  among_us: {
    gradient: "linear-gradient(160deg, #0a0a1a 0%, #1a1a3e 40%, #2d1b69 100%)",
    particles: [
      { emoji: "🚀", count: 4 },
      { emoji: "🔴", count: 3 },
      { emoji: "💚", count: 3 },
      { emoji: "⭐", count: 5 },
      { emoji: "👾", count: 3 },
    ],
    animClass: "animate-float-spin",
  },
};

const DEFAULT_THEME = {
  gradient: "linear-gradient(160deg, #EEF2FF 0%, #F5F3FF 60%, #EEF2FF 100%)",
  particles: [] as { emoji: string; count: number }[],
  animClass: "animate-float-slow",
};

// Deterministic positions so no hydration mismatch
function getPositions(index: number, total: number) {
  const positions = [
    { left: "5%",  top: "10%", size: "2rem", delay: "0s",    duration: "6s"  },
    { left: "15%", top: "70%", size: "1.5rem", delay: "1s",  duration: "8s"  },
    { left: "25%", top: "30%", size: "2.5rem", delay: "2s",  duration: "7s"  },
    { left: "35%", top: "85%", size: "1.8rem", delay: "0.5s",duration: "9s"  },
    { left: "45%", top: "15%", size: "2rem",   delay: "1.5s",duration: "6.5s"},
    { left: "55%", top: "60%", size: "1.5rem", delay: "3s",  duration: "8s"  },
    { left: "65%", top: "40%", size: "2.2rem", delay: "0.8s",duration: "7.5s"},
    { left: "75%", top: "75%", size: "1.8rem", delay: "2s",  duration: "6s"  },
    { left: "82%", top: "20%", size: "2rem",   delay: "1.2s",duration: "9s"  },
    { left: "90%", top: "55%", size: "1.5rem", delay: "0.3s",duration: "7s"  },
    { left: "8%",  top: "50%", size: "1.8rem", delay: "2.5s",duration: "8.5s"},
    { left: "48%", top: "90%", size: "2rem",   delay: "1.8s",duration: "6s"  },
  ];
  return positions[index % positions.length];
}

export function ThemeBackground({ gameId, favoriteColor }: Props) {
  const theme = (gameId && THEMES[gameId]) ? THEMES[gameId] : null;

  const allParticles = useMemo(() => {
    if (!theme) return [];
    const list: { emoji: string; pos: ReturnType<typeof getPositions> }[] = [];
    let i = 0;
    for (const group of theme.particles) {
      for (let j = 0; j < group.count; j++) {
        list.push({ emoji: group.emoji, pos: getPositions(i, 12) });
        i++;
      }
    }
    return list;
  }, [theme]);

  const gradient = theme ? theme.gradient : `linear-gradient(160deg, ${favoriteColor}15 0%, ${favoriteColor}08 60%, ${favoriteColor}15 100%)`;

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50%  { transform: translateY(-30px) rotate(10deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
        }
        @keyframes floatSpin {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50%  { transform: translateY(-25px) rotate(180deg); opacity: 0.9; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.6; }
        }
        @keyframes floatSnow {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes floatBounce {
          0%,100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50%     { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }
        @keyframes floatBlock {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
          33%  { transform: translateY(-15px) rotate(5deg); opacity: 0.8; }
          66%  { transform: translateY(-8px) rotate(-5deg); opacity: 0.6; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
        }
        .theme-particle { position: absolute; pointer-events: none; user-select: none; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15)); }
        .anim-float     { animation: floatUp     var(--dur) ease-in-out var(--delay) infinite; }
        .anim-spin      { animation: floatSpin   var(--dur) linear      var(--delay) infinite; }
        .anim-snow      { animation: floatSnow   var(--dur) linear      var(--delay) infinite; }
        .anim-bounce    { animation: floatBounce var(--dur) ease-in-out var(--delay) infinite; }
        .anim-block     { animation: floatBlock  var(--dur) ease-in-out var(--delay) infinite; }
      `}</style>

      <div
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{ background: gradient }}
        aria-hidden="true"
      >
        {allParticles.map((p, i) => {
          const animClass =
            theme?.animClass === "animate-float-spin"  ? "anim-spin"   :
            theme?.animClass === "animate-float-snow"  ? "anim-snow"   :
            theme?.animClass === "animate-float-bounce"? "anim-bounce" :
            theme?.animClass === "animate-float-block" ? "anim-block"  :
            "anim-float";

          return (
            <span
              key={i}
              className={`theme-particle ${animClass}`}
              style={{
                left: p.pos.left,
                top: p.pos.top,
                fontSize: p.pos.size,
                "--delay": p.pos.delay,
                "--dur": p.pos.duration,
              } as React.CSSProperties}
            >
              {p.emoji}
            </span>
          );
        })}
      </div>
    </>
  );
}
