// Sidebar and stage pieces shared by every map tool.

import type { ReactNode } from "react";
import { MAX_SEED, randomSeed, type MapTool } from "./useMapTool";
import { randomName } from "./options";

export function NameSeedFields({
  tool,
  nameLabel,
  children,
}: {
  tool: MapTool;
  nameLabel: string;
  children?: ReactNode;
}) {
  const { options, set } = tool;
  return (
    <div className="group">
      <label className="field name-field">
        <span>{nameLabel}</span>
        <div className="name-row">
          <input
            type="text"
            value={options.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <button
            className="icon-btn"
            title="New name"
            onClick={() => set("name", randomName(Math.random))}
          >
            ↻
          </button>
        </div>
      </label>

      <label className="field">
        <span>Seed</span>
        <div className="name-row">
          <input
            type="number"
            value={options.seed}
            min={0}
            max={MAX_SEED}
            onChange={(e) =>
              set(
                "seed",
                Math.min(MAX_SEED, Math.floor(Math.abs(Number(e.target.value)))) ||
                  0,
              )
            }
          />
          <button
            className="icon-btn"
            title="New seed"
            onClick={() => set("seed", randomSeed())}
          >
            ↻
          </button>
        </div>
      </label>

      {children}
    </div>
  );
}

export function ExportControls({ tool }: { tool: MapTool }) {
  return (
    <div className="group">
      <label className="field">
        <span>Cell Size: {tool.cellSize}px</span>
        <input
          type="range"
          min={8}
          max={40}
          value={tool.cellSize}
          onChange={(e) => tool.setCellSize(Number(e.target.value))}
        />
      </label>
      <button className="primary-btn" onClick={tool.downloadPng}>
        Download PNG
      </button>
    </div>
  );
}

export function MapStage({
  tool,
  meta,
  panel,
}: {
  tool: MapTool;
  meta: ReactNode;
  panel: ReactNode;
}) {
  return (
    <main className="stage">
      <div className="stage-bar">
        <strong>{tool.options.name}</strong>
        <span className="meta">
          {meta} · {tool.dims.width}×{tool.dims.height}px
        </span>
      </div>
      <div className="stage-body">
        <div className="canvas-scroll">
          <canvas
            ref={tool.canvasRef}
            className="map-canvas"
            onClick={tool.onCanvasClick}
          />
        </div>
        {panel}
      </div>
    </main>
  );
}
