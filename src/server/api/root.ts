import { songRouter } from "~/server/api/routers/song";
import { filterRouter } from "~/server/api/routers/filter";
import { uiRouter } from "~/server/api/routers/ui";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  ui: uiRouter,
  filter: filterRouter,
  song: songRouter,
});

export type AppRouter = typeof appRouter;
