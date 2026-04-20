"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SpellingMission {
  pokemon: string;
  pokemonEmoji: string;
  pokemonColor: string;
  region: string;
  regionEmoji: string;
  story: string;
  word: string;
  hint: string;
  successLine: string;
}

interface Props { age: number; childId: string; }

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildMissions(age: number): SpellingMission[] {
  const easy = age <= 6;
  const hard  = age >= 9;

  const bank: SpellingMission[] = easy ? [
    { pokemon:"Pikachu", pokemonEmoji:"⚡", pokemonColor:"#F9A825", region:"Pallet Town", regionEmoji:"🏡",
      story:"Pikachu lost his Pokéball! Help him write the word to find it!",
      word:"CAT", hint:"A furry pet that says meow 🐱",
      successLine:"Pikachu found the Pokéball and used Thunderbolt! ⚡" },
    { pokemon:"Bulbasaur", pokemonEmoji:"🌿", pokemonColor:"#4CAF50", region:"Viridian Forest", regionEmoji:"🌲",
      story:"Bulbasaur needs to water the right plant. Spell the word!",
      word:"SUN", hint:"It shines in the sky every day ☀️",
      successLine:"Bulbasaur's Vine Whip made the plant bloom! 🌸" },
    { pokemon:"Charmander", pokemonEmoji:"🔥", pokemonColor:"#E53935", region:"Mt. Moon", regionEmoji:"🌙",
      story:"Charmander's tail flame is flickering! Spell the word to help!",
      word:"HOT", hint:"The opposite of cold 🔥",
      successLine:"Charmander roared and became extra warm! 🦎" },
    { pokemon:"Squirtle", pokemonEmoji:"💧", pokemonColor:"#1E88E5", region:"Cerulean City", regionEmoji:"🏊",
      story:"Squirtle needs to refill the lake! Spell the word!",
      word:"WET", hint:"What you are after swimming 🌊",
      successLine:"Squirtle's Water Gun filled the whole lake! 💧" },
    { pokemon:"Jigglypuff", pokemonEmoji:"🎤", pokemonColor:"#F48FB1", region:"Lavender Town", regionEmoji:"🎵",
      story:"Jigglypuff wants to sing the right note! Spell the word!",
      word:"FUN", hint:"What you have when you play 🎉",
      successLine:"Everyone clapped for Jigglypuff's beautiful song! 🎶" },
  ] : hard ? [
    { pokemon:"Mewtwo", pokemonEmoji:"🌀", pokemonColor:"#7B1FA2", region:"Cerulean Cave", regionEmoji:"🌑",
      story:"Mewtwo is guarding ancient treasure! Spell the word to pass!",
      word:"ANCIENT", hint:"Something very, very old ⏳",
      successLine:"Mewtwo lowered its barrier — you may pass! 🚀" },
    { pokemon:"Gengar", pokemonEmoji:"👻", pokemonColor:"#4A148C", region:"Pokemon Tower", regionEmoji:"🏚️",
      story:"Gengar haunts the tower! Only the right spelling breaks the spell!",
      word:"SHADOW", hint:"It follows you on a sunny day 🌘",
      successLine:"The curse is broken — Gengar vanished laughing! 👻" },
    { pokemon:"Alakazam", pokemonEmoji:"🥄", pokemonColor:"#F57F17", region:"Saffron City", regionEmoji:"🔮",
      story:"Alakazam bent his spoons! Spell the word to straighten them!",
      word:"PSYCHIC", hint:"Using your mind to move things 🧠",
      successLine:"Alakazam's spoons shine like new! ✨" },
    { pokemon:"Dragonite", pokemonEmoji:"🐉", pokemonColor:"#FB8C00", region:"Dragon's Den", regionEmoji:"🌊",
      story:"Dragonite is flying through a storm! Spell the word to guide it!",
      word:"COMPASS", hint:"It always points north 🧭",
      successLine:"Dragonite landed safely and delivered its message! 📬" },
    { pokemon:"Articuno", pokemonEmoji:"❄️", pokemonColor:"#0277BD", region:"Seafoam Islands", regionEmoji:"🧊",
      story:"Articuno froze the path! Melt the ice with the right word!",
      word:"BLIZZARD", hint:"A very heavy snowstorm ❄️",
      successLine:"Articuno parted the blizzard and the path appeared! 🌟" },
  ] : [
    { pokemon:"Pikachu", pokemonEmoji:"⚡", pokemonColor:"#F9A825", region:"Vermilion City", regionEmoji:"⚡",
      story:"Pikachu needs power for the S.S. Anne! Spell the word!",
      word:"ELECTRIC", hint:"What powers your phone 🔋",
      successLine:"Pikachu charged the whole ship! ⚡" },
    { pokemon:"Eevee", pokemonEmoji:"🦊", pokemonColor:"#795548", region:"Celadon City", regionEmoji:"🌿",
      story:"Eevee can't choose an evolution! Spell the word to help!",
      word:"EVOLVE", hint:"To change into something stronger 🔄",
      successLine:"Eevee glowed and evolved into Flareon! 🔥" },
    { pokemon:"Snorlax", pokemonEmoji:"😴", pokemonColor:"#607D8B", region:"Cycling Road", regionEmoji:"🚴",
      story:"Snorlax is blocking the road again! Spell the word to wake it!",
      word:"HUNGRY", hint:"How you feel before lunch 🍽️",
      successLine:"Snorlax woke up and cleared the path! 💪" },
    { pokemon:"Magikarp", pokemonEmoji:"🐟", pokemonColor:"#EF5350", region:"Mt. Moon Lake", regionEmoji:"🏔️",
      story:"Magikarp keeps splashing! Spell the word to help it learn a new move!",
      word:"SPLASH", hint:"What happens when you jump in water 💦",
      successLine:"Magikarp splashed so hard it evolved into Gyarados! 🐉" },
    { pokemon:"Alakazam", pokemonEmoji:"🥄", pokemonColor:"#F57F17", region:"Silph Co.", regionEmoji:"🏢",
      story:"Alakazam needs to teleport! Spell the right word!",
      word:"TELEPORT", hint:"Disappear here, appear somewhere else instantly ✨",
      successLine:"Alakazam teleported everyone to safety! 🌀" },
  ];

  return bank.sort(() => Math.random() - 0.5);
}

// ── Scramble the word into letter tiles ──────────────────────────────────────

function scramble(word: string): string[] {
  return word.split("").sort(() => Math.random() - 0.5);
}

// ── Pokémon scene ─────────────────────────────────────────────────────────────

function PokemonScene({ regionEmoji }: { regionEmoji: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none" aria-hidden>
      {/* Sky */}
      <div className="absolute inset-0" style={{background:"linear-gradient(180deg,#FF6F00 0%,#FFA726 30%,#FFE0B2 70%,#FFF3E0 100%)"}}/>
      {/* Pokéball pattern */}
      <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-white opacity-20"
        style={{background:"linear-gradient(180deg, #E53935 50%, white 50%)"}}/>
      <div className="absolute top-8 right-8 w-8 h-8 rounded-full border-3 border-white opacity-15"
        style={{background:"linear-gradient(180deg, #E53935 50%, white 50%)"}}/>
      {/* Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-20 rounded-b-[20px]"
        style={{background:"linear-gradient(180deg,#66BB6A 0%,#388E3C 100%)"}}/>
      {/* Footprints */}
      {[10,28,48,68].map((l,i) => (
        <div key={i} className="absolute bottom-6 text-sm opacity-50" style={{left:`${l}%`}}>👣</div>
      ))}
      {/* Region emoji */}
      <div className="absolute bottom-16 right-6 text-5xl">{regionEmoji}</div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function PokemonSpellingMission({ age, childId }: Props) {
  const router = useRouter();
  const [missions, setMissions] = useState<SpellingMission[]>([]);
  const [idx, setIdx]                 = useState(0);
  const [phase, setPhase]             = useState<"story"|"spell"|"result">("story");
  const [tiles, setTiles]             = useState<string[]>([]);
  const [placed, setPlaced]           = useState<string[]>([]);
  const [isCorrect, setIsCorrect]     = useState(false);
  const [score, setScore]             = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => { setMissions(buildMissions(age)); }, [age]);

  useEffect(() => {
    if (missions.length && phase === "spell") {
      setTiles(shuffle(missions[idx].word.split("")));
      setPlaced([]);
    }
  }, [idx, phase, missions]);

  if (!missions.length) return null;
  const mission = missions[idx];
  const TOTAL   = missions.length;
  const wordLen = mission.word.length;

  const placeTile = (letter: string, tileIdx: number) => {
    if (placed.length >= wordLen) return;
    const newTiles = [...tiles];
    newTiles.splice(tileIdx, 1);
    setTiles(newTiles);
    setPlaced(p => [...p, letter]);
  };

  const removePlaced = (i: number) => {
    const letter = placed[i];
    setPlaced(p => p.filter((_,j) => j !== i));
    setTiles(t => [...t, letter].sort(() => Math.random() - 0.5));
  };

  const checkWord = () => {
    const correct = placed.join("") === mission.word;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setPhase("result");
  };

  const next = () => {
    if (idx + 1 >= TOTAL) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, module: "SPELLING", score: Math.round((score / TOTAL) * 100), timeTaken: 90 }),
      }).catch(console.error);
      setShowComplete(true);
    } else {
      setIdx(i => i + 1);
      setPhase("story");
    }
  };

  const tryAgain = () => {
    setTiles(shuffle(mission.word.split("")));
    setPlaced([]);
    setPhase("spell");
  };

  if (showComplete) {
    const stars = score >= TOTAL * 0.9 ? 3 : score >= TOTAL * 0.6 ? 2 : 1;
    return (
      <div className="max-w-md mx-auto text-center py-8 px-4">
        <div className="text-6xl mb-2 animate-bounce">🏆</div>
        <h2 className="font-baloo text-3xl font-extrabold text-gray-800 mb-1">Pokédex Complete!</h2>
        <p className="text-gray-500 mb-4">Professor Oak is proud of you!</p>
        <div className="flex justify-center gap-2 text-5xl mb-6">
          {Array.from({length:3}).map((_,i) => <span key={i} className={i < stars ? "opacity-100" : "opacity-20"}>⭐</span>)}
        </div>
        <div className="rounded-[20px] p-5 mb-6"
          style={{background:"linear-gradient(135deg,#FFF9C4,#FFF176)", border:"3px solid #F9A825", boxShadow:"0 5px 0 #F9A82560"}}>
          <p className="font-baloo text-4xl font-extrabold text-yellow-800">{score}/{TOTAL} caught!</p>
          <p className="text-yellow-700 font-bold text-sm mt-1">Gotta spell 'em all! ⚡</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary px-6">Back to Hub</button>
          <button onClick={() => { setMissions(buildMissions(age)); setIdx(0); setScore(0); setPhase("story"); setShowComplete(false); }}
            className="btn-primary px-6" style={{background:"#F9A825", boxShadow:"0 4px 0 #F57F17"}}>
            More Missions!
          </button>
        </div>
      </div>
    );
  }

  // ── Story phase ──
  if (phase === "story") return (
    <div className="max-w-md mx-auto px-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {Array.from({length:TOTAL}).map((_,i) => (
            <div key={i} className="w-8 h-2 rounded-full transition-all"
              style={{background: i < idx ? "#F9A825" : i === idx ? "#FFE082" : "#FFF9C4"}}/>
          ))}
        </div>
        <span className="text-xs font-bold text-yellow-700">Mission {idx+1}/{TOTAL}</span>
      </div>

      <div className="relative rounded-[24px] overflow-hidden mb-4" style={{minHeight:200}}>
        <PokemonScene regionEmoji={mission.regionEmoji}/>
        <div className="relative z-10 p-5 pb-24">
          <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-4 font-bold text-white text-sm"
            style={{background: mission.pokemonColor, boxShadow:`0 3px 0 ${mission.pokemonColor}80`}}>
            {mission.pokemonEmoji} {mission.pokemon} needs your help!
          </div>
          <div className="bg-white rounded-[16px] p-4 shadow-lg max-w-xs"
            style={{border:`3px solid ${mission.pokemonColor}`}}>
            <p className="font-bold text-gray-700 text-sm leading-relaxed">{mission.story}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] p-4 mb-5 flex items-center gap-3"
        style={{background:"#FFF9C4", border:"3px solid #F9A825", boxShadow:"0 4px 0 #F9A82540"}}>
        <span className="text-3xl">💡</span>
        <div>
          <p className="font-baloo text-base font-extrabold text-yellow-800">Your clue:</p>
          <p className="text-yellow-700 font-bold text-sm">{mission.hint}</p>
        </div>
      </div>

      <button
        onClick={() => setPhase("spell")}
        className="btn-primary w-full text-lg"
        style={{background: mission.pokemonColor, boxShadow:`0 5px 0 ${mission.pokemonColor}80`}}
      >
        Gotta Spell It! ⚡
      </button>
    </div>
  );

  // ── Spell phase ──
  if (phase === "spell") return (
    <div className="max-w-md mx-auto px-2">
      <div className="rounded-[16px] px-4 py-3 mb-5 flex items-center gap-3"
        style={{background: mission.pokemonColor + "15", border:`2px solid ${mission.pokemonColor}40`}}>
        <span className="text-2xl">{mission.pokemonEmoji}</span>
        <p className="font-bold text-sm text-gray-700">Spell the word: <em>{mission.hint}</em></p>
      </div>

      {/* Answer slots */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({length: wordLen}).map((_, i) => (
          <button
            key={i}
            onClick={() => placed[i] && removePlaced(i)}
            className="w-12 h-12 rounded-[12px] flex items-center justify-center font-baloo text-xl font-extrabold border-2 transition-all"
            style={{
              background: placed[i] ? mission.pokemonColor : "white",
              color: placed[i] ? "white" : "#9CA3AF",
              borderColor: placed[i] ? mission.pokemonColor : "#D1D5DB",
              boxShadow: placed[i] ? `0 3px 0 ${mission.pokemonColor}80` : "none",
            }}
          >
            {placed[i] || "_"}
          </button>
        ))}
      </div>

      {/* Letter tiles */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {tiles.map((letter, i) => (
          <button
            key={i}
            onClick={() => placeTile(letter, i)}
            className="w-12 h-12 rounded-[12px] font-baloo text-xl font-extrabold transition-all hover:-translate-y-1"
            style={{
              background:"#FFF9C4",
              border:`2px solid ${mission.pokemonColor}`,
              color: mission.pokemonColor,
              boxShadow:`0 3px 0 ${mission.pokemonColor}60`,
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      <button
        onClick={checkWord}
        disabled={placed.length < wordLen}
        className="btn-primary w-full text-lg"
        style={{
          background: placed.length < wordLen ? "#E5E7EB" : mission.pokemonColor,
          boxShadow: placed.length < wordLen ? "none" : `0 5px 0 ${mission.pokemonColor}80`,
          color: placed.length < wordLen ? "#9CA3AF" : "white",
          cursor: placed.length < wordLen ? "not-allowed" : "pointer",
        }}
      >
        {placed.length < wordLen ? `Place ${wordLen - placed.length} more letter${wordLen - placed.length !== 1 ? "s" : ""}` : "Submit! ⚡"}
      </button>
    </div>
  );

  // ── Result phase ──
  return (
    <div className="max-w-md mx-auto px-2">
      <div className="relative rounded-[24px] overflow-hidden mb-5" style={{minHeight:200}}>
        <PokemonScene regionEmoji={mission.regionEmoji}/>
        <div className="relative z-10 p-6 flex flex-col items-center justify-center" style={{minHeight:200}}>
          {isCorrect ? (
            <div className="bg-white rounded-[16px] p-4 shadow-lg text-center max-w-xs"
              style={{border:`3px solid ${mission.pokemonColor}`}}>
              <div className="text-5xl mb-2 animate-bounce">{mission.pokemonEmoji}</div>
              <p className="font-baloo text-xl font-extrabold mb-1" style={{color: mission.pokemonColor}}>
                Caught! ✅
              </p>
              <p className="text-gray-600 text-sm font-medium">{mission.successLine}</p>
              <div className="flex justify-center gap-1 mt-2">
                {[1,2,3].map(i => <span key={i} className="text-2xl">⭐</span>)}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[16px] p-4 shadow-lg text-center max-w-xs"
              style={{border:"3px solid #E53935"}}>
              <div className="text-5xl mb-2">😅</div>
              <p className="font-baloo text-lg font-extrabold text-red-600 mb-1">
                It escaped! Try again!
              </p>
              <p className="text-gray-500 text-sm">The word was <strong>{mission.word}</strong></p>
            </div>
          )}
        </div>
      </div>

      {isCorrect ? (
        <button onClick={next} className="btn-primary w-full text-lg"
          style={{background: mission.pokemonColor, boxShadow:`0 5px 0 ${mission.pokemonColor}80`}}>
          {idx + 1 >= TOTAL ? "See Results! 🏆" : "Next Mission! →"}
        </button>
      ) : (
        <div className="flex gap-3">
          <button onClick={tryAgain} className="btn-primary flex-1"
            style={{background: mission.pokemonColor, boxShadow:`0 4px 0 ${mission.pokemonColor}80`}}>
            Try Again! 💪
          </button>
          <button onClick={next} className="btn-secondary flex-1">Skip Mission</button>
        </div>
      )}
    </div>
  );
}
