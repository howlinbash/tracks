"use client";

import { api } from "~/trpc/react";
import SongList from "./song-list";
import { type ReactNode } from "react";
import WindowedSongList from "./song-list-windowed";

type SwitcherProps = {
  children: ReactNode;
};

const SongListLoader = ({ children }: SwitcherProps) => {
  const { data, isLoading } = api.song.getSongs.useQuery();

  return isLoading ? (
    children
  ) : data!.length > 90 ? (
    <WindowedSongList songs={data} />
  ) : (
    <SongList songs={data} />
  );
};

export default SongListLoader;
