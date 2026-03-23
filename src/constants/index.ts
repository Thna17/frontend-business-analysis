// Site Configuration
export const SITE_CONFIG = {
    name: "PHKA Blush",
    description: "Khmer beauty essentials for live-first commerce",
    url: "https://pichpisey.shop",
    ogImage: "/og-image.jpg",
    links: {
        instagram: "https://www.instagram.com/phka.official/",
        facebook: "https://www.facebook.com/phka.official/",
        twitter: "https://t.me/phkaofficial",
    },
};

import { NavigationItem } from "@/types";

// Navigation Links
export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        name: "Shop All",
        href: "/products",
    },
    {
        name: "New Arrivals",
        href: "/new-arrivals",
    },
    {
        name: "Blush",
        href: "/products?category=makeup",
    },
    {
        name: "Live Deals",
        href: "/campaign/phka-blush-b1g1",
    },
    {
        name: "About",
        href: "/about",
    },
];

// Footer Links
export const FOOTER_LINKS = {
    shop: [
        { name: "Shop All", href: "/products" },
        { name: "Best Sellers", href: "/products?sort=bestseller" },
        { name: "New Arrivals", href: "/products?sort=newest" },
    ],
    service: [
        { name: "Telegram Support", href: "https://t.me/phkaofficial" },
        { name: "Shipping & Returns", href: "/shipping" },
        { name: "FAQ", href: "/faq" },
    ],
    company: [
        { name: "Our Story", href: "/about" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Careers", href: "/careers" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
    ],
};

// Currency and Localization
export const DEFAULT_CURRENCY = "USD";
export const SUPPORTED_CURRENCIES = ["USD", "KHR"];

// Shipping Options
export const SHIPPING_OPTIONS = [
    {
        id: "standard",
        name: "Standard Shipping",
        description: "5-7 business days",
        price: 0,
    },
    {
        id: "express",
        name: "Express Shipping",
        description: "2-3 business days",
        price: 25,
    },
    {
        id: "overnight",
        name: "Overnight Shipping",
        description: "Next business day",
        price: 50,
    },
];

// Free Shipping Threshold
export const FREE_SHIPPING_THRESHOLD = 40;

// Pagination
export const PRODUCTS_PER_PAGE = 12;

// Sort Options
export const SORT_OPTIONS = [
    { name: "Featured", value: "featured" },
    { name: "Newest", value: "newest" },
    { name: "Price: Low to High", value: "price-asc" },
    { name: "Price: High to Low", value: "price-desc" },
    { name: "Best Selling", value: "bestseller" },
];
