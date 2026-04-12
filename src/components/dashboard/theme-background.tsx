"use client";

interface Props {
  gameId: string | null | undefined;
  favoriteColor: string;
}

export const DARK_GAME_THEMES = new Set([
  "minecraft", "roblox", "fortnite", "among_us", "superheroes",
]);

// ── SVG scene backgrounds ─────────────────────────────────────────────────────

function MinecraftScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB"/><stop offset="60%" stopColor="#B0E0FF"/><stop offset="100%" stopColor="#7EC8E3"/>
        </linearGradient>
        <linearGradient id="mc-tree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A6B1A"/><stop offset="100%" stopColor="#2D5512"/>
        </linearGradient>
        <linearGradient id="mc-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE066"/><stop offset="100%" stopColor="#FFB800"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#mc-sky)"/>
      {/* Sun */}
      <rect x="650" y="40" width="64" height="64" fill="url(#mc-sun)" rx="4"/>
      <rect x="658" y="48" width="48" height="48" fill="#FFE566" rx="2" opacity="0.6"/>
      {/* Clouds */}
      <g fill="white" opacity="0.9">
        <rect x="80" y="60" width="120" height="24" rx="4"/><rect x="64" y="72" width="152" height="24" rx="4"/><rect x="96" y="84" width="96" height="16" rx="4"/>
      </g>
      <g fill="white" opacity="0.8">
        <rect x="380" y="40" width="96" height="20" rx="4"/><rect x="368" y="52" width="120" height="20" rx="4"/><rect x="388" y="64" width="80" height="14" rx="4"/>
      </g>
      {/* Mountains */}
      <polygon points="0,320 120,180 240,320" fill="#6A6A6A" opacity="0.6"/>
      <polygon points="140,320 300,140 460,320" fill="#5A5A5A" opacity="0.7"/>
      <polygon points="350,320 520,160 680,320" fill="#4A4A4A" opacity="0.6"/>
      <polygon points="560,320 700,200 800,320" fill="#5E5E5E" opacity="0.5"/>
      {/* Ground blocks */}
      {[0,40,80,120,160,200,240,280,320,360,400,440,480,520,560,600,640,680,720,760].map(x => (
        <g key={x}>
          <rect x={x} y="320" width="40" height="40" fill="#5D8C3E" stroke="#3D6B1E" strokeWidth="1"/>
          <rect x={x} y="360" width="40" height="40" fill="#8B6914" stroke="#6B4E0F" strokeWidth="1"/>
          <rect x={x} y="400" width="40" height="40" fill="#828282" stroke="#5A5A5A" strokeWidth="1"/>
          <rect x={x} y="440" width="40" height="40" fill="#6E6E6E" stroke="#4A4A4A" strokeWidth="1"/>
          <rect x={x} y="480" width="40" height="40" fill="#5A5A5A" stroke="#3A3A3A" strokeWidth="1"/>
          <rect x={x} y="520" width="40" height="40" fill="#4A4A4A" stroke="#2A2A2A" strokeWidth="1"/>
          <rect x={x} y="560" width="40" height="40" fill="#3A3A3A" stroke="#1A1A1A" strokeWidth="1"/>
        </g>
      ))}
      {/* Tree 1 */}
      <rect x="100" y="240" width="16" height="80" fill="#6B4E10"/>
      <rect x="72" y="180" width="72" height="72" fill="url(#mc-tree)" rx="2"/>
      <rect x="80" y="164" width="56" height="24" fill="#3A6B1A" rx="2"/>
      <rect x="92" y="152" width="32" height="20" fill="#2D5512" rx="2"/>
      {/* Tree 2 */}
      <rect x="580" y="256" width="16" height="64" fill="#6B4E10"/>
      <rect x="556" y="200" width="64" height="64" fill="url(#mc-tree)" rx="2"/>
      <rect x="564" y="188" width="48" height="20" fill="#3A6B1A" rx="2"/>
      <rect x="572" y="176" width="32" height="18" fill="#2D5512" rx="2"/>
      {/* Tree 3 */}
      <rect x="300" y="268" width="12" height="52" fill="#6B4E10"/>
      <rect x="280" y="220" width="52" height="52" fill="url(#mc-tree)" rx="2"/>
      <rect x="288" y="208" width="36" height="18" fill="#3A6B1A" rx="2"/>
      {/* Creeper */}
      <rect x="690" y="282" width="48" height="48" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" rx="2"/>
      <rect x="700" y="292" width="10" height="10" fill="#1B5E20"/>
      <rect x="718" y="292" width="10" height="10" fill="#1B5E20"/>
      <rect x="708" y="308" width="12" height="6" fill="#1B5E20"/>
      <rect x="704" y="314" width="6" height="8" fill="#1B5E20"/>
      <rect x="718" y="314" width="6" height="8" fill="#1B5E20"/>
      {/* Diamond ore */}
      <rect x="28" y="434" width="40" height="40" fill="#5A5A5A" stroke="#3A3A3A" strokeWidth="1"/>
      <rect x="34" y="440" width="10" height="8" fill="#5EEAD4" opacity="0.9"/>
      <rect x="48" y="448" width="8" height="10" fill="#5EEAD4" opacity="0.9"/>
      <rect x="38" y="456" width="10" height="8" fill="#5EEAD4" opacity="0.9"/>
      {/* Torch */}
      <rect x="450" y="302" width="6" height="18" fill="#C8A96E"/>
      <rect x="448" y="296" width="10" height="8" fill="#FF6B00"/>
      <rect x="450" y="294" width="6" height="6" fill="#FFD700"/>
    </svg>
  );
}

function RobloxScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a2e"/><stop offset="50%" stopColor="#1a1a4e"/><stop offset="100%" stopColor="#2d1b69"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#rb-sky)"/>
      {/* Stars */}
      {[[50,40],[150,80],[280,30],[420,60],[580,25],[700,70],[760,40],[100,150],[350,120],[650,140],[200,200],[500,180],[750,160],[30,250],[450,240],[680,220]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={i%3===0?2.5:1.5} fill="white" opacity={0.5+i%4*0.1}/>
      ))}
      {/* Platforms */}
      <rect x="60" y="240" width="160" height="24" rx="6" fill="#4F46E5" stroke="#818CF8" strokeWidth="2"/>
      <rect x="60" y="258" width="160" height="10" rx="3" fill="#3730A3"/>
      <rect x="300" y="180" width="200" height="24" rx="6" fill="#7C3AED" stroke="#A78BFA" strokeWidth="2"/>
      <rect x="300" y="198" width="200" height="10" rx="3" fill="#5B21B6"/>
      <rect x="580" y="220" width="180" height="24" rx="6" fill="#4F46E5" stroke="#818CF8" strokeWidth="2"/>
      <rect x="580" y="238" width="180" height="10" rx="3" fill="#3730A3"/>
      <rect x="120" y="380" width="220" height="24" rx="6" fill="#6D28D9" stroke="#8B5CF6" strokeWidth="2"/>
      <rect x="120" y="398" width="220" height="10" rx="3" fill="#4C1D95"/>
      <rect x="460" y="350" width="240" height="24" rx="6" fill="#4338CA" stroke="#6366F1" strokeWidth="2"/>
      <rect x="460" y="368" width="240" height="10" rx="3" fill="#312E81"/>
      {/* Ground */}
      <rect x="0" y="480" width="800" height="40" fill="#312E81" stroke="#4338CA" strokeWidth="2"/>
      <rect x="0" y="514" width="800" height="86" fill="#1E1B4B"/>
      {/* Roblox character */}
      <rect x="340" y="120" width="56" height="52" fill="#FFB6C1" rx="4" stroke="#E0A0B0" strokeWidth="2"/>
      <rect x="350" y="134" width="14" height="14" fill="white" rx="2"/>
      <rect x="372" y="134" width="14" height="14" fill="white" rx="2"/>
      <rect x="355" y="138" width="8" height="8" fill="#1a1a4e" rx="1"/>
      <rect x="377" y="138" width="8" height="8" fill="#1a1a4e" rx="1"/>
      <rect x="353" y="154" width="30" height="4" fill="#C0608A" rx="2"/>
      <rect x="342" y="172" width="52" height="52" fill="#4F46E5" rx="4" stroke="#3730A3" strokeWidth="2"/>
      <rect x="310" y="172" width="28" height="40" fill="#4F46E5" rx="4" stroke="#3730A3" strokeWidth="2"/>
      <rect x="398" y="172" width="28" height="40" fill="#4F46E5" rx="4" stroke="#3730A3" strokeWidth="2"/>
      <rect x="342" y="224" width="22" height="44" fill="#312E81" rx="4" stroke="#1E1B4B" strokeWidth="2"/>
      <rect x="372" y="224" width="22" height="44" fill="#312E81" rx="4" stroke="#1E1B4B" strokeWidth="2"/>
      {/* Trophy */}
      <rect x="620" y="420" width="40" height="8" fill="#FBBF24" rx="2"/>
      <rect x="630" y="400" width="20" height="22" fill="#F59E0B" rx="2"/>
      <rect x="616" y="396" width="48" height="12" rx="6" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
      <polygon points="640,380 648,396 632,396" fill="#FCD34D"/>
      {/* Gems */}
      <polygon points="720,160 730,175 720,190 710,175" fill="#EC4899" stroke="#BE185D" strokeWidth="2"/>
      <polygon points="80,310 90,325 80,340 70,325" fill="#34D399" stroke="#059669" strokeWidth="2"/>
    </svg>
  );
}

function PokemonScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB"/><stop offset="70%" stopColor="#B8E4FF"/><stop offset="100%" stopColor="#7EC8E3"/>
        </linearGradient>
        <linearGradient id="pk-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5CB85C"/><stop offset="100%" stopColor="#3D9140"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#pk-sky)"/>
      <circle cx="700" cy="80" r="50" fill="#FFF176" opacity="0.9"/>
      <circle cx="700" cy="80" r="38" fill="#FFF9C4" opacity="0.5"/>
      {/* Clouds */}
      <g fill="white" opacity="0.85"><ellipse cx="150" cy="100" rx="70" ry="30"/><ellipse cx="120" cy="110" rx="50" ry="25"/><ellipse cx="180" cy="108" rx="55" ry="25"/></g>
      <g fill="white" opacity="0.75"><ellipse cx="480" cy="70" rx="60" ry="24"/><ellipse cx="452" cy="80" rx="44" ry="22"/><ellipse cx="508" cy="78" rx="48" ry="22"/></g>
      {/* Path */}
      <rect x="340" y="360" width="120" height="240" fill="#D2B48C" opacity="0.4"/>
      {/* Ground */}
      <rect x="0" y="420" width="800" height="180" fill="url(#pk-grass)"/>
      <rect x="0" y="420" width="800" height="16" fill="#6CC96C"/>
      {/* Flowers */}
      {[[80,430],[160,425],[500,432],[620,428],[720,436]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill={["#FF6B6B","#FFD700","#FF69B4","#FF6B6B","#FFD700"][i]}/>
          <circle cx={x-5} cy={y-5} r="5" fill={["#FF6B6B","#FFD700","#FF69B4","#FF6B6B","#FFD700"][i]} opacity="0.8"/>
          <circle cx={x+5} cy={y-5} r="5" fill={["#FF6B6B","#FFD700","#FF69B4","#FF6B6B","#FFD700"][i]} opacity="0.8"/>
          <circle cx={x} cy={y-8} r="5" fill={["#FF6B6B","#FFD700","#FF69B4","#FF6B6B","#FFD700"][i]} opacity="0.8"/>
          <circle cx={x} cy={y} r="3" fill="white"/>
        </g>
      ))}
      {/* Pokéball */}
      <circle cx="400" cy="320" r="70" fill="white" stroke="#333" strokeWidth="4"/>
      <path d="M330,320 A70,70 0 0,1 470,320" fill="#FF1111" stroke="#333" strokeWidth="4"/>
      <rect x="330" y="316" width="140" height="8" fill="#333"/>
      <circle cx="400" cy="320" r="22" fill="white" stroke="#333" strokeWidth="4"/>
      <circle cx="400" cy="320" r="12" fill="white" stroke="#999" strokeWidth="3"/>
      {/* Lightning bolt */}
      <polygon points="660,200 648,240 660,236 648,280 676,232 662,236 676,200" fill="#FFD700" stroke="#F57F00" strokeWidth="2"/>
      {/* Trees */}
      <ellipse cx="120" cy="350" rx="45" ry="50" fill="#2E7D32"/>
      <rect x="112" y="390" width="16" height="30" fill="#795548"/>
      <ellipse cx="680" cy="360" rx="40" ry="45" fill="#388E3C"/>
      <rect x="672" y="396" width="16" height="24" fill="#795548"/>
    </svg>
  );
}

function PawPatrolScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#56CCF2"/><stop offset="60%" stopColor="#87CEEB"/><stop offset="100%" stopColor="#B0E0FF"/>
        </linearGradient>
        <linearGradient id="pp-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6FCF97"/><stop offset="100%" stopColor="#27AE60"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#pp-sky)"/>
      <circle cx="680" cy="90" r="55" fill="#FFD93D" opacity="0.95"/>
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <line key={i} x1={680+Math.cos(angle*Math.PI/180)*60} y1={90+Math.sin(angle*Math.PI/180)*60} x2={680+Math.cos(angle*Math.PI/180)*80} y2={90+Math.sin(angle*Math.PI/180)*80} stroke="#FFD93D" strokeWidth="4" strokeLinecap="round"/>
      ))}
      {[[120,80],[380,50],[600,100]].map(([cx,cy],i) => (
        <g key={i} fill="white" opacity="0.9">
          <ellipse cx={cx} cy={cy} rx="60" ry="28"/>
          <ellipse cx={cx-30} cy={cy+5} rx="38" ry="24"/>
          <ellipse cx={cx+30} cy={cy+5} rx="42" ry="24"/>
        </g>
      ))}
      {/* Lookout tower */}
      <rect x="340" y="180" width="120" height="240" fill="#E74C3C" rx="4"/>
      <rect x="320" y="160" width="160" height="32" fill="#C0392B" rx="4"/>
      <polygon points="400,80 480,160 320,160" fill="#E74C3C"/>
      <rect x="370" y="300" width="60" height="120" fill="#C0392B" rx="4"/>
      <circle cx="400" cy="200" r="28" fill="#F39C12"/>
      <circle cx="400" cy="200" r="16" fill="#E67E22"/>
      <rect x="358" y="224" width="32" height="32" fill="#3498DB" rx="4"/>
      <rect x="410" y="224" width="32" height="32" fill="#3498DB" rx="4"/>
      {/* Ground */}
      <rect x="0" y="420" width="800" height="180" fill="url(#pp-ground)"/>
      <rect x="0" y="420" width="800" height="20" fill="#8BC34A"/>
      {/* Road */}
      <rect x="0" y="456" width="800" height="60" fill="#607D8B"/>
      {[0,80,160,240,320,400,480,560,640,720].map(x => (
        <rect key={x} x={x+20} y="482" width="50" height="6" fill="white" rx="2" opacity="0.8"/>
      ))}
      {/* Paw prints */}
      {[[80,446],[200,440],[600,444],[720,442]].map(([x,y],i) => (
        <g key={i} fill="#A5D6A7" opacity="0.6">
          <ellipse cx={x} cy={y} rx="10" ry="12"/>
          <circle cx={x-10} cy={y-12} r="5"/>
          <circle cx={x} cy={y-16} r="5"/>
          <circle cx={x+10} cy={y-12} r="5"/>
        </g>
      ))}
      {/* Fire truck */}
      <rect x="560" y="390" width="160" height="60" fill="#E53935" rx="8"/>
      <rect x="560" y="370" width="80" height="30" fill="#E53935" rx="4"/>
      <rect x="568" y="374" width="64" height="22" fill="#81D4FA" rx="3"/>
      <circle cx="590" cy="455" r="18" fill="#333"/><circle cx="590" cy="455" r="10" fill="#777"/>
      <circle cx="700" cy="455" r="18" fill="#333"/><circle cx="700" cy="455" r="10" fill="#777"/>
      <rect x="620" y="362" width="20" height="12" fill="#FFD93D" rx="3"/>
    </svg>
  );
}

function FrozenScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a6b"/><stop offset="40%" stopColor="#2B5797"/><stop offset="100%" stopColor="#4FC3F7"/>
        </linearGradient>
        <linearGradient id="fr-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3F2FD"/><stop offset="100%" stopColor="#BBDEFB"/>
        </linearGradient>
        <radialGradient id="fr-aurora" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#00BCD4" stopOpacity="0.4"/>
          <stop offset="50%" stopColor="#7C4DFF" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#00BCD4" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#fr-sky)"/>
      <ellipse cx="400" cy="180" rx="500" ry="200" fill="url(#fr-aurora)"/>
      {[[60,40],[180,25],[320,55],[500,30],[650,45],[750,20],[100,100],[420,80],[700,110]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%3===0?2:1.5} fill="white" opacity={0.7+i%3*0.1}/>
      ))}
      {/* Mountains */}
      <polygon points="0,400 150,180 300,400" fill="#1565C0" opacity="0.7"/>
      <polygon points="100,400 280,140 460,400" fill="#0D47A1" opacity="0.8"/>
      <polygon points="300,400 500,100 700,400" fill="#1565C0" opacity="0.75"/>
      <polygon points="500,400 680,160 800,400" fill="#0D47A1" opacity="0.7"/>
      <polygon points="150,180 120,230 180,230" fill="white" opacity="0.9"/>
      <polygon points="280,140 245,200 315,200" fill="white" opacity="0.9"/>
      <polygon points="500,100 460,175 540,175" fill="white" opacity="0.9"/>
      <polygon points="680,160 648,215 712,215" fill="white" opacity="0.9"/>
      {/* Ice ground */}
      <rect x="0" y="400" width="800" height="200" fill="url(#fr-snow)"/>
      <line x1="100" y1="420" x2="180" y2="440" stroke="#90CAF9" strokeWidth="2" opacity="0.5"/>
      <line x1="300" y1="430" x2="420" y2="410" stroke="#90CAF9" strokeWidth="2" opacity="0.5"/>
      {/* Snowflakes */}
      {[[80,320],[200,280],[400,260],[600,300],[720,270],[150,370],[500,360],[680,380]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity={0.6+i%3*0.1}>
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#B3E5FC" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="0" y1="-14" x2="0" y2="14" stroke="#B3E5FC" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="-10" y1="-10" x2="10" y2="10" stroke="#B3E5FC" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="10" y1="-10" x2="-10" y2="10" stroke="#B3E5FC" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="0" cy="0" r="3" fill="#E3F2FD"/>
        </g>
      ))}
      {/* Snowman */}
      <circle cx="680" cy="440" r="36" fill="white" stroke="#B0BEC5" strokeWidth="2"/>
      <circle cx="680" cy="394" r="26" fill="white" stroke="#B0BEC5" strokeWidth="2"/>
      <circle cx="680" cy="356" r="20" fill="white" stroke="#B0BEC5" strokeWidth="2"/>
      <circle cx="673" cy="352" r="3" fill="#37474F"/>
      <circle cx="687" cy="352" r="3" fill="#37474F"/>
      <polygon points="680,358 700,360 680,362" fill="#FF7043"/>
      <circle cx="680" cy="386" r="3" fill="#37474F"/>
      <circle cx="680" cy="396" r="3" fill="#37474F"/>
      <circle cx="680" cy="406" r="3" fill="#37474F"/>
      <rect x="662" y="330" width="36" height="8" fill="#1A237E" rx="2"/>
      <rect x="667" y="306" width="26" height="26" fill="#1A237E" rx="2"/>
      <path d="M656,370 Q680,378 704,370" stroke="#E53935" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function SuperheroesScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sh-sky" x1="0" y1="0.5" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a0a1a"/><stop offset="50%" stopColor="#1a1040"/><stop offset="100%" stopColor="#2d1b69"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sh-sky)"/>
      <circle cx="120" cy="100" r="60" fill="#FFF9C4" opacity="0.9"/>
      <circle cx="140" cy="80" r="48" fill="#1a1040" opacity="0.3"/>
      {/* City */}
      {[[0,280,80,320],[60,240,60,360],[100,200,80,400],[160,260,60,340],[200,180,100,420],[280,220,80,380],[340,160,80,440],[420,200,100,400],[500,240,80,360],[560,180,80,420],[620,220,80,380],[680,260,60,340],[720,200,80,400],[760,280,40,320]].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={i%3===0?"#1E1B4B":i%3===1?"#312E81":"#1a1040"}/>
      ))}
      {/* Windows */}
      {[[120,200],[220,180],[300,165],[420,205],[520,245],[580,185],[640,225],[700,265]].map(([bx,by],bi) => (
        [0,1,2,3].map(row => [0,1,2].map(col => (
          <rect key={`${bi}-${row}-${col}`} x={bx+col*22+4} y={by+row*36+8} width="14" height="22" rx="1"
            fill={(bi+row+col)%3===0?"#FFF9C4":"#1E1B4B"} opacity={(bi+row+col)%3===0?0.9:1}/>
        )))
      ))}
      {/* Lightning bolt */}
      <polygon points="380,80 340,200 370,200 330,340 410,180 375,180 420,80" fill="#FFD700" stroke="#F57F00" strokeWidth="3" opacity="0.95"/>
      {/* Stars */}
      {[[200,50],[350,30],[500,60],[650,25],[750,80],[50,150],[600,140]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="white" opacity={0.5+i%3*0.1}/>
      ))}
      {/* Flying hero */}
      <ellipse cx="600" cy="200" rx="40" ry="30" fill="#3730A3" opacity="0.8"/>
      <ellipse cx="610" cy="196" rx="20" ry="15" fill="#1E1B4B" opacity="0.9"/>
      <path d="M575,205 Q560,260 590,280 Q610,270 600,230" fill="#DC2626" opacity="0.85"/>
      {/* POW burst */}
      <polygon points="160,280 180,260 200,280 210,255 220,278 240,265 230,290 250,295 228,305 235,328 212,318 208,342 195,320 175,335 180,310 158,310 172,294" fill="#FFD700" stroke="#F57F00" strokeWidth="2"/>
      <text x="194" y="300" fontSize="18" fontWeight="900" fill="#1a1040" textAnchor="middle" fontFamily="Arial Black, Arial">POW!</text>
    </svg>
  );
}

function FortniteScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fn-sky" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#0d1117"/><stop offset="50%" stopColor="#1c2526"/><stop offset="100%" stopColor="#2d3748"/>
        </linearGradient>
        <linearGradient id="fn-storm" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#1a1a3e" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#fn-sky)"/>
      <ellipse cx="750" cy="300" rx="300" ry="350" fill="url(#fn-storm)"/>
      {[[50,30],[150,60],[300,25],[450,45],[600,35],[720,55],[100,120],[400,100],[680,130]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity={0.5+i%3*0.15}/>
      ))}
      {/* Built structures */}
      <rect x="560" y="200" width="80" height="220" fill="#4A5568" stroke="#718096" strokeWidth="2"/>
      <rect x="548" y="192" width="104" height="20" fill="#2D3748" stroke="#4A5568" strokeWidth="2"/>
      <polygon points="480,420 560,200 560,420" fill="#2D3748" stroke="#4A5568" strokeWidth="2"/>
      <rect x="460" y="300" width="120" height="16" fill="#4A5568" stroke="#718096" strokeWidth="2"/>
      {/* Ground */}
      <rect x="0" y="420" width="800" height="180" fill="#1A2332"/>
      <rect x="0" y="420" width="800" height="12" fill="#2D3748"/>
      {[0,60,140,220,300,400,480,560,660,740].map(x => (
        <rect key={x} x={x} y="420" width="50" height="12" fill="#2E7D32" opacity="0.7"/>
      ))}
      {/* Ammo box */}
      <rect x="100" y="390" width="44" height="36" fill="#B7791F" rx="3" stroke="#92400E" strokeWidth="2"/>
      <rect x="104" y="394" width="36" height="28" fill="#D97706" rx="2"/>
      {/* Shield potion */}
      <ellipse cx="200" cy="405" rx="16" ry="22" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
      <ellipse cx="200" cy="405" rx="10" ry="14" fill="#60A5FA" opacity="0.6"/>
      <rect x="194" y="383" width="12" height="8" fill="#93C5FD" rx="2"/>
      {/* Purple chest */}
      <rect x="320" y="382" width="56" height="44" fill="#5B21B6" rx="4" stroke="#7C3AED" strokeWidth="2"/>
      <ellipse cx="348" cy="404" rx="8" ry="8" fill="#A78BFA" opacity="0.8"/>
      <ellipse cx="348" cy="404" rx="24" ry="20" fill="#7C3AED" opacity="0.3"/>
      {/* Victory Royale */}
      <rect x="150" y="100" width="300" height="64" rx="8" fill="#7C3AED" opacity="0.85"/>
      <text x="300" y="126" fontSize="16" fill="#FCD34D" fontWeight="900" textAnchor="middle" fontFamily="Arial Black, Arial">VICTORY ROYALE</text>
      <text x="300" y="152" fontSize="26" fill="#FFD700" fontWeight="900" textAnchor="middle" fontFamily="Arial">🏆 #1</text>
      {/* Storm ring */}
      <circle cx="400" cy="300" r="250" fill="none" stroke="#7C3AED" strokeWidth="8" strokeDasharray="20,10" opacity="0.4"/>
    </svg>
  );
}

function AmongUsScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="au-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a1a"/><stop offset="50%" stopColor="#1a1a3e"/><stop offset="100%" stopColor="#2d1b69"/>
        </linearGradient>
        <radialGradient id="au-planet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4A90D9"/><stop offset="70%" stopColor="#357ABD"/><stop offset="100%" stopColor="#1a5276"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#au-bg)"/>
      {[[40,35],[120,70],[220,20],[340,55],[460,30],[580,65],[700,22],[760,80],[80,140],[200,110],[360,130],[520,105],[660,145],[780,120],[30,230],[170,200],[290,240],[440,210],[590,235],[730,205]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%4===0?2.5:i%3===0?2:1.5} fill="white" opacity={0.4+i%5*0.12}/>
      ))}
      {/* Planet */}
      <circle cx="680" cy="140" r="90" fill="url(#au-planet)"/>
      <ellipse cx="660" cy="120" rx="45" ry="30" fill="#5DADE2" opacity="0.4" transform="rotate(-20,660,120)"/>
      <ellipse cx="680" cy="140" rx="130" ry="25" fill="none" stroke="#85C1E9" strokeWidth="8" opacity="0.4"/>
      {/* Spaceship */}
      <ellipse cx="200" cy="180" rx="100" ry="40" fill="#2C3E50"/>
      <ellipse cx="200" cy="165" rx="60" ry="30" fill="#34495E"/>
      <ellipse cx="200" cy="155" rx="40" ry="22" fill="#85C1E9" opacity="0.8"/>
      <ellipse cx="140" cy="195" rx="18" ry="8" fill="#FF6B35" opacity="0.8"/>
      <ellipse cx="260" cy="195" rx="18" ry="8" fill="#FF6B35" opacity="0.8"/>
      <ellipse cx="140" cy="198" rx="12" ry="4" fill="#FFD93D" opacity="0.9"/>
      <ellipse cx="260" cy="198" rx="12" ry="4" fill="#FFD93D" opacity="0.9"/>
      {/* Crewmate Red */}
      <ellipse cx="350" cy="370" rx="38" ry="48" fill="#E74C3C"/>
      <rect x="320" y="390" width="26" height="40" fill="#C0392B" rx="4"/>
      <rect x="362" y="390" width="26" height="40" fill="#C0392B" rx="4"/>
      <rect x="312" y="406" width="28" height="16" fill="#A93226" rx="4"/>
      <rect x="366" y="406" width="28" height="16" fill="#A93226" rx="4"/>
      <rect x="318" y="336" width="64" height="40" rx="20" fill="#85C1E9" opacity="0.85"/>
      <rect x="384" y="350" width="22" height="36" fill="#C0392B" rx="4"/>
      {/* Ghost crewmate */}
      <ellipse cx="520" cy="360" rx="32" ry="40" fill="#3498DB" opacity="0.4"/>
      <rect x="496" y="378" width="22" height="34" fill="#2980B9" rx="4" opacity="0.4"/>
      <rect x="522" y="378" width="22" height="34" fill="#2980B9" rx="4" opacity="0.4"/>
      <rect x="504" y="326" width="56" height="36" rx="18" fill="#85C1E9" opacity="0.35"/>
      <ellipse cx="508" cy="316" rx="14" ry="8" fill="#AED6F1" opacity="0.35"/>
      <ellipse cx="530" cy="316" rx="14" ry="8" fill="#AED6F1" opacity="0.35"/>
      {/* Vent */}
      <rect x="80" y="420" width="80" height="40" fill="#2C3E50" rx="4" stroke="#566573" strokeWidth="2"/>
      <line x1="120" y1="420" x2="120" y2="460" stroke="#566573" strokeWidth="2"/>
      <line x1="80" y1="440" x2="160" y2="440" stroke="#566573" strokeWidth="2"/>
      {/* Emergency button */}
      <circle cx="660" cy="440" r="36" fill="#E74C3C" stroke="#922B21" strokeWidth="4"/>
      <circle cx="660" cy="440" r="24" fill="#C0392B"/>
      <text x="660" y="436" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">EMERGENCY</text>
      <text x="660" y="447" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">MEETING</text>
      {/* IMPOSTOR text */}
      <rect x="120" y="80" width="200" height="44" rx="6" fill="#C0392B" opacity="0.9"/>
      <text x="220" y="107" fontSize="22" fill="white" fontWeight="900" textAnchor="middle" fontFamily="Arial Black, Arial">IMPOSTOR!</text>
    </svg>
  );
}

const SCENE_MAP: Record<string, () => JSX.Element> = {
  minecraft:   MinecraftScene,
  roblox:      RobloxScene,
  pokemon:     PokemonScene,
  paw_patrol:  PawPatrolScene,
  frozen:      FrozenScene,
  superheroes: SuperheroesScene,
  fortnite:    FortniteScene,
  among_us:    AmongUsScene,
};

export function ThemeBackground({ gameId, favoriteColor }: Props) {
  const SceneComponent = gameId ? SCENE_MAP[gameId] : null;
  const fallbackGradient = `linear-gradient(160deg, ${favoriteColor}15 0%, ${favoriteColor}08 60%, ${favoriteColor}15 100%)`;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {SceneComponent ? (
        <>
          <SceneComponent />
          {/* Subtle overlay so card text stays readable */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)" }}/>
        </>
      ) : (
        <div className="w-full h-full" style={{ background: fallbackGradient }}/>
      )}
    </div>
  );
}
