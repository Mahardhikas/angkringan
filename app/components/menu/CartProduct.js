import { cartProductPrice } from "../AppContext";
import Trash from "../icons/Trash";
import Image from "next/image";

export default function CartProduct({ product, onRemove, index }) {
  return (
    <div className="flex items-center gap-4 border-b py-4 text-black">
      <div className="w-24">
        <Image width={240} height={240} src={product.image} alt={''} />
      </div>
      <div className="grow">
        <h3 className="font-semibold">
          {product.name}
        </h3>
        {product.size && (
          <div className="text-sm">
            Ukuran: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map(extra => (
              <div key={extra.name}>{extra.name} Rp.{extra.price}</div>
            ))}
          </div>
        )}
      </div>
      <div className="text-lg font-semibold">
        Rp. {cartProductPrice(product)}
      </div>
      {!!onRemove && (
        <div className="ml-0.5">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2">
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}
