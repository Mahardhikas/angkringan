'use client'
import Image from "next/image";
import MenuItem from "../menu/MenuItem";
import SectionHeaders from "./SectionHeaders";
import { useEffect, useState } from "react";

export default function HomeMenu(){
    const [bestSellers, setBestSellers] = useState([]);
    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setBestSellers(menuItems.slice(-4));
            })
        })
    },[]);
    return (
        <section className="">
            <div className="text-center mb-4">
                <SectionHeaders 
                subHeader={'Silahkan'} 
                mainHeader={'Menu Rekomendasi'} 
                />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers?.length > 0 && bestSellers.map(item => (
                <MenuItem key={item.id} {...item} />
            ))}
            </div>
        </section>
    )
}