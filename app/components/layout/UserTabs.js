'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function UserTabs({isAdmin, isOwner}) {
  const path = usePathname();
  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
          <Link
            className={path === '/profile' ? 'active' : ''}
            href={'/profile'}
          >
            Data Diri
          </Link>
      {isAdmin && (
        <>
          <Link
            href={'/categories'}
            className={path === '/categories' ? 'active' : ''}
          >
            Kategori
          </Link>
          <Link
            href={'/menu-items'}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            Menu
          </Link>
          <Link
            className={path === '/orders' ? 'active' : ''}
            href={'/orders'}
          >
            Pesanan
          </Link>
        </>
      )}
      {isOwner && (
        <>
          <Link
            className={path.includes('/users') ? 'active' : ''}
            href={'/users'}
          >
            Pengguna
          </Link>
          <Link
          className={path.includes('/report') ? 'active' : ''}
          href={'/report'}
          >
            Laporan
          </Link>
        </>
      )}
    </div>
  );
}