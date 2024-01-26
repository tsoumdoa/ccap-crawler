/** @jsx jsx */
import {  jsx } from "https://deno.land/x/hono/middleware.ts";

import {
  jsxRenderer,
} from "https://deno.land/x/hono/middleware.ts";

// this is a temporary solution - shall set up Tailwind properly and probably
// want to use Radix UI. No Daisy bullshit plz.

export const renderer = jsxRenderer(
  ({ children }) => {
    return (
      <html data-theme="light" lang="eng">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=devide-width, initial-scale=1" />
          <link
            href="https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="/static/style.css" rel="stylesheet" />
          <title>CRAWLER</title>
        </head>
        <body class="px-8 py-12 mx-auto max-w-7xl">{children}</body>
      </html>
    );
  },
  {
    docType: true,
  },
);
