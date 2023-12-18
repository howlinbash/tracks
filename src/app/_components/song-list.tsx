"use client"

import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import type { Song } from "~/types";

const SongRow = ({ song }: { song?: Song }) => (
  <tr className="flex w-full py-1 pl-6 text-left" key={song?.id ?? "0"}>
    <td className="w-full">{song ? eraEnum[song.era as EraEnum] : ""}</td>
    <td className="w-full">{song?.genre}</td>
    <td className="w-full">{song?.artist}</td>
    <td className="w-full">{song?.song}</td>
  </tr>
);

export type SongListProps = { items?: Song[] };

const SongList = ({ items: songs }: SongListProps) => {
  return (
    <div className="h-full w-full overflow-y-scroll">
      <table className="w-full">
        <tbody>
          {!songs ? (
            <SongRow />
          ) : (
            songs?.map((song) => <SongRow song={song} />)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;