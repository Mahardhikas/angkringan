'use client';
import {CartContext} from "../AppContext";
import Bars2 from "../icons/Bars2";
import ShoppingCart from "../icons/ShoppingCart";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useContext, useState} from "react";

function AuthLinks({status, userName}) {
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="whitespace-nowrap">
          Hello, {userName}
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-red-500 rounded-full text-white px-8 py-2">
          Logout
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <>
        <Link href={'/login'} className="bg-orange-600 rounded-full text-white px-8 py-2">Login</Link>
        {/* <Link href={'/register'} className="bg-red-500 rounded-full text-white px-8 py-2">
          Register
        </Link> */}
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  console.log(session);
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const {cartProducts} = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }
  return (
    <header>
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-orange-500 font-semibold text-2xl" href={'/'}>
          Angkringan Umi
        </Link>
        <div className="flex gap-8 items-center">
          <Link href={'/cart'} className="relative">
            <ShoppingCart color="white"/>
            
          </Link>
          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen(prev => !prev)}>
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'}>Beranda</Link>
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#contact'}>Kontak</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="text-orange-500 font-semibold text-2xl" href={'/'}>
            Angkringan Umi
          </Link>
          <Link href={'/'}>Beranda</Link>
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#contact'}>Kontak</Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <AuthLinks status={status} userName={userName} />
          <Link href={'/cart'} className="relative">
            <ShoppingCart color="white"/>
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs py-1 px-1 rounded-full leading-3">
            {cartProducts.length}
          </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}