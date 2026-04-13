import Link from "next/link";
import Image from "next/image";
// import { StarRow } from "../ProductCardComponent";

const categoryTone = {
  Skincare: "bg-sky-50 text-sky-800",
  Makeup: "bg-violet-50 text-violet-800",
  Fragrance: "bg-amber-50 text-amber-900",
  Haircare: "bg-emerald-50 text-emerald-900",
};

export function StarRow({ rating = 4.8 }) {
  return (
    <p
      className="flex items-center gap-0.5 text-amber-400"
      aria-label={`${rating} stars`}
    >
      <span className="text-sm">★★★★★</span>
      <span className="ml-1 text-xs tabular-nums text-gray-500">{rating}</span>
    </p>
  );
}

function badgeClass(label) {
  return categoryTone[label] ?? "bg-indigo-50 text-indigo-800";
}

const btnClass =
  "mt-2 block w-full rounded-xl border border-gray-900 bg-gray-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800";

export default function ShopCardComponent({ product }) {
  const { productId, productName, price, imageUrl, categoryId } = product || {};

  return (
    <article className="group max-w-[300px] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={
            imageUrl ||
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=1000&fit=crop"
          }
          alt={productName || "Product"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover`}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-semibold leading-snug text-gray-900">
            {productName}
          </h3>
          <p className="mt-1 min-h-10 line-clamp-2 text-sm leading-5 text-gray-500">
            Premium beauty product with high-quality ingredients.
          </p>
        </div>
        <StarRow />
        {/* <p
          className="flex items-center gap-0.5 text-amber-400"
          aria-label={`${rating} stars`}
        >
          <span className="text-sm">★★★★★</span>
          <span className="ml-1 text-xs tabular-nums text-gray-500">
            {rating}
          </span>
        </p> */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <p className="text-xl font-semibold tabular-nums text-gray-900">
            ${price}
          </p>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass("Skincare")}`}
          >
            Skincare
          </span>
        </div>
        <Link href={`/products/${productId}`} className={`${btnClass}`}>
          View Product
        </Link>
      </div>
    </article>
  );
}
