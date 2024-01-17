"use client";

import { useAtom } from 'jotai';
import { songCount } from './song-list-loader';

const SongCount = () => {
  const [count] = useAtom(songCount);
  return <span className="justify-self-center">{count} songs</span>
};

export default SongCount;
