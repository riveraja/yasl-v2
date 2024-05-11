## Summary

### Yet Another Short Link v2

An open source short link application that converts long URLs to shorter URLs.

## Requirements

- BunJS
- ElysiaJS
- Drizzle ORM
- ReactJS
- Vite
- PostgreSQL 16
- Docker

## Test with Nix

```bash
nix-shell -p bun
```

- Clone the repo
- `cd ./backend` and run `bun install`
- `cd ./frontend` and run `bun install`
- `cd ./docker` and run `docker compose up`, keep this terminal open
- `cd ./backend` and run `bun dev`, keep this terminal open
- open another terminal, then `cd ./frontend` and run `bun dev`
