import mug from "@/assets/shop-mug.webp";
import flask from "@/assets/shop-flask.webp";
import shirt from "@/assets/shop-t-shirt.webp";
import polo from "@/assets/shop-polo.webp";
import cap from "@/assets/shop-cap.webp";
import tote from "@/assets/shop-tote.webp";
import notebook from "@/assets/shop-notebook.webp";
import folder from "@/assets/shop-folder.webp";
import usb from "@/assets/shop-usb.webp";
import display from "@/assets/shop-display.webp";
import drawstring from "@/assets/shop-drawstring-bag.webp";
import lanyard from "@/assets/shop-lanyard.webp";
import mouseMat from "@/assets/shop-mouse-mat.webp";
import phoneStand from "@/assets/shop-phone-stand.webp";
import brochure from "@/assets/shop-brochure.webp";
import businessCards from "@/assets/shop-business-cards.webp";
import banner from "@/assets/shop-roll-up-banner.webp";
import giftBox from "@/assets/shop-gift-box.webp";

export type ShopProduct = {
  slug: string;
  name: string;
  category: "Drinkware" | "Apparel & bags" | "Office & display" | "Print & packaging";
  description: string;
  options: string;
  image: string;
};

// Product categories, not inventory or fulfilled client work. Specifications are confirmed per enquiry.
export const shopProducts: readonly ShopProduct[] = [
  { slug: "mug", name: "Ceramic mug", category: "Drinkware", description: "An everyday object for desks, welcome packs and gifting.", options: "Discuss size, colour and print placement.", image: mug },
  { slug: "flask", name: "Insulated drinkware", category: "Drinkware", description: "A reusable bottle or flask for work and travel.", options: "Discuss capacity, finish and marking method.", image: flask },
  { slug: "t-shirt", name: "T-shirt", category: "Apparel & bags", description: "A wearable starting point for teams, events and campaigns.", options: "Discuss fabric, sizes, colour and print.", image: shirt },
  { slug: "polo", name: "Polo shirt", category: "Apparel & bags", description: "A considered option for staff and team clothing.", options: "Discuss fit, fabric, sizes and embroidery or print.", image: polo },
  { slug: "cap", name: "Cap", category: "Apparel & bags", description: "A compact piece of everyday brand presence.", options: "Discuss style, colour and embroidery or print.", image: cap },
  { slug: "tote", name: "Tote bag", category: "Apparel & bags", description: "Something to carry publications, essentials or an event pack.", options: "Discuss material, dimensions, handles and print.", image: tote },
  { slug: "notebook", name: "Notebook / jotter", category: "Office & display", description: "A useful place for notes, meetings and ideas.", options: "Discuss page size, binding, paper and cover.", image: notebook },
  { slug: "folder", name: "Presentation folder", category: "Office & display", description: "Keep a proposal, meeting pack or document set together.", options: "Discuss format, pockets, stock and finishing.", image: folder },
  { slug: "usb", name: "USB flash drive", category: "Office & display", description: "A physical format for handing over digital material.", options: "Discuss capacity, connector, casing and marking.", image: usb },
  { slug: "display", name: "Tabletop display", category: "Office & display", description: "Put a message where people need to see it.", options: "Discuss dimensions, material and artwork.", image: display },
  { slug: "drawstring-bag", name: "Drawstring bag", category: "Apparel & bags", description: "A lightweight carry option for an event or team pack.", options: "Discuss fabric, dimensions, cords and marking.", image: drawstring },
  { slug: "lanyard", name: "Lanyard & badge holder", category: "Office & display", description: "Keep identification close at meetings and events.", options: "Discuss width, clip, holder and print.", image: lanyard },
  { slug: "mouse-mat", name: "Mouse mat", category: "Office & display", description: "A useful surface for everyday desk work.", options: "Discuss dimensions, surface, backing and print.", image: mouseMat },
  { slug: "phone-stand", name: "Desktop phone stand", category: "Office & display", description: "A small support for a phone at a desk or counter.", options: "Discuss material, format and marking area.", image: phoneStand },
  { slug: "brochure", name: "Brochure / booklet", category: "Print & packaging", description: "Bring a message together in a portable publication.", options: "Discuss format, page count, paper, binding and artwork.", image: brochure },
  { slug: "business-cards", name: "Business cards", category: "Print & packaging", description: "A compact handover for a name and contact details.", options: "Discuss stock, size, print and finishing.", image: businessCards },
  { slug: "roll-up-banner", name: "Roll-up banner", category: "Office & display", description: "A freestanding message for an event or reception.", options: "Discuss size, mechanism, material and artwork.", image: banner },
  { slug: "gift-box", name: "Presentation / gift box", category: "Print & packaging", description: "Bring objects together as a considered pack.", options: "Discuss dimensions, board, insert, finish and marking.", image: giftBox },
];
export type ShopIntent = "buy-plain" | "customise";
export function productEnquiryText(product: ShopProduct, intent: ShopIntent = "customise") {
  return `${intent === "buy-plain" ? "Buy plain" : "Customise"}: ${product.name}.\n${product.options}\nQuantity, specification and timing: `;
}