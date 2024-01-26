import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tubesRouter = createTRPCRouter({
  postTubes: publicProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      console.log({ input });
      await ctx.db.tubes.update({
        where: {
          id: 1,
        },
        data: { tubes: input },
      });
    }),
});
