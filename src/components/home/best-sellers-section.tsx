"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGetProductsQuery } from "@/redux/services/api";
import { Loader2 } from "lucide-react";

export default function BestSellersSection() {
  const { data: products, isLoading, error } = useGetProductsQuery();

  // Ensure we always show 3 products for the UI, prioritizing bestsellers
  const allProducts = products || [];
  let bestSellers = allProducts.filter((product) => product.isBestseller);

  if (bestSellers.length < 3) {
    const others = allProducts.filter((product) => !product.isBestseller);
    bestSellers = [...bestSellers, ...others].slice(0, 3);
  }

  if (isLoading) {
    return (
      <section className="bg-white py-20 lg:py-28 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </section>
    );
  }

  if (error) {
    // Silently fail or minimal error? User wants "look good".
    return null;
  }

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Best Sellers</h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {bestSellers.map((product, index) => {
            const image = product.images?.[0]?.url || "/product-1.png";

            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.1 }}
                className="flex h-full flex-col items-center text-center group cursor-pointer"
              >
                <Link href={`/products/${product.slug}`} className="w-full">
                  <div className="relative w-full overflow-hidden rounded-md bg-neutral-100 px-6 py-10 transition-transform duration-500 group-hover:scale-[1.02]">
                    <div className="relative mx-auto h-64 w-full max-w-[240px]">
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 80vw, 240px"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{product.name}</p>
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${product.price}
                    </p>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
