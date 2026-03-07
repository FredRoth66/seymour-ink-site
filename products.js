// products.js
// Base prices only; final prices are computed via pricing.js

window.PRODUCTS = {
  keychain: {
    id: "keychain",
    name: "Logo Keychain",
    basePrice: 1200, // $12.00
    image: "/images/keychain.png",
    type: "inhouse"
  },
  earrings: {
    id: "earrings",
    name: "Logo Earrings",
    basePrice: 1500, // $15.00
    image: "/images/earrings.png",
    type: "inhouse"
  },
  necklace: {
    id: "necklace",
    name: "Logo Necklace",
    basePrice: 2000, // $20.00
    image: "/images/necklace.png",
    type: "inhouse"
  },
  tshirt: {
    id: "tshirt",
    name: "Team T‑Shirt",
    basePrice: 2000, // $20.00 base before buffer/tier/discount
    image: "/images/tshirt.png",
    type: "pod"
  }
};