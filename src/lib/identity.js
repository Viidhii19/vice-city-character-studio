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
