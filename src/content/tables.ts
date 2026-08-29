// Flavor tables that drive the dungeon "stocking" content. Kept deliberately
// broad rather than exhaustive, enough variety to feel hand-stocked.
//
// Some entries are adapted from the community tables published on
// r/BehindTheTables (https://www.reddit.com/r/BehindTheTables/wiki/index/):
// Basic Dungeons, Dungeon Dressing, Temples, Tombs and Castle Dungeons.

export interface Monster {
  name: string;
  cr: string;
  xp: number;
  mm: number;
}

// A spread of low-level (CR 1/8 – 2) monsters, with Monster Manual pages.
export const MONSTERS: Monster[] = [
  { name: "Giant Rat", cr: "1/8", xp: 25, mm: 327 },
  { name: "Kobold", cr: "1/8", xp: 25, mm: 195 },
  { name: "Bandit", cr: "1/8", xp: 25, mm: 343 },
  { name: "Cultist", cr: "1/8", xp: 25, mm: 345 },
  { name: "Poisonous Snake", cr: "1/8", xp: 25, mm: 334 },
  { name: "Stirge", cr: "1/8", xp: 25, mm: 284 },
  { name: "Giant Poisonous Snake", cr: "1/4", xp: 50, mm: 327 },
  { name: "Giant Centipede", cr: "1/4", xp: 50, mm: 323 },
  { name: "Giant Bat", cr: "1/4", xp: 50, mm: 323 },
  { name: "Swarm of Bats", cr: "1/4", xp: 50, mm: 337 },
  { name: "Winged Kobold", cr: "1/4", xp: 50, mm: 195 },
  { name: "Zombie", cr: "1/4", xp: 50, mm: 316 },
  { name: "Skeleton", cr: "1/4", xp: 50, mm: 272 },
  { name: "Goblin", cr: "1/4", xp: 50, mm: 166 },
  { name: "Shadow", cr: "1/2", xp: 100, mm: 269 },
  { name: "Hobgoblin", cr: "1/2", xp: 100, mm: 186 },
  { name: "Rust Monster", cr: "1/2", xp: 100, mm: 262 },
  { name: "Darkmantle", cr: "1/2", xp: 100, mm: 46 },
  { name: "Magma Mephit", cr: "1/2", xp: 100, mm: 216 },
  { name: "Gnoll", cr: "1/2", xp: 100, mm: 163 },
  { name: "Giant Spider", cr: "1", xp: 200, mm: 328 },
  { name: "Giant Toad", cr: "1", xp: 200, mm: 329 },
  { name: "Ghoul", cr: "1", xp: 200, mm: 148 },
  { name: "Bugbear", cr: "1", xp: 200, mm: 33 },
  { name: "Dryad", cr: "1", xp: 200, mm: 121 },
  { name: "Specter", cr: "1", xp: 200, mm: 279 },
  { name: "Gelatinous Cube", cr: "2", xp: 450, mm: 242 },
  { name: "Gargoyle", cr: "2", xp: 450, mm: 140 },
  { name: "Ogre", cr: "2", xp: 450, mm: 237 },
  { name: "Ogre Zombie", cr: "2", xp: 450, mm: 316 },
  { name: "Will-o'-Wisp", cr: "2", xp: 450, mm: 301 },
  { name: "Minotaur Skeleton", cr: "2", xp: 450, mm: 273 },
];

// Leader + minion pairings for more characterful encounters.
export const LEADER_PAIRS: { leader: string; minion: string }[] = [
  { leader: "Goblin Boss", minion: "Goblin" },
  { leader: "Bandit Captain", minion: "Bandit" },
  { leader: "Cult Fanatic", minion: "Cultist" },
  { leader: "Hobgoblin Captain", minion: "Hobgoblin" },
  { leader: "Ogre", minion: "Zombie" },
];
export const LEADERS: Record<string, Monster> = {
  "Goblin Boss": { name: "Goblin Boss", cr: "1", xp: 200, mm: 166 },
  "Bandit Captain": { name: "Bandit Captain", cr: "2", xp: 450, mm: 344 },
  "Cult Fanatic": { name: "Cult Fanatic", cr: "2", xp: 450, mm: 345 },
  "Hobgoblin Captain": { name: "Hobgoblin Captain", cr: "3", xp: 700, mm: 186 },
  Ogre: { name: "Ogre", cr: "2", xp: 450, mm: 237 },
};

export const MONSTER_ACTIVITY = [
  "gathered around an evil shrine",
  "wielding bizarre eldritch powers",
  "bloodied and fleeing a more powerful enemy",
  "investigating a strange noise",
  "hunting for food",
  "cursed to wander senselessly",
  "squabbling over a scrap of treasure",
  "sleeping fitfully",
  "performing a dark ritual",
  "lost and searching for a way out",
  "guarding a hoard",
  "feasting on a fresh kill",
];

// - - - theme / general - - -

export const CREATORS = [
  "a demonic cult",
  "a mad wizard",
  "an ancient dwarven clan",
  "a forgotten empire",
  "a death priest",
  "a cabal of necromancers",
  "a dragon of old",
  "an exiled noble house",
  "a circle of druids",
  "a guild of assassins",
  "an ancient elvish prince",
  "a dark sorceress",
  "a foreign empire",
  "an ambitious queen of old",
  "a company of prosperous merchants",
  "a powerful noble family",
  "a sect of religious zealots",
  "an ancient race of giants",
  "a tyrannical king of old",
];
export const CREATOR_PURPOSE = [
  "a stronghold",
  "a temple",
  "a tomb",
  "a prison",
  "a mine",
  "a laboratory",
  "a treasure vault",
  "a refuge",
  "a lair",
  "a palace",
  "a storage vault",
  "a sewer",
  "a maze",
];
export const CREATOR_FATE = [
  "were destroyed by a terrible discovery",
  "were wiped out by a rival power",
  "vanished without a trace",
  "were consumed by their own creation",
  "fell to infighting and betrayal",
  "were driven mad and scattered",
  "abandoned it in the dead of night",
];
export const SINCE = [
  "the dungeon has been conquered and altered many times since then",
  "it has since been claimed by monstrous squatters",
  "it has lain sealed and undisturbed for centuries",
  "a series of would-be conquerors have left their mark",
  "it has slowly filled with the detritus of failed expeditions",
  "nature has begun to reclaim its silent halls",
  "a dangerous outlaw has since made a hideout of it",
  "an elemental lord now holds court in its depths",
  "a vampire has since claimed it for a lair",
  "a lich has taken the lower halls for its own",
  "a demon was bound here and never left",
  "an orc warlord has since seized it as a seat of power",
  "a hobgoblin commander garrisons it now",
  "an aberrant presence has settled into its deepest rooms",
  "a witch has moved into its ruined chambers",
  "a dragon has coiled itself around what remains of the treasure",
];

export const WALLS = [
  { name: "Superior Masonry", note: "DC 20 to climb" },
  { name: "Masonry", note: "DC 15 to climb" },
  { name: "Hewn Stone", note: "DC 20 to climb" },
  { name: "Unworked Stone", note: "DC 15 to climb" },
  { name: "Reinforced Masonry", note: "DC 25 to climb" },
];
export const FLOORS = [
  { name: "Uneven Flagstone", note: "DC 10 to charge or run" },
  { name: "Smooth Flagstone", note: null },
  { name: "Natural Stone", note: "DC 10 to charge or run" },
  { name: "Cracked and Broken Tile", note: "DC 12 to charge or run" },
  { name: "Packed Earth", note: null },
];
export const TEMPERATURES = ["Cold", "Cool", "Moderate", "Warm", "Hot"];
export const ILLUMINATION = [
  "Dark (individual creatures may carry lights)",
  "Dark",
  "Dimly lit by phosphorescent fungus",
  "Dimly lit by guttering torches",
  "Brightly lit by everburning braziers",
  "Lit only by distant torchlight from an adjoining chamber",
];

// - - - corridor features - - -

export const CORRIDOR_FLAVOR = [
  "An overwhelming stench fills the corridor",
  "Water drips from the ceiling",
  "Burning torches in iron sconces line the corridor",
  "Several square holes are cut into the walls here",
  "Several alcoves are cut into the walls here",
  "Moaning fills the corridor",
  "Skeletons hang from chains and manacles against the walls",
  "A cold draft flows down the passage",
  "The floor is littered with gnawed bones",
  "Faded murals cover the walls",
  "Cobwebs choke the passage from floor to ceiling",
  "Scratch marks score the stone floor",
  "A slight damp breeze moves through the passage",
  "A strong wind moans down the corridor",
  "A sudden downdraft pushes through from above",
  "The air here is still and very chill",
  "An acrid chemical smell hangs in the air",
  "A dank, mouldy smell fills the passage",
  "A sulphurous reek drifts up the corridor",
  "The stale, fetid air here is hard to breathe",
  "Footsteps echo somewhere ahead",
  "Footsteps recede into the dark behind you",
  "Faint giggling comes from somewhere nearby",
  "Distant chanting rises and falls",
  "Something scratches and scrabbles behind the walls",
  "A slow dripping echoes from further along",
  "Chains rattle somewhere out of sight",
  "A distant gong sounds once, then falls silent",
  "Rubble and dirt cover the floor here",
  "A slimy coating covers the walls",
  "Dry leaves and twigs have drifted into the passage",
  "A large puddle of standing water spans the passage",
];

// - - - room features - - -

export const ROOM_PURPOSE = [
  "an armory",
  "an arena",
  "a gathering hall",
  "a prison",
  "a treasury",
  "a kitchen",
  "a gallery",
  "a maze",
  "an oubliette",
  "a torture chamber",
  "a shrine",
  "a barracks",
  "a crypt",
  "a chapel",
  "a guardroom",
  "a library",
  "a mortuary",
  "an infirmary",
  "a workshop",
  "a stable",
  "a dining hall",
  "a robing room",
  "an interrogation room",
  "a cell block",
];
export const ROOM_PURPOSE_DETAIL: Record<string, string[]> = {
  "an armory": [
    "The walls are scarred by centuries of blades, and a stone table stained with rust stands in the north-east corner of the room.",
    "The walls are scarred by centuries of blades, and cruel arrowheads embedded into the stone mark a shooting range.",
  ],
  "an arena": [
    "The floor is still covered in places by blood-soaked sand, and fragments of shattered iron blades litter the corners.",
    "The floor is still covered in places by blood-soaked sand, and rusted iron spikes are set into the walls at irregular intervals.",
  ],
  "a gathering hall": [
    "A long table of blood-soaked stone still dominates the center of the room, and the walls are scorched where tapestries once hung.",
  ],
  "a prison": [
    "Several ruined iron cages stand against the walls, surrounded by faded and illegible graffiti.",
    "Several ruined iron cages stand against the north wall, beneath hundreds of eyes carved into the vaulted ceiling.",
  ],
  "a treasury": [
    "A few guardian statues still stand within alcoves cut into the walls, and the floor has been smashed by thieves searching for secret spaces.",
  ],
  "a kitchen": [
    "The ruin of a crude hearth lies in the north-west corner of the room, surrounded by a ring of knives driven into the floor.",
  ],
  "a gallery": [
    "A few statues still stand within alcoves cut into the walls, though most have been smashed to rubble.",
    "A few statues still stand within alcoves cut into the walls, and fragments of carved marble litter the corners.",
  ],
  "a maze": [
    "Iron nails driven into the stone mark the missing walls, and centuries of boots have worn the pattern into the floor.",
  ],
  "an oubliette": [
    "The walls are far older than any entrance cut through them, and scarred by centuries of claw marks.",
    "A single pit covered by iron bars lies in the east side of the room, and cries of the long-forgotten dead echo in the vaulted ceiling.",
  ],
  "a torture chamber": [
    "A massive stone table still lies in the south-east corner of the room, ruined and defaced with baleful symbols and runes.",
  ],
  "a shrine": [
    "A defaced altar squats against the far wall, ringed by the stubs of countless burned-down candles.",
  ],
  "a barracks": [
    "Rows of rotten bunks line the walls, and a rack of rusted weapons has collapsed across the floor.",
  ],
  "a crypt": [
    "A gilded sarcophagus lies open along the far wall, and a plaque beside it lists a family lineage no one has read in centuries.",
    "A simple stone sarcophagus stands at the center, its lid marked with dates in a script no longer spoken.",
  ],
  "a chapel": [
    "A small altar is set into an alcove in the wall, and a sconce still holds the stubs of several candles.",
    "A wide fresco of some mythological scene covers the far wall, defaced at the head of every figure.",
  ],
  "a guardroom": [
    "Empty manacles hang along one wall, and a wooden door reinforced with steel bands lies splintered off its hinges.",
  ],
  "a library": [
    "Rotted shelving lines the walls, and a huge book of sacred texts lies open on a lectern, its pages fused into a solid block.",
  ],
  "a mortuary": [
    "A slab of stained stone dominates the room, and the scent of decaying flesh has never quite left it.",
  ],
  "an infirmary": [
    "Rows of rotted cots line the walls, and shattered clay jars litter the floor where a dispensary once stood.",
  ],
  "a workshop": [
    "Racks of embalming tools hang above a workbench, most of them rusted into a single mass.",
  ],
  "a stable": [
    "Iron rings are set into the walls at waist height, and the floor is thick with ancient straw and dung.",
  ],
  "a dining hall": [
    "A long banquet table has collapsed at the center of the room, and an ornamental rug beneath it has rotted to threads.",
  ],
  "a robing room": [
    "Robes and cassocks still hang on hooks along the wall, stiff with age and grey with dust.",
  ],
  "an interrogation room": [
    "A single chair is bolted to the floor beneath an empty sconce, and the stone around it is dark with old stains.",
  ],
  "a cell block": [
    "Steel bars stand where you expected a stone wall, and a passage runs past a row of cells, every door hanging open.",
  ],
};
export const ROOM_AGE = ["might once have been", "might have been"];
export const ROOM_RUIN = [
  ", before the dungeon fell to ruin.",
  ", until recently.",
  ", long ago.",
];

export const FEATURE_CLAUSE = [
  "the ceiling is covered with needle-like stalactites",
  "a stream of water flows along a channel in the floor",
  "a tile mosaic of ancient mythology covers the floor",
  "a chute falls into this room from above",
  "part of the ceiling has collapsed into this room",
  "a corroded chain lies in the south side of the room",
  "a pile of broken glass lies in the south side of the room",
  "several empty flasks are scattered throughout the room",
  "a faded and torn tapestry hangs from the north wall",
  "a stone ramp ascends towards the east wall",
  "lit candles are scattered across the floor",
  "a corroded iron key hangs from a hook on the south wall",
  "a wooden ladder rests against the west wall",
  "rusting iron spikes line the north and east walls",
  "a set of demonic war masks hangs on the west wall",
  "jagged steel blades project from cracks in the north and south walls",
  "a pile of iron blobs lies in the north side of the room",
  "the floor is covered in square tiles, alternating white and black",
  "a small altar is set into an alcove in the wall",
  "empty manacles hang from the wall",
  "a wall sconce holds the stubs of many candles",
  "an empty sconce juts from the wall where a torch should be",
  "a mosaic is set into the floor of the room",
  "a plaque on the wall lists a family lineage",
  "an ornate oil lamp lies on its side, long dry",
  "a gilded sarcophagus stands against the far wall",
  "an empty coffin lies open in the middle of the floor",
  "dust lies thick and undisturbed over everything",
  "rubble and dirt are heaped against the walls",
  "a slimy coating covers the ceiling",
  "dried blood is smeared across the flagstones",
  "a broken bottle and a torn sack lie discarded in a corner",
  "the splintered haft of a pick leans against the wall",
  "a rusted iron bar has been bent nearly double",
  "a badly dented helmet lies where it was dropped",
  "scattered teeth and fangs crunch underfoot",
  "a rotten length of rope trails across the floor",
  "a small puddle of water has gathered in a crack in the floor",
  "guano coats the floor beneath a crack in the ceiling",
  "common fungi sprout from the damp corners",
  "a torch stub lies in a blob of hardened wax",
  "scratchings cover the wall at shoulder height",
];
export const GRAFFITI = [
  "Alotel died here, her luck ran out before her arrows",
  "It's a trap",
  "You cannot kill it with swords",
  "Praise Shiva the Destroyer",
  "Sunilda was here",
  "Don't lose your head",
  "The hammer is cursed",
  "Kill them with acid",
  "The Cohort of Samue killed a demon here",
];
export const WALL_SIDES = ["north", "south", "east", "west"];

// - - - tricks - - -

export const TRICKS = [
  "A magical shrine in the {corner} of the room summons an air elemental to serve whomever offers a prayer (but only once)",
  "A magical shrine of a god of death in the {corner} of the room heals all wounds of whomever offers a prayer (but only once)",
  "A magical idol in the {side} of the room grants greater intelligence (for one hour) to whomever sacrifices a gemstone upon it",
  "A narrow spiral stair passes through this room, leading a thousand feet up or down back to this room",
  "A magical fountain in the {corner} of the room turns water to wine for whomever drinks from it (but only once)",
  "A carved face on the {side} wall whispers a single true prophecy to the first creature to address it",
];
export const CORNERS = [
  "north-west corner",
  "north-east corner",
  "south-west corner",
  "south-east corner",
];
export const SIDES = ["north side", "south side", "east side", "west side"];

// - - - traps - - -

export interface TrapDef {
  name: string;
  find: [number, number];
  disable: [number, number];
  area: string;
  effect: (dc: number, dice: number) => string;
}
export const TRAPS: TrapDef[] = [
  {
    name: "Electrified Floortile",
    find: [10, 20],
    disable: [10, 15],
    area: "affects all targets within a 10 ft. square area",
    effect: (dc, d) => `DC ${dc} save or take ${d}d10 lightning damage`,
  },
  {
    name: "Concealed Pit",
    find: [10, 15],
    disable: [10, 15],
    area: "affects all targets entering a 10 ft. square area",
    effect: (dc, d) => `DC ${dc} save or take ${d}d10 damage`,
  },
  {
    name: "Poison Gas Trap",
    find: [10, 15],
    disable: [10, 15],
    area: "affects all targets within a 10 ft. square area",
    effect: (dc, d) => `DC ${dc} save or take ${d}d10 poison damage`,
  },
  {
    name: "Falling Block",
    find: [10, 15],
    disable: [10, 15],
    area: "affects all targets within a 10 ft. square area",
    effect: (dc, d) => `DC ${dc} save or take ${d}d10 damage`,
  },
  {
    name: "Acid Spray",
    find: [10, 15],
    disable: [15, 20],
    area: "affects all targets within a 20 ft. cone",
    effect: (dc, d) =>
      `DC ${dc} save or take ${d}d10 acid damage for 1d4 rounds`,
  },
  {
    name: "Ice Dart Trap",
    find: [10, 15],
    disable: [10, 15],
    area: "attack",
    effect: (_dc, d) =>
      `+${3 + d * 2} to hit against one target, ${d}d10 cold damage`,
  },
  {
    name: "Arrow Trap",
    find: [10, 15],
    disable: [10, 15],
    area: "attack",
    effect: (_dc, d) =>
      `+${5 + d} to hit against one target, ${d}d10 piercing damage`,
  },
  {
    name: "Magic Missile Trap",
    find: [15, 20],
    disable: [10, 15],
    area: "one target",
    effect: (_dc, d) => `${d}d10 force damage`,
  },
  {
    name: "Contact Poison",
    find: [10, 15],
    disable: [10, 15],
    area: "affects each creature which touches the trigger",
    effect: (dc, d) => `DC ${dc} save or take ${d}d10 damage`,
  },
  {
    name: "Thunderstone Mine",
    find: [15, 15],
    disable: [10, 15],
    area: "affects all targets within 20 ft.",
    effect: (dc, d) =>
      `DC ${dc} save or take ${d}d10 thunder damage and become deafened for 1d4 rounds`,
  },
];
export const SPECIAL_DOOR_TRAPS = [
  "One-way Door: DC 10 to find, DC {dis} to disable",
  "Teleporter Crystal: DC 10 to find, DC 10 to disable; affects each creature which touches the crystal, DC {save} save or be teleported to another location",
];

// - - - secret door concealment - - -

export const SECRET_CONCEAL = [
  "The door is concealed behind an area of slime",
  "A bookcase and concealed door pivots smoothly",
  "The door is concealed behind a tapestry of a legendary battle",
  "The door is located near the ceiling and concealed behind a pile of skulls",
  "The door is concealed within the mouth of a demonic face carved from stone",
  "The door is located above a small stone dais and concealed within a mosaic of legendary monsters",
  "The door is concealed behind a statue of a demonic sorceress, and opened by moving her hand",
  "The door is concealed behind an area of mould",
  "The door is concealed behind a pile of skulls",
  "The door is located above a small stone dais and concealed by an illusion",
];

// - - - doors - - -

export interface DoorMaterial {
  name: string;
  hp: number;
  breakDC: number;
  openDC: number; // DC to pick the lock, when locked
}
export const DOOR_MATERIALS: DoorMaterial[] = [
  { name: "Simple Wooden", hp: 10, breakDC: 15, openDC: 10 },
  { name: "Good Wooden", hp: 15, breakDC: 15, openDC: 15 },
  { name: "Strong Wooden", hp: 20, breakDC: 20, openDC: 20 },
  { name: "Stone", hp: 60, breakDC: 25, openDC: 20 },
  { name: "Iron", hp: 60, breakDC: 30, openDC: 25 },
];
export const DOOR_QUIRK = [
  null,
  null,
  null,
  "(slides up)",
  "(slides to one side)",
  "(magically reinforced, disadvantage to break)",
];

// - - - treasure - - -

export const GEMS_10 = [
  "azurite",
  "blue quartz",
  "lapis lazuli",
  "moss agate",
  "tiger eye",
  "turquoise",
];
export const GEMS_50 = [
  "diamond",
  "chalcedony",
  "jasper",
  "moonstone",
  "sardonyx",
  "carnelian",
  "citrine",
  "quartz",
  "onyx",
  "zircon",
];
export const ART_25 = [
  "a bone rod inlaid with ornate silver scrollwork",
  "a bone shield brooch set with topaz",
  "a jasper cup inlaid with ornate electrum scrollwork",
  "a pewter crown inlaid with a filigree of silver",
  "a stoneware tile adorned with silver in relief",
  "a cloth coat trimmed with fur",
  "a fine steel salt cellar set with pearl",
  "a set of crystal dice",
  "an earthenware tureen embossed with arcane runes",
  "a lacquered wooden medallion inlaid with electrum",
  "a copper shield brooch engraved with arcane runes",
  "a wooden orb engraved with arcane runes",
];
export const MAGIC_ITEMS = [
  "Potion of Healing (common, dmg 187)",
  "Potion of Greater Healing (uncommon, dmg 187)",
  "Potion of Animal Friendship (uncommon, dmg 187)",
  "Potion of Fire Breath (uncommon, dmg 187)",
  "Potion of Gaseous Form (rare, dmg 187)",
  "Driftglobe (uncommon, dmg 166)",
  "Dust of Dryness (uncommon, dmg 166)",
  "Spell Scroll (Mending) (common, dmg 200)",
  "Spell Scroll (Arcane Lock) (uncommon, dmg 200)",
  "Robe of Useful Items (uncommon, dmg 195)",
  "Scroll of Protection (rare, dmg 199)",
  "Bag of Holding (uncommon, dmg 153)",
];
