import { api } from "~/trpc/server";
import SongListServer from "./_components/song-list-server";
import FilterListsServer from "./_components/filter-lists-server";
import FilterListLoader from "./_components/filter-list-loader";
import SongListLoader from "./_components/song-list-loader";
import SongCount from "./_components/song-count";
import { ModeToggle } from "./_components/mode-toggle";
import { Sidebar } from "./_components/sidebar";
import Github from "./_components/github";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
          <Github />
        </div>
      </header>
      <div className="grid w-full grid-cols-[auto_1fr] gap-4">
        <Sidebar className="w-52 bg-muted" />
        <ResizablePanelGroup
          direction="vertical"
          className="grid h-full w-full grid-rows-3 pb-4 pr-4"
        >
          <ResizablePanel className="mb-2 flex h-full">
            <FilterListLoader>
              <FilterListsServer filterGraph={filterGraph} />
            </FilterListLoader>
          </ResizablePanel>
          <ResizableHandle className="border-red" />
          <ResizablePanel className="mt-2 flex h-full">
            <SongListLoader>
              <SongListServer songs={songs} />
            </SongListLoader>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
