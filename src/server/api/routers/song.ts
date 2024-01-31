import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { pickLibraryWhere } from "~/server/lib";

type WhereFilters = {
  eraId?: number;
  genreId?: number;
  artistId?: number;
};

export const songRouter = createTRPCRouter({
  getSongs: publicProcedure.query(async ({ ctx }) => {
    const filters = await ctx.db.filter.findFirst({
      select: {
        eraId: true,
        genreId: true,
        artistId: true,
      },
    });

    const whereFilters: WhereFilters = {};

    if (filters) {
      Object.entries(filters).forEach((cat) => {
        if (cat[1]) {
          whereFilters[cat[0] as keyof WhereFilters] = cat[1];
        }
      });
    }

    const library = await ctx.db.ui.findFirst({});
    const whereLibrary = pickLibraryWhere(library?.library);
    const songs = await ctx.db.song.findMany({
      where: {
        ...whereFilters,
        ...whereLibrary,
      },
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
        tubes: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return songs.map((song) => ({
      id: song.id,
      song: song.label,
      path: song.path,
      era: song.era.label,
      genre: song.genre.label,
      artist: song.artist.label,
      tubes: song.tubes ?? [],
    }));
  }),
});
