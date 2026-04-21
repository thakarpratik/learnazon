"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SpeakingMission {
  performer: string;
  performerEmoji: string;
  performerColor: string;
  venue: string;
  venueEmoji: string;
  scenario: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  successLine: string;
}

interface Props { age: number; childId: string; }

// ── Mission banks ─────────────────────────────────────────────────────────────

function buildMissions(age: number): SpeakingMission[] {
  const easy = age <= 6;
  const hard  = age >= 9;

  const easyBank: SpeakingMission[] = [
    {
      performer: "Taylor", performerEmoji: "🎤", performerColor: "#E91E8C",
      venue: "City Arena", venueEmoji: "🏟️",
      scenario: "Taylor walks on stage and trips over the microphone cord. Everyone goes quiet.",
      question: "How does Taylor feel right now?",
      options: ["Happy and excited", "Embarrassed and nervous", "Angry and loud", "Sleepy and bored"],
      correctIndex: 1,
      successLine: "Taylor took a deep breath and kept going — that's real courage! 🌟",
    },
    {
      performer: "Bruno", performerEmoji: "🎵", performerColor: "#FF6F00",
      venue: "Jazz Club", venueEmoji: "🎷",
      scenario: "Bruno finishes his song and the crowd cheers really loudly.",
      question: "How does Bruno feel after the big cheer?",
      options: ["Sad and lonely", "Scared and hiding", "Proud and happy", "Confused and lost"],
      correctIndex: 2,
      successLine: "Bruno's big smile says it all — sharing talent feels amazing! ✨",
    },
    {
      performer: "Beyoncé", performerEmoji: "⭐", performerColor: "#FFD600",
      venue: "Grand Theatre", venueEmoji: "🎭",
      scenario: "Beyoncé's friend bumps into her before the show and knocks her hat off.",
      question: "What should Beyoncé's friend say?",
      options: ["Say nothing and walk away", "Blame Beyoncé for standing there", "Say sorry and pick it up", "Laugh and run off"],
      correctIndex: 2,
      successLine: "Saying sorry and helping out is the kindest thing to do! 💛",
    },
    {
      performer: "Ed", performerEmoji: "🎸", performerColor: "#43A047",
      venue: "Street Stage", venueEmoji: "🎪",
      scenario: "Ed starts playing but forgets his guitar pick. He looks upset.",
      question: "What face matches how Ed feels?",
      options: ["A huge smile", "A surprised gasp", "A worried frown", "A sleepy yawn"],
      correctIndex: 2,
      successLine: "Noticing how others feel helps us be better friends! 🎸",
    },
    {
      performer: "Adele", performerEmoji: "🎭", performerColor: "#7B1FA2",
      venue: "Opera House", venueEmoji: "🏛️",
      scenario: "Adele sings a very sad song and a tear rolls down her cheek.",
      question: "What emotion is Adele showing?",
      options: ["Joy", "Anger", "Sadness", "Silliness"],
      correctIndex: 2,
      successLine: "It's totally okay to show sadness — it means we really feel things! 💜",
    },
  ];

  const mediumBank: SpeakingMission[] = [
    {
      performer: "Taylor", performerEmoji: "🎤", performerColor: "#E91E8C",
      venue: "Talk Show Stage", venueEmoji: "📺",
      scenario: "Taylor is on a talk show. The host is still speaking, but Taylor wants to share her story right now.",
      question: "What is the polite thing for Taylor to do?",
      options: ["Jump in and start talking loudly", "Wait for the host to finish, then speak", "Walk off the stage", "Cover her ears"],
      correctIndex: 1,
      successLine: "Waiting your turn to speak shows real respect — well done! 🎤",
    },
    {
      performer: "Bruno", performerEmoji: "🎵", performerColor: "#FF6F00",
      venue: "Music School", venueEmoji: "🎹",
      scenario: "Bruno needs help reading the music notes but feels shy to ask his teacher.",
      question: "What should Bruno say to ask for help politely?",
      options: ["Throw the music sheet on the floor", "Whisper so quietly nobody hears", "Excuse me, could you help me with these notes please?", "Demand help right now"],
      correctIndex: 2,
      successLine: "Asking nicely is a superpower — people LOVE to help someone polite! 🎵",
    },
    {
      performer: "Beyoncé", performerEmoji: "⭐", performerColor: "#FFD600",
      venue: "Rehearsal Room", venueEmoji: "🪞",
      scenario: "Beyoncé accidentally steps on her dancer's foot during rehearsal.",
      question: "How should Beyoncé say sorry properly?",
      options: ["Ignore it and keep dancing", "Shout that it wasn't her fault", "Look at her dancer and say Sorry, are you okay?", "Run out of the room"],
      correctIndex: 2,
      successLine: "A real apology means looking at the person and asking if they're okay! ⭐",
    },
    {
      performer: "Ed", performerEmoji: "🎸", performerColor: "#43A047",
      venue: "Radio Studio", venueEmoji: "📻",
      scenario: "The radio host and Ed keep talking at the same time and nobody can understand either of them.",
      question: "What rule would fix this problem?",
      options: ["Both people shout even louder", "Take turns — one person speaks while the other listens", "Stay silent the whole time", "Text each other instead"],
      correctIndex: 1,
      successLine: "Taking turns is the secret to great conversations! 🎸",
    },
    {
      performer: "Adele", performerEmoji: "🎭", performerColor: "#7B1FA2",
      venue: "Backstage", venueEmoji: "🎬",
      scenario: "Adele's friend says she doesn't want to perform. Adele wants to support her, not pressure her.",
      question: "What is the kindest thing Adele can say?",
      options: ["You HAVE to go on stage!", "That's fine, I'm here for you no matter what.", "Boo, you're no fun.", "Just pretend to be fine."],
      correctIndex: 1,
      successLine: "True kindness means accepting how someone feels without pressure! 💜",
    },
  ];

  const hardBank: SpeakingMission[] = [
    {
      performer: "Taylor", performerEmoji: "🎤", performerColor: "#E91E8C",
      venue: "Award Show", venueEmoji: "🏆",
      scenario: "Taylor has 30 seconds to give a speech accepting her award. She wants everyone to feel included.",
      question: "What is the BEST way to start a short speech?",
      options: ["Talk only about yourself and how amazing you are", "Thank the people who helped you and say what this means to you", "Read from your phone without looking up", "Say nothing and wave for 30 seconds"],
      correctIndex: 1,
      successLine: "A great speech thanks others and comes from the heart! 🎤",
    },
    {
      performer: "Bruno", performerEmoji: "🎵", performerColor: "#FF6F00",
      venue: "Band Meeting", venueEmoji: "🎶",
      scenario: "Bruno and his bandmate disagree on the song choice. Both feel strongly about their idea.",
      question: "What is the best way to resolve this disagreement?",
      options: ["Bruno quits the band", "Each person shares their reason, then they vote or find a compromise", "Bruno ignores his bandmate completely", "They argue until someone cries"],
      correctIndex: 1,
      successLine: "Sharing reasons and compromising turns disagreements into great teamwork! 🎵",
    },
    {
      performer: "Beyoncé", performerEmoji: "⭐", performerColor: "#FFD600",
      venue: "Press Conference", venueEmoji: "📸",
      scenario: "A reporter says something Beyoncé disagrees with. She wants to share her opinion without being rude.",
      question: "How can Beyoncé express her opinion kindly?",
      options: ["Point and say You're completely wrong!", "Say I see it differently — here is what I think… then explain calmly", "Leave without saying anything", "Mock the reporter's question"],
      correctIndex: 1,
      successLine: "Disagreeing kindly keeps the conversation respectful and strong! ⭐",
    },
    {
      performer: "Ed", performerEmoji: "🎸", performerColor: "#43A047",
      venue: "Interview Stage", venueEmoji: "🎙️",
      scenario: "Ed's interviewer tells a long story about feeling left out as a kid. Ed wants to show he really listened.",
      question: "What does active listening look like?",
      options: ["Look at your phone while they talk", "Nod, make eye contact, and say something about what they shared", "Stare blankly and say nothing at all", "Change the topic immediately"],
      correctIndex: 1,
      successLine: "Active listening means truly hearing someone — it's the greatest gift! 🎸",
    },
    {
      performer: "Adele", performerEmoji: "🎭", performerColor: "#7B1FA2",
      venue: "Masterclass", venueEmoji: "🎓",
      scenario: "Adele is teaching young singers. One student is nervous and can barely speak in front of the group.",
      question: "What should Adele say to help the student feel confident?",
      options: ["Everyone is watching — don't mess up!", "Your voice matters. Take a breath, I believe in you.", "Maybe singing isn't for you.", "Just copy what everyone else does."],
      correctIndex: 1,
      successLine: "Encouraging others to believe in themselves is the most powerful communication of all! 💜",
    },
  ];

  const bank = easy ? easyBank : hard ? hardBank : mediumBank;
  // Shuffle without Set spreading — Fisher-Yates
  const arr = bank.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr.slice(0, 5);
}

// ── Stage scene ───────────────────────────────────────────────────────────────

function StageScene({ venueEmoji, performerEmoji, performerColor }: {
  venueEmoji: string;
  performerEmoji: string;
  performerColor: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      {/* Curtain background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#B71C1C 0%,#7B0000 60%,#1a0000 100%)" }} />

      {/* Curtain folds left */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute top-0 bottom-0" style={{
          left: `${i * 6}%`,
          width: "5%",
          background: "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(183,28,28,0.1) 50%, rgba(0,0,0,0.3) 100%)",
        }} />
      ))}
      {/* Curtain folds right */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute top-0 bottom-0" style={{
          right: `${i * 6}%`,
          width: "5%",
          background: "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(183,28,28,0.1) 50%, rgba(0,0,0,0.4) 100%)",
        }} />
      ))}

      {/* Stage floor */}
      <div className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: "linear-gradient(180deg,#8B6914 0%,#5D4037 100%)", borderTop: "3px solid #FFD700" }} />

      {/* Spotlight beams */}
      <div className="absolute top-0 left-1/4" style={{
        width: 80, height: "75%",
        background: "linear-gradient(180deg, rgba(255,255,200,0.25) 0%, rgba(255,255,200,0) 100%)",
        clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
      }} />
      <div className="absolute top-0 right-1/4" style={{
        width: 80, height: "75%",
        background: "linear-gradient(180deg, rgba(255,230,180,0.2) 0%, rgba(255,230,180,0) 100%)",
        clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
      }} />

      {/* Gold stars floating */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-3 text-2xl">
        {["⭐", "🌟", "⭐"].map((s, i) => (
          <span key={i} style={{ opacity: 0.9, filter: "drop-shadow(0 0 6px gold)" }}>{s}</span>
        ))}
      </div>

      {/* Microphone stand center-stage */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-4xl"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,215,0,0.8))" }}>
        🎤
      </div>

      {/* Performer spotlight circle */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full"
        style={{ background: "rgba(255,255,180,0.3)", boxShadow: "0 0 30px 15px rgba(255,255,180,0.15)" }} />

      {/* Venue badge */}
      <div className="absolute top-3 right-4 text-3xl">{venueEmoji}</div>

      {/* Performer emoji badge */}
      <div className="absolute top-3 left-4 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg"
        style={{ background: performerColor, border: "2px solid white" }}>
        {performerEmoji}
      </div>
    </div>
  );
}

// ── Audience cheer animation ──────────────────────────────────────────────────

function AudienceCheer() {
  return (
    <div className="flex justify-center gap-1 mt-3 animate-bounce">
      {["👏", "👏", "👏", "🎉", "👏", "👏", "👏"].map((e, i) => (
        <span key={i} className="text-xl" style={{
          animationDelay: `${i * 80}ms`,
          display: "inline-block",
        }}>{e}</span>
      ))}
    </div>
  );
}

// ── Completion screen ─────────────────────────────────────────────────────────

function CompletionScreen({ score, total, onRetry, onBack }: {
  score: number;
  total: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const stars = score >= Math.ceil(total * 0.9) ? 3 : score >= Math.ceil(total * 0.6) ? 2 : 1;
  return (
    <div className="max-w-md mx-auto text-center py-8 px-4">
      {/* Badge */}
      <div className="text-7xl mb-3 animate-bounce">🌟</div>
      <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">Star Performer!</h2>
      <p className="text-gray-500 mb-5">The crowd is on their feet for you!</p>

      {/* Stars row */}
      <div className="flex justify-center gap-2 text-5xl mb-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>⭐</span>
        ))}
      </div>

      {/* Score card */}
      <div className="rounded-2xl p-5 mb-6"
        style={{
          background: "linear-gradient(135deg,#FCE4EC,#F8BBD0)",
          border: "3px solid #E91E8C",
          boxShadow: "0 5px 0 #E91E8C60",
        }}>
        {/* Badge label */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1 mb-3"
          style={{ background: "#E91E8C", color: "white" }}>
          <span className="text-lg">🌟</span>
          <span className="font-bold text-sm tracking-wide">STAR PERFORMER BADGE</span>
        </div>
        <p className="font-baloo text-4xl font-extrabold text-pink-800 mb-1">{score}/{total} correct!</p>
        <p className="text-pink-600 font-bold text-sm">
          {score === total
            ? "Perfect score — you nailed every question!"
            : score >= Math.ceil(total * 0.6)
            ? "Great communication skills!"
            : "Keep practising — you're getting there!"}
        </p>
        <AudienceCheer />
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onBack}
          className="btn-secondary px-6"
        >
          Back to Hub
        </button>
        <button
          onClick={onRetry}
          className="btn-primary px-6"
          style={{ background: "#E91E8C", boxShadow: "0 4px 0 #AD1457" }}
        >
          Perform Again! 🎤
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TalentSpeakingMission({ age, childId }: Props) {
  const router = useRouter();
  const [missions, setMissions]         = useState<SpeakingMission[]>([]);
  const [idx, setIdx]                   = useState(0);
  const [phase, setPhase]               = useState<"story" | "question" | "result">("story");
  const [selected, setSelected]         = useState<number | null>(null);
  const [score, setScore]               = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => { setMissions(buildMissions(age)); }, [age]);

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
      const finalScore = selected === mission.correctIndex ? score : score; // score already updated via setState
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          module: "SPEAKING",
          score: Math.round((score / TOTAL) * 100),
          timeTaken: 120,
        }),
      }).catch(console.error);
      void finalScore; // suppress unused warning
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

  if (showComplete) return (
    <CompletionScreen
      score={score}
      total={TOTAL}
      onRetry={retry}
      onBack={() => router.push("/dashboard")}
    />
  );

  // ── Story phase ───────────────────────────────────────────────────────────────
  if (phase === "story") return (
    <div className="max-w-md mx-auto px-2">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all"
              style={{
                width: 28,
                background: i < idx ? "#E91E8C" : i === idx ? "#F48FB1" : "#FCE4EC",
              }}
            />
          ))}
        </div>
        <span className="text-xs font-bold" style={{ color: "#E91E8C" }}>
          Act {idx + 1}/{TOTAL}
        </span>
      </div>

      {/* Stage scene card */}
      <div className="relative rounded-[24px] overflow-hidden mb-4" style={{ minHeight: 200 }}>
        <StageScene
          venueEmoji={mission.venueEmoji}
          performerEmoji={mission.performerEmoji}
          performerColor={mission.performerColor}
        />

        {/* Performer name tag */}
        <div className="relative z-10 p-4 pb-20">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1 mb-4 font-bold text-white text-sm shadow-lg"
            style={{ background: mission.performerColor }}
          >
            {mission.performerEmoji} {mission.performer} is performing at {mission.venue}!
          </div>

          {/* Comic-panel speech bubble */}
          <div className="relative bg-white rounded-2xl p-4 shadow-xl max-w-xs"
            style={{ border: `3px solid ${mission.performerColor}` }}>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 left-6 w-4 h-4 bg-white rotate-45"
              style={{ border: `3px solid ${mission.performerColor}`, borderTop: "none", borderLeft: "none" }} />
            <p className="font-bold text-gray-700 text-sm leading-relaxed">{mission.scenario}</p>
          </div>
        </div>
      </div>

      {/* Question preview card */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "#FCE4EC",
          border: `3px solid ${mission.performerColor}`,
          boxShadow: `0 4px 0 ${mission.performerColor}40`,
        }}
      >
        <p className="font-baloo text-base font-extrabold mb-1" style={{ color: mission.performerColor }}>
          🎤 Your turn to shine:
        </p>
        <p className="font-bold text-gray-700 text-sm">{mission.question}</p>
      </div>

      <button
        onClick={() => setPhase("question")}
        className="btn-primary w-full text-lg rounded-2xl"
        style={{
          background: mission.performerColor,
          boxShadow: `0 5px 0 ${mission.performerColor}80`,
        }}
      >
        Take the Stage! 🎤
      </button>
    </div>
  );

  // ── Question phase ────────────────────────────────────────────────────────────
  if (phase === "question") return (
    <div className="max-w-md mx-auto px-2">
      {/* Scenario recap bubble */}
      <div
        className="rounded-2xl px-4 py-3 mb-4 flex items-start gap-3"
        style={{
          background: mission.performerColor + "15",
          border: `2px solid ${mission.performerColor}40`,
        }}
      >
        <span className="text-2xl mt-0.5">{mission.performerEmoji}</span>
        <p className="font-bold text-sm text-gray-700 leading-relaxed">{mission.scenario}</p>
      </div>

      {/* Question */}
      <div className="rounded-2xl px-4 py-3 mb-5"
        style={{ background: "#FCE4EC", border: `2px solid ${mission.performerColor}` }}>
        <p className="font-baloo font-extrabold text-base" style={{ color: mission.performerColor }}>
          {mission.question}
        </p>
      </div>

      {/* 2x2 choice grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {mission.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="rounded-2xl py-4 px-3 font-bold text-sm text-white text-left transition-all hover:-translate-y-1 active:translate-y-0 leading-snug"
            style={{
              background: mission.performerColor,
              boxShadow: `0 5px 0 ${mission.performerColor}80`,
              minHeight: 80,
            }}
          >
            <span className="block text-lg mb-1 opacity-80">
              {["🅐", "🅑", "🅒", "🅓"][i]}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-gray-400 font-medium">
        Choose the best answer and shine on stage!
      </div>
    </div>
  );

  // ── Result phase ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto px-2">
      <div className="relative rounded-[24px] overflow-hidden mb-5" style={{ minHeight: 220 }}>
        <StageScene
          venueEmoji={mission.venueEmoji}
          performerEmoji={mission.performerEmoji}
          performerColor={mission.performerColor}
        />
        <div className="relative z-10 p-6 flex flex-col items-center justify-center" style={{ minHeight: 220 }}>
          {correct ? (
            <div
              className="bg-white rounded-2xl p-5 shadow-xl text-center max-w-xs w-full"
              style={{ border: `3px solid ${mission.performerColor}` }}
            >
              <div className="text-5xl mb-2 animate-bounce">{mission.performerEmoji}</div>
              <p
                className="font-baloo text-xl font-extrabold mb-1"
                style={{ color: mission.performerColor }}
              >
                Brilliant! ✅
              </p>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">{mission.successLine}</p>
              <AudienceCheer />
            </div>
          ) : (
            <div
              className="bg-white rounded-2xl p-5 shadow-xl text-center max-w-xs w-full"
              style={{ border: "3px solid #E53935" }}
            >
              <div className="text-5xl mb-2">😬</div>
              <p className="font-baloo text-lg font-extrabold text-red-600 mb-2">
                Not quite — keep practising!
              </p>
              <p className="text-gray-500 text-sm mb-1">
                The best answer was:
              </p>
              <p
                className="font-bold text-sm rounded-xl px-3 py-2"
                style={{ background: "#E8F5E9", color: "#2E7D32" }}
              >
                {mission.options[mission.correctIndex]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Correct / wrong indicator strip */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {mission.options.map((option, i) => {
          const isCorrect  = i === mission.correctIndex;
          const isSelected = i === selected;
          let bg = "#F5F5F5";
          let border = "#E0E0E0";
          let textColor = "#757575";
          if (isCorrect) { bg = "#E8F5E9"; border = "#4CAF50"; textColor = "#2E7D32"; }
          else if (isSelected && !isCorrect) { bg = "#FFEBEE"; border = "#E53935"; textColor = "#C62828"; }
          return (
            <div
              key={i}
              className="rounded-2xl px-3 py-3 text-xs font-bold leading-snug"
              style={{ background: bg, border: `2px solid ${border}`, color: textColor }}
            >
              {isCorrect && <span className="mr-1">✅</span>}
              {isSelected && !isCorrect && <span className="mr-1">❌</span>}
              {option}
            </div>
          );
        })}
      </div>

      <button
        onClick={next}
        className="btn-primary w-full text-lg rounded-2xl"
        style={{
          background: mission.performerColor,
          boxShadow: `0 5px 0 ${mission.performerColor}80`,
        }}
      >
        {idx + 1 >= TOTAL ? "See My Badge! 🌟" : "Next Performance! →"}
      </button>
    </div>
  );
}
