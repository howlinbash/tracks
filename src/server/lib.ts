import { LibraryEnum } from "@prisma/client";

export const pickLibraryWhere = (library?: LibraryEnum) => {
  if (library === LibraryEnum.ONLINE) return { tubes: { some: {} } };
  if (library === LibraryEnum.OFFLINE)
    return { OR: [{ ktv: true }, { tubes: { some: {} } }] };
  if (library === LibraryEnum.WISHLIST)
    return { ktv: null, tubes: { none: {} } };
  return {};
};
