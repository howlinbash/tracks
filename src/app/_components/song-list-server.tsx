"use server"

import { type EraEnum } from "@prisma/client";
import { eraEnum } from "../enums";
import type { Song } from "~/types";

const SongRow = ({ song }: { song?: Song }) => (
  <tr className="flex w-full py-1 pl-6 text-left" key={song?.id ?? "0"}>
    <td className="w-full">{song ? eraEnum[song.era as EraEnum] : ""}</td>
    <td className="w-full">{song?.genre}</td>
    <td className="w-full">{song?.artist}</td>
    <td className="w-full">{song?.song}</td>
  </tr>
);

const SongListServer = ({ songs }: { songs: Song[] }) => {
  return (
    <table className="w-full h-full">
      <thead className="sticky top-0 bg-slate-900">
        <tr className="flex w-full py-2 pl-6 text-left">
          <th className="w-full">Era</th>
          <th className="w-full">Genre</th>
          <th className="w-full">Artist</th>
          <th className="w-full">Song</th>
        </tr>
      </thead>
      <tbody>{songs?.map((song) => <SongRow song={song} />)}</tbody>
    </table>
  );
};

export default SongListServer;
