import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type WhereSongs = {
  eraId?: number;
  genreId?: number;
  artistId?: number;
};

export const songRouter = createTRPCRouter({
  getSongs: publicProcedure.query(async ({ ctx }) => {
    const filter = await ctx.db.filter.findFirst({
      select: {
        eraId: true,
        genreId: true,
        artistId: true,
      },
    });

    const whereSongs: WhereSongs = {};

    if (filter) {
      Object.entries(filter).forEach((cat) => {
        if (cat[1]) {
          whereSongs[cat[0] as keyof WhereSongs] = cat[1];
        }
      });
    }

    console.dir({ whereSongs });
    const songs = await ctx.db.song.findMany({
      where: whereSongs,
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
      },
    });

    return songs.map((song) => ({
      id: song.id,
      song: song.label,
      path: song.path,
      era: song.era.label,
      genre: song.genre.label,
      artist: song.artist.label,
    }));
  }),
});
