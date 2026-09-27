/**
 * Vice City Identity DNA
 *
 * Computes a deterministic identity archetype from vibe + activity selection.
 * Core design principle: USER CHOICE → VISIBLE CONSEQUENCE.
 *
 * The combination of vibe and tonight's route produces a unique underworld
 * persona label that appears in the setup preview, compilation screen,
 * profile card, and exported dossier — making every selection feel meaningful.
 */

const DNA_MATRIX = {
  'neon-nights': {
    'cruise-city': 'CHROME PHANTOM',
    'hang-docks':  'ELECTRIC GHOST',
    'ride-jetski': 'NEON SPEEDSTER',
    'visit-deli':  'NIGHT INFORMANT',
    'hit-gym':     'MIDNIGHT ENFORCER',
  },
  'ocean-drive': {
    'cruise-city': 'COASTAL SOVEREIGN',
    'hang-docks':  'MARINA OPERATIVE',
    'ride-jetski': 'WAVE RUNNER',
    'visit-deli':  'BOARDWALK INSIDER',
    'hit-gym':     'BEACH TITAN',
  },
  'downtown-heat': {
    'cruise-city': 'CITY PREDATOR',
    'hang-docks':  'HARBOR ENFORCER',
    'ride-jetski': 'BAY RAIDER',
    'visit-deli':  'STREET INTEL',
    'hit-gym':     'CONCRETE TITAN',
  },
  'after-dark': {
    'cruise-city': 'CYBER NOIR RUNNER',
    'hang-docks':  'SHADOW BROKER',
    'ride-jetski': 'DARK WATER GHOST',
    'visit-deli':  'UNDERCOVER ASSET',
    'hit-gym':     'IRON PHANTOM',
  },
  'sunset-boulevard': {
    'cruise-city': 'GOLDEN HOUR DRIFTER',
    'hang-docks':  'TWILIGHT OPERATOR',
    'ride-jetski': 'SUNSET WAVE RIDER',
    'visit-deli':  'BOULEVARD INSIDER',
    'hit-gym':     'GOLDEN TITAN',
  },
  'backstreet': {
    'cruise-city': 'TUNER OUTLAW',
    'hang-docks':  'DOCK SYNDICATE',
    'ride-jetski': 'ACID WAVE RIDER',
    'visit-deli':  'BACKSTREET BROKER',
    'hit-gym':     'YARD IRON',
  },
};

/**
 * Returns the deterministic identity archetype string for a vibe + activity pair.
 * Falls back gracefully if no match is found.
 */
export function computeIdentityDNA(preset, activity) {
  return DNA_MATRIX[preset]?.[activity] ?? 'VICE CITY OPERATIVE';
}

/**
 * Returns deterministic visual DNA telemetry attributes (STYLE, HEAT, ENERGY, MYSTERY, RISK)
 * completely calculated from the user's selected vibe, activity, and character attributes.
 */
export function computeVisualDNAStats(preset = 'neon-nights', activity = 'cruise-city', character = {}) {
  // 1. STYLE: Vibe baseline + activity modifier
  const vibeStyleMap = {
    'neon-nights': 92,
    'ocean-drive': 88,
    'sunset-boulevard': 94,
    'after-dark': 84,
    'downtown-heat': 78,
    'backstreet': 86,
  };
  const activityStyleMod = {
    'cruise-city': 6,
    'ride-jetski': 4,
    'visit-deli': -2,
    'hit-gym': 0,
    'hang-docks': 2,
  };
  const style = Math.min(98, Math.max(45, (vibeStyleMap[preset] || 85) + (activityStyleMod[activity] || 0)));

  // 2. HEAT: Direct reflection of operative heat level (1 - 5)
  const heatLevel = character.heat ?? 3;
  const heat = Math.min(98, Math.max(25, heatLevel * 18 + 8));

  // 3. ENERGY: Derived from physical route intensity
  const activityEnergyMap = {
    'ride-jetski': 95,
    'hang-docks': 90,
    'hit-gym': 85,
    'cruise-city': 80,
    'visit-deli': 60,
  };
  const energy = activityEnergyMap[activity] || 75;

  // 4. MYSTERY: Covert nature of preset and underworld location
  const vibeMysteryMap = {
    'after-dark': 95,
    'backstreet': 88,
    'neon-nights': 70,
    'downtown-heat': 76,
    'sunset-boulevard': 52,
    'ocean-drive': 44,
  };
  const activityMysteryMod = {
    'hang-docks': 8,
    'visit-deli': 6,
    'cruise-city': 0,
    'ride-jetski': -4,
    'hit-gym': -6,
  };
  const mystery = Math.min(98, Math.max(35, (vibeMysteryMap[preset] || 70) + (activityMysteryMod[activity] || 0)));

  // 5. RISK: Street danger quotient based on heat and route stakes
  const activityRiskMap = {
    'hang-docks': 92,
    'ride-jetski': 84,
    'cruise-city': 78,
    'visit-deli': 64,
    'hit-gym': 54,
  };
  const baseRisk = activityRiskMap[activity] || 70;
  const risk = Math.min(98, Math.max(30, Math.round(baseRisk * 0.7 + heatLevel * 6)));

  return [
    { label: 'STYLE', value: style, bar: '████████░░' },
    { label: 'HEAT', value: heat, bar: '███████░░░' },
    { label: 'ENERGY', value: energy, bar: '█████████░' },
    { label: 'MYSTERY', value: mystery, bar: '█████░░░░░' },
    { label: 'RISK', value: risk, bar: '██████░░░░' },
  ];
}
