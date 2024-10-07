"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut, UserRoundPen } from "lucide-react";
import Link from "next/link";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button className="sm" variant="ghost">
            <LogOut className="h-5 w-5 mr-2" />
            Излез
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button className="sm" variant="ghost">
            <UserRoundPen className="h-5 w-5 mr-2" />
            Професор
          </Button>
        </Link>
      )}
      <UserButton />
    </div>
  );
};

export default NavbarRoutes;
