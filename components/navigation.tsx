import Link from "next/link";
import React from "react";

export const Navigation: React.FC = () => {
  return (
    <nav className="w-full bg-white dark:bg-black shadow-md p-6 justify-between flex fixed top-0">
      <Link
        href="/"
        className="font-black tracking-tighter text-xl dark:text-white"
      >
        ${String(process.env.NAME)}
      </Link>

      <Link
        href="mailto:tgknapp11@gmail.com"
        className="font-bold tracking-tighter dark:text-white"
      >
        Contact
      </Link>
    </nav>
  );
};
