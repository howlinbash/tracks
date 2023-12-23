import { api } from "~/trpc/server";
import FilterLists from "./_components/filter-lists";
import SongList from "./_components/song-list";
import SongSwitcher from "./_switchers/song-switcher";
import FilterSwitcher from "./_switchers/filter-switcher";
import SongListServer from "./_switchers/song-list-server";
import FilterListsServer from "./_switchers/filter-lists-server";

export default async function Home() {
  const songs = await api.song.getSongs.query();
  const filterGraph = await api.filter.getFilterGraph.query();

  return (
    <main className="grid h-screen w-full grid-rows-[auto_1fr_1fr] gap-4 py-4">
      <div className="grid w-full grid-cols-[1fr_1fr_1fr] items-center">
        <h2 className="pl-5">Howlin Tracks</h2>
        <span className="justify-self-center"></span>
        <div />
      </div>
      <div className="grid h-[45vh] w-full grid-cols-[1fr_1fr_1fr] gap-4 px-4">
        <FilterSwitcher Component={FilterLists}>
          <FilterListsServer filterGraph={filterGraph} />
        </FilterSwitcher>
      </div>
      <SongSwitcher Component={SongList}>
        <SongListServer songs={songs} />
      </SongSwitcher>
    </main>
  );
}
