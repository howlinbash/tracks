import { z } from "zod";
import {
  type Context,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { ERAS, GENRES, ARTISTS } from "~/constants";
import type { Record } from "@prisma/client/runtime/library";
import type { Artist, Era, Genre } from "@prisma/client";
import { LibraryEnum } from "@prisma/client";
import { pickLibraryWhere } from "~/server/lib";

type WhereSongs = {
  eraId?: number;
  genreId?: number;
  artistId?: number;
};

type EraGraph<T> = {
  genres: T;
  artists: T;
};

type GenreGraph<T> = { all: T } & Record<string, T>;

type CatGraph<T> = {
  allIds: number[];
  byId: Record<string, T>;
};

type FilterGraph = {
  eras: CatGraph<Era & EraGraph<number[]>>;
  genres: CatGraph<Genre & { artists: GenreGraph<number[]> }>;
  artists: CatGraph<Artist>;
};

type FilterSets = {
  eras: Record<string, EraGraph<Set<number>>>;
  genres: Record<string, GenreGraph<Set<number>>>;
};

/*
 * Unitl I improve my typing, use this map to navigate the graphs
 *
 *
 * const filterGraph: unknown = {
 *   eras: {
 *     allIds: [],
 *     byId: {
 *       "eraId": {
 *         ...era,
 *         artists: [],
 *         genres: []
 *       }
 *     }
 *   },
 *   genres: {
 *     allIds: [],
 *     byId: {
 *       "genreId": {
 *         ...genre,
 *         artists: {
 *           all: [],
 *           '90s': [],
 *           '00s': []
 *         },
 *       }
 *     }
 *   },
 *   artists: {
 *     allIds: [],
 *     byId: {
 *       "artistId": { ...artist }
 *     }
 *   },
 * };
 *
 * const filterSets = {
 *   eras: {
 *     "1": {
 *       artists: new Set(),
 *       genres: new Set(),
 *     }
 *   },
 *   genres: {
 *     "genreId": {
 *       all: new Set(),
 *       '90s': new Set(),
 *       '00s': new Set(),
 *     },
 *   },
 * };
 *
 */

const category = z.literal(ERAS).or(z.literal(GENRES)).or(z.literal(ARTISTS));

const filterSelector = async (ctx: Context, library: LibraryEnum) => {
  if (library === LibraryEnum.ONLINE) {
    const where = { where: { songs: { some: { tubes: { some: {} } } } } };
    return {
      eras: await ctx.db.era.findMany(where),
      genres: await ctx.db.genre.findMany(where),
      artists: await ctx.db.artist.findMany(where),
    };
  }
  if (library === LibraryEnum.OFFLINE) {
    const where = {
      where: {
        OR: [
          { songs: { some: { ktv: true } } },
          { songs: { some: { tubes: { some: {} } } } },
        ],
      },
    };
    return {
      eras: await ctx.db.era.findMany(where),
      genres: await ctx.db.genre.findMany(where),
      artists: await ctx.db.artist.findMany(where),
    };
  }
  if (library === LibraryEnum.WISHLIST) {
    const where = {
      where: {
        songs: {
          some: {
            ktv: null,
            tubes: { none: {} },
          },
        },
      },
    };
    return {
      eras: await ctx.db.era.findMany(where),
      genres: await ctx.db.genre.findMany(where),
      artists: await ctx.db.artist.findMany(where),
    };
  }
  return {
    eras: await ctx.db.era.findMany(),
    genres: await ctx.db.genre.findMany(),
    artists: await ctx.db.artist.findMany(),
  };
};

export const filterRouter = createTRPCRouter({
  getFilterGraph: publicProcedure.query(async ({ ctx }) => {
    const filterGraph: FilterGraph = {
      eras: {
        allIds: [],
        byId: {},
      },
      genres: {
        allIds: [],
        byId: {},
      },
      artists: {
        allIds: [],
        byId: {},
      },
    };

    const filterSets: FilterSets = { eras: {}, genres: {} };

    const library = await ctx.db.ui.findFirst({});
    const whereLibrary = pickLibraryWhere(library?.library);

    const songs = await ctx.db.song.findMany({
      where: {
        ...whereLibrary,
      },
      select: {
        id: true,
        label: true,
        path: true,
        eraId: true,
        genreId: true,
        artistId: true,
        active: true,
        tubes: true,
      },
    });

    const filters = await filterSelector(
      ctx,
      library?.library ?? LibraryEnum.ALL
    );
    const { eras, genres, artists } = filters;

    eras.forEach((era) => {
      filterGraph.eras.allIds.push(era.id);
      filterGraph.eras.byId[era.id] = { ...era, artists: [], genres: [] };
      filterSets.eras[era.id] = {
        artists: new Set<number>(),
        genres: new Set<number>(),
      };
    });
    genres.forEach((genre) => {
      filterGraph.genres.allIds.push(genre.id);
      filterGraph.genres.byId[genre.id] = { ...genre, artists: { all: [] } };
      filterSets.genres[genre.id] = { all: new Set<number>() };
    });
    artists.forEach((artist) => {
      filterGraph.artists.allIds.push(artist.id);
      filterGraph.artists.byId[artist.id] = artist;
    });

    songs.forEach(({ eraId, genreId, artistId }) => {
      const eraSets = filterSets.eras[eraId];
      eraSets!.genres.add(genreId);
      eraSets!.artists.add(artistId);

      const genreSets = filterSets.genres[genreId];
      if (genreSets![eraId] instanceof Set) {
        genreSets![eraId]!.add(artistId);
      } else {
        const newSet = new Set<number>();
        newSet.add(artistId);
        filterSets.genres[genreId]![eraId] = newSet;
      }
      filterSets.genres[genreId]!.all.add(artistId);
    });

    Object.entries(filterSets.eras).forEach(([eraId, graph]) => {
      Object.entries(graph).forEach(([category, set]) => {
        filterGraph.eras.byId[eraId]![category as "genres" | "artists"] =
          Array.from(set).sort((a, b) => a - b);
      });
    });

    Object.entries(filterSets.genres).forEach(([genreId, graph]) => {
      Object.entries(graph).forEach(([artistKey, set]) => {
        filterGraph.genres.byId[genreId]!.artists[artistKey] = Array.from(
          set
        ).sort((a, b) => a - b);
      });
    });

    return filterGraph;
  }),

  getFilters: publicProcedure
    .input(z.object({ category }))
    .query(async ({ ctx, input }) => {
      const filters = await ctx.db.filter.findFirst({
        select: {
          eraId: true,
          genreId: true,
          artistId: true,
        },
      });

      const whereSongs: WhereSongs = {};

      if (filters) {
        Object.entries(filters).forEach((cat) => {
          if (cat[1]) {
            whereSongs[cat[0] as keyof WhereSongs] = cat[1];
          }
        });
      }

      switch (input.category) {
        case ERAS: {
          const eras = await ctx.db.era.findMany({});
          if (filters?.eraId) {
            const activeFilter = eras.find(
              (filter) => filters.eraId === filter.id
            );
            if (activeFilter) {
              activeFilter.active = true;
            }
          }
          return eras;
        }
        case GENRES: {
          const genres = await ctx.db.genre.findMany({
            where: {
              songs: {
                some: whereSongs.eraId
                  ? {
                      eraId: whereSongs.eraId,
                    }
                  : {},
              },
            },
          });
          if (filters?.genreId) {
            const activeFilter = genres.find(
              (filter) => filters.genreId === filter.id
            );
            if (activeFilter) {
              activeFilter.active = true;
            }
          }
          return genres;
        }
        case ARTISTS: {
          const artists = await ctx.db.artist.findMany({
            where: {
              songs: {
                some: whereSongs,
              },
            },
          });
          if (filters?.artistId) {
            const activeFilter = artists.find(
              (filter) => filters.artistId === filter.id
            );
            if (activeFilter) {
              activeFilter.active = true;
            }
          }
          return artists;
        }
      }
    }),

  postFilter: publicProcedure
    .input(
      z.object({
        eras: z.union([z.number(), z.null()]),
        genres: z.union([z.number(), z.null()]),
        artists: z.union([z.number(), z.null()]),
      })
    )
    .mutation(
      async ({ ctx, input }) =>
        await ctx.db.filter.update({
          where: {
            id: 1,
          },
          data: {
            eraId: input.eras,
            genreId: input.genres,
            artistId: input.artists,
          },
        })
    ),
});
