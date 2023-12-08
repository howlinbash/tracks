import { songRouter } from "~/server/api/routers/song";
import { filterRouter } from "~/server/api/routers/filter";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  filter: filterRouter,
  song: songRouter,
});

export type AppRouter = typeof appRouter;
