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
      <SectionHeaders
        subHeader={'Kisah Kami'}
        mainHeader={'Tentang Kami'}
      />
      <div className="text-gray-500 mx-w-2md mx-auto mt-4 flex-col gap-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin feugiat mollis. Cras sagittis mauris ut eleifend facilisis. Vestibulum blandit, ipsum ut suscipit scelerisque, metus lectus imperdiet nulla, in elementum leo velit sit amet urna. Nulla tristique varius sagittis. Pellentesque sollicitudin sapien at semper euismod. Etiam efficitur felis et commodo bibendum. Morbi id nisi consequat, fermentum ante a, aliquam dolor.
        </p>
        <p>
          Morbi congue mattis nisl. Nam imperdiet odio a nunc sodales sagittis. Cras rhoncus consectetur lorem, nec porta nisl interdum ut. Suspendisse ut tempus urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris scelerisque venenatis laoreet. Sed quis porta nisi. Ut in ultricies sapien, vel auctor metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In in felis cursus, tempor elit a, laoreet turpis. Sed dolor mauris, congue non sem quis, semper lobortis lacus. Aenean consectetur nunc quis aliquet venenatis. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </p>
      </div>
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
