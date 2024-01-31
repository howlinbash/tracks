"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { api } from "~/trpc/react";
import { LibraryEnum } from "@prisma/client";
import { useEffect, useState } from "react";

const playlists = [
  "Recently Added",
  "Recently Played",
  "Top Songs",
  "Top Albums",
  "Top Artists",
  "Bedtime Beats",
];

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [library, setLibrary] = useState<LibraryEnum>(LibraryEnum.ALL);
  const utils = api.useUtils();

  const handleLibraryClick = (libraryType: LibraryEnum) => {
    setLibrary(libraryType);
  };

  const postLibrary = api.ui.postLibraryType.useMutation({
    onSuccess: () => {
      void utils.filter.getFilterGraph.invalidate();
      void utils.song.getSongs.invalidate();
    },
  });

  useEffect(() => {
    postLibrary.mutate(library);
  }, [library]);

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleLibraryClick(LibraryEnum.ALL)}
            >
              <Icons.library />
              All Tracks
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleLibraryClick(LibraryEnum.ONLINE)}
            >
              <Icons.cloud />
              Online
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleLibraryClick(LibraryEnum.OFFLINE)}
            >
              <Icons.laptop />
              Offline
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleLibraryClick(LibraryEnum.WISHLIST)}
            >
              <Icons.shoppingBag />
              Wishlist
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <div className="space-y-1 p-2">
            {playlists?.map((playlist, i) => (
              <Button
                key={`${playlist}-${i}`}
                variant="ghost"
                className="w-full justify-start font-normal"
              >
                <Icons.playlist />
                {playlist}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
