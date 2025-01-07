import { useState } from "react";

export default function AddToCartButton({
  hasSizesOrExtras,
  onClick,
  basePrice,
  image,
}) {
  const [isFlying, setIsFlying] = useState(false);

  const handleFlyingAnimation = () => {
    setIsFlying(true);
    setTimeout(() => {
      setIsFlying(false); // Reset animasi
      onClick(); // Panggil fungsi onClick setelah animasi selesai
    }, 1000); // Waktu animasi (sesuaikan dengan CSS)
  };

  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        <div onClick={handleFlyingAnimation} className="relative">
          {isFlying && (
            <img
              src={image}
              alt="Flying item"
              className="flying-animation"
            />
          )}
          <div className="static-button">
            Rp. {basePrice}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 bg-orange-600 text-white rounded-full px-8 py-2"
    >
      <span>Rp. {basePrice}</span>
    </button>
  );
}
