"use server"

import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import { type RouterOutputs } from "~/trpc/shared";

type Song = RouterOutputs["song"]["getSongs"][number];

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
    <div className="h-full w-full overflow-y-scroll text-stone-400">
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

export default SongListServer;
