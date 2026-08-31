import { useEffect, useRef } from "react";
import type { Dungeon } from "../dungeon/types";
import { ROLES, TOPOLOGIES } from "../dungeon/fiveroom";
import type { DungeonContent } from "../content/stock";
import { RoomBlock } from "./Codex";

// The adventure brief for a five-room dungeon: who sent the party, what the
// place is, and the five beats in story order rather than map order.
export function Brief({
  dungeon,
  content,
  name,
  selectedRoom,
  onSelectRoom,
}: {
  dungeon: Dungeon;
  content: DungeonContent;
  name: string;
  selectedRoom: number | null;
  onSelectRoom: (id: number | null) => void;
}) {
  const { theme, adventure, general, wanderingMonsters, rooms } = content;
  const selRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRoom != null) {
      selRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedRoom]);

  // Beats first, in story order; the junction halls come after them.
  const order = new Map(ROLES.map((role, i) => [role, i]));
  const ordered = [...dungeon.rooms].sort(
    (a, b) =>
      (order.get(a.role!) ?? 99) - (order.get(b.role!) ?? 99) || a.id - b.id,
  );
  const shape = TOPOLOGIES.find((t) => t.name === adventure?.topology);

  return (
    <div className="codex">
      <div className="codex-inner">
        <h2 className="codex-title">{name}</h2>

        {adventure && (
          <div className="codex-theme">
            <div className="codex-theme-label">The Job</div>
            <p>
              The party is hired by {adventure.patron} to{" "}
              {adventure.commission}. The site is {adventure.location}.
            </p>
          </div>
        )}

        <div className="codex-theme">
          <div className="codex-theme-label">Theme</div>
          <p>{theme}</p>
        </div>

        {shape && (
          <div className="codex-theme">
            <div className="codex-theme-label">Shape</div>
            <p>
              {shape.name}. {shape.note}
            </p>
          </div>
        )}

        {adventure && (
          <div className="codex-theme keeper">
            <div className="codex-theme-label">Keep In Your Pocket</div>
            <p>
              {adventure.keeper.name}: {adventure.keeper.promise} Do not explain
              it. Spend it when the party is ten levels stronger.
            </p>
          </div>
        )}

        <div className="codex-hint">
          One session, five beats. Click a room on the map, or a card below.
        </div>

        {ordered.map((room) => {
          const content = rooms.get(room.id);
          if (!content) return null;
          const selected = room.id === selectedRoom;
          return (
            <div
              key={room.id}
              ref={selected ? selRef : undefined}
              className={`room-card${selected ? " selected" : ""}`}
              onClick={() => onSelectRoom(selected ? null : room.id)}
            >
              <RoomBlock room={content} onSelectRoom={onSelectRoom} />
            </div>
          );
        })}

        <div className="codex-section">
          <div className="codex-section-title">If They Wander</div>
          <div className="codex-rows">
            {wanderingMonsters.slice(0, 3).map((m, i) => (
              <div className="codex-row" key={i}>
                <div className="codex-row-label">{i + 1}</div>
                <div className="codex-row-value">{m}</div>
              </div>
            ))}
            <div className="codex-row">
              <div className="codex-row-label">Light</div>
              <div className="codex-row-value">{general.illumination}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
