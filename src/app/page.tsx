import { api } from "~/trpc/server";
import { ERAS, GENRES, ARTISTS } from "~/constants";
import FilterList from "./_components/filter-list";
import SongList from "./_components/song-list";
import SongSwitcher from "./_switchers/song-switcher";
import FilterSwitcher from "./_switchers/filter-switcher";
import SongListServer from "./_switchers/song-list-server";
import FilterListServer from "./_switchers/filter-list-server";

export default async function Home() {
  const songs = await api.song.getSongs.query();
  const eras = await api.filter.getFilters.query({ category: ERAS });
  const genres = await api.filter.getFilters.query({ category: GENRES });
  const artists = await api.filter.getFilters.query({ category: ARTISTS });

  return (
    <main className="grid h-screen w-full grid-rows-[auto_1fr_1fr] gap-4 py-4">
      <div className="grid w-full grid-cols-[1fr_1fr_1fr] items-center">
        <h2 className="pl-5">Howlin Tracks</h2>
        <span className="justify-self-center"></span>
        <div />
      </div>
      <div className="grid h-[45vh] w-full grid-cols-[1fr_1fr_1fr] gap-4 px-4">
        <FilterSwitcher category={ERAS} Component={FilterList}>
          <FilterListServer category={ERAS} filters={eras} />
        </FilterSwitcher>
        <FilterSwitcher category={GENRES} Component={FilterList}>
          <FilterListServer category={GENRES} filters={genres} />
        </FilterSwitcher>
        <FilterSwitcher category={ARTISTS} Component={FilterList}>
          <FilterListServer category={ARTISTS} filters={artists} />
        </FilterSwitcher>
      </div>
      <SongSwitcher Component={SongList}>
        <SongListServer songs={songs} />
      </SongSwitcher>
    </main>
  );
}
