"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TravelMission {
  guide: string;
  guideEmoji: string;
  guideColor: string;
  country: string;
  countryEmoji: string;
  story: string;
  englishWord: string;
  correctSpanish: string;
  wrongOptions: [string, string, string];
  successLine: string;
}

interface Props { age: number; childId: string; }

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildMissions(age: number): TravelMission[] {
  const easy = age <= 6;
  const hard  = age >= 9;

  const bank: TravelMission[] = easy ? [
    {
      guide: "Dora", guideEmoji: "👧", guideColor: "#E91E8C",
      country: "Mexico", countryEmoji: "🇲🇽",
      story: "Dora is at the colourful market in Mexico City! She wants to buy something RED. How do you say RED in Spanish?",
      englishWord: "RED",
      correctSpanish: "rojo",
      wrongOptions: ["azul", "verde", "negro"],
      successLine: "¡Rojo! Dora found the perfect red sombrero at the market! 🎉",
    },
    {
      guide: "Boots", guideEmoji: "🐒", guideColor: "#FF6D00",
      country: "Colombia", countryEmoji: "🇨🇴",
      story: "Boots the monkey is swinging through the Colombian jungle! He counts ONE banana. How do you say ONE in Spanish?",
      englishWord: "ONE",
      correctSpanish: "uno",
      wrongOptions: ["dos", "tres", "cinco"],
      successLine: "¡Uno! Boots found his favourite banana and did a happy dance! 🍌",
    },
    {
      guide: "Dora", guideEmoji: "👧", guideColor: "#E91E8C",
      country: "Peru", countryEmoji: "🇵🇪",
      story: "Dora is visiting Machu Picchu and spots a cute CAT resting on the ancient stones! What is CAT in Spanish?",
      englishWord: "CAT",
      correctSpanish: "gato",
      wrongOptions: ["perro", "pájaro", "pez"],
      successLine: "¡Gato! The cat purred and showed Dora the secret path! 🐱",
    },
    {
      guide: "Map", guideEmoji: "🗺️", guideColor: "#FBC02D",
      country: "Argentina", countryEmoji: "🇦🇷",
      story: "Map is leading the way through Argentina! The sky above Buenos Aires is so BLUE. How do you say BLUE?",
      englishWord: "BLUE",
      correctSpanish: "azul",
      wrongOptions: ["rojo", "amarillo", "verde"],
      successLine: "¡Azul! The beautiful blue sky lights up all of Argentina! 🌤️",
    },
    {
      guide: "Boots", guideEmoji: "🐒", guideColor: "#FF6D00",
      country: "Ecuador", countryEmoji: "🇪🇨",
      story: "Boots sees THREE colourful birds on the Galápagos Islands! How do you say THREE in Spanish?",
      englishWord: "THREE",
      correctSpanish: "tres",
      wrongOptions: ["uno", "dos", "cuatro"],
      successLine: "¡Tres! The three birds chirped and flew Boots over the islands! 🐦",
    },
  ] : hard ? [
    {
      guide: "Dora", guideEmoji: "👧", guideColor: "#E91E8C",
      country: "Spain", countryEmoji: "🇪🇸",
      story: "Dora is in Madrid and needs to catch the eight o'clock train! How do you say 'It is eight o'clock' in Spanish?",
      englishWord: "It is eight o'clock",
      correctSpanish: "Son las ocho",
      wrongOptions: ["Es la una", "Son las tres", "Son las diez"],
      successLine: "¡Son las ocho! Dora caught the train to Barcelona just in time! 🚂",
    },
    {
      guide: "Señor Tucán", guideEmoji: "🦜", guideColor: "#00897B",
      country: "Costa Rica", countryEmoji: "🇨🇷",
      story: "Señor Tucán wants to say 'I want to eat' before the rainforest fiesta! What is the correct phrase?",
      englishWord: "I want to eat",
      correctSpanish: "Quiero comer",
      wrongOptions: ["Puedo dormir", "Tengo sed", "Voy a correr"],
      successLine: "¡Quiero comer! Señor Tucán gobbled up all the tropical fruit! 🌮",
    },
    {
      guide: "Dora", guideEmoji: "👧", guideColor: "#E91E8C",
      country: "Chile", countryEmoji: "🇨🇱",
      story: "Dora is hiking in Patagonia and wants to say 'I can run fast'! Choose the right Spanish sentence!",
      englishWord: "I can run fast",
      correctSpanish: "Puedo correr rápido",
      wrongOptions: ["Quiero dormir tarde", "Tengo que comer", "Me gusta bailar"],
      successLine: "¡Puedo correr rápido! Dora sprinted to the top of the mountain! 🏔️",
    },
    {
      guide: "Backpack", guideEmoji: "🎒", guideColor: "#7B1FA2",
      country: "Cuba", countryEmoji: "🇨🇺",
      story: "Backpack is dancing salsa in Havana! She says 'I like to dance'. What is that in Spanish?",
      englishWord: "I like to dance",
      correctSpanish: "Me gusta bailar",
      wrongOptions: ["Quiero cantar", "Puedo saltar", "Tengo que estudiar"],
      successLine: "¡Me gusta bailar! Backpack danced all night at the Havana fiesta! 💃",
    },
    {
      guide: "Tico", guideEmoji: "🐢", guideColor: "#388E3C",
      country: "Venezuela", countryEmoji: "🇻🇪",
      story: "Tico the squirrel is at Angel Falls! 'We are friends' — how do you say that in Spanish?",
      englishWord: "We are friends",
      correctSpanish: "Somos amigos",
      wrongOptions: ["Ellos son grandes", "Tú eres bueno", "Yo tengo hambre"],
      successLine: "¡Somos amigos! Tico and Dora hugged under the waterfall! 🌊",
    },
  ] : [
    {
      guide: "Dora", guideEmoji: "👧", guideColor: "#E91E8C",
      country: "Mexico", countryEmoji: "🇲🇽",
      story: "Dora is at a family reunion in Guadalajara! She introduces her GRANDMOTHER. How do you say GRANDMOTHER in Spanish?",
      englishWord: "GRANDMOTHER",
      correctSpanish: "abuela",
      wrongOptions: ["abuelo", "madre", "tía"],
      successLine: "¡Abuela! Dora's grandmother hugged her and gave her homemade tamales! 🫔",
    },
    {
      guide: "Boots", guideEmoji: "🐒", guideColor: "#FF6D00",
      country: "Dominican Republic", countryEmoji: "🇩🇴",
      story: "Boots visits a beach café in Punta Cana and orders BREAD. What is BREAD in Spanish?",
      englishWord: "BREAD",
      correctSpanish: "pan",
      wrongOptions: ["leche", "arroz", "queso"],
      successLine: "¡Pan! The baker gave Boots the warmest, freshest bread on the island! 🍞",
    },
    {
      guide: "Señor Tucán", guideEmoji: "🦜", guideColor: "#00897B",
      country: "Guatemala", countryEmoji: "🇬🇹",
      story: "Señor Tucán is exploring a Maya temple and hurts his HAND! How do you say HAND in Spanish?",
      englishWord: "HAND",
      correctSpanish: "mano",
      wrongOptions: ["pie", "cabeza", "brazo"],
      successLine: "¡Mano! Dora bandaged Señor Tucán's hand and they continued exploring! 🏛️",
    },
    {
      guide: "Map", guideEmoji: "🗺️", guideColor: "#FBC02D",
      country: "Bolivia", countryEmoji: "🇧🇴",
      story: "Map says today is WEDNESDAY and the fiesta starts in the Andes! What is WEDNESDAY in Spanish?",
      englishWord: "WEDNESDAY",
      correctSpanish: "miércoles",
      wrongOptions: ["lunes", "viernes", "domingo"],
      successLine: "¡Miércoles! The whole town danced at the Wednesday fiesta! 🎊",
    },
    {
      guide: "Dora", guideEmoji: "👧", guideColor: "#E91E8C",
      country: "Panama", countryEmoji: "🇵🇦",
      story: "Dora crosses the Panama Canal and spots a huge FISH! How do you say FISH in Spanish?",
      englishWord: "FISH",
      correctSpanish: "pez",
      wrongOptions: ["gato", "perro", "pájaro"],
      successLine: "¡Pez! The giant fish waved its fin and escorted Dora's boat through the canal! 🐟",
    },
  ];

  return bank.sort(() => Math.random() - 0.5);
}

// ── Travel scene background ────────────────────────────────────────────────────

function TravelScene({ countryEmoji, guideColor }: { countryEmoji: string; guideColor: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#1565C0 0%,#42A5F5 40%,#E3F2FD 70%,#FFFDE7 100%)" }}
      />
      {/* Sun */}
      <div
        className="absolute top-4 right-8 w-14 h-14 rounded-full opacity-90"
        style={{ background: "radial-gradient(circle,#FFF176 60%,#FFD54F 100%)", boxShadow: "0 0 24px 8px #FFD54F80" }}
      />
      {/* Clouds */}
      <div className="absolute top-6 left-6 opacity-80">
        <div className="w-16 h-6 rounded-full bg-white" />
        <div className="w-10 h-5 rounded-full bg-white -mt-3 ml-3" />
      </div>
      <div className="absolute top-10 left-24 opacity-60">
        <div className="w-12 h-5 rounded-full bg-white" />
        <div className="w-8 h-4 rounded-full bg-white -mt-2 ml-2" />
      </div>
      {/* Ground / land */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 rounded-b-[20px]"
        style={{ background: "linear-gradient(180deg,#81C784 0%,#388E3C 100%)" }}
      />
      {/* Road path */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20 opacity-60"
        style={{ background: "linear-gradient(180deg,#BDBDBD,#9E9E9E)" }}
      />
      {/* Passport stamp circles */}
      <div
        className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 opacity-25"
        style={{ borderColor: guideColor }}
      />
      <div
        className="absolute top-16 right-3 w-7 h-7 rounded-full border-4 opacity-20"
        style={{ borderColor: guideColor }}
      />
      {/* Country flag emoji */}
      <div className="absolute bottom-16 right-5 text-5xl drop-shadow-md">{countryEmoji}</div>
      {/* Small flag left */}
      <div className="absolute bottom-14 left-5 text-3xl opacity-70">{countryEmoji}</div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function SpanishTravelMission({ age, childId }: Props) {
  const router = useRouter();
  const [missions, setMissions]           = useState<TravelMission[]>([]);
  const [idx, setIdx]                     = useState(0);
  const [phase, setPhase]                 = useState<"story" | "choose" | "result">("story");
  const [options, setOptions]             = useState<string[]>([]);
  const [selected, setSelected]           = useState<string | null>(null);
  const [isCorrect, setIsCorrect]         = useState(false);
  const [score, setScore]                 = useState(0);
  const [showComplete, setShowComplete]   = useState(false);

  useEffect(() => { setMissions(buildMissions(age)); }, [age]);

  useEffect(() => {
    if (missions.length && phase === "choose") {
      const mission = missions[idx];
      const mixed: string[] = shuffle([
        mission.correctSpanish,
        mission.wrongOptions[0],
        mission.wrongOptions[1],
        mission.wrongOptions[2],
      ]);
      setOptions(mixed);
      setSelected(null);
    }
  }, [idx, phase, missions]);

  if (!missions.length) return null;

  const mission = missions[idx];
  const TOTAL   = missions.length;

  const handleChoice = (word: string) => {
    if (selected !== null) return; // already answered
    setSelected(word);
    const correct = word === mission.correctSpanish;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setPhase("result");
  };

  const next = () => {
    if (idx + 1 >= TOTAL) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          module: "SPANISH",
          score: Math.round((score / TOTAL) * 100),
          timeTaken: 90,
        }),
      }).catch(console.error);
      setShowComplete(true);
    } else {
      setIdx(i => i + 1);
      setPhase("story");
    }
  };

  const tryAgain = () => {
    setSelected(null);
    setIsCorrect(false);
    setPhase("choose");
  };

  // ── Completion screen ──────────────────────────────────────────────────────

  if (showComplete) {
    const stars = score >= TOTAL * 0.9 ? 3 : score >= TOTAL * 0.6 ? 2 : 1;
    return (
      <div className="max-w-md mx-auto text-center py-8 px-4">
        <div className="text-6xl mb-2 animate-bounce">🌍</div>
        <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">¡Misión Completa!</h2>
        <p className="text-gray-500 mb-4">Dora is so proud of your Spanish!</p>

        <div className="flex justify-center gap-2 text-5xl mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>⭐</span>
          ))}
        </div>

        {/* World Traveller badge */}
        <div
          className="rounded-[20px] p-5 mb-4 flex flex-col items-center"
          style={{
            background: "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
            border: "3px solid #43A047",
            boxShadow: "0 5px 0 #43A04760",
          }}
        >
          <div className="text-5xl mb-2">🌐</div>
          <p className="font-baloo text-xl font-extrabold text-green-800">World Traveller Badge</p>
          <p className="text-green-700 font-bold text-sm mt-1">Earned by exploring the Spanish-speaking world!</p>
        </div>

        <div
          className="rounded-[20px] p-4 mb-6"
          style={{
            background: "linear-gradient(135deg,#FFF9C4,#FFF176)",
            border: "3px solid #FBC02D",
            boxShadow: "0 5px 0 #FBC02D60",
          }}
        >
          <p className="font-baloo text-4xl font-extrabold text-yellow-800">{score}/{TOTAL} correct!</p>
          <p className="text-yellow-700 font-bold text-sm mt-1">¡Fantástico! Keep exploring! 🗺️</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary px-6">
            Back to Hub
          </button>
          <button
            onClick={() => {
              setMissions(buildMissions(age));
              setIdx(0);
              setScore(0);
              setPhase("story");
              setShowComplete(false);
            }}
            className="btn-primary px-6"
            style={{ background: "#E91E8C", boxShadow: "0 4px 0 #AD1457" }}
          >
            ¡Otra Vez! 🌍
          </button>
        </div>
      </div>
    );
  }

  // ── Progress bar ───────────────────────────────────────────────────────────

  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex gap-1">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-2 rounded-full transition-all"
            style={{
              background:
                i < idx
                  ? mission.guideColor
                  : i === idx
                  ? mission.guideColor + "80"
                  : "#E5E7EB",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-bold" style={{ color: mission.guideColor }}>
        Mission {idx + 1}/{TOTAL}
      </span>
    </div>
  );

  // ── Story phase ────────────────────────────────────────────────────────────

  if (phase === "story") return (
    <div className="max-w-md mx-auto px-2">
      <ProgressBar />

      <div className="relative rounded-[24px] overflow-hidden mb-4" style={{ minHeight: 210 }}>
        <TravelScene countryEmoji={mission.countryEmoji} guideColor={mission.guideColor} />
        <div className="relative z-10 p-5 pb-24">
          <div
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-4 font-bold text-white text-sm"
            style={{ background: mission.guideColor, boxShadow: `0 3px 0 ${mission.guideColor}80` }}
          >
            {mission.guideEmoji} {mission.guide} is in {mission.country}!
          </div>
          <div
            className="bg-white rounded-[16px] p-4 shadow-lg max-w-xs"
            style={{ border: `3px solid ${mission.guideColor}` }}
          >
            <p className="font-bold text-gray-700 text-sm leading-relaxed">{mission.story}</p>
          </div>
        </div>
      </div>

      {/* Passport stamp feel */}
      <div
        className="rounded-[20px] p-3 mb-5 flex items-center gap-3"
        style={{
          background: "#FFF3E0",
          border: "3px dashed #FB8C00",
          boxShadow: "0 3px 0 #FB8C0040",
        }}
      >
        <span className="text-3xl">🛂</span>
        <div>
          <p className="font-baloo text-base font-extrabold text-orange-800">Passport Clue</p>
          <p className="text-orange-700 font-bold text-sm">
            Translate <strong>"{mission.englishWord}"</strong> into Spanish!
          </p>
        </div>
      </div>

      <button
        onClick={() => setPhase("choose")}
        className="btn-primary w-full text-lg"
        style={{ background: mission.guideColor, boxShadow: `0 5px 0 ${mission.guideColor}80` }}
      >
        {mission.guideEmoji} ¡Vámonos! Let&apos;s Go!
      </button>
    </div>
  );

  // ── Choose phase ───────────────────────────────────────────────────────────

  if (phase === "choose") return (
    <div className="max-w-md mx-auto px-2">
      <ProgressBar />

      {/* English word display */}
      <div
        className="rounded-[24px] p-6 mb-5 text-center"
        style={{
          background: "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
          border: `3px solid ${mission.guideColor}`,
          boxShadow: `0 5px 0 ${mission.guideColor}50`,
        }}
      >
        <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">English Word</p>
        <p
          className="font-baloo text-4xl font-extrabold"
          style={{ color: mission.guideColor }}
        >
          {mission.englishWord}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {mission.guideEmoji} Pick the Spanish translation below!
        </p>
      </div>

      {/* 4 choice buttons */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleChoice(opt)}
            disabled={selected !== null}
            className="rounded-[16px] py-4 px-3 font-baloo text-lg font-extrabold transition-all hover:-translate-y-1 active:translate-y-0"
            style={{
              background: "white",
              border: `3px solid ${mission.guideColor}60`,
              color: mission.guideColor,
              boxShadow: `0 4px 0 ${mission.guideColor}40`,
              cursor: selected !== null ? "not-allowed" : "pointer",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Map hint bar */}
      <div
        className="rounded-[14px] p-3 flex items-center gap-2 text-sm"
        style={{ background: "#F3E5F5", border: "2px solid #CE93D8" }}
      >
        <span className="text-xl">🗺️</span>
        <span className="font-bold text-purple-700">
          {mission.countryEmoji} {mission.country} — choose wisely, explorer!
        </span>
      </div>
    </div>
  );

  // ── Result phase ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-md mx-auto px-2">
      <ProgressBar />

      <div className="relative rounded-[24px] overflow-hidden mb-4" style={{ minHeight: 210 }}>
        <TravelScene countryEmoji={mission.countryEmoji} guideColor={mission.guideColor} />
        <div
          className="relative z-10 p-6 flex flex-col items-center justify-center"
          style={{ minHeight: 210 }}
        >
          {isCorrect ? (
            <div
              className="bg-white rounded-[16px] p-5 shadow-lg text-center max-w-xs"
              style={{ border: `3px solid ${mission.guideColor}` }}
            >
              <div className="text-5xl mb-2 animate-bounce">{mission.guideEmoji}</div>
              <p
                className="font-baloo text-2xl font-extrabold mb-1"
                style={{ color: mission.guideColor }}
              >
                ¡Muy bien! ✅
              </p>
              <p
                className="font-baloo text-lg font-bold mb-2"
                style={{ color: "#43A047" }}
              >
                {mission.correctSpanish}
              </p>
              <p className="text-gray-600 text-sm font-medium">{mission.successLine}</p>
              <div className="flex justify-center gap-1 mt-3">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="text-2xl">⭐</span>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="bg-white rounded-[16px] p-5 shadow-lg text-center max-w-xs"
              style={{ border: "3px solid #E53935" }}
            >
              <div className="text-5xl mb-2">😅</div>
              <p className="font-baloo text-xl font-extrabold text-red-600 mb-1">
                ¡Inténtalo de nuevo!
              </p>
              <p className="text-gray-500 text-sm">
                The answer was{" "}
                <strong style={{ color: "#43A047" }}>{mission.correctSpanish}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Revealed choice buttons with green/red */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map((opt) => {
          const isRight = opt === mission.correctSpanish;
          const isChosen = opt === selected;
          let bg = "#F5F5F5";
          let border = "#BDBDBD";
          let color = "#757575";
          if (isRight) { bg = "#E8F5E9"; border = "#43A047"; color = "#2E7D32"; }
          else if (isChosen && !isRight) { bg = "#FFEBEE"; border = "#E53935"; color = "#C62828"; }
          return (
            <div
              key={opt}
              className="rounded-[16px] py-4 px-3 font-baloo text-lg font-extrabold text-center flex items-center justify-center gap-2"
              style={{
                background: bg,
                border: `3px solid ${border}`,
                color,
              }}
            >
              {isRight ? "✅" : isChosen ? "❌" : ""} {opt}
            </div>
          );
        })}
      </div>

      {isCorrect ? (
        <button
          onClick={next}
          className="btn-primary w-full text-lg"
          style={{ background: mission.guideColor, boxShadow: `0 5px 0 ${mission.guideColor}80` }}
        >
          {idx + 1 >= TOTAL ? "See Results! 🏆" : "Next Country! 🌍"}
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={tryAgain}
            className="btn-primary flex-1"
            style={{ background: mission.guideColor, boxShadow: `0 4px 0 ${mission.guideColor}80` }}
          >
            Try Again! 💪
          </button>
          <button onClick={next} className="btn-secondary flex-1">
            Skip Mission
          </button>
        </div>
      )}
    </div>
  );
}
