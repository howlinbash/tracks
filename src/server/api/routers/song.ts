import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const songRouter = createTRPCRouter({
  getSongs: publicProcedure.query(async ({ ctx }) => {
    const songs = await ctx.db.song.findMany({});
    console.log(songs[0]);
    return songs;
  }),
});
