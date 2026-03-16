// ─── Favourite Colors ──────────────────────────────────────────────────────────
export const FAVORITE_COLORS = [
  { name: "Electric Blue",  hex: "#3D5AFE", text: "white"  },
  { name: "Fiery Red",      hex: "#F44336", text: "white"  },
  { name: "Sunny Yellow",   hex: "#FFC107", text: "#1A1A2E"},
  { name: "Mint Green",     hex: "#00E676", text: "#1A1A2E"},
  { name: "Hot Pink",       hex: "#E91E63", text: "white"  },
  { name: "Deep Purple",    hex: "#7C4DFF", text: "white"  },
  { name: "Sky Blue",       hex: "#29B6F6", text: "white"  },
  { name: "Orange",         hex: "#FF6D00", text: "white"  },
];

// ─── Favourite Animals (mascots) ──────────────────────────────────────────────
export const FAVORITE_ANIMALS = [
  { emoji: "🦊", name: "Fox"      },
  { emoji: "🐼", name: "Panda"    },
  { emoji: "🦁", name: "Lion"     },
  { emoji: "🐨", name: "Koala"    },
  { emoji: "🐯", name: "Tiger"    },
  { emoji: "🦋", name: "Butterfly"},
  { emoji: "🐬", name: "Dolphin"  },
  { emoji: "🦄", name: "Unicorn"  },
  { emoji: "🐸", name: "Frog"     },
  { emoji: "🦖", name: "Dino"     },
  { emoji: "🐧", name: "Penguin"  },
  { emoji: "🦉", name: "Owl"      },
];

// ─── Favourite Games / Shows (age-filtered) ────────────────────────────────────
export interface FavGame {
  id: string;
  label: string;
  emoji: string;
  minAge: number;
  exampleTopics: Record<string, string>; // module → example phrase for AI
}

export const FAVORITE_GAMES: FavGame[] = [
  {
    id: "minecraft",
    label: "Minecraft",
    emoji: "⛏️",
    minAge: 6,
    exampleTopics: {
      MATH:           "mining diamonds and building with blocks",
      MONEY:          "trading emeralds with villagers",
      SPELLING:       "crafting items like swords and pickaxes",
      TIME_TELLING:   "knowing when night falls so you avoid creepers",
      PUBLIC_SPEAKING:"explaining your best Minecraft build",
      LIFE_SKILLS:    "planning your base before you build it",
    },
  },
  {
    id: "roblox",
    label: "Roblox",
    emoji: "🎮",
    minAge: 6,
    exampleTopics: {
      MATH:           "earning Robux and leveling up",
      MONEY:          "buying items in the Roblox shop",
      SPELLING:       "naming your games and characters",
      TIME_TELLING:   "knowing when your friends are online",
      PUBLIC_SPEAKING:"describing your favourite Roblox game",
      LIFE_SKILLS:    "setting goals for your Roblox character",
    },
  },
  {
    id: "pokemon",
    label: "Pokémon",
    emoji: "⚡",
    minAge: 5,
    exampleTopics: {
      MATH:           "counting HP and attack points",
      MONEY:          "buying Poké Balls at the shop",
      SPELLING:       "spelling Pokémon names like Pikachu",
      TIME_TELLING:   "knowing when to use a Pokémon Center",
      PUBLIC_SPEAKING:"describing your favourite Pokémon",
      LIFE_SKILLS:    "planning your Pokémon team",
    },
  },
  {
    id: "paw_patrol",
    label: "Paw Patrol",
    emoji: "🐾",
    minAge: 5,
    exampleTopics: {
      MATH:           "counting pups on a rescue mission",
      MONEY:          "buying treats for the pups",
      SPELLING:       "spelling pup names like Chase and Skye",
      TIME_TELLING:   "knowing when the next rescue mission starts",
      PUBLIC_SPEAKING:"telling the story of a rescue mission",
      LIFE_SKILLS:    "helping others like the Paw Patrol does",
    },
  },
  {
    id: "frozen",
    label: "Frozen",
    emoji: "❄️",
    minAge: 5,
    exampleTopics: {
      MATH:           "counting snowflakes and ice crystals",
      MONEY:          "buying things in Arendelle's market",
      SPELLING:       "spelling icy words like snow and frost",
      TIME_TELLING:   "knowing when winter arrives in Arendelle",
      PUBLIC_SPEAKING:"telling Elsa and Anna's story",
      LIFE_SKILLS:    "being brave like Elsa and Anna",
    },
  },
  {
    id: "superheroes",
    label: "Superheroes",
    emoji: "🦸",
    minAge: 5,
    exampleTopics: {
      MATH:           "counting how many villains the hero defeated",
      MONEY:          "budgeting for superhero gadgets",
      SPELLING:       "spelling hero names and powers",
      TIME_TELLING:   "knowing when the city needs saving",
      PUBLIC_SPEAKING:"giving a superhero speech to inspire others",
      LIFE_SKILLS:    "helping people like a real superhero",
    },
  },
  {
    id: "fortnite",
    label: "Fortnite",
    emoji: "🏗️",
    minAge: 8,
    exampleTopics: {
      MATH:           "calculating shield and health points",
      MONEY:          "buying V-Bucks and skins",
      SPELLING:       "spelling weapons and locations",
      TIME_TELLING:   "knowing when the storm closes in",
      PUBLIC_SPEAKING:"commentating a Victory Royale",
      LIFE_SKILLS:    "building a strategy before the game",
    },
  },
  {
    id: "among_us",
    label: "Among Us",
    emoji: "🚀",
    minAge: 7,
    exampleTopics: {
      MATH:           "counting crewmates and tasks remaining",
      MONEY:          "earning coins for cosmetics",
      SPELLING:       "spelling words like crew and spaceship",
      TIME_TELLING:   "timing how long tasks take",
      PUBLIC_SPEAKING:"convincing others you are not the impostor",
      LIFE_SKILLS:    "working as a team to complete the mission",
    },
  },
];

// ─── Learning Style ────────────────────────────────────────────────────────────
export const LEARNING_STYLES = [
  {
    id: "challenge",
    label: "Push Me Hard",
    emoji: "💪",
    desc: "I love a tough challenge!",
    aiTone: "enthusiastic and challenging — push them, celebrate effort, use phrases like 'You can do this!' and 'Almost there!'",
  },
  {
    id: "nurture",
    label: "Help Me Along",
    emoji: "🤝",
    desc: "I like hints and support",
    aiTone: "gentle and nurturing — give clear hints, use phrases like 'Great try!' and 'Here is a little clue to help you...'",
  },
];

// ─── Theme builder from child preferences ─────────────────────────────────────
export function buildChildTheme(child: {
  favoriteColor?: string | null;
  favoriteAnimal?: string | null;
  favoriteGame?: string | null;
  age?: number;
}) {
  const color = child.favoriteColor ?? "#3D5AFE";
  const animal = child.favoriteAnimal ?? "🌟";

  // Derive lighter/darker shades from hex
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const lightBg  = `rgba(${r},${g},${b},0.08)`;
  const mediumBg = `rgba(${r},${g},${b},0.18)`;
  const border   = `rgba(${r},${g},${b},0.3)`;

  // World name by age
  const worlds: Record<number, string> = {
    5: "Wonderland", 6: "Adventure", 7: "Explorer",
    8: "Champion",   9: "Discovery", 10: "Galaxy",
  };
  const world = worlds[child.age ?? 7] ?? "Explorer";

  return { color, lightBg, mediumBg, border, animal, world };
}

// ─── AI prompt context from preferences ───────────────────────────────────────
export function buildAIContext(child: {
  name?: string;
  nickname?: string | null;
  favoriteGame?: string | null;
  learningStyle?: string | null;
  favoriteAnimal?: string | null;
  age?: number;
}, module: string): string {
  const name = child.nickname ?? child.name ?? "the child";
  const age = child.age ?? 7;
  const game = FAVORITE_GAMES.find((g) => g.id === child.favoriteGame);
  const style = LEARNING_STYLES.find((s) => s.id === child.learningStyle);

  const gameContext = game
    ? `The child loves ${game.label}. Use examples related to ${game.exampleTopics[module] ?? game.label} when explaining concepts.`
    : "";

  const styleContext = style
    ? `Learning style: be ${style.aiTone}`
    : "Be encouraging and supportive.";

  const animalContext = child.favoriteAnimal
    ? `Their mascot is ${child.favoriteAnimal}. You can occasionally reference their mascot friend cheering them on.`
    : "";

  return `You are tutoring ${name}, age ${age}. ${gameContext} ${styleContext} ${animalContext}`.trim();
}
