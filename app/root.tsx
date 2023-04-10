import { ThemeProvider } from "@material-tailwind/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { ReactNode } from "react";

import stylesheet from "~/styles/global.css";
import customTWMTheme from "~/theme/customTWMTheme";
import { getEnv } from "./env.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export interface LoaderParams {
  ENV: ReturnType<typeof getEnv>;
}

export const loader: LoaderFunction = async ({ params }) => {
  return json<LoaderParams>({
    ENV: getEnv(),
  });
};

function Document({ children }: { children: ReactNode }) {
  const { ENV } = useLoaderData<LoaderParams>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <ThemeProvider value={customTWMTheme}>
        <Outlet />
      </ThemeProvider>
    </Document>
  );
}
