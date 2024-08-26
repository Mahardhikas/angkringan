'use client';
import Right from "../components/icons/Right";
import UserTabs from "../components/layout/UserTabs";
import {useProfile} from "../components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function MenuItemsPage() {

  const [menuItems, setMenuItems] = useState([]);
  const {loading, data} = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setMenuItems(menuItems);
      });
    })
  }, []);

  if (loading) {
    return 'Loading user info...';
  }

  if (!data.admin) {
    return 'Not an admin.';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true}/>
      <div className="mt-8">
        <Link
          className="button flex"
          href={'/menu-items/new'}>
          <span>Buat Menu Baru</span>
          <Right />
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu baru:</h2>
        <div className="grid grid-cols-3 gap-2">
          {menuItems?.length > 0 && menuItems.map(item => (
            <Link
              key={item._id}
              href={'/menu-items/edit/'+item._id}
              className="bg-gray-200 rounded-lg p-4 flex flex-col items-center"
            >
              <div className="relative w-full h-48 flex justify-center items-center">
                <Image
                  className="rounded-md object-cover"
                  src={item.image} alt={''} layout="fill" />
              </div>
              <div className="text-center mt-2">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
