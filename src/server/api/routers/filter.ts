import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ERAS, GENRES, ARTISTS, CategoryIdDict } from "~/constants";

const category = z.literal(ERAS).or(z.literal(GENRES)).or(z.literal(ARTISTS));

type WhereSongs = {
  eraId?: number;
  genreId?: number;
  artistId?: number;
};

export const filterRouter = createTRPCRouter({
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
              (filter) => filters.eraId === filter.id,
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
              (filter) => filters.genreId === filter.id,
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
              (filter) => filters.artistId === filter.id,
            );
            if (activeFilter) {
              activeFilter.active = true;
            }
          }
          return artists;
        }
      }
    }),

  setFilter: publicProcedure
    .input(
      z.object({
        category,
        filterId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { category, filterId } = input;
      const filter = await ctx.db.filter.findFirst();

      const catId = CategoryIdDict[category];
      const res = await ctx.db.filter.update({
        where: {
          id: 1,
        },
        data: {
          [catId]: filter?.[catId] === filterId ? null : filterId,
        },
      });
      return res;
    }),
});
