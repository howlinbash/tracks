import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const songRouter = createTRPCRouter({
  getSongs: publicProcedure.query(({ ctx }) => {
    return ctx.db.song.findMany({});
  }),
});
