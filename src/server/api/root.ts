import { songRouter } from "~/server/api/routers/song";
import { filterRouter } from "~/server/api/routers/filter";
import { tubesRouter } from "~/server/api/routers/tubes";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  tubes: tubesRouter,
  filter: filterRouter,
  song: songRouter,
});

export type AppRouter = typeof appRouter;
