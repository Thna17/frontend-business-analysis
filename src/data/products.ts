import { Product } from "@/types";

export const sampleProducts: Product[] = [
    {
        id: "1",
        name: "PHKA Blush - Kolab",
        slug: "phka-blush-kolab",
        description: "A soft everyday PHKA blush shade with smooth blend and long-wear comfort.",
        price: 10.00,
        images: [
            { id: "img1", url: "/product-new-arrivals-1.jpg", alt: "PHKA Blush - Kolab", isPrimary: true }
        ],
        category: { id: "cat1", name: "Makeup", slug: "makeup" },
        subcategory: "Blush",
        sizes: [
            { id: "standard", name: "Standard", inStock: true }
        ],
        colors: [
            { id: "kolab", name: "Kolab", hex: "#F2A7A1", inStock: true }
        ],
        stockQuantity: 120,
        isNew: true,
        isBestseller: true,
        isFeatured: true,
        materials: ["Silky powder", "Vitamin E", "Cruelty-free"],
        careInstructions: ["Store in a cool, dry place"],
        madeIn: "Cambodia",
        sku: "PHKA-BL-KOLAB-001"
    },
    {
        id: "2",
        name: "PHKA Blush - Romduol",
        slug: "phka-blush-romduol",
        description: "A romantic PHKA blush tone for warm glow and natural color payoff.",
        price: 10.00,
        images: [
            { id: "img2", url: "/product-new-arrivals-2.jpg", alt: "PHKA Blush - Romduol", isPrimary: true }
        ],
        category: { id: "cat1", name: "Makeup", slug: "makeup" },
        subcategory: "Blush",
        sizes: [
            { id: "standard", name: "Standard", inStock: true }
        ],
        colors: [
            { id: "romduol", name: "Romduol", hex: "#D48887", inStock: true },
            { id: "chhuk", name: "Chhuk", hex: "#E6A19F", inStock: true },
        ],
        stockQuantity: 110,
        isNew: true,
        isBestseller: true,
        isFeatured: true,
        materials: ["Fine pigment", "Vitamin E"],
        careInstructions: ["Keep lid closed tight"],
        madeIn: "Cambodia",
        sku: "PHKA-BL-ROMDUOL-001"
    },
    {
        id: "3",
        name: "PHKA Blush - 3 Colors Bundle",
        slug: "phka-blush-3-colors-bundle",
        description: "Three-shade PHKA bundle crafted for gifting and campaign drops.",
        price: 30.00,
        images: [
            { id: "img3", url: "/product-new-arrivals-3.jpg", alt: "PHKA Blush 3 Colors Bundle", isPrimary: true }
        ],
        category: { id: "cat1", name: "Makeup", slug: "makeup" },
        subcategory: "Bundle",
        sizes: [
            { id: "standard", name: "Standard", inStock: true }
        ],
        colors: [
            { id: "kolab", name: "Kolab", hex: "#F2A7A1", inStock: true },
            { id: "romduol", name: "Romduol", hex: "#D48887", inStock: true },
            { id: "nokoreach", name: "Nokoreach", hex: "#C97A82", inStock: true }
        ],
        stockQuantity: 70,
        isNew: true,
        isBestseller: false,
        isFeatured: true,
        materials: ["Gift-ready set", "PHKA signature shades"],
        careInstructions: ["Keep away from direct sunlight"],
        madeIn: "Cambodia",
        sku: "PHKA-BL-BUNDLE-003"
    }
];
