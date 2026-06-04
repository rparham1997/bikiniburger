export const site = {
  name: "Bikini Burger",
  tagline: "Fresh burgers, fries, shakes & good vibes.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://bikiniburger.shop",
  address: "44 Rittenhouse Pl, Ardmore, PA 19003",
  phone: "610-649-3903",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  hours: "Mon-Sat 11 AM-11 PM; Sun 12 PM-10 PM",
  instagram: "https://www.instagram.com/bikiniburger_/?hl=en",
  facebookPost:
    "https://www.facebook.com/ArdmoreBiz/posts/-new-business-alert-welcome-bikini-burger-the-ardmore-business-association-is-th/1309525317883509/",
  orderUrl: "/order",
  doorDashUrl:
    process.env.NEXT_PUBLIC_DOORDASH_URL ||
    "https://www.doordash.com/store/bikini-burger-ardmore-44512416/110398546/",
  uberEatsUrl: process.env.NEXT_PUBLIC_UBER_EATS_URL || "https://www.ubereats.com/search?q=Bikini%20Burger%20Ardmore",
  seamlessUrl:
    process.env.NEXT_PUBLIC_SEAMLESS_URL ||
    "https://www.seamless.com/menu/bikini-burger-44-rittenhouse-pl-ardmore/13877008",
  grubhubUrl:
    process.env.NEXT_PUBLIC_GRUBHUB_URL ||
    "https://www.grubhub.com/restaurant/bikini-burger-44-rittenhouse-pl-ardmore/13877008",
  mapQuery: "44 Rittenhouse Pl, Ardmore, PA 19003"
};

export const buildContactHref = (subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (site.email) {
    return `mailto:${site.email}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  return `sms:${site.phone.replace(/\D/g, "")}?&body=${encodedBody}`;
};
