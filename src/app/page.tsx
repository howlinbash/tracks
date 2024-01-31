import { api } from "~/trpc/server";
import SongListServer from "./_components/song-list-server";
import FilterListsServer from "./_components/filter-lists-server";
import FilterListLoader from "./_components/filter-list-loader";
import SongListLoader from "./_components/song-list-loader";
import SongCount from "./_components/song-count";
import { ModeToggle } from "./_components/mode-toggle";
import { Sidebar } from "./_components/sidebar";

export default async function Home() {
  const songs = await api.song.getSongs.query();
  const filterGraph = await api.filter.getFilterGraph.query();

  return (
    <div className="grid h-screen w-full grid-rows-[auto_1fr] gap-4">
      <header className="grid w-full grid-cols-[1fr_1fr_1fr] items-center pt-4">
        <h2 className="pl-5">Howlin Tracks</h2>
        <SongCount />
        <div className="flex justify-end pr-4">
          <ModeToggle />
        </div>
      </header>
      <div className="grid w-full grid-cols-[auto_1fr] gap-4">
        <Sidebar className="w-52 bg-muted" />
        <main className="grid h-full w-full grid-rows-2 gap-4 pb-4 pr-4">
          <FilterListLoader>
            <FilterListsServer filterGraph={filterGraph} />
          </FilterListLoader>
          <SongListLoader>
            <SongListServer songs={songs} />
          </SongListLoader>
        </main>
      </div>
    </div>
  );
}
