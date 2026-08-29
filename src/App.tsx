import { useEffect, useState, type ComponentType } from "react";
import { DungeonGenerator } from "./DungeonGenerator";

type Tool = {
  slug: string;
  name: string;
  blurb: string;
  Component?: ComponentType;
};

const TOOLS: Tool[] = [
  {
    slug: "dungeon",
    name: "Dungeon Generator",
    blurb:
      "Procedural 5e dungeons: rooms, corridors, doors, stairs and stocked room descriptions. Deterministic seeds, PNG export, all in your browser.",
    Component: DungeonGenerator,
  },
  {
    slug: "encounter",
    name: "Encounter Builder",
    blurb: "Budget an encounter by party level and difficulty.",
  },
  {
    slug: "loot",
    name: "Treasure Hoard",
    blurb: "Roll individual treasure and hoards off the DMG tables.",
  },
  {
    slug: "npc",
    name: "NPC Generator",
    blurb: "Names, traits, bonds and flaws for the tavern regulars.",
  },
];

const route = () => location.hash.replace(/^#\/?/, "");

export function App() {
  const [slug, setSlug] = useState(route);

  useEffect(() => {
    const onHash = () => setSlug(route());
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const Tool = TOOLS.find((t) => t.slug === slug)?.Component;
  return Tool ? <Tool /> : <Home />;
}

function Home() {
  return (
    <div className="home">
      <header className="home-hero">
        <h1>Vaultwright</h1>
        <p>
          Client-side tools for running 5e games. No accounts, no server, no
          waiting. Everything generates in your browser.
        </p>
      </header>

      <div className="tool-grid">
        {TOOLS.map((tool) =>
          tool.Component ? (
            <a className="tool-card" key={tool.slug} href={`#/${tool.slug}`}>
              <ToolBody tool={tool} />
            </a>
          ) : (
            <div className="tool-card soon" key={tool.slug}>
              <ToolBody tool={tool} />
              <span className="badge">Coming soon</span>
            </div>
          ),
        )}
      </div>

      <footer className="home-credit">
        Built from scratch, inspired by donjon's classic generators.
      </footer>
    </div>
  );
}

function ToolBody({ tool }: { tool: Tool }) {
  return (
    <>
      <h2>{tool.name}</h2>
      <p>{tool.blurb}</p>
    </>
  );
}
