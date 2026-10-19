// Flat illustrations for fun facts, keyed by the fact's `tag` (lowercase).
// Add a new key here when you introduce a new tag in data.js.
window.ICONS = {
  laughter: `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="34" fill="#ffd23f" stroke="#e8a900" stroke-width="3"/>
    <path d="M32 44 q6-8 12 0 M56 44 q6-8 12 0" stroke="#3b2a00" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M30 56 h40 q-4 22 -20 22 q-16 0 -20 -22z" fill="#7a2a1a"/><path d="M38 70 q12 8 24 0 q-4 8 -12 8 q-8 0 -12 -8z" fill="#ef4f5f"/>
    <path d="M24 48 q-6 8 -2 14 q6 0 4 -8z M76 48 q6 8 2 14 q-6 0 -4 -8z" fill="#5ec5ff"/></svg>`,
  heart: `<svg viewBox="0 0 100 100"><path d="M50 86 C14 62 10 40 18 28 c8 -12 26 -12 32 4 c6 -16 24 -16 32 -4 c8 12 4 34 -32 58z" fill="#ef4f5f"/>
    <path d="M16 52 h18 l6 -12 l8 24 l7 -18 l5 6 h24" stroke="#fff" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  walking: `<svg viewBox="0 0 100 100"><path d="M12 60 q2 -14 16 -18 l14 -4 q8 -8 12 -14 l10 6 q4 10 14 14 q12 4 12 16 v6 H12z" fill="#2fb0e8"/>
    <path d="M10 66 h80 v6 q0 6 -6 6 H16 q-6 0 -6 -6z" fill="#f5f7fb" stroke="#c7d2e3" stroke-width="2"/>
    <path d="M44 40 l6 6 M50 34 l6 6 M56 28 l6 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M20 56 q14 -4 26 2" stroke="#1d7fb0" stroke-width="3" fill="none"/></svg>`,
  hydration: `<svg viewBox="0 0 100 100"><path d="M30 20 h40 l-5 64 q-1 6 -7 6 H42 q-6 0 -7 -6z" fill="#e7f2ff" stroke="#9cc3ec" stroke-width="3"/>
    <path d="M33 44 h34 l-3 40 q-1 4 -5 4 H41 q-4 0 -5 -4z" fill="#5ec5ff"/><ellipse cx="50" cy="44" rx="17" ry="3" fill="#8fd8ff"/>
    <path d="M16 36 q-6 8 0 12 q6 -4 0 -12z M84 52 q-6 8 0 12 q6 -4 0 -12z M80 24 q-4 6 0 9 q4 -3 0 -9z" fill="#2d8fdf"/></svg>`,
  strength: `<svg viewBox="0 0 100 100"><rect x="30" y="46" width="40" height="8" rx="3" fill="#8a94a8"/>
    <rect x="14" y="30" width="10" height="40" rx="4" fill="#7b5cff"/><rect x="24" y="36" width="8" height="28" rx="3" fill="#a48dff"/>
    <rect x="76" y="30" width="10" height="40" rx="4" fill="#7b5cff"/><rect x="68" y="36" width="8" height="28" rx="3" fill="#a48dff"/>
    <rect x="6" y="44" width="8" height="12" rx="3" fill="#5d6b8a"/><rect x="86" y="44" width="8" height="12" rx="3" fill="#5d6b8a"/></svg>`,
  sleep: `<svg viewBox="0 0 100 100"><path d="M58 18 a32 32 0 1 0 24 52 a26 26 0 1 1 -24 -52z" fill="#ffd23f" stroke="#e8a900" stroke-width="2"/>
    <circle cx="40" cy="58" r="3" fill="#e8a900"/><circle cx="52" cy="72" r="2.5" fill="#e8a900"/>
    <text x="62" y="36" font-family="Baloo 2, sans-serif" font-weight="800" font-size="16" fill="#2d6cdf">Z</text>
    <text x="74" y="24" font-family="Baloo 2, sans-serif" font-weight="800" font-size="12" fill="#2d6cdf">z</text>
    <text x="84" y="14" font-family="Baloo 2, sans-serif" font-weight="800" font-size="9" fill="#2d6cdf">z</text></svg>`,
  stretching: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="90" rx="34" ry="5" fill="#cdeedd"/>
    <circle cx="44" cy="22" r="8" fill="#f2b38a"/><path d="M44 30 q4 18 2 30" stroke="#16a085" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M44 34 q16 -10 30 -24 M46 36 q-14 -2 -26 -14" stroke="#f2b38a" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M46 60 l-14 26 M46 60 l18 24" stroke="#1d2b4f" stroke-width="7" stroke-linecap="round" fill="none"/></svg>`,
  movement: `<svg viewBox="0 0 100 100"><rect x="44" y="8" width="12" height="8" rx="2" fill="#5d6b8a"/><path d="M72 22 l6 -6" stroke="#5d6b8a" stroke-width="5" stroke-linecap="round"/>
    <circle cx="50" cy="56" r="34" fill="#fff" stroke="#1d2b4f" stroke-width="5"/>
    <path d="M50 56 V22 A34 34 0 0 1 70 28.5 z" fill="#ffd23f"/><path d="M50 56 L66 34" stroke="#ef4f5f" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="56" r="4" fill="#1d2b4f"/><text x="50" y="80" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#1d2b4f">5 min</text></svg>`,
  nuts: `<svg viewBox="0 0 100 100"><g transform="rotate(-30 50 50)"><path d="M50 12 c16 0 20 14 14 24 c-4 6 -4 10 0 16 c8 12 2 36 -14 36 c-16 0 -22 -24 -14 -36 c4 -6 4 -10 0 -16 c-6 -10 -2 -24 14 -24z" fill="#d9a066" stroke="#a8743c" stroke-width="3"/>
    <path d="M40 24 h20 M38 34 h24 M36 60 h28 M36 72 h28" stroke="#a8743c" stroke-width="2" stroke-dasharray="3 4"/></g></svg>`,
  fruit: `<svg viewBox="0 0 100 100"><path d="M18 30 q6 46 60 46 q10 0 12 -6 q-44 4 -60 -42z" fill="#ffd23f" stroke="#e8a900" stroke-width="3" stroke-linejoin="round"/>
    <path d="M16 24 l6 8" stroke="#6b4a1a" stroke-width="6" stroke-linecap="round"/><path d="M84 70 l6 0" stroke="#6b4a1a" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 38 q12 26 44 30" stroke="#e8a900" stroke-width="2" fill="none"/></svg>`,
  vitamins: `<svg viewBox="0 0 100 100"><path d="M50 26 c-14 -6 -30 2 -30 22 c0 20 10 40 20 40 c4 0 6 -4 10 -4 c4 0 6 4 10 4 c10 0 20 -20 20 -40 c0 -20 -16 -28 -30 -22z" fill="#ef4f5f" stroke="#c22f3f" stroke-width="3"/>
    <path d="M50 28 q0 30 0 54" stroke="#c22f3f" stroke-width="2" fill="none"/><path d="M50 28 q0 -12 10 -18" stroke="#22b573" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M34 36 q-4 10 -2 22" stroke="#ff9aa5" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`,
  energy: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fff6dd"/><path d="M56 10 L24 56 h22 l-6 34 l34 -48 H52z" fill="#ffd23f" stroke="#e8a900" stroke-width="3" stroke-linejoin="round"/></svg>`,
  nature: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="90" rx="36" ry="5" fill="#cdeedd"/><rect x="45" y="58" width="10" height="32" rx="3" fill="#8a5a2b"/>
    <circle cx="50" cy="38" r="24" fill="#22b573"/><circle cx="32" cy="50" r="16" fill="#1e9e64"/><circle cx="68" cy="50" r="16" fill="#1e9e64"/>
    <circle cx="44" cy="30" r="6" fill="#5fd39b"/><circle cx="84" cy="18" r="8" fill="#ffd23f"/></svg>`,
  breathing: `<svg viewBox="0 0 100 100"><path d="M50 12 v34" stroke="#c7d2e3" stroke-width="6" stroke-linecap="round"/>
    <path d="M46 40 q-8 -14 -18 -10 q-14 6 -14 34 q0 20 12 22 q16 2 20 -14z" fill="#ff8fa3"/><path d="M54 40 q8 -14 18 -10 q14 6 14 34 q0 20 -12 22 q-16 2 -20 -14z" fill="#ff8fa3"/>
    <path d="M50 44 q-6 6 -12 6 M50 44 q6 6 12 6" stroke="#c7d2e3" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M26 50 q-2 14 4 24 M74 50 q2 14 -4 24" stroke="#ffc2cd" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  gratitude: `<svg viewBox="0 0 100 100"><rect x="22" y="12" width="56" height="76" rx="6" fill="#fff" stroke="#7b5cff" stroke-width="4"/>
    <path d="M22 22 h-6 M22 36 h-6 M22 50 h-6 M22 64 h-6 M22 78 h-6" stroke="#7b5cff" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 52 c-14 -10 -12 -24 -2 -22 q2 0 2 4 q0 -4 2 -4 c10 -2 12 12 -2 22z" fill="#ef4f5f"/>
    <path d="M34 64 h32 M34 74 h22" stroke="#c7d2e3" stroke-width="4" stroke-linecap="round"/></svg>`,
  focus: `<svg viewBox="0 0 100 100"><circle cx="46" cy="54" r="36" fill="#ef4f5f"/><circle cx="46" cy="54" r="26" fill="#fff"/>
    <circle cx="46" cy="54" r="16" fill="#ef4f5f"/><circle cx="46" cy="54" r="6" fill="#fff"/>
    <path d="M46 54 L84 16" stroke="#1d2b4f" stroke-width="4" stroke-linecap="round"/><path d="M78 12 l10 -2 l-2 10 z M80 22 l10 -2" fill="#2d6cdf" stroke="#2d6cdf" stroke-width="3" stroke-linejoin="round"/></svg>`,
  screens: `<svg viewBox="0 0 100 100"><rect x="32" y="14" width="36" height="72" rx="8" fill="#1d2b4f"/><rect x="36" y="22" width="28" height="54" rx="3" fill="#5ec5ff"/>
    <circle cx="50" cy="81" r="2.5" fill="#8a94a8"/><path d="M20 30 l-8 -6 M18 50 h-10 M20 70 l-8 6 M80 30 l8 -6 M82 50 h10 M80 70 l8 6" stroke="#2d6cdf" stroke-width="4" stroke-linecap="round"/></svg>`,
  routine: `<svg viewBox="0 0 100 100"><circle cx="24" cy="22" r="10" fill="#ffd23f"/><circle cx="76" cy="22" r="10" fill="#ffd23f"/>
    <circle cx="50" cy="54" r="32" fill="#fff" stroke="#2d6cdf" stroke-width="6"/><path d="M50 54 V34 M50 54 l14 8" stroke="#1d2b4f" stroke-width="5" stroke-linecap="round"/>
    <path d="M28 84 l-6 8 M72 84 l6 8" stroke="#2d6cdf" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="54" r="3" fill="#ef4f5f"/></svg>`,
  avocado: `<svg viewBox="0 0 100 100"><path d="M50 8 c14 0 18 16 22 30 c6 18 14 26 10 40 c-4 12 -18 16 -32 16 c-14 0 -28 -4 -32 -16 c-4 -14 4 -22 10 -40 c4 -14 8 -30 22 -30z" fill="#3e7d2c"/>
    <path d="M50 16 c10 0 13 12 16 24 c5 16 11 22 8 34 c-3 9 -13 12 -24 12 c-11 0 -21 -3 -24 -12 c-3 -12 3 -18 8 -34 c3 -12 6 -24 16 -24z" fill="#cfe68a"/>
    <circle cx="50" cy="64" r="14" fill="#8a5a2b"/><circle cx="46" cy="60" r="4" fill="#b07a45"/></svg>`,
  yogurt: `<svg viewBox="0 0 100 100"><path d="M22 38 h56 l-6 46 q-1 6 -7 6 H35 q-6 0 -7 -6z" fill="#e7f2ff" stroke="#2d6cdf" stroke-width="3"/>
    <path d="M24 52 h52" stroke="#2d6cdf" stroke-width="3"/><path d="M22 38 q8 -10 16 -2 q6 -8 12 0 q6 -8 12 0 q8 -8 16 2z" fill="#fff" stroke="#c7d2e3" stroke-width="2"/>
    <circle cx="40" cy="30" r="5" fill="#ef4f5f"/><circle cx="54" cy="28" r="5" fill="#7b5cff"/><circle cx="64" cy="32" r="4" fill="#ef4f5f"/>
    <path d="M70 12 l-12 26" stroke="#8a94a8" stroke-width="4" stroke-linecap="round"/><ellipse cx="72" cy="10" rx="5" ry="7" fill="#8a94a8" transform="rotate(25 72 10)"/></svg>`,
  popcorn: `<svg viewBox="0 0 100 100"><g fill="#fff6dd" stroke="#e8a900" stroke-width="2"><circle cx="32" cy="34" r="10"/><circle cx="50" cy="26" r="11"/><circle cx="68" cy="34" r="10"/><circle cx="40" cy="20" r="8"/><circle cx="60" cy="18" r="8"/></g>
    <path d="M22 40 h56 l-8 50 H30z" fill="#fff"/><path d="M22 40 h10 l4 50 h-6z M44 40 h12 l-1 50 h-10z M68 40 h10 l-8 50 h-6z" fill="#ef4f5f"/>
    <path d="M22 40 h56 l-8 50 H30z" fill="none" stroke="#c22f3f" stroke-width="2"/></svg>`,
  berries: `<svg viewBox="0 0 100 100"><path d="M50 22 q14 -16 30 -10 q-10 14 -30 10z" fill="#22b573"/>
    <circle cx="34" cy="56" r="18" fill="#3b4cc0"/><circle cx="64" cy="50" r="18" fill="#4a5fd6"/><circle cx="50" cy="74" r="16" fill="#2f3ea8"/>
    <path d="M30 50 l4 4 l4 -4 M60 44 l4 4 l4 -4 M46 68 l4 4 l4 -4" stroke="#1a2470" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="28" cy="50" r="3" fill="#8e9cf0"/><circle cx="58" cy="44" r="3" fill="#8e9cf0"/></svg>`,
  music: `<svg viewBox="0 0 100 100"><path d="M18 60 v-10 a32 32 0 0 1 64 0 v10" stroke="#1d2b4f" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="12" y="54" width="18" height="30" rx="8" fill="#7b5cff"/><rect x="70" y="54" width="18" height="30" rx="8" fill="#7b5cff"/>
    <path d="M44 40 v24 M44 40 l14 -4 v22" stroke="#ef4f5f" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="40" cy="65" r="5" fill="#ef4f5f"/><circle cx="54" cy="59" r="5" fill="#ef4f5f"/></svg>`,
  sunlight: `<svg viewBox="0 0 100 100"><circle cx="50" cy="60" r="20" fill="#ffd23f"/>
    <g stroke="#ff8a3d" stroke-width="5" stroke-linecap="round"><path d="M50 28 v-14 M24 40 l-10 -10 M76 40 l10 -10 M18 62 h-12 M82 62 h12"/></g>
    <path d="M0 72 q25 -14 50 0 t50 0 V100 H0z" fill="#22b573"/><path d="M0 84 q25 -10 50 0 t50 0 V100 H0z" fill="#1e9e64"/></svg>`,
  friends: `<svg viewBox="0 0 100 100"><circle cx="32" cy="34" r="12" fill="#f2b38a"/><circle cx="68" cy="34" r="12" fill="#c98a5e"/>
    <path d="M12 86 q0 -32 20 -32 q20 0 20 32z" fill="#2d6cdf"/><path d="M48 86 q0 -32 20 -32 q20 0 20 32z" fill="#16a085"/>
    <path d="M50 26 c-8 -6 -7 -14 -1 -13 q1 0 1 2 q0 -2 1 -2 c6 -1 7 7 -1 13z" fill="#ef4f5f" transform="translate(0 -6) scale(1)"/></svg>`,
  meditation: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#f1eaff"/><circle cx="50" cy="24" r="9" fill="#f2b38a"/>
    <path d="M50 33 q-12 0 -12 20 h24 q0 -20 -12 -20z" fill="#7b5cff"/><path d="M38 40 q-12 10 -6 22 M62 40 q12 10 6 22" stroke="#f2b38a" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M20 72 q30 -16 60 0 q-30 10 -60 0z" fill="#5a3fd6"/><circle cx="32" cy="64" r="3" fill="#f2b38a"/><circle cx="68" cy="64" r="3" fill="#f2b38a"/></svg>`,
  caffeine: `<svg viewBox="0 0 100 100"><path d="M36 26 q-6 -8 0 -16 M50 26 q-6 -8 0 -16 M64 26 q-6 -8 0 -16" stroke="#c7d2e3" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M18 34 h56 v26 q0 24 -28 24 q-28 0 -28 -24z" fill="#ff8a3d"/><path d="M74 40 h6 q10 0 10 10 q0 10 -10 10 h-7" stroke="#ff8a3d" stroke-width="6" fill="none"/>
    <ellipse cx="46" cy="34" rx="28" ry="5" fill="#6b4a1a"/><path d="M12 90 h68" stroke="#c7d2e3" stroke-width="5" stroke-linecap="round"/></svg>`,
  temperature: `<svg viewBox="0 0 100 100"><rect x="30" y="10" width="20" height="58" rx="10" fill="#fff" stroke="#1d2b4f" stroke-width="4"/>
    <circle cx="40" cy="74" r="16" fill="#2d8fdf" stroke="#1d2b4f" stroke-width="4"/><rect x="36" y="40" width="8" height="32" fill="#2d8fdf"/>
    <g stroke="#5ec5ff" stroke-width="4" stroke-linecap="round"><path d="M74 26 v32 M60 34 l28 16 M60 50 l28 -16"/></g></svg>`,
  naps: `<svg viewBox="0 0 100 100"><path d="M10 54 q0 -16 16 -16 h48 q16 0 16 16 q0 16 -16 16 H26 q-16 0 -16 -16z" fill="#fff" stroke="#9cc3ec" stroke-width="4"/>
    <path d="M24 46 q26 8 52 0" stroke="#c7d2e3" stroke-width="3" fill="none"/>
    <circle cx="74" cy="24" r="14" fill="#ffd23f" stroke="#e8a900" stroke-width="3"/><path d="M74 16 v8 l6 3" stroke="#1d2b4f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <text x="22" y="30" font-family="Baloo 2, sans-serif" font-weight="800" font-size="16" fill="#2d6cdf">Zz</text></svg>`,
  dreams: `<svg viewBox="0 0 100 100"><path d="M26 70 a16 16 0 0 1 2 -32 a20 20 0 0 1 38 -6 a16 16 0 0 1 8 38z" fill="#e7f2ff" stroke="#9cc3ec" stroke-width="3"/>
    <path d="M50 40 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1z" fill="#ffd23f"/>
    <circle cx="34" cy="56" r="3" fill="#7b5cff"/><circle cx="66" cy="54" r="3" fill="#7b5cff"/>
    <circle cx="30" cy="82" r="5" fill="#e7f2ff" stroke="#9cc3ec" stroke-width="2"/><circle cx="20" cy="92" r="3" fill="#e7f2ff" stroke="#9cc3ec" stroke-width="2"/></svg>`,
  memory: `<svg viewBox="0 0 100 100"><path d="M48 18 q-14 -6 -22 4 q-12 2 -12 16 q-8 8 -2 20 q0 14 14 16 q8 10 22 4z" fill="#ff8fa3" stroke="#e05a78" stroke-width="3"/>
    <path d="M52 18 q14 -6 22 4 q12 2 12 16 q8 8 2 20 q0 14 -14 16 q-8 10 -22 4z" fill="#ffa3b4" stroke="#e05a78" stroke-width="3"/>
    <path d="M30 34 q8 4 6 12 M24 56 q10 -2 14 6 M70 34 q-8 4 -6 12 M76 56 q-10 -2 -14 6 M50 20 v58" stroke="#e05a78" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M84 10 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2z" fill="#ffd23f"/></svg>`,
  bath: `<svg viewBox="0 0 100 100"><path d="M20 22 q0 -10 10 -10 q8 0 8 8" stroke="#8a94a8" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g fill="#e7f2ff" stroke="#9cc3ec" stroke-width="2"><circle cx="40" cy="44" r="8"/><circle cx="54" cy="40" r="10"/><circle cx="68" cy="46" r="7"/><circle cx="78" cy="30" r="5"/></g>
    <rect x="8" y="50" width="84" height="8" rx="4" fill="#2d6cdf"/><path d="M14 58 h72 v8 q0 16 -18 16 H32 q-18 0 -18 -16z" fill="#5ec5ff"/>
    <path d="M26 82 l-4 8 M74 82 l4 8" stroke="#2d6cdf" stroke-width="5" stroke-linecap="round"/></svg>`,
  default: `<svg viewBox="0 0 100 100"><path d="M50 12 a26 26 0 0 0 -16 46 q4 4 4 10 h24 q0 -6 4 -10 a26 26 0 0 0 -16 -46z" fill="#ffd23f" stroke="#e8a900" stroke-width="3"/>
    <rect x="38" y="72" width="24" height="6" rx="2" fill="#8a94a8"/><rect x="40" y="80" width="20" height="6" rx="2" fill="#8a94a8"/>
    <path d="M44 50 l6 -10 l6 10" stroke="#e8a900" stroke-width="3" fill="none"/></svg>`
};
