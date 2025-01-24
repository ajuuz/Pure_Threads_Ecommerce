"use client";
import { useState } from "react";
import { Lens } from "@/components/ui/lens";

export function LensZoom({imageURL}) {
  const [hovering, setHovering] = useState(false);

  return (
    (<div>

        <div className="relative z-1">
          <Lens hovering={hovering} setHovering={setHovering}>
            <img
              src={imageURL}
              alt="image"
              className="w-[350px] md:w-[450px] lg:w-[400px]"
              width={450}
              height={500} />
          </Lens>
        </div>
    </div>)
  );
}

