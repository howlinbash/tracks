# Howlin Tracks


Howlin Bash's Super Speedy Song Picker.

This project was built with the the [T3 Stack](https://create.t3.gg/)

It utilises end-to-end typescript from the prisma schema to the user input.


## Major Dependencies

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [PostgreSQL](https://postgresql.org)
- [TanStack Table](https://tanstack.com/table)
- [TanStack Virtual](https://tanstack.com/virtual)


## Why is Howlin Tracks so darn snappy?

So glad you asked. Firstly it utilises Next.js SSR to ensure that the full markup
is loaded on first request. Even though the markup is not yet interactive, it gives
the user a second to get their bearings while the app catches up.

Next the user input is debounced so database calls are only made when a user
settles on a filter.

Then the 3 filter lists at the top are relying on a simple filter cache that is
filtered locally in the browser. It is very lightweight and very snappy.

Finally, if the song table returns many results, only the visible portion of
the list will be rendered on the screen. Tanstack Virtual ensure that the user
wont notice the difference.


## Keyboard Navigation

This app is designed to be used with a keyboard for rapid song selection.

| Binding           | Action                              |
|-------------------|-------------------------------------|
| Tab               | Cycle list focus clockwise          |
| Shift-Tab         | Cycle list focus anti-clockwise     |
| j / Down Arrow    | Select *next* list item             |
| k / Up Arrow      | Select *previous* list item         |
| gg / Home         | Select *first* list item            |
| G / End           | Select *last* list item             |
| d / Page Down     | Scroll down a page                  |
| u / Page Up       | Scroll up a page                    |


## What's next

As you may have noticed the app is not finished. The very next thing I will do
is connect it to my local karaoke songs so it can enque them to the vlc app.

Then:
- search
- search in list (typing b-e-a... will move the cursor closer to the beatles)
- add a track form
- csv tracks uploader
- twitch oauth
- and much, much more.


## Dev Setup

Create an .env file from .env.example.
```sh
# Install the dependencies
npm i

# Boot up the database
docker compose up

# Start prisma studio
npm run db:studio

# Run the db migrations
npm run db:push

# Populate the database
npm run db:load

# Start the dev server
npm run dev
```

## Stage

To duplicate this, replace the howlinbash images in the commands and dockerfile
with your own.
```sh
# Build the base container
docker build -t howlinbash/base -f base.Dockerfile .

# Build the app container
docker build -t howlinbash/app -f app.Dockerfile .

# Stage the containers
docker compose -f docker-compose.stage.yml up
```
A first time deploy will require a database dump.
```sh
# Extract the database from your local build
pg_dump -h localhost -U postgres -d tracksdb > dump.sql

# Copy the dump into your staged database container
docker cp dump.sql your_postgres_container_id:/dump.sql

# Exec into your staged db container
docker exec -it your_postgres_container_id bash

# Restore the dump file
psql -h localhost -U your_username -d tracksdb -f /data_dump.sql

# Restart the containers
docker compose -f docker-compose.stage.yml stop
docker compose -f docker-compose.stage.yml up
```
