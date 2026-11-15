// Share links must round-trip every option, and reject values no control offers.

import { hashFor, optionsFromHash } from "../ui/useMapTool";
import { DEFAULT_OPTIONS, FIELDS } from "../ui/options";
import type { DungeonOptions } from "../dungeon/types";
import { fail } from "./util";

export function checkUrls(): string {
  let n = 0;
  for (const field of FIELDS) {
    for (const { value } of field.options) {
      const options = {
        ...DEFAULT_OPTIONS,
        seed: 1234567,
        name: "The Vault of Ash & Ruin?",
        map_cols: 77,
        map_rows: 91,
        [field.key]: value,
      } as DungeonOptions;
      const back = {
        ...DEFAULT_OPTIONS,
        ...optionsFromHash(hashFor("dungeon", options, DEFAULT_OPTIONS), "dungeon", DEFAULT_OPTIONS),
      };
      if (JSON.stringify(back) !== JSON.stringify(options)) {
        fail(`${field.key}=${value} did not round-trip: ${JSON.stringify(back)}`);
      }
      n++;
    }
  }
  const junk = optionsFromHash(
    "#/dungeon?dungeon_layout=Nope&seed=-4&evil=1&grid=Hex",
    "dungeon",
    DEFAULT_OPTIONS,
  );
  if (JSON.stringify(junk) !== JSON.stringify({ grid: "Hex" })) {
    fail(`bad values were accepted: ${JSON.stringify(junk)}`);
  }
  if (optionsFromHash("#/fiveroom?seed=1", "dungeon", DEFAULT_OPTIONS) !== null) {
    fail("another tool's link was read as this tool's");
  }
  return `${n} option values round-trip through share links`;
}
