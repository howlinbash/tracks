import { api } from "~/trpc/server";
import SongListServer from "./_components/song-list-server";
import FilterListsServer from "./_components/filter-lists-server";
import FilterListLoader from "./_components/filter-list-loader";
import SongListLoader from "./_components/song-list-loader";

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
      <FilterListLoader>
        <FilterListsServer filterGraph={filterGraph} />
      </FilterListLoader>
      <SongListLoader>
        <SongListServer songs={songs} />
      </SongListLoader>
    </main>
  );
}
