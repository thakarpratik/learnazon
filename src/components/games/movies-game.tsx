"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Level } from "./level-picker";

interface MovieQuestion {
  question: string;
  answer: string;
  choices: string[];
  emoji: string;
  funFact: string;
}

// Easy — animated classics, characters, simple plots (ages 5-7)
const Q_EASY: MovieQuestion[] = [
  { question: "Which film features a fish called Nemo who gets lost?", answer: "Finding Nemo", choices: ["Finding Nemo", "The Little Mermaid", "Shark Tale", "Moana"], emoji: "🐠", funFact: "Finding Nemo was filmed underwater — well, the animators studied real coral reefs to make it look real!" },
  { question: "In Frozen, what is the name of the snowman who loves warm hugs?", answer: "Olaf", choices: ["Olaf", "Sven", "Kristoff", "Hans"], emoji: "⛄", funFact: "Olaf's famous quote 'Some people are worth melting for' was voted one of Disney's most loved lines!" },
  { question: "Which movie is about a toy cowboy called Woody?", answer: "Toy Story", choices: ["Toy Story", "Cars", "Brave", "Coco"], emoji: "🤠", funFact: "Toy Story (1995) was the world's first fully computer-animated feature film!" },
  { question: "In The Lion King, what is Simba's dad called?", answer: "Mufasa", choices: ["Mufasa", "Scar", "Rafiki", "Zazu"], emoji: "🦁", funFact: "The Lion King is loosely based on Shakespeare's Hamlet — a play written over 400 years ago!" },
  { question: "Which Disney princess has hair that glows when she sings?", answer: "Rapunzel", choices: ["Rapunzel", "Cinderella", "Aurora", "Ariel"], emoji: "👸", funFact: "Rapunzel's hair in Tangled is 70 feet long — that's longer than a double-decker bus!" },
  { question: "In Monsters, Inc., what scares the monsters about children?", answer: "Children are toxic to monsters", choices: ["Children are toxic to monsters", "Children make monsters disappear", "Children steal monster powers", "Children shrink monsters"], emoji: "👾", funFact: "The animators created special software just to animate Sully's 2.3 million individual hairs!" },
  { question: "What animal is Dumbo?", answer: "Elephant", choices: ["Elephant", "Giraffe", "Rabbit", "Bear"], emoji: "🐘", funFact: "Dumbo was made in just one year — super fast for an animated film!" },
  { question: "In Shrek, what kind of creature is Donkey?", answer: "A donkey", choices: ["A donkey", "A horse", "A mule", "A unicorn"], emoji: "🫏", funFact: "Eddie Murphy improvised many of Donkey's funniest lines — they weren't in the original script!" },
  { question: "Which movie features the song 'Let It Go'?", answer: "Frozen", choices: ["Frozen", "Moana", "Tangled", "Brave"], emoji: "❄️", funFact: "'Let It Go' won the Oscar for Best Original Song and has been translated into 42 languages!" },
  { question: "What is the name of the cowgirl doll in Toy Story 2?", answer: "Jessie", choices: ["Jessie", "Bo Peep", "Barbie", "Dolly"], emoji: "🤠", funFact: "Jessie's backstory scene in Toy Story 2 made millions of adults cry — it's one of Pixar's most emotional moments!" },
];

// Medium — film knowledge, directors, behind the scenes, world cinema (ages 8-10)
const Q_MEDIUM: MovieQuestion[] = [
  { question: "Who directed the Harry Potter film series? (First film director)", answer: "Chris Columbus", choices: ["Chris Columbus", "Steven Spielberg", "J.K. Rowling", "Peter Jackson"], emoji: "⚡", funFact: "Steven Spielberg was originally asked to direct Harry Potter but turned it down!" },
  { question: "In which film does a boy discover he can talk to dead people?", answer: "The Sixth Sense", choices: ["The Sixth Sense", "Casper", "Ghostbusters", "Coraline"], emoji: "👻", funFact: "The twist at the end of The Sixth Sense is considered one of the greatest movie surprises ever!" },
  { question: "What is the highest-grossing animated film of all time?", answer: "The Lion King (2019)", choices: ["The Lion King (2019)", "Frozen II", "Incredibles 2", "Minions"], emoji: "🦁", funFact: "The Lion King (2019) earned over $1.6 billion worldwide!" },
  { question: "In Inside Out, which emotion is NOT one of Riley's main emotions?", answer: "Love", choices: ["Love", "Joy", "Sadness", "Disgust"], emoji: "🧠", funFact: "Pixar consulted real psychologists to make sure the emotions in Inside Out were scientifically accurate!" },
  { question: "What does CGI stand for in film-making?", answer: "Computer-Generated Imagery", choices: ["Computer-Generated Imagery", "Creative Graphics Interface", "Camera Guided Images", "Colour Grade Imaging"], emoji: "💻", funFact: "The first major use of CGI in a film was Westworld in 1973 — just 2D pixel images!" },
  { question: "Which movie features the character E.T. the alien?", answer: "E.T. the Extra-Terrestrial", choices: ["E.T. the Extra-Terrestrial", "Close Encounters", "Aliens", "Men in Black"], emoji: "👽", funFact: "Steven Spielberg directed E.T. — and famously cried when he watched the finished film!" },
  { question: "What is a 'screenplay'?", answer: "The written script of a film", choices: ["The written script of a film", "A special type of cinema screen", "The film's soundtrack", "The opening credits"], emoji: "📜", funFact: "An average screenplay is about 90–120 pages — roughly 1 minute of screen time per page!" },
  { question: "In which country was the Studio Ghibli animation company founded?", answer: "Japan", choices: ["Japan", "USA", "France", "South Korea"], emoji: "🎌", funFact: "Studio Ghibli's Spirited Away (2001) was the first anime film to win an Academy Award!" },
  { question: "What is a 'film score'?", answer: "The music composed specifically for a film", choices: ["The music composed specifically for a film", "The rating a film gets from critics", "The number of films an actor has made", "The cost of making a film"], emoji: "🎼", funFact: "John Williams composed the iconic scores for Star Wars, Jaws, Indiana Jones, and Harry Potter!" },
  { question: "Which film features a young girl who goes to a magical world through a wardrobe?", answer: "The Chronicles of Narnia", choices: ["The Chronicles of Narnia", "Alice in Wonderland", "The Golden Compass", "Pan's Labyrinth"], emoji: "🦁", funFact: "C.S. Lewis wrote The Lion, the Witch and the Wardrobe in just a few months in 1950!" },
];

// Advanced — film history, technique, awards, world cinema (ages 10+)
const Q_HARD: MovieQuestion[] = [
  { question: "What film technique involves playing footage at a higher speed to create a slow-motion effect?", answer: "High-speed (overcranking) camera", choices: ["High-speed (overcranking) camera", "Slow shutter speed", "Time-lapse photography", "Green screen"], emoji: "🎥", funFact: "Bullet time in The Matrix used 120 cameras firing in sequence to create its iconic slow-motion effect!" },
  { question: "The prestigious film festival held in Cannes, France, awards what as its top prize?", answer: "The Palme d'Or", choices: ["The Palme d'Or", "The Golden Lion", "The Golden Bear", "The Grand Jury Prize"], emoji: "🏆", funFact: "The Palme d'Or has been awarded since 1955 — it's one of the most coveted prizes in cinema!" },
  { question: "Which director is known for films like Inception, The Dark Knight, and Interstellar?", answer: "Christopher Nolan", choices: ["Christopher Nolan", "Quentin Tarantino", "Martin Scorsese", "Steven Spielberg"], emoji: "🎬", funFact: "Christopher Nolan shoots on film (not digital) and refuses to use storyboards — he works it all out in his head!" },
  { question: "What is the 'Bechdel Test' in film?", answer: "Whether a film has 2+ women who talk to each other about something other than a man", choices: ["Whether a film has 2+ women who talk to each other about something other than a man", "Whether a film passes censorship rules", "Whether a film has a female director", "Whether a film features a female lead"], emoji: "🎭", funFact: "Fewer than half of Hollywood films pass the Bechdel Test, despite it being a very low bar!" },
  { question: "What does a film's 'aspect ratio' refer to?", answer: "The proportional relationship between the width and height of the screen", choices: ["The proportional relationship between the width and height of the screen", "The ratio of dialogue to action", "The number of cameras used", "The film's budget to box office ratio"], emoji: "📽️", funFact: "IMAX films use a 1.43:1 aspect ratio — much taller than standard widescreen, showing more of the image!" },
  { question: "Which silent film star was known as 'The Little Tramp'?", answer: "Charlie Chaplin", choices: ["Charlie Chaplin", "Buster Keaton", "Harold Lloyd", "Stan Laurel"], emoji: "🎩", funFact: "Charlie Chaplin once entered a Charlie Chaplin look-alike contest — and lost!" },
  { question: "What is the term for the technique of gradually increasing brightness at the start of a scene?", answer: "Fade in", choices: ["Fade in", "Jump cut", "Dissolve", "Match cut"], emoji: "🎞️", funFact: "Stanley Kubrick's 2001: A Space Odyssey used a match cut so famous it's taught in every film school!" },
  { question: "Which film won the first Academy Award for Best Picture in 1928?", answer: "Wings", choices: ["Wings", "Sunrise", "The Jazz Singer", "Metropolis"], emoji: "🏆", funFact: "Wings was a WWI epic and the only silent film to ever win Best Picture at the Oscars!" },
  { question: "What is 'method acting'?", answer: "When an actor stays in character on and off set to deeply embody a role", choices: ["When an actor stays in character on and off set to deeply embody a role", "When an actor learns all lines from memory", "When an actor performs all their own stunts", "When an actor improvises all their dialogue"], emoji: "🎭", funFact: "Heath Ledger stayed in character as The Joker for weeks and kept a diary of the character's thoughts!" },
  { question: "Which Japanese director made Seven Samurai, widely considered one of the greatest films ever?", answer: "Akira Kurosawa", choices: ["Akira Kurosawa", "Hayao Miyazaki", "Yasujirō Ozu", "Hirokazu Kore-eda"], emoji: "🇯🇵", funFact: "Seven Samurai directly inspired The Magnificent Seven and countless other Western films!" },
];

function getQuestions(age: number, level: Level): MovieQuestion[] {
  let pool: MovieQuestion[];
  if (level === "easy" || age <= 7)        pool = Q_EASY;
  else if (level === "advanced" || age >= 10) pool = Q_HARD;
  else                                     pool = Q_MEDIUM;
  if (level === "advanced" && age < 9)     pool = Q_MEDIUM;
  if (level === "easy"     && age > 8)     pool = Q_EASY;

  const count = level === "easy" ? 5 : level === "medium" ? 7 : 10;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}

interface MoviesGameProps { age: number; childId: string; level?: Level; }

export function MoviesGame({ age, childId, level = "medium" }: MoviesGameProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<MovieQuestion[]>([]);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<string | null>(null);
  const [correct, setCorrect]     = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hint, setHint]           = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [showFact, setShowFact]   = useState(false);

  useEffect(() => { setQuestions(getQuestions(age, level)); }, [age, level]);

  const totalQ = questions.length;
  const levelBadge: Record<Level, string> = { easy: "🌱 Easy", medium: "⭐ Medium", advanced: "🔥 Advanced" };

  const handleAnswer = useCallback(async (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    const q = questions[current];
    const isCorrect = choice === q.answer;
    setShowFact(true);

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setHint("✅ Correct! You're a true film buff! 🎬");
    } else {
      setLoadingHint(true);
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childAge: age,
            module: "MOVIES",
            context: `Movies question: "${q.question}". Correct answer: "${q.answer}". Child answered: "${choice}".`,
            question: `I answered "${choice}" but the correct answer is "${q.answer}". Can you explain why in a fun, film-fan way?`,
          }),
        });
        const data = await res.json();
        setHint(data.response ?? `The answer is "${q.answer}" — a great one to remember! 🎥`);
      } catch {
        setHint(`The answer is "${q.answer}". Lights, camera, try again! 🎬`);
      } finally {
        setLoadingHint(false);
      }
    }

    setTimeout(() => {
      setSelected(null); setHint(""); setShowFact(false);
      if (current + 1 >= totalQ) {
        setShowResult(true);
        const score = Math.round(((isCorrect ? correct + 1 : correct) / totalQ) * 100);
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, module: "MOVIES", score, timeTaken: 90 }),
        }).catch(console.error);
      } else {
        setCurrent((c) => c + 1);
      }
    }, isCorrect ? 2200 : 3500);
  }, [selected, questions, current, correct, age, childId, totalQ]);

  if (!questions.length) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-5xl animate-bounce-slow">🎬</div>
    </div>
  );

  if (showResult) {
    const score = Math.round((correct / totalQ) * 100);
    const stars = score === 100 ? 3 : score >= 80 ? 2 : 1;
    return (
      <div className="text-center py-10">
        <div className="text-7xl mb-4">{score >= 80 ? "🏆" : score >= 60 ? "🎬" : "🎞️"}</div>
        <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">
          {score >= 80 ? "Oscar-worthy!" : score >= 60 ? "Great film fan!" : "Keep watching!"}
        </h2>
        <p className="text-xl text-gray-500 mb-4">{correct} out of {totalQ} correct</p>
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-4xl ${i < stars ? "opacity-100" : "opacity-20"}`}>⭐</span>
          ))}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">Back to Home</button>
          <button onClick={() => { setQuestions(getQuestions(age, level)); setCurrent(0); setCorrect(0); setShowResult(false); }} className="btn-primary">
            Play Again 🎬
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = (current / totalQ) * 100;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
          {levelBadge[level]}
        </span>
        <span className="text-sm font-semibold text-gray-500">{correct} correct ⭐</span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
          <span>Question {current + 1} of {totalQ}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7C3AED, #A855F7)" }}
            role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl shadow-card p-8 text-center mb-6 border border-purple-100">
        <div className="text-5xl mb-4">{q.emoji}</div>
        <p className="font-fredoka text-2xl md:text-3xl font-bold text-gray-800 leading-snug">{q.question}</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 gap-3 mb-4" role="group" aria-label="Answer choices">
        {q.choices.map((choice) => {
          let style = "bg-white border-2 border-gray-200 text-gray-800 hover:border-purple-400 hover:bg-purple-50 text-left";
          if (selected !== null) {
            if (choice === q.answer) style = "bg-green-500 border-green-500 text-white text-left";
            else if (choice === selected) style = "bg-red-400 border-red-400 text-white text-left";
            else style = "bg-white border-2 border-gray-100 text-gray-400 opacity-60 text-left";
          }
          return (
            <button key={choice} onClick={() => handleAnswer(choice)} disabled={selected !== null}
              className={`${style} rounded-2xl px-6 py-4 font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300`}>
              {choice}
            </button>
          );
        })}
      </div>

      {/* Fun fact */}
      {showFact && selected && (
        <div className="rounded-2xl p-4 mb-3 bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium" role="status" aria-live="polite">
          🎬 <strong>Did you know?</strong> {q.funFact}
        </div>
      )}

      {(hint || loadingHint) && (
        <div className={`rounded-2xl p-4 text-center font-semibold text-base ${hint.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}
          role="status" aria-live="polite">
          {loadingHint ? "🤔 Getting a hint…" : hint}
        </div>
      )}
    </div>
  );
}
