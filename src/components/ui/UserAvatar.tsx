"use client";

import React from "react";

interface UserAvatarProps {
  gender?: "MALE" | "FEMALE" | string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  gender = "MALE",
  size = "md",
  className = "",
}) => {
  const isFemale = String(gender).toUpperCase() === "FEMALE";

  const sizeClasses: Record<string, string> = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-28 h-28",
    "2xl": "w-32 h-32",
  };

  const dim = sizeClasses[size] || "w-10 h-10";

  if (isFemale) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 select-none bg-[#f5edfd] flex items-center justify-center border border-purple-200/60 shadow-xs ${dim} ${className}`}
        title="Female Avatar"
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background circle */}
          <circle cx="60" cy="60" r="60" fill="#F3E8FF" />

          {/* Clothes / Top */}
          <path
            d="M26 120C26 95 38 88 50 86L60 96L70 86C82 88 94 95 94 120H26Z"
            fill="#334155"
          />
          {/* Inner purple blouse/collar */}
          <path d="M50 86L60 102L70 86L60 92L50 86Z" fill="#7C3AED" />
          <path d="M56 102H64V120H56V102Z" fill="#8B5CF6" />

          {/* Neck */}
          <rect x="52" y="72" width="16" height="18" rx="4" fill="#FBCFE8" />

          {/* Face Base */}
          <ellipse cx="60" cy="56" rx="22" ry="24" fill="#FED7AA" />

          {/* Ears */}
          <circle cx="38" cy="56" r="5" fill="#FED7AA" />
          <circle cx="82" cy="56" r="5" fill="#FED7AA" />
          {/* Cute earrings */}
          <circle cx="38" cy="59" r="2" fill="#A855F7" />
          <circle cx="82" cy="59" r="2" fill="#A855F7" />

          {/* Hair back / sides */}
          <path
            d="M34 50C34 32 45 22 60 22C75 22 86 32 86 50C86 64 82 74 82 78C78 78 74 72 74 68C68 70 52 70 46 68C46 72 42 78 38 78C38 74 34 64 34 50Z"
            fill="#1E293B"
          />

          {/* Hair Bangs front sweep */}
          <path
            d="M36 46C42 36 54 34 66 38C76 42 82 48 84 52C82 40 74 30 60 30C46 30 38 40 36 46Z"
            fill="#0F172A"
          />
          <path
            d="M36 46C42 50 48 50 54 44C58 40 60 38 60 38C52 38 44 40 36 46Z"
            fill="#1E293B"
          />

          {/* Eyebrows */}
          <path
            d="M48 46C51 45 54 46 55 47"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M72 46C69 45 66 46 65 47"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Eyes with friendly eyelashes */}
          <circle cx="51" cy="52" r="3.2" fill="#0F172A" />
          <circle cx="52.2" cy="51" r="1.2" fill="#FFFFFF" />
          <path d="M46 50L48 52" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

          <circle cx="69" cy="52" r="3.2" fill="#0F172A" />
          <circle cx="70.2" cy="51" r="1.2" fill="#FFFFFF" />
          <path d="M74 50L72 52" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Cute Nose */}
          <circle cx="60" cy="57" r="1.4" fill="#F97316" opacity="0.6" />

          {/* Cheerful Smile */}
          <path
            d="M54 62C56 67 64 67 66 62"
            stroke="#BE185D"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="44" cy="58" rx="3.5" ry="2" fill="#F472B6" opacity="0.45" />
          <ellipse cx="76" cy="58" rx="3.5" ry="2" fill="#F472B6" opacity="0.45" />
        </svg>
      </div>
    );
  }

  // Male Avatar (matches media_1791315052738.png & media_1791315141466.png)
  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 select-none bg-[#eef2ff] flex items-center justify-center border border-indigo-200/60 shadow-xs ${dim} ${className}`}
      title="Male Avatar"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Soft Lavender Background */}
        <circle cx="60" cy="60" r="60" fill="#EEF2FF" />

        {/* Black/Charcoal Shirt with Shoulders */}
        <path
          d="M26 120C26 96 38 88 52 86L60 94L68 86C82 88 94 96 94 120H26Z"
          fill="#1E293B"
        />

        {/* Purple Tie & Inner Shirt */}
        <path d="M54 87L60 97L66 87L63 85H57L54 87Z" fill="#6366F1" />
        <path d="M57 97L60 120L63 97H57Z" fill="#7C3AED" />
        {/* Small tie pattern dots */}
        <circle cx="60" cy="103" r="1.2" fill="#DDD6FE" />
        <circle cx="60" cy="110" r="1.2" fill="#DDD6FE" />

        {/* Neck */}
        <rect x="52" y="70" width="16" height="20" rx="4" fill="#FED7AA" />

        {/* Head / Face */}
        <ellipse cx="60" cy="54" rx="22" ry="24" fill="#FED7AA" />

        {/* Ears */}
        <circle cx="38" cy="54" r="5" fill="#FED7AA" />
        <circle cx="82" cy="54" r="5" fill="#FED7AA" />

        {/* Hair - Stylish crop parted hair as in screenshot */}
        <path
          d="M36 50C36 32 46 22 60 22C74 22 84 32 84 50C84 53 82 54 80 50C78 38 72 32 60 32C48 32 42 38 40 50C38 54 36 53 36 50Z"
          fill="#0F172A"
        />
        <path
          d="M38 42C44 28 54 24 66 26C74 27 80 32 82 38C76 34 68 32 58 34C48 36 42 40 38 42Z"
          fill="#1E293B"
        />

        {/* Eyebrows */}
        <path
          d="M48 44C51 43 54 44 55 45"
          stroke="#0F172A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M72 44C69 43 66 44 65 45"
          stroke="#0F172A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Expressive Friendly Eyes */}
        <circle cx="51" cy="50" r="3.2" fill="#0F172A" />
        <circle cx="52.2" cy="49" r="1.2" fill="#FFFFFF" />

        <circle cx="69" cy="50" r="3.2" fill="#0F172A" />
        <circle cx="70.2" cy="49" r="1.2" fill="#FFFFFF" />

        {/* Nose */}
        <circle cx="60" cy="55" r="1.4" fill="#F97316" opacity="0.6" />

        {/* Friendly open smile */}
        <path
          d="M53 60C55 66 65 66 67 60"
          stroke="#B91C1C"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Teeth highlight */}
        <path
          d="M55 60.5C57 62.5 63 62.5 65 60.5"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
