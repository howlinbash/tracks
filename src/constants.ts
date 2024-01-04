export const ERAS = "eras";
export const GENRES = "genres";
export const ARTISTS = "artists";
export const CategoryIdDict = {
  [ERAS]: "eraId",
  [GENRES]: "genreId",
  [ARTISTS]: "artistId",
} as const;
export const CategoryMap = [ERAS, GENRES, ARTISTS];
