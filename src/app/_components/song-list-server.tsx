"use server";

import { type EraEnum } from "@prisma/client";
import { eraEnum } from "../enums";
import type { Song } from "~/types";

const SongRow = ({ song }: { song?: Song }) => (
  <tr
    className="grid w-full grid-cols-[auto_3fr_4fr_5fr] py-1 pl-6 text-left"
    key={song?.id ?? "0"}
  >
    <td className="w-16 overflow-hidden text-ellipsis whitespace-nowrap">
      {song ? eraEnum[song.era as EraEnum] : ""}
    </td>
    <td className="overflow-hidden text-ellipsis whitespace-nowrap">
      {song?.genre}
    </td>
    <td className="overflow-hidden text-ellipsis whitespace-nowrap">
      {song?.artist}
    </td>
    <td className="overflow-hidden text-ellipsis whitespace-nowrap">
      {song?.song}
    </td>
  </tr>
);

const SongListServer = ({ songs }: { songs: Song[] }) => {
  return (
    <div className="relative max-h-full w-full">
      <table className="absolute flex h-full w-full flex-col">
        <thead className="top-0">
          <tr className="grid w-full grid-cols-[auto_3fr_4fr_5fr] border-b py-2 pl-6 text-left">
            <th className="w-16">Era</th>
            <th>Genre</th>
            <th>Artist</th>
            <th>Song</th>
          </tr>
        </thead>
        <tbody className={`w-full flex-1 overflow-y-scroll`}>
          {songs?.map((song) => <SongRow song={song} />)}
        </tbody>
      </table>
    </div>
  );
};

export default SongListServer;
