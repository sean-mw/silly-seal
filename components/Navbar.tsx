"use client";

import Button from "./Button";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isRoot = pathname === "/";

  return (
    <>
      {!isRoot && (
        <div className="p-8">
          <Button onClick={() => router.back()}>←</Button>
        </div>
      )}
    </>
  );
}
