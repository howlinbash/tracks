"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";
import { ModeToggle } from "./mode-toggle";

const Tubes = () => {
  const [tubes, setTubes] = useState(false);
  const utils = api.useUtils();

  const handleClick = () => {
    setTubes((tubes) => !tubes);
  };

  const postTubes = api.tubes.postTubes.useMutation({
    onSuccess: () => {
      void utils.filter.getFilterGraph.invalidate();
      void utils.song.getSongs.invalidate();
    },
  });

  useEffect(() => {
    postTubes.mutate(tubes);
  }, [tubes]);

  return (
    <div className="flex justify-end">
      <div className="pr-4">
        <Button onClick={handleClick}>
          {tubes ? "Show All" : "Available"}
        </Button>
      </div>
      <div className="flex justify-center pr-4">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Tubes;
