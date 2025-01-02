import Image from "next/image";
import Right from "../icons/Right";
import Link from "next/link";

export default function Hero() {
    return(
        <section className="hero mt-4" >
            <div className="py-12">
                <h1 className="text-4xl font-semibold text-black">Segalanya berbeda <br />ketika kita dengan&nbsp; <span className="text-orange-600">Angkringan Umi</span></h1>
                <p className="my-6 text-gray-500">
                Hidup dapat diibaratkan seperti secangkir kopi hitam. Dimana rasa manis dan pahit akan bertemu di dalam sebuah kehangatan.
                </p>
                <div className="flex gap-4 text-sm">
                    <Link href={'/menu'} className="gap-2">
                    <button className="bg-orange-600 uppercase items-center flex gap-2 text-white px-4 py-2 rounded-full">Pesan Sekarang <Right/></button>
                    </Link>
                </div>
            </div>
            <div className="relative w-48 h-48 mx-auto my-auto">
                <Image src={'/logo.jpg'} layout={'fill'} objectFit={'contain'} alt={'menu'} className="rounded-full"/>
            </div>
        </section>
    );
}