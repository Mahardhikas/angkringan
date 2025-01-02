'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OwnerTabs({ isAdmin, isOwner }) {
  const path = usePathname();

  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      {isOwner && (
        <>
          <Link
            className={path === '/report' ? 'active' : ''}
            href={'/report'}
          >
            Harian
          </Link>
          <Link
            className={path === '/report/report-weekly' ? 'active' : ''}
            href={'/report/report-weekly'}
          >
            Mingguan
          </Link>
        </>
      )}
    </div>
  );
}
