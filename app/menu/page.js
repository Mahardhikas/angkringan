'use client';
import { useEffect, useState } from "react";
import SectionHeaders from "../components/layout/SectionHeaders";
import MenuItem from "../components/menu/MenuItem";

export default function MenuPage() {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
      fetch('/api/categories').then(res => res.json()).then(categories => setCategories(categories));
      fetch('/api/menu-items').then(res => res.json()).then(menuItems => setMenuItems(menuItems));
    }, []);

    return (
      <section className="mt-8">
        {categories.length > 0 && categories.map(c => (
          <div key={c._id} className="mb-12">
            <div className="text-center mb-6">
              <SectionHeaders mainHeader={c.name} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems.filter(item => item.category === c._id).map(item => (
                <MenuItem key={item._id} {...item} />
              ))}
            </div>
          </div>
        ))}
      </section>
    );
}
