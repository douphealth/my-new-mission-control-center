import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blank App" },
      { name: "description", content: "A blank app canvas." },
      { property: "og:title", content: "Blank App" },
      { property: "og:description", content: "A blank app canvas." },
    ],
  }),
  component: Index,
});

function Index() {
  return <main className="min-h-screen bg-background" aria-label="Blank app canvas" />;
}
