import React from "react";

interface Props {
  free: number;
  total: number;
}

export default function AvailabilityChip({ free, total }: Props) {
  if (total <= 0) return null;

  const percentage = Math.round((free / total) * 100);
  const colorClass = percentage > 0 ? "bg-green-500" : "bg-red-500";

  return (
    <span
      role="status"
      className={`px-2 py-1 rounded text-white text-sm ${colorClass}`}
    >
      {percentage}% libre
    </span>
  );
}
