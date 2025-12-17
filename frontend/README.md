
## Getting Started

First, install 

```bash
npm install
```

## Create .env file in root directory
```bash
.env
```
## Add environment variables in .env file
# backend url
```bash
NEXT_PUBLIC_STRAPI_URL=

NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_STRAPI_TOKEN=
```

run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## SSR - Server side rendering
This is default behaviour of Next.js

## SSG - Static site generation
any content which does not have network calls is a static page by default

## ISG or ISR - Incremental static regeneration
fetch in next.js caches the response 
To opt out use:
```
export const dynamic = 'force-dynamic';
```

However, there are exceptions, fetch requests are not cached when:
- Used inside a server Action.
- Used inside a Route Handler that uses the POST method.