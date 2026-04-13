"use client";

export default function CreateProductCard({ onClick }) {
  return (
    <article
      onClick={onClick}
      className="group relative flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-lime-300 bg-lime-50 p-4 shadow-sm transition hover:border-lime-500 hover:bg-lime-100 hover:shadow-md"
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="rounded-full bg-lime-500 p-4 text-white">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h3 className="text-center text-sm font-semibold text-lime-700">
          Create Product
        </h3>
        <p className="text-center text-xs text-lime-600">Add new product</p>
      </div>
    </article>
  );
}
