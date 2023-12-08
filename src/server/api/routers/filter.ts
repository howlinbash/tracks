import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ERAS, GENRES, ARTISTS } from "~/constants";

export const filterRouter = createTRPCRouter({
  getFilters: publicProcedure
    .input(z.object({
      category: z.literal(ERAS).or(z.literal(GENRES)).or(z.literal(ARTISTS)),
    }))
    .query(({ ctx, input }) => {
      switch(input.category) {
        case ERAS:
          return ctx.db.era.findMany({})
        case GENRES:
          return ctx.db.genre.findMany({})
        case ARTISTS:
          return ctx.db.artist.findMany({})
      }
    }),
});
