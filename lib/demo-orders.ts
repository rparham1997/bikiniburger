export const demoOrders = [
  {
    id: "demo_pickup_1001",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    total: "$37.10",
    paymentStatus: "paid",
    status: "new",
    fulfillment: "pickup",
    customerName: "Demo Pickup Customer",
    phone: "610-555-0198",
    email: "pickup@example.com",
    address: "",
    requestedTime: "ASAP",
    notes: "No onions on the cheeseburger.",
    summary: "1x Single Cheeseburger, 1x Fries, 1x Bikini Soda, 1x Bacon",
    items: [
      { name: "Single Cheeseburger", quantity: 1, total: "$12.00" },
      { name: "Fries", quantity: 1, total: "$6.25" },
      { name: "Bikini Soda", quantity: 1, total: "$3.50" },
      { name: "Bacon", quantity: 1, total: "$3.13" },
      { name: "PA sales tax estimate", quantity: 1, total: "$1.49" }
    ]
  },
  {
    id: "demo_delivery_1002",
    createdAt: new Date(Date.now() - 1000 * 60 * 21).toISOString(),
    total: "$62.42",
    paymentStatus: "paid",
    status: "preparing",
    fulfillment: "delivery",
    customerName: "Demo Delivery Customer",
    phone: "610-555-0144",
    email: "delivery@example.com",
    address: "44 Rittenhouse Pl, Ardmore, PA 19003",
    requestedTime: "7:15 PM",
    notes: "Call when outside.",
    summary: "1x Fat Daddy Steakhouse, 1x Onion Rings, 2x Bikini Soda",
    items: [
      { name: "Fat Daddy Steakhouse", quantity: 1, total: "$20.00" },
      { name: "Onion Rings", quantity: 1, total: "$6.25" },
      { name: "Bikini Soda", quantity: 2, total: "$7.00" },
      { name: "In-house delivery", quantity: 1, total: "$5.00" },
      { name: "PA sales tax estimate", quantity: 1, total: "$2.00" }
    ]
  }
];
