"use client";

import { api } from "~/trpc/react";
import SongList from "./song-list";
import { type ReactNode } from "react";

type SwitcherProps = {
  children: ReactNode;
};

const SongListLoader = ({ children }: SwitcherProps) => {
  const { data, isLoading } = api.song.getSongs.useQuery();

  return isLoading ? children : <SongList songs={data!} />;
};

export default SongListLoader;
