import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ERAS, GENRES, ARTISTS, CategoryIdDict } from "~/constants";

const category = z.literal(ERAS).or(z.literal(GENRES)).or(z.literal(ARTISTS));

export const filterRouter = createTRPCRouter({
  getFilters: publicProcedure
    .input(z.object({ category }))
    .query(({ ctx, input }) => {
      switch (input.category) {
        case ERAS:
          return ctx.db.era.findMany({})
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
