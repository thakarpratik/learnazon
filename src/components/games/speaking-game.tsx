"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

function getPrompt(age: number): { prompt: string; duration: number; tip: string } {
  const prompts5 = [
    { prompt: "Tell me about your favourite toy!", duration: 30, tip: "Speak clearly and tell us its name and why you love it." },
    { prompt: "What is your favourite animal and why?", duration: 30, tip: "Say the animal's name and 2 things you like about it." },
  ];
  const prompts6 = [
    { prompt: "Describe what you see in your bedroom.", duration: 45, tip: "Look around in your mind — name the colours and things you see." },
    { prompt: "What is your favourite food and how does it taste?", duration: 45, tip: "Use words like sweet, salty, crunchy, soft to describe it." },
  ];
  const prompts8 = [
    { prompt: "Tell a short story about a hero who saves the day!", duration: 60, tip: "Include a beginning, a problem, and how the hero fixes it." },
    { prompt: "Describe your perfect day from morning to night.", duration: 60, tip: "Use words like first, then, next, and finally." },
  ];
  const prompts10 = [
    { prompt: "Should kids have more time to play or more time to study? Give your opinion!", duration: 120, tip: "Say your opinion, give 2 reasons, and finish with a strong conclusion." },
    { prompt: "Is it better to live in the city or the countryside? Debate it!", duration: 120, tip: "Pick a side and give 3 good reasons." },
  ];

  const pool = age <= 5 ? prompts5 : age <= 7 ? prompts6 : age <= 9 ? prompts8 : prompts10;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface SpeakingGameProps { age: number; childId: string; }

export function SpeakingGame({ age, childId }: SpeakingGameProps) {
  const router = useRouter();
  const [prompt] = useState(() => getPrompt(age));
  const [phase, setPhase] = useState<"intro" | "ready" | "recording" | "done" | "feedback">("intro");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(prompt.duration);
  const [transcript, setTranscript] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

    // Speech recognition
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
        if (e.error !== "no-speech") setMediaError("Mic not available — your speech won't be recorded but you can still practice!");
      };
      recognition.start();
      recognitionRef.current = recognition;
    } else {
      setMediaError("Speech recognition isn't supported in this browser. Practice speaking aloud!");
    }

    // Countdown timer
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
          context: `Prompt: "${prompt.prompt}". Child spoke for ${prompt.duration} seconds.`,
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

  // Intro phase
  if (phase === "intro") return (
    <div className="max-w-lg mx-auto text-center">
      <div className="text-7xl mb-6 animate-bounce-slow">🎤</div>
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

  // Countdown
  if (phase === "ready") return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="font-fredoka text-2xl text-gray-600 mb-4">Get ready…</p>
      <div className="font-fredoka text-9xl font-bold text-orange-500 animate-bounce-slow">{countdown}</div>
    </div>
  );

  // Recording
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
      <p className="text-gray-500 font-medium mb-6">Speak clearly and confidently!</p>
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

  // Done / loading feedback
  if (phase === "done") return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="text-6xl mb-4 animate-bounce-slow">🌟</div>
      <p className="font-fredoka text-2xl text-gray-700">Getting your feedback…</p>
    </div>
  );

  // Feedback
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
