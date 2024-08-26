import FlyingButton from 'react-flying-item'

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) {
  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        <div onClick={onClick}>
            <FlyingButton
              targetTop={'5%'}
              targetLeft={'95%'}
              src={image}>
                Rp. {basePrice}
            </FlyingButton>
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