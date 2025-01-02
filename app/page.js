'use client'
import Link from "next/link";
import Header from "./components/layout/Header";
import Hero from "./components/layout/Hero";
import HomeMenu from "./components/layout/HomeMenu";
import SectionHeaders from "./components/layout/SectionHeaders";
import Checkout from "./components/Checkout";
import { useEffect } from "react";


export default function Home() {
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js"
    const clientKey = process.env.MIDTRANS_CLIENT_KEY
    const script = document.createElement('script')
    script.src = snapScript
    script.setAttribute('data-client-key', clientKey)
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, []);

  return (
  <>
    <Hero />
    <HomeMenu />
    <section   className="text-center my-16" id="about">
    </section>
    <section   className="text-center my-16" id="contact">
      <SectionHeaders
        subHeader={'Untuk Hal Penting'}
        mainHeader={'Hubungi Kami'} 
        />
      <div className="mt-8">
        <a className="text-4xl underline text-gray-500" href="tel:+6289637779125">
          +62 896 3777 9125
        </a>
      </div>
    </section >
  </>
  );
}
