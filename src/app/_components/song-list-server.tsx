"use server"

import { type EraEnum } from "@prisma/client";
import { eraEnum } from "../enums";
import type { Song } from "~/types";

const SongRow = ({ song }: { song?: Song }) => (
  <tr className="grid w-full grid-cols-[auto_3fr_4fr_5fr] py-1 pl-6 text-left" key={song?.id ?? "0"}>
    <td className="overflow-hidden text-ellipsis whitespace-nowrap w-16">{song ? eraEnum[song.era as EraEnum] : ""}</td>
    <td className="overflow-hidden text-ellipsis whitespace-nowrap">{song?.genre}</td>
    <td className="overflow-hidden text-ellipsis whitespace-nowrap">{song?.artist}</td>
    <td className="overflow-hidden text-ellipsis whitespace-nowrap">{song?.song}</td>
  </tr>
);

const SongListServer = ({ songs }: { songs: Song[] }) => {
  return (
    <div
      className="relative ml-4 max-h-full w-[calc(100%-32px)] border-2 border-slate-900 bg-slate-900"
    >
    <table className="absolute flex h-full w-full flex-col bg-slate-900">
      <thead className="top-0 bg-slate-900">
        <tr className="grid w-full grid-cols-[auto_3fr_4fr_5fr] border-b border-stone-200 py-2 pl-6 text-left">
          <th className="w-16">Era</th>
          <th>Genre</th>
          <th>Artist</th>
          <th>Song</th>
        </tr>
      </thead>
      <tbody>{songs?.map((song) => <SongRow song={song} />)}</tbody>
    </table>
    </div>
  );
};

export default SongListServer;
