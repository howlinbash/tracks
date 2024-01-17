"use client";

import { api } from "~/trpc/react";
import SongList from "./song-list";
import { useEffect, type ReactNode } from "react";
import WindowedSongList from "./song-list-windowed";
import { atom, useAtom } from 'jotai';

type SwitcherProps = {
  children: ReactNode;
};

export const songCount = atom(0);

const SongListLoader = ({ children }: SwitcherProps) => {
  const { data: songs, isLoading } = api.song.getSongs.useQuery();
  const [_, setCount] = useAtom(songCount);

  useEffect(() => {
    if (songs?.length) {
      setCount(songs.length);
    }
  }, [songs?.length]);

  return isLoading ? (
    children
  ) : songs!.length > 90 ? (
    <WindowedSongList songs={songs} />
  ) : (
    <SongList songs={songs} />
  );
};

export default SongListLoader;
