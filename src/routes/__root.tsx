import type { ReactNode } from "react";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import "../index.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mission Control" },
      { name: "description", content: "Mission Control dashboard" },
    ],
  }),
  shellComponent: RootDocument,
  component: Outlet,
  notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
  return (
    <main className="min-h-screen bg-background text-foreground grid place-items-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link to="/" className="mt-4 inline-flex text-sm text-primary underline-offset-4 hover:underline">
          Go home
        </Link>
      </div>
    </main>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}