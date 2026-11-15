// Self-checks for the generators. Run with `npm run check`.

import { checkDungeons, checkMasks } from "./dungeon";
import { checkFiveRoom } from "./fiveroom";
import { checkStock } from "./stock";
import { checkUrls } from "./url";

for (const check of [
  checkMasks,
  checkDungeons,
  checkFiveRoom,
  checkStock,
  checkUrls,
]) {
  const started = Date.now();
  console.log(`ok: ${check()} (${Date.now() - started}ms)`);
}
