import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getArtistsWithMoreThanOneSong() {
  const artistsWithSongs = await prisma.artist.findMany({
    where: {
      songs: {
        some: {},
      },
    },
    include: {
      songs: true,
    },
  });

  const artistsWithMultipleSongs = artistsWithSongs.filter(
    (artist) => artist.songs.length > 1
  );

  const sortedArtists = artistsWithMultipleSongs.sort(
    (a, b) => b.songs.length - a.songs.length
  );

  sortedArtists.forEach((artist) => {
    console.log(`${artist.label}: ${artist.songs.length} songs`);
  });
}

getArtistsWithMoreThanOneSong()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
