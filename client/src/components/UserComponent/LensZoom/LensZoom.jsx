"use client";
import { useState } from "react";
import { Lens } from "@/components/ui/lens";

export function LensZoom({imageURL}) {
  const [hovering, setHovering] = useState(false);

  return (
    (<div>

        <div className="relative z-10">
          <Lens hovering={hovering} setHovering={setHovering}>
            <img
              src={imageURL}
              alt="image"
              width={500}
              height={500} />
          </Lens>
        </div>
    </div>)
  );
}

