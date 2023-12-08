import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const songRouter = createTRPCRouter({
  getSongs: publicProcedure.query(async ({ ctx }) => {
    const songs = await ctx.db.song.findMany({
      select: {
        id: true,
        label: true,
        path: true,
        era: {
          select: {
            label: true,
          },
        },
        genre: {
          select: {
            label: true,
          },
        },
        artist: {
          select: {
            label: true,
          },
        },
      }
    });

    return songs.map(song => ({
        id: song.id,
        song: song.label,
        path: song.path,
        era: song.era.label,
        genre: song.genre.label,
        artist: song.artist.label,
    }));
  }),
});
