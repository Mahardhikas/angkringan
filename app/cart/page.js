'use client';
import { CartContext, cartProductPrice } from "../components/AppContext";
import MejaInputs from "../components/layout/MejaInputs";
import SectionHeaders from "../components/layout/SectionHeaders";
import CartProduct from "../components/menu/CartProduct";
import { useProfile } from "../components/UseProfile";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartProducts, removeCartProduct, clearCart } = useContext(CartContext);
  const [ meja, setMeja ] = useState({});
  const { data: profileData } = useProfile();

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const { noMeja, nama } = profileData;
      const mejaFromProfile = {
        noMeja,
        nama
      };
      setMeja(mejaFromProfile);
    }
  }, [profileData]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }

  function handleMejaChange(propName, value) {
    setMeja(prevMeja => ({ ...prevMeja, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meja,
          cartProducts,
        }),
      });
      
      const requestData = await response.json();
      console.log('Received token:', requestData.token);

      if (window.snap && requestData.token) {
        window.snap.pay(requestData.token, {
          onSuccess: function(result) {
            console.log('Payment successful:', result);
            clearCart(); // Mengosongkan keranjang
          },
          onPending: function(result) {
            console.log('Payment pending:', result);
            clearCart(); // Mengosongkan keranjang
          },
          onError: function(result) {
            console.error('Payment error:', result);
            clearCart(); // Mengosongkan keranjang
          },
          onClose: function() {
            console.log('Payment popup closed');
            clearCart(); // Mengosongkan keranjang
          }
        });
      } else {
        console.error('Midtrans snap.js is not loaded or token is missing');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong... Please try again later');
    }
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Keranjang" />
        <p className="mt-4 text-white">Keranjang kamu kosong!</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Keranjang" />
      </div>
      <div className="mt-8 ">
        <div>
          {cartProducts?.length === 0 && (
            <div>Tidak ada produk yang kamu pesan</div>
          )}
          {cartProducts?.length > 0 && cartProducts.map((product, index) => (
            <CartProduct
              key={index}
              product={product}
              index={index}
              onRemove={removeCartProduct}
            />
          ))}
          <div className="py-2 pr-16 flex justify-end items-center text-black">
            <div className="text-gray-500">
              Total:
            </div>
            <div className="font-semibold pl-2 text-right text-black">
              Rp. {subtotal}
            </div>
          </div>
        </div>
      </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <MejaInputs
              mejaProps={meja}
              setMejaProp={handleMejaChange}
            />
            <button type="submit">Rp. {subtotal}</button>
          </form>
        </div>
    </section>
  );
}
