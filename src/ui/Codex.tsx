import { useEffect, useRef } from "react";
import type { Dungeon } from "../dungeon/types";
import type { DungeonContent, RoomContent } from "../content/stock";

export function Codex({
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
  const { theme, general, corridorFeatures, wanderingMonsters, rooms } =
    content;
  const roomIds = dungeon.rooms.map((r) => r.id);
  const selRef = useRef<HTMLDivElement>(null);

  // Scroll the selected room card into view when it changes.
  useEffect(() => {
    if (selectedRoom != null) {
      selRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedRoom]);

  return (
    <div className="codex">
      <div className="codex-inner">
        <h2 className="codex-title">{name}</h2>

        <div className="codex-theme">
          <div className="codex-theme-label">Theme</div>
          <p>{theme}</p>
        </div>

        <Section title="General">
          <Row label="History">{general.history}</Row>
          <Row label="Size">{general.size}</Row>
          <Row label="Walls">{general.walls}</Row>
          <Row label="Floor">{general.floor}</Row>
          <Row label="Temperature">{general.temperature}</Row>
          <Row label="Illumination">{general.illumination}</Row>
        </Section>

        {corridorFeatures.length > 0 && (
          <Section title="Corridor Features">
            {corridorFeatures.map((f) => (
              <Row key={f.letter} label={f.letter}>
                {f.text}
              </Row>
            ))}
          </Section>
        )}

        <Section title="Wandering Monsters">
          {wanderingMonsters.map((m, i) => (
            <Row key={i} label={String(i + 1)}>
              {m}
            </Row>
          ))}
        </Section>

        <div className="codex-hint">
          Click a room on the map — or a card below — to inspect it.
        </div>

        {roomIds.map((id) => {
          const room = rooms.get(id);
          if (!room) return null;
          const selected = id === selectedRoom;
          return (
            <div
              key={id}
              ref={selected ? selRef : undefined}
              className={`room-card${selected ? " selected" : ""}`}
              onClick={() => onSelectRoom(selected ? null : id)}
            >
              <RoomBlock room={room} onSelectRoom={onSelectRoom} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoomBlock({
  room,
  onSelectRoom,
}: {
  room: RoomContent;
  onSelectRoom: (id: number) => void;
}) {
  return (
    <>
      <div className="room-head">Room #{room.id}</div>

      {room.entries.map((e, i) => (
        <div className="entry" key={i}>
          <div className="entry-label">{e.label}</div>
          <div className="entry-door">{e.title}</div>
          {e.symbols.map((s, j) => (
            <div className="entry-sym" key={j}>
              <span className="sym">{s.sym}</span> {s.text}
            </div>
          ))}
          {e.leadsTo && (
            <div className="entry-leads">
              <span className="arrow">→</span> Leads to{" "}
              <button
                className="room-link"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelectRoom(e.leadsTo!.id);
                }}
              >
                room #{e.leadsTo.id}
              </button>
              {e.leadsTo.inhabited ? `, inhabited by ${e.leadsTo.inhabited}` : ""}
            </div>
          )}
        </div>
      ))}

      {room.feature && (
        <div className="room-sub">
          <div className="sub-title">Room Features</div>
          <p>{room.feature}</p>
        </div>
      )}

      {room.trick && (
        <div className="room-sub">
          <div className="sub-title">Trick</div>
          <p>{room.trick}</p>
        </div>
      )}

      {room.trap && (
        <div className="room-sub">
          <div className="sub-title">Trap</div>
          <p>{room.trap}</p>
        </div>
      )}

      {room.monster && (
        <div className="room-sub">
          <div className="sub-title">Monster</div>
          <p>{room.monster}</p>
          {room.treasure && (
            <p className="treasure">Treasure: {room.treasure}</p>
          )}
        </div>
      )}

      {room.hidden && (
        <div className="room-sub">
          <div className="sub-title">Hidden Treasure</div>
          <p>{room.hidden.container}</p>
          {room.hidden.trapLine && (
            <p className="entry-sym">
              <span className="sym">Ⓣ</span> {room.hidden.trapLine}
            </p>
          )}
          <p className="treasure">{room.hidden.contents}</p>
        </div>
      )}

      {room.empty && <div className="room-empty">Empty</div>}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="codex-section">
      <div className="codex-section-title">{title}</div>
      <div className="codex-rows">{children}</div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="codex-row">
      <div className="codex-row-label">{label}</div>
      <div className="codex-row-value">{children}</div>
    </div>
  );
}
