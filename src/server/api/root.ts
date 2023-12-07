import { songRouter } from "~/server/api/routers/song";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  song: songRouter,
});

export type AppRouter = typeof appRouter;
