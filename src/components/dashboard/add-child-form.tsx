"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiFetch, apiJson } from "@/lib/api";
import {
  FAVORITE_COLORS,
  FAVORITE_ANIMALS,
  FAVORITE_GAMES,
  LEARNING_STYLES,
} from "@/lib/personalisation";

type Step = 1 | 2 | 3 | 4;

export function AddChildForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Step 1
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [pin, setPin] = useState(["", "", "", ""]);

  // Step 2
  const [favoriteColor, setFavoriteColor] = useState(FAVORITE_COLORS[0].hex);
  const [favoriteAnimal, setFavoriteAnimal] = useState("🦊");
  const [mascotName, setMascotName] = useState("");

  // Step 3
  const [favoriteGame, setFavoriteGame] = useState<string | null>(null);

  // Step 4
  const [learningStyle, setLearningStyle] = useState<string | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePinInput = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...pin];
    next[i] = value.slice(-1);
    setPin(next);
    if (value && i < 3) document.getElementById(`cpin-${i + 1}`)?.focus();
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!name.trim()) return setError("Please enter your child's name");
      if (!age) return setError("Please select your child's age");
      if (pin.join("").length < 4) return setError("Please set a 4-digit PIN");
    }
    setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async () => {
    setError("");

    if (status !== "authenticated") {
      setError("You must be logged in as a parent to add a child. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/children", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          nickname: nickname.trim() || null,
          age,
          pin: pin.join(""),
          avatar: favoriteAnimal,
          favoriteColor,
          favoriteAnimal,
          favoriteGame,
          learningStyle,
          mascotName: mascotName.trim() || null,
        }),
      });

      const data = await apiJson<{ child?: unknown; message?: string }>(res);

      if (!res.ok) {
        throw new Error((data as any).message ?? "Failed to add child");
      }

      router.push("/parent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const selectedColor = FAVORITE_COLORS.find((c) => c.hex === favoriteColor) ?? FAVORITE_COLORS[0];
  const availableGames = FAVORITE_GAMES.filter((g) => g.minAge <= (age ?? 5));

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <p className="font-fredoka text-xl font-bold text-gray-800 mb-2">Please log in first</p>
        <p className="text-gray-400 text-sm mb-6">You need to be logged in as a parent to add a child.</p>
        <a href="/login" className="btn-primary">Log In →</a>
      </div>
    );
  }

  return (
    <div className="card p-8 border" style={{ borderColor: favoriteColor + "40" }}>
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all"
              style={s <= step
                ? { backgroundColor: favoriteColor, color: "white", transform: s === step ? "scale(1.1)" : "scale(1)" }
                : { backgroundColor: "#F3F4F6", color: "#9CA3AF" }
              }
            >
              {s < step ? "✓" : s}
            </div>
            {s < 4 && (
              <div className="w-12 h-1 mx-1 rounded-full transition-all"
                style={{ backgroundColor: s < step ? favoriteColor : "#E5E7EB" }} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {/* ── STEP 1: Basics ── */}
      {step === 1 && (
        <div>
          <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-1">Tell us about your child 👋</h2>
          <p className="text-gray-400 text-sm mb-6">Just the basics to get started</p>
          <div className="space-y-5">
            <div>
              <label htmlFor="child-name" className="block text-sm font-bold text-gray-700 mb-2">Child&apos;s name</label>
              <input id="child-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none font-medium transition-colors"
                style={{ borderColor: name ? favoriteColor : "#E5E7EB" }}
                placeholder="e.g. Emma" autoComplete="off" />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-sm font-bold text-gray-700 mb-1">
                Nickname <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input id="nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none font-medium"
                placeholder="e.g. Emmy, Captain, Champ" autoComplete="off" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Age</label>
              <div className="grid grid-cols-6 gap-2" role="radiogroup">
                {[5,6,7,8,9,10].map((a) => (
                  <button key={a} type="button" onClick={() => setAge(a)}
                    className="py-3 rounded-xl font-bold text-lg transition-all"
                    style={{
                      backgroundColor: age === a ? favoriteColor : "#F5F7FA",
                      color: age === a ? "white" : "#6B7280",
                      boxShadow: age === a ? `0 4px 12px ${favoriteColor}40` : "none",
                    }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Secret 4-digit PIN 🔐 <span className="text-gray-400 font-normal">(child uses this to log in)</span>
              </label>
              <div className="flex gap-3">
                {pin.map((digit, i) => (
                  <input key={i} id={`cpin-${i}`} type="text" inputMode="numeric" maxLength={1}
                    value={digit} onChange={(e) => handlePinInput(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !pin[i] && i > 0) document.getElementById(`cpin-${i-1}`)?.focus(); }}
                    className="w-16 h-16 text-center text-3xl font-bold border-2 rounded-2xl focus:outline-none transition-colors"
                    style={{
                      borderColor: digit ? favoriteColor : "#E5E7EB",
                      backgroundColor: digit ? favoriteColor + "15" : "#F9FAFB",
                    }}
                    aria-label={`PIN digit ${i + 1}`} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={nextStep} className="mt-8 w-full py-4 rounded-full font-bold text-lg text-white transition-all"
            style={{ backgroundColor: favoriteColor, boxShadow: `4px 4px 0 ${favoriteColor}40` }}>
            Next: Choose a Style 🎨
          </button>
        </div>
      )}

      {/* ── STEP 2: Style ── */}
      {step === 2 && (
        <div>
          <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-1">Make it yours! 🎨</h2>
          <p className="text-gray-400 text-sm mb-6">Pick a colour and a mascot friend</p>
          <div className="mb-7">
            <label className="block text-sm font-bold text-gray-700 mb-3">Favourite colour</label>
            <div className="grid grid-cols-4 gap-3">
              {FAVORITE_COLORS.map((c) => (
                <button key={c.hex} type="button" onClick={() => setFavoriteColor(c.hex)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: favoriteColor === c.hex ? c.hex : "transparent",
                    backgroundColor: c.hex + "15",
                    boxShadow: favoriteColor === c.hex ? `0 0 0 3px ${c.hex}40` : "none",
                  }}>
                  <div className="w-10 h-10 rounded-full shadow-md border-2 border-white" style={{ backgroundColor: c.hex }} />
                  <span className="text-xs font-bold text-gray-600">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-7">
            <label className="block text-sm font-bold text-gray-700 mb-3">Choose a mascot friend</label>
            <div className="grid grid-cols-6 gap-2">
              {FAVORITE_ANIMALS.map((a) => (
                <button key={a.emoji} type="button" onClick={() => setFavoriteAnimal(a.emoji)}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: favoriteAnimal === a.emoji ? favoriteColor : "transparent",
                    backgroundColor: favoriteAnimal === a.emoji ? favoriteColor + "15" : "#F5F7FA",
                    transform: favoriteAnimal === a.emoji ? "scale(1.1)" : "scale(1)",
                  }}>
                  <span className="text-3xl">{a.emoji}</span>
                  <span className="text-xs text-gray-500">{a.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="mascot-name" className="block text-sm font-bold text-gray-700 mb-2">
              Give your {favoriteAnimal} a name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="mascot-name" type="text" value={mascotName} onChange={(e) => setMascotName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none font-medium"
              style={{ borderColor: mascotName ? favoriteColor : undefined }}
              placeholder="e.g. Foxy, Buddy, Luna" autoComplete="off" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-full font-bold text-lg border-2 transition-all"
              style={{ borderColor: favoriteColor, color: favoriteColor }}>← Back</button>
            <button onClick={nextStep} className="flex-1 py-4 rounded-full font-bold text-lg text-white transition-all"
              style={{ backgroundColor: favoriteColor, boxShadow: `4px 4px 0 ${favoriteColor}40` }}>
              Next: Interests 🎮
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Interests ── */}
      {step === 3 && (
        <div>
          <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-1">
            What does {nickname || name} love? 🎮
          </h2>
          <p className="text-gray-400 text-sm mb-6">We&apos;ll use this to make examples more fun</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {availableGames.map((game) => (
              <button key={game.id} type="button"
                onClick={() => setFavoriteGame(game.id === favoriteGame ? null : game.id)}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all font-semibold"
                style={{
                  borderColor: favoriteGame === game.id ? favoriteColor : "#E5E7EB",
                  backgroundColor: favoriteGame === game.id ? favoriteColor + "15" : "white",
                }}>
                <span className="text-3xl">{game.emoji}</span>
                <span className="text-sm text-gray-700">{game.label}</span>
                {favoriteGame === game.id && <span className="ml-auto" style={{ color: favoriteColor }}>✓</span>}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mb-6">Can&apos;t find their favourite? Skip this — you can update it later.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-full font-bold text-lg border-2 transition-all"
              style={{ borderColor: favoriteColor, color: favoriteColor }}>← Back</button>
            <button onClick={nextStep} className="flex-1 py-4 rounded-full font-bold text-lg text-white transition-all"
              style={{ backgroundColor: favoriteColor, boxShadow: `4px 4px 0 ${favoriteColor}40` }}>
              Last step! 💪
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Learning Style ── */}
      {step === 4 && (
        <div>
          <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-1">
            How does {nickname || name} like to learn? 🧠
          </h2>
          <p className="text-gray-400 text-sm mb-6">This helps our AI tutor give the right encouragement</p>
          <div className="space-y-4 mb-8">
            {LEARNING_STYLES.map((style) => (
              <button key={style.id} type="button" onClick={() => setLearningStyle(style.id)}
                className="w-full flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all"
                style={{
                  borderColor: learningStyle === style.id ? favoriteColor : "#E5E7EB",
                  backgroundColor: learningStyle === style.id ? favoriteColor + "12" : "white",
                  boxShadow: learningStyle === style.id ? `0 4px 16px ${favoriteColor}25` : "none",
                }}>
                <span className="text-5xl">{style.emoji}</span>
                <div className="flex-1">
                  <p className="font-fredoka text-xl font-bold text-gray-800">{style.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{style.desc}</p>
                </div>
                {learningStyle === style.id && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: favoriteColor }}>✓</div>
                )}
              </button>
            ))}
          </div>

          {/* Preview */}
          {learningStyle && (
            <div className="rounded-2xl p-5 mb-6 border text-center"
              style={{ backgroundColor: favoriteColor + "10", borderColor: favoriteColor + "30" }}>
              <p className="text-3xl mb-2">{favoriteAnimal}</p>
              <p className="font-fredoka text-lg font-bold text-gray-800">
                {nickname || name}&apos;s dashboard is ready!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Themed in {selectedColor.name.toLowerCase()}
                {mascotName ? ` · Mascot: ${mascotName}` : ""}
                {favoriteGame ? ` · Loves ${FAVORITE_GAMES.find(g => g.id === favoriteGame)?.label}` : ""}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 py-4 rounded-full font-bold text-lg border-2 transition-all"
              style={{ borderColor: favoriteColor, color: favoriteColor }}>← Back</button>
            <button onClick={handleSubmit} disabled={loading || !learningStyle}
              className="flex-1 py-4 rounded-full font-bold text-lg text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: favoriteColor, boxShadow: `4px 4px 0 ${favoriteColor}40` }}>
              {loading ? "Creating…" : `Let's go, ${nickname || name}! 🚀`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
