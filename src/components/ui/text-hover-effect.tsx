"use client";
import React, { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Outlined SVG wordmark: the stroke draws itself in and a gradient spotlight
 * follows the pointer on hover.
 */
export const TextHoverEffect = ({
  text,
  duration = 0.3,
}: {
  text: string;
  duration?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const uid = useId().replace(/:/g, "");
  const ids = { gradient: `tg-${uid}`, reveal: `rm-${uid}`, mask: `tm-${uid}` };

  const { contextSafe } = useGSAP(
    () => {
      gsap.fromTo(
        ".draw-text",
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: 6, ease: "power2.inOut", delay: 2.2 },
      );
    },
    { scope: svgRef },
  );

  const onMove = contextSafe((e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    gsap.to(`#${ids.reveal}`, {
      attr: {
        cx: ((e.clientX - rect.left) / rect.width) * 700,
        cy: ((e.clientY - rect.top) / rect.height) * 100,
      },
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 700 100"
      xmlns="http://www.w3.org/2000/svg"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={onMove}
      className="tracking-[.8em]"
      role="img"
      aria-label={text}
    >
      <defs>
        <linearGradient id={ids.gradient} gradientUnits="userSpaceOnUse">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab398" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>
        <radialGradient id={ids.reveal} gradientUnits="userSpaceOnUse" r="140" cx="350" cy="50">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id={ids.mask}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${ids.reveal})`} />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold transition-opacity"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="draw-text fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold"
      >
        {text}
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#${ids.gradient})`}
        strokeWidth="0.3"
        mask={`url(#${ids.mask})`}
        className="fill-transparent font-[helvetica] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};
