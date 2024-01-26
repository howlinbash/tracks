"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";

const Tubes = () => {
  const [tubes, setTubes] = useState(false);
  const utils = api.useUtils();

  const handleClick = () => {
    console.log("clicky", tubes);
    setTubes((tubes) => !tubes);
  };

  const postTubes = api.tubes.postTubes.useMutation({
    onSuccess: () => {
      void utils.song.getSongs.invalidate();
    },
  });

  useEffect(() => {
    postTubes.mutate(tubes);
  }, [tubes]);

  return (
    <div className="flex-end flex">
      <Button variant="secondary" onClick={handleClick}>
        {tubes ? "Show All" : "Available"}
      </Button>
    </div>
  );
};

export default Tubes;
