"use client";

import { useState } from "react";

type UserAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  textClassName?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

export default function UserAvatar({
  name,
  avatarUrl,
  className = "h-10 w-10",
  textClassName = "text-sm",
}: UserAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const showImage =
    Boolean(avatarUrl) &&
    avatarUrl !== failedUrl;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl ?? undefined}
        alt={`${name}'s profile`}
        referrerPolicy="no-referrer"
        onError={() => setFailedUrl(avatarUrl ?? null)}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={`${name}'s profile`}
      className={`${className} ${textClassName} flex items-center justify-center rounded-full bg-[#fbb12c] font-bold text-[#003d35]`}
    >
      {getInitials(name)}
    </div>
  );
}
