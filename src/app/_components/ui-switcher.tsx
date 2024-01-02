"use client";

import { api } from "~/trpc/react";
import FilterLists from "./filter-lists";
import SongList from "./song-list";
import type { ReactNode } from "react";

type SwitcherProps = {
  ServerFilterLists: ReactNode
  ServerSongList: ReactNode
}

const UiSwitcher = ({ ServerFilterLists, ServerSongList }: SwitcherProps) => {
  const { data: graph, isLoading: graphIsLoading } = api.filter.getFilterGraph.useQuery();
  const { data: songs, isLoading: songsIsLoading } = api.song.getSongs.useQuery();

  ;
  return (
    <>
      <div className="grid h-[45vh] w-full grid-cols-[1fr_1fr_1fr] gap-4 px-4">
        {graphIsLoading ? ServerFilterLists : <FilterLists filterGraph={graph!} />}
      </div>
      <div className="w-full overflow-y-scroll px-4">
        {songsIsLoading ? ServerSongList : <SongList items={songs} />}
      </div>
    </>
  );
};

export default UiSwitcher;
