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

// - - - five-room dungeon beats - - -

// The five-act structure John Four wrote up as the five-room dungeon. The
// "purpose" is what the beat is for; the guises are ways of playing it, so the
// entrance is not always a fight and the puzzle is not always a puzzle.
//
// Each guise is tagged combat or not, because the puzzle is meant to be the
// opposite of the entrance: a fight at the door means a problem behind it, and
// a riddle at the door means something waiting behind it with teeth. The
// setback can land as a false victory as easily as a false defeat, which flips
// the tone of everything around it.

export interface Guise {
  text: string;
  combat: boolean;
}
export interface BeatDef {
  purpose: string;
  guises: Guise[];
}

export const FIVE_ROOM_BEATS: Record<string, BeatDef> = {
  Entrance: {
    purpose: "The way in, and the promise of what waits deeper.",
    guises: [
      {
        text: "Guardian at the gate: something was left here to keep visitors out, and it is still on duty",
        combat: true,
      },
      {
        text: "The door itself answers: touch it and something comes out of the walls",
        combat: true,
      },
      {
        text: "Scouts on the perimeter who have already seen the party coming",
        combat: true,
      },
      {
        text: "A threshold ritual: the way opens only for those who pay it some courtesy",
        combat: false,
      },
      {
        text: "A warning left by the last party through, still legible if anyone reads it",
        combat: false,
      },
      {
        text: "An obstacle of rusted iron and settled stone, more work than danger",
        combat: false,
      },
      {
        text: "A parley: whatever holds the door would rather talk first",
        combat: false,
      },
      {
        text: "An open, unguarded door, which is its own kind of warning",
        combat: false,
      },
    ],
  },
  Puzzle: {
    purpose:
      "The counterweight to the entrance: whatever that was, this is the other thing.",
    guises: [
      {
        text: "A mechanism that must be understood before it will give up the way on",
        combat: false,
      },
      {
        text: "A negotiation with something that knows more about this place than the party does",
        combat: false,
      },
      {
        text: "A riddle in a language nobody here should be able to read, and a price for reading it",
        combat: false,
      },
      {
        text: "A choice with no safe option, only a cheaper one",
        combat: false,
      },
      {
        text: "A search: the way on is here, but not where anyone would look",
        combat: false,
      },
      {
        text: "A wide open space with no cover, and the problem of crossing it",
        combat: false,
      },
      {
        text: "The guardian that should have been at the door, waiting one room in",
        combat: true,
      },
      {
        text: "Something that has to be fought quietly, because of what is in the next room",
        combat: true,
      },
      {
        text: "A caretaker who will not be reasoned with and will not leave its post",
        combat: true,
      },
    ],
  },
  Setback: {
    purpose:
      "The turn, and where the meat of the dungeon is. It should cost the party something.",
    guises: [
      {
        text: "False victory: the obstacle folds far too easily, and something is worse for it",
        combat: true,
      },
      {
        text: "False defeat: the party loses ground here, and that loss is the way forward",
        combat: true,
      },
      {
        text: "An ambush that rises on all sides once the party is committed to the room",
        combat: true,
      },
      {
        text: "A betrayal: something the party trusted turns, or was never what it claimed",
        combat: true,
      },
      {
        text: "The hostages are the enemy, wearing the faces the party came to rescue",
        combat: true,
      },
      {
        text: "A one-way door: the way back closes, and the dungeon stops being optional",
        combat: false,
      },
      {
        text: "The stakes are revealed to be larger, and the clock starts running",
        combat: false,
      },
    ],
  },
  Climax: {
    purpose: "The boss. Everything so far was paying for this.",
    guises: [
      {
        text: "The thing that owns this place, met on ground it chose",
        combat: true,
      },
      {
        text: "A charismatic villain who would rather talk the party around than fight them",
        combat: true,
      },
      {
        text: "Two sides fighting over the prize, and the party gets to decide who wins",
        combat: true,
      },
      {
        text: "A ritual most of the way finished, and the people finishing it",
        combat: true,
      },
      {
        text: "A fight against the clock rather than against hit points",
        combat: true,
      },
      {
        text: "The obstacle from the entrance again, grown into its full strength",
        combat: true,
      },
    ],
  },
  Resolution: {
    purpose: "The payoff, and the hook into whatever comes next.",
    guises: [
      {
        text: "The hoard, and the mundane trouble of carrying it home",
        combat: false,
      },
      {
        text: "An answer to the question the party came in with",
        combat: false,
      },
      {
        text: "A survivor who owes them, and knows the way out",
        combat: false,
      },
      {
        text: "A door to somewhere the party could not have reached before",
        combat: false,
      },
      {
        text: "Proof of what happened here, worth more to the right buyer than gold is",
        combat: false,
      },
      {
        text: "Quiet, and the first safe place to rest since the entrance",
        combat: false,
      },
    ],
  },
  Junction: {
    purpose: "A hall between beats, carrying no part of the story on its own.",
    guises: [
      {
        text: "A crossing hall that everything else in this place opens onto",
        combat: false,
      },
      {
        text: "A junction worn smooth by traffic that has not passed in a long time",
        combat: false,
      },
      {
        text: "A waypoint, useful mainly for working out where the party has not been yet",
        combat: false,
      },
    ],
  },
};

// A dungeon is any location an adventure happens in, so it does not have to be
// a hole in the ground with vaulted ceilings.
export const LOCATIONS = [
  "a crypt under a chapel that was built to keep it shut",
  "a windmill standing over a river that dried up a century ago",
  "a merchant's mansion, sealed with the family still inside",
  "a watchtower on a road nobody uses any more",
  "a flooded mine with one dry level left",
  "a lighthouse whose keeper stopped answering letters",
  "a monastery library, its lower stacks bricked off",
  "a bandit camp built into a collapsed amphitheatre",
  "a sunken barge grounded in the reeds",
  "a menagerie whose cages are mostly open",
  "a foundry gone cold, the moulds still full",
  "a courthouse where the cells outnumber the rooms",
  "an aqueduct junction, half of it still running",
  "the corpse of something enormous, now furnished",
  "a greenhouse where the garden won and kept going",
  "a caravanserai walled up from the inside",
];

// Who wants this done, and what they are actually paying for.
export const PATRONS = [
  "the local baron, who would rather this were quiet",
  "a temple that will not say why it wants the place emptied",
  "a guild that owns the deed and none of the keys",
  "the last surviving heir, who has never been inside",
  "a scholar with a map and no intention of walking in",
  "the village itself, having taken up a collection",
  "a rival who wants it looted before somebody else does",
  "a magistrate settling an inheritance nobody wants",
];
export const COMMISSIONS = [
  "clear it out and confirm what killed the last crew",
  "recover one specific thing and leave the rest",
  "find out what has been coming out of it at night",
  "get proof of who has been using it, and bring that proof back",
  "reach the bottom, whatever the bottom turns out to be",
  "make it safe enough to sell",
  "bring back whoever went in last week",
];

// The entrance has to answer the obvious question: why is this place still
// full of treasure? Something kept everybody else out until now.
export const SEALS = [
  "the door was warded, and the ward has only just failed",
  "the only key was buried with the person who locked it",
  "everyone local knows better, and nobody local is talking",
  "the way in was underwater until this season",
  "the last crew through sealed it behind them on purpose",
  "the entrance was hidden until recent digging exposed it",
  "the thing on the threshold has turned back everyone before now",
  "the ritual that opens it takes something nobody wanted to give",
  "a rockfall closed it, and something has just cleared the rockfall",
];

// What the setback takes out of the party before the boss room.
export const SETBACK_COSTS = [
  "spell slots: this is where the casters spend the ones they were saving",
  "hit points, and enough of them that resting starts to sound reasonable",
  "time: whatever the party is racing gets a head start here",
  "an item, broken or taken, that the party had been relying on",
  "the retreat: whatever they wanted to fall back to is gone",
  "trust, in whichever NPC came this far with them",
];

// Boss rooms are better when the room fights too.
export const BATTLEFIELDS = [
  "a raised dais the boss will not willingly step down from",
  "waist-deep water that halves anyone who tries to charge",
  "chandeliers and scaffolding worth cutting down",
  "a pit across the middle that both sides have to respect",
  "braziers that can be tipped, and will spread",
  "rubble and broken pillars: difficult terrain, and cover for both sides",
  "a ritual circle that hurts whoever stands in it, and matters anyway",
  "three exits, and the boss knows which one leads out",
];
export const BOSS_TACTICS = [
  "goes for the healer first and keeps going",
  "grapples the front line and drags them out of formation",
  "fights from range and spends minions to buy distance",
  "targets whoever solved the puzzle room, having watched them do it",
  "focuses whoever hits hardest, then withdraws when bloodied",
  "never leaves the one piece of terrain that favours it",
];
export const BOSS_TWISTS = [
  "wants a duel, and will honour it about as far as it has to",
  "offers a bargain that is genuinely good, which is the problem",
  "has a monologue with a point in it the party may start to agree with",
  "is not the one in charge, and says so once things go badly",
  "knows one of the party by name, and says it early",
  "would surrender if anyone offered, and nobody usually does",
];

// The resolution is either the reward or the twist, and either way it should
// leave a thread for next time.
export const RESOLUTION_COMPLICATIONS = [
  "the chest is a mimic, and it has been patient",
  "the loot is warded and the ward is still live",
  "the way out is not the way in, and it is not marked",
  "something followed the party down and is between them and the door",
  "the prize is too heavy to carry out in one trip",
  "the survivor the party is escorting has their own errand here",
];
export const RESOLUTION_TWISTS = [
  "the thing the boss was summoning arrives anyway, wearing the boss",
  "the patron wanted this done for a reason nobody mentioned",
  "the villain the party killed was the one holding something worse in place",
  "the proof they came for names somebody the party trusts",
  "one of the bodies here is wearing the party's own colours",
  "the ritual did work, somewhere else, and the party is late",
];
export const HOOKS = [
  "a map with a second site circled and no note explaining why",
  "correspondence signed with a name and no title",
  "a debt marker made out to somebody in the nearest town",
  "a key that does not fit anything here",
  "a survivor's account of where the rest of them went",
  "a shipment manifest for goods that never arrived",
  "an unfinished ritual with the last component missing",
];

// A piece to keep in your pocket: a name dropped now and cashed in years
// later, the way a level-two curiosity becomes a level-thirteen boss fight.
export const KEPT_NAMES = [
  "the Screaming Mass",
  "Cryptus, the Patient Wound",
  "the Lady of Salt",
  "the Third Signatory",
  "Vaun of the Long Hunger",
  "the Kindly Auditor",
  "the Bell Beneath",
  "Orrun, Who Was Owed",
];
export const KEPT_PROMISES = [
  "whoever paid the price at the entrance is marked, and strangers will start noticing them",
  "the name is spoken here once, like it is common knowledge, and never explained",
  "something in this place was left as a message, and it was not left for the party",
  "the cult here was a branch office, and the ledger says where the others are",
  "an item leaves with the party that somebody is going to come asking about",
];

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
