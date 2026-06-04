export type MenuItem = {
  id: string;
  name: string;
  price?: number;
  priceLabel?: string;
  category: "Daily Special" | "Burgers" | "Shakes & Sides" | "Kids Meals" | "Merch";
  description: string;
  image: string;
  badge?: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "daily-special-single-burger",
    name: "Daily Special",
    price: 20,
    category: "Daily Special",
    description: "Single burger with fries and a Bikini Soda.",
    image: "/images/bikini-burger-real-food-1.jpg",
    badge: "Burger, fries & soda"
  },
  {
    id: "beef-burger",
    name: "Beef Burger",
    price: 11,
    category: "Burgers",
    description: "Classic beef burger with lettuce, tomato and onion.",
    image: "/images/bikini-burger-real-food-6.jpg",
    badge: "Classic"
  },
  {
    id: "cheesesteak-platter",
    name: "Cheesesteak Platter",
    price: 18,
    category: "Burgers",
    description: "Cheesesteak platter served with fries and potato salad.",
    image: "/images/bikini-burger-real-food-1.jpg"
  },
  {
    id: "beef-burger-platter",
    name: "Beef Burger Platter",
    price: 17,
    category: "Burgers",
    description: "Beef burger platter with fries and potato salad.",
    image: "/images/bikini-burger-real-food-1.jpg"
  },
  {
    id: "turkey-burger",
    name: "Turkey Burger",
    price: 11,
    category: "Burgers",
    description: "Turkey burger with lettuce, tomato and onion.",
    image: "/images/bikini-burger-real-food-5.jpg"
  },
  {
    id: "turkey-burger-platter",
    name: "Turkey Burger Platter",
    price: 17,
    category: "Burgers",
    description: "Turkey burger platter with fries and potato salad.",
    image: "/images/bikini-burger-real-food-3.jpg"
  },
  {
    id: "surf-turf-burger",
    name: "Surf & Turf Burger",
    price: 20,
    category: "Burgers",
    description: "Surf & turf burger with shrimp. Make it a fries order for $23.",
    image: "/images/bikini-burger-real-food-4.jpg",
    badge: "Signature"
  },
  {
    id: "fat-daddy-steakhouse",
    name: "Fat Daddy Steakhouse",
    price: 20,
    category: "Burgers",
    description: "A loaded steakhouse-style Bikini Burger special with melted cheese and big flavor. Make it a fries order for $23.",
    image: "/images/bikini-burger-fat-daddy-steakhouse.jpg",
    badge: "Special"
  },
  {
    id: "pizza-burger",
    name: "Pizza Burger",
    price: 20,
    category: "Burgers",
    description: "A saucy burger special with melted cheese, onions and pizza-shop comfort. Make it a fries order for $23.",
    image: "/images/bikini-burger-pizza-burger.jpg",
    badge: "Special"
  },
  {
    id: "hot-dog-fries-platter",
    name: "Hot Dog and Fries Platter",
    price: 13,
    category: "Burgers",
    description: "Loaded hot dog with onions, relish, mustard, ketchup and a tray of crinkle-cut fries.",
    image: "/images/bikini-burger-hot-dog-fries-platter.jpg",
    badge: "Special"
  },
  {
    id: "butterfly-shrimp-platter",
    name: "Butterfly Shrimp Platter",
    price: 13,
    category: "Burgers",
    description: "Crispy butterfly shrimp with crinkle-cut fries and a side of slaw.",
    image: "/images/bikini-burger-butterfly-shrimp-platter.jpg",
    badge: "Special"
  },
  {
    id: "double-cheeseburger",
    name: "Double Cheeseburger",
    price: 15.63,
    category: "Burgers",
    description: "Two patties, Cooper Sharp, seeded roll, no secret sauce needed.",
    image: "/images/bikini-burger-real-food-2.jpg",
    badge: "Popular"
  },
  {
    id: "double-cheeseburger-bikini-wrap",
    name: "Double Cheeseburger on a Bikini Wrap",
    price: 15,
    category: "Burgers",
    description: "Double cheeseburger stacked into a Bikini wrap with lettuce, tomato, onion and pickles.",
    image: "/images/bikini-burger-double-wrap.jpg",
    badge: "Wrap option"
  },
  {
    id: "triple-cheeseburger",
    name: "Triple Cheeseburger",
    price: 17,
    category: "Burgers",
    description: "A triple stack for the late-night 11 PM appetite.",
    image: "/images/bikini-burger-real-food-3.jpg"
  },
  {
    id: "veggie-burger",
    name: "Veggie Burger",
    price: 11,
    category: "Burgers",
    description: "Black bean veggie burger with the same care as the classics.",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "fries",
    name: "Fries",
    price: 6.25,
    category: "Shakes & Sides",
    description: "Whole potato crinkle-cut fries, hot and ready for dipping.",
    image: "/images/bikini-burger-side-photo-2960.jpg",
    badge: "Must add"
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    price: 6.25,
    category: "Shakes & Sides",
    description: "Crispy golden onion rings served hot from the fryer.",
    image: "/images/bikini-burger-side-photo-2958.jpg",
    badge: "Side"
  },
  {
    id: "potato-salad",
    name: "Potato Salad",
    price: 6,
    category: "Shakes & Sides",
    description: "Cool, creamy potato salad from the counter case.",
    image: "/images/bikini-burger-real-food-7.jpg",
    badge: "Side favorite"
  },
  {
    id: "soda",
    name: "Bikini Soda",
    price: 4,
    category: "Shakes & Sides",
    description: "Made with pure cane sugar. Only burger shop in America with its own soda.",
    image: "/images/bikini-burger-cane-sugar-soda-real.jpg",
    badge: "Pure cane sugar"
  },
  {
    id: "pup-cups",
    name: "Pup Cups",
    price: 2,
    category: "Shakes & Sides",
    description: "A little sidewalk treat for the four-legged regulars.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "milkshakes",
    name: "All Milkshakes",
    price: 7.29,
    category: "Shakes & Sides",
    description: "Made with real ice cream. Flavors: vanilla, chocolate, strawberry, and cookies & cream.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=80",
    badge: "Real ice cream"
  },
  {
    id: "kids-meal",
    name: "Kids Meals",
    price: 10.99,
    category: "Kids Meals",
    description: "Includes burger, fries and drink of choice.",
    image: "/images/bikini-burger-real-food-6.jpg"
  }
];

export const featuredItems = menuItems.filter((item) =>
  ["beef-burger", "surf-turf-burger", "double-cheeseburger", "potato-salad"].includes(item.id)
);

export const merchItems: MenuItem[] = [
  {
    id: "bikini-burger-sweatshirt",
    name: "Bikini Burger Sweatshirt",
    price: 35,
    category: "Merch",
    description: "Red logo sweatshirt. Select size at pickup or add a preferred size in checkout notes.",
    image: "/images/bikini-burger-merch.jpg",
    badge: "Custom merch"
  },
  {
    id: "bikini-burger-tee",
    name: "Bikini Burger T-Shirt",
    price: 30,
    category: "Merch",
    description: "Red Bikini Burger tee with the beach-burger graphic, shown on real customers.",
    image: "/images/bikini-burger-merch-models-2.png",
    badge: "Logo tee"
  },
  {
    id: "bikini-burger-logo-cup",
    name: "Bikini Burger Logo Cup",
    priceLabel: "In-store",
    category: "Merch",
    description: "Red logo cup from the merch shelf. Add cup pricing when available.",
    image: "/images/bikini-burger-merch.jpg",
    badge: "Counter item"
  }
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2
  }).format(price);
