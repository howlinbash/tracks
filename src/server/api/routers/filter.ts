import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ERAS, GENRES, ARTISTS, CategoryIdDict } from "~/constants";

const category = z.literal(ERAS).or(z.literal(GENRES)).or(z.literal(ARTISTS));


export const filterRouter = createTRPCRouter({
  getFilters: publicProcedure
    .input(z.object({ category }))
    .query(async ({ ctx, input }) => {
      const filters = await ctx.db.filter.findFirst({})
      switch (input.category) {
        case ERAS: {
          const eras = await ctx.db.era.findMany({})
          if (filters?.eraId) {
            const activeFilter = eras.find(filter => filters.eraId === filter.id)
            if (activeFilter) {
              activeFilter.active = true;
            }
          }
          return eras;
        }
        case GENRES:
          return ctx.db.genre.findMany({})
        case ARTISTS:
          return ctx.db.artist.findMany({})
      }
    }),

  setFilter: publicProcedure
    .input(z.object({
      category,
      filterId: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const { category, filterId } = input;
      const res = await ctx.db.filter.update({
        where: {
          id: 1,
        },
        data: {
          [CategoryIdDict[category]]: filterId,
        },
      })
      return res;
    }),
});
