import { api } from "~/trpc/server";
import { ERAS, GENRES, ARTISTS } from "~/constants";
import FilterList from "./_components/filter-list";
import SongList from "./_components/song-list";

export default async function Home() {
  void api.song.getSongs.query();
  void api.filter.getFilters.query({ category: ERAS });
  void api.filter.getFilters.query({ category: GENRES });
  void api.filter.getFilters.query({ category: ARTISTS });

  return (
    <main className="grid h-screen w-full grid-rows-[auto_1fr_1fr] gap-2.5">
      <div className="grid w-full grid-cols-[1fr_1fr_1fr] items-center pt-4">
        <h2 className="pl-5">Howlin Tracks</h2>
        <p className="justify-self-center">?? Songs</p>
        <div />
      </div>
      <div className="grid h-[45vh] w-full grid-cols-[1fr_1fr_1fr] gap-px">
        <FilterList category={ERAS} />
        <FilterList category={GENRES} />
        <FilterList category={ARTISTS} />
      </div>
      <SongList />
    </main>
  );
}
