import { LibraryEnum } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const uiRouter = createTRPCRouter({
  postLibraryType: publicProcedure
    .input(z.nativeEnum(LibraryEnum))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.ui.update({
        where: {
          id: 1,
        },
        data: { library: input },
      });
    }),
});
