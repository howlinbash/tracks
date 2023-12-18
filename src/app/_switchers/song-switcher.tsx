"use client";

import { api } from "~/trpc/react";
import type { ComponentType, ReactNode } from "react";
import type { SongListProps } from "../_components/song-list";

type SwitcherProps<T> = {
  children: ReactNode
  Component: ComponentType<T>
}

const SongSwitcher = ({ children, Component }: SwitcherProps<SongListProps>) => {
  const { data: songs, isLoading } = api.song.getSongs.useQuery();
  return isLoading ? children : <Component items={songs} />;
};

export default SongSwitcher;
