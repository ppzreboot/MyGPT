# MyGPT

## Build & Deploy

Build Client:
``` bash
./build/front.sh
```

Start DEV Server:
``` bash
cd server
deno run --watch -A main/main.ts
```

Deploy to `Deno Deply(EA)`:
``` bash
cd server
deno deploy
```
