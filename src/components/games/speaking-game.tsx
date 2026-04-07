"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Level } from "./level-picker";

interface Prompt { prompt: string; duration: number; tip: string; }

// Large pool of prompts per age group — randomised so every session feels fresh
const PROMPTS: Record<string, Prompt[]> = {
  "5": [
    { prompt: "Tell me about your favourite toy!", duration: 30, tip: "Say its name and why you love it." },
    { prompt: "What is your favourite animal and why?", duration: 30, tip: "Say the animal's name and 2 things you like about it." },
    { prompt: "What do you like to eat for breakfast?", duration: 30, tip: "Name the food and use words like yummy or crunchy." },
    { prompt: "Tell me about your best friend!", duration: 30, tip: "Say their name and what you do together." },
    { prompt: "What is your favourite colour and what things are that colour?", duration: 30, tip: "Name 3 things that are your favourite colour." },
    { prompt: "Describe what you can see outside your window.", duration: 30, tip: "Use describing words like big, small, green, or fluffy." },
  ],
  "6": [
    { prompt: "Describe what you see in your bedroom.", duration: 45, tip: "Name the colours and things you see." },
    { prompt: "What is your favourite food and how does it taste?", duration: 45, tip: "Use words like sweet, salty, crunchy, soft." },
    { prompt: "Tell me about a place you love to visit.", duration: 45, tip: "Say where it is and what you do there." },
    { prompt: "What is the funniest thing that has ever happened to you?", duration: 45, tip: "Say when it happened and why it was funny." },
    { prompt: "Describe your favourite season and what you do in it.", duration: 45, tip: "Name the season and 2 activities you enjoy." },
    { prompt: "If you had a pet dragon, what would you name it and what would it do?", duration: 45, tip: "Be creative — describe its colour, size, and one special power." },
    { prompt: "Tell me about your favourite cartoon or TV show.", duration: 45, tip: "Say the name and describe one character you like." },
    { prompt: "What would you buy if you had £10?", duration: 45, tip: "Say what you'd buy and why." },
  ],
  "8": [
    { prompt: "Tell a short story about a hero who saves the day!", duration: 60, tip: "Include a beginning, a problem, and how the hero fixes it." },
    { prompt: "Describe your perfect day from morning to night.", duration: 60, tip: "Use words like first, then, next, and finally." },
    { prompt: "If you could visit any country in the world, where would you go and why?", duration: 60, tip: "Name 3 things you'd see or do there." },
    { prompt: "What is the most important invention ever made? Explain why.", duration: 60, tip: "Name the invention and give 2 reasons it matters." },
    { prompt: "Describe a time you helped someone. What happened?", duration: 60, tip: "Say who you helped, what you did, and how it made you feel." },
    { prompt: "If you could have any superpower, what would it be? How would you use it?", duration: 60, tip: "Describe the power and give 2 examples of how you'd use it to help people." },
    { prompt: "What is your favourite book or movie? Tell me what it is about.", duration: 60, tip: "Introduce the main character and say what happens to them." },
    { prompt: "Imagine you discovered a secret door in your school. What is behind it?", duration: 60, tip: "Describe what you find and what you do next." },
    { prompt: "What would you change about your school and why?", duration: 60, tip: "Suggest 2 changes and explain why each would make school better." },
  ],
  "10": [
    { prompt: "Should kids have more time to play or more time to study? Give your opinion!", duration: 90, tip: "State your view, give 2 reasons, then finish with a strong conclusion." },
    { prompt: "Is it better to live in the city or the countryside? Debate it!", duration: 90, tip: "Pick a side and give 3 good reasons." },
    { prompt: "Should all schools have a uniform? Argue for or against.", duration: 90, tip: "Give 3 reasons and address one counter-argument." },
    { prompt: "What is the biggest challenge facing young people today?", duration: 90, tip: "Name the challenge, explain why it matters, and suggest one solution." },
    { prompt: "If you were headteacher for a day, what would you change and why?", duration: 90, tip: "Announce 2-3 changes and explain the benefit of each." },
    { prompt: "Are video games good or bad for children? Give your verdict.", duration: 90, tip: "Present both sides, then give your final opinion with 2 strong reasons." },
    { prompt: "Should animals be kept in zoos? Make your case.", duration: 90, tip: "Consider animal welfare and education — then give your view." },
    { prompt: "What does it mean to be a good leader? Give an example.", duration: 90, tip: "Define 2 key qualities and describe a real or fictional leader who shows them." },
    { prompt: "Persuade me to try your favourite food or hobby.", duration: 90, tip: "Use persuasive language: 'You'll love it because…', 'Imagine how great it feels when…'" },
  ],
};

function getPrompt(age: number, level: Level): Prompt {
  // Pick pool based on age bracket, then adjust duration based on level
  const key = age <= 5 ? "5" : age <= 7 ? "6" : age <= 9 ? "8" : "10";
  const pool = PROMPTS[key];
  const base = pool[Math.floor(Math.random() * pool.length)];

  // Adjust duration and tip by level
  if (level === "easy") {
    return { ...base, duration: Math.max(20, base.duration - 15), tip: "Take your time — speak slowly and clearly!" };
  }
  if (level === "advanced") {
    return { ...base, duration: base.duration + 30, tip: base.tip + " Add extra details and a strong conclusion!" };
  }
  return base;
}

interface SpeakingGameProps { age: number; childId: string; level?: Level; }

export function SpeakingGame({ age, childId, level = "medium" }: SpeakingGameProps) {
  const router = useRouter();
  const [prompt] = useState(() => getPrompt(age, level));
  const [phase, setPhase] = useState<"intro" | "ready" | "recording" | "done" | "feedback">("intro");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(prompt.duration);
  const [transcript, setTranscript] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const levelBadge: Record<Level, string> = { easy: "🌱 Easy", medium: "⭐ Medium", advanced: "🔥 Advanced" };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  const startCountdown = () => {
    setPhase("ready");
    let c = 3;
    setCountdown(c);
    const interval = setInterval(() => {
      c--;
      if (c <= 0) { clearInterval(interval); startRecording(); }
      else setCountdown(c);
    }, 1000);
  };

  const startRecording = () => {
    setPhase("recording");
    setTimeLeft(prompt.duration);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (e: any) => {
        const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
        setTranscript(t);
      };
      recognition.onerror = (e: any) => {
        if (e.error !== "no-speech") setMediaError("Mic not available — practice speaking aloud!");
      };
      recognition.start();
      recognitionRef.current = recognition;
    } else {
      setMediaError("Speech recognition isn't supported in this browser. Practice speaking aloud!");
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { stopRecording(); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    setPhase("done");
    getFeedback();
  };

  const getFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childAge: age,
          module: "PUBLIC_SPEAKING",
          context: `Prompt: "${prompt.prompt}". Level: ${level}. Child spoke for ${prompt.duration} seconds.`,
          question: transcript
            ? `The child said: "${transcript.slice(0, 300)}". Give encouraging feedback on their public speaking. Mention 1 thing they did well and 1 friendly tip to improve.`
            : "The child completed the speaking challenge. Give general encouraging feedback about public speaking practice.",
        }),
      });
      const data = await res.json();
      setAiFeedback(data.response ?? "Great job speaking up! Keep practicing — you're getting better every time! 🌟");
    } catch {
      setAiFeedback("Wonderful effort! Speaking in front of others is a superpower — and you're building it! 🦸‍♀️");
    } finally {
      setLoadingFeedback(false);
      setPhase("feedback");
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, module: "PUBLIC_SPEAKING", score: transcript.split(" ").length > 10 ? 85 : 60, timeTaken: prompt.duration }),
      }).catch(console.error);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (phase === "intro") return (
    <div className="max-w-lg mx-auto text-center">
      <div className="text-7xl mb-6 animate-bounce-slow">🎤</div>
      {/* Level badge */}
      <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 mb-4">
        {levelBadge[level]}
      </span>
      <div className="bg-white rounded-3xl shadow-card p-8 mb-6 border border-green-100">
        <p className="text-gray-500 font-semibold mb-3">Your speaking challenge:</p>
        <p className="font-fredoka text-2xl font-bold text-gray-800 mb-4">{prompt.prompt}</p>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm font-semibold text-green-700">💡 Tip: {prompt.tip}</p>
        </div>
      </div>
      <p className="text-gray-500 mb-6 font-medium">You have <strong>{prompt.duration} seconds</strong> to speak. Take a breath — you've got this!</p>
      <button onClick={startCountdown} className="btn-primary text-xl w-full">I&apos;m Ready! 🚀</button>
    </div>
  );

  if (phase === "ready") return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="font-fredoka text-2xl text-gray-600 mb-4">Get ready…</p>
      <div className="font-fredoka text-9xl font-bold text-orange-500 animate-bounce-slow">{countdown}</div>
    </div>
  );

  if (phase === "recording") return (
    <div className="max-w-lg mx-auto text-center">
      <div className="relative w-40 h-40 mx-auto mb-6">
        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75" />
        <div className="relative w-full h-full bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">🎤</span>
        </div>
      </div>
      <div className="font-fredoka text-5xl font-bold text-gray-800 mb-2">
        {minutes > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : `${seconds}s`}
      </div>
      <p className="text-gray-500 font-medium mb-2">Speak clearly and confidently!</p>
      <p className="text-sm text-gray-400 italic mb-4 px-4">{prompt.prompt}</p>
      {transcript && (
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-left mb-6 max-h-32 overflow-y-auto">
          <p className="text-sm text-blue-700 italic">{transcript}</p>
        </div>
      )}
      {mediaError && <p className="text-amber-600 text-sm mb-4 bg-amber-50 rounded-xl p-3">{mediaError}</p>}
      <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-fun transition-all">
        Stop Recording ⏹
      </button>
    </div>
  );

  if (phase === "done") return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="text-6xl mb-4 animate-bounce-slow">🌟</div>
      <p className="font-fredoka text-2xl text-gray-700">Getting your feedback…</p>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">Amazing speaking!</h2>
      <div className="flex justify-center gap-1 mb-6">
        {[1,2,3].map((i) => <span key={i} className="text-4xl">⭐</span>)}
      </div>
      <div className="bg-white rounded-3xl shadow-card p-6 mb-6 border border-green-100 text-left">
        <p className="font-bold text-gray-700 mb-3">🤖 AI Coach says:</p>
        <p className="text-gray-600 leading-relaxed">{loadingFeedback ? "Thinking…" : aiFeedback}</p>
      </div>
      {transcript && (
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-left mb-6">
          <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">What you said</p>
          <p className="text-sm text-blue-800 italic">{transcript}</p>
        </div>
      )}
      <div className="flex gap-3 justify-center">
        <button onClick={() => router.push("/dashboard")} className="btn-secondary">Home</button>
        <button onClick={() => { setPhase("intro"); setTranscript(""); setAiFeedback(""); }} className="btn-primary">Try Again 🎤</button>
      </div>
    </div>
  );
}
