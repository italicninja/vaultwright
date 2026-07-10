import { getPalette } from "../render/palettes";
import type { MapStyle } from "../dungeon/types";

const ITEMS: { glyph: JSX.Element; label: string }[] = [
  {
    label: "Archway",
    glyph: (
      <g stroke="currentColor" strokeWidth={2} fill="none">
        <line x1={4} y1={5} x2={4} y2={15} />
        <line x1={16} y1={5} x2={16} y2={15} />
      </g>
    ),
  },
  {
    label: "Door",
    glyph: (
      <g stroke="currentColor" strokeWidth={2}>
        <line x1={4} y1={5} x2={4} y2={15} fill="none" />
        <line x1={16} y1={5} x2={16} y2={15} fill="none" />
        <rect x={8} y={4} width={4} height={12} fill="none" />
      </g>
    ),
  },
  {
    label: "Locked Door",
    glyph: (
      <g stroke="currentColor" strokeWidth={2}>
        <line x1={4} y1={5} x2={4} y2={15} />
        <line x1={16} y1={5} x2={16} y2={15} />
        <rect x={8} y={4} width={4} height={12} fill="currentColor" />
      </g>
    ),
  },
  {
    label: "Trapped Door",
    glyph: (
      <g stroke="currentColor" strokeWidth={1.6}>
        <rect x={8} y={4} width={4} height={12} fill="none" />
        <line x1={6} y1={6} x2={14} y2={14} />
        <line x1={14} y1={6} x2={6} y2={14} />
      </g>
    ),
  },
  {
    label: "Secret Door",
    glyph: (
      <text
        x={10}
        y={15}
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize={14}
        textAnchor="middle"
        fill="currentColor"
      >
        S
      </text>
    ),
  },
  {
    label: "Portcullis",
    glyph: (
      <g fill="currentColor">
        <circle cx={5} cy={10} r={1.5} />
        <circle cx={9} cy={10} r={1.5} />
        <circle cx={13} cy={10} r={1.5} />
        <circle cx={17} cy={10} r={1.5} />
      </g>
    ),
  },
  {
    label: "Stairs Down",
    glyph: (
      <g stroke="currentColor" strokeWidth={1.4}>
        <line x1={3} y1={6} x2={3} y2={14} />
        <line x1={7} y1={7} x2={7} y2={13} />
        <line x1={11} y1={8} x2={11} y2={12} />
        <line x1={15} y1={9} x2={15} y2={11} />
      </g>
    ),
  },
  {
    label: "Stairs Up",
    glyph: (
      <g stroke="currentColor" strokeWidth={1.4}>
        <line x1={3} y1={9} x2={3} y2={11} />
        <line x1={7} y1={8} x2={7} y2={12} />
        <line x1={11} y1={7} x2={11} y2={13} />
        <line x1={15} y1={6} x2={15} y2={14} />
      </g>
    ),
  },
];

export function Legend({ style }: { style: MapStyle }) {
  const pal = getPalette(style);
  return (
    <div className="group legend">
      <span className="group-title">Legend</span>
      <div className="legend-grid">
        {ITEMS.map((item) => (
          <div className="legend-item" key={item.label}>
            <svg
              viewBox="0 0 20 20"
              width={22}
              height={22}
              style={{
                color: pal.ink,
                background: pal.floor,
                borderRadius: 3,
                border: `1px solid ${pal.grid}`,
              }}
            >
              {item.glyph}
            </svg>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
