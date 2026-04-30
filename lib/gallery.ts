import { extname, basename, dirname } from "path";
import { instagramPosts } from "./instagram";

export interface GalleryImage {
  src: string;
  thumb: string;
  alt: string;
}

export interface GallerySection {
  id: string;
  title: string;
  accent: string;
  description: string;
  images: GalleryImage[];
}

/**
 * Derives the thumbnail path for a given source image.
 * e.g. /portfolio/images/xsr/photo.jpg -> /portfolio/images/xsr/_thumbs/photo.webp
 */
function thumb(src: string): string {
  const dir = dirname(src);
  const name = basename(src, extname(src));
  return `${dir}/_thumbs/${name}.webp`;
}

function img(src: string, alt: string): GalleryImage {
  return { src, thumb: thumb(src), alt };
}

const staticGalleryData: GallerySection[] = [
  {
    id: "xsr",
    title: "Yamaha XSR",
    accent: "The Neo-Retro Ride",
    description:
      "My Yamaha XSR -- a neo-retro machine that matches the aesthetic of everything I build.",
    images: [
      img("/portfolio/images/xsr/street-parked.jpg", "XSR parked on the street with helmet on the seat"),
      img("/portfolio/images/xsr/beach-ride.jpg", "Rider on the XSR parked on a sandy beach"),
      img("/portfolio/images/xsr/office-parking.jpg", "XSR under a covered office parking area"),
      img("/portfolio/images/xsr/ruins-backdrop.jpg", "XSR with backpack parked against old brick ruins"),
      img("/portfolio/images/xsr/coastal-sunset.jpg", "XSR with backpack on a rocky coast at sunset"),
      img("/portfolio/images/xsr/hilltop-stop.jpg", "XSR parked at a hilltop road barrier with mountain view"),
      img("/portfolio/images/xsr/park-dappled-light.jpg", "XSR in dappled sunlight near park steps"),
    ],
  },
  {
    id: "3d_prints",
    title: "3D Prints",
    accent: "Bambu Lab Creations",
    description:
      "Things I design and print on my Bambu Lab printer -- from functional parts to creative builds.",
    images: [
      img("/portfolio/images/3d_prints/first-prints.jpg", "First batch of prints: a small boat, USB dongle holder and misc parts"),
      img("/portfolio/images/3d_prints/cup-holder.jpg", "Desk cup holder clipped to monitor with a Starbucks mug"),
      img("/portfolio/images/3d_prints/first-batch.jpg", "First creative batch: bust, KANAKJR nameplate, dragon figure and keycap"),
      img("/portfolio/images/3d_prints/ipad-arm-stand.jpg", "Articulated arm stand holding an iPad with a CAD drawing on screen"),
      img("/portfolio/images/3d_prints/enclosure-parts.jpg", "Enclosure parts freshly off the Bambu print plate"),
      img("/portfolio/images/3d_prints/gundam-figure.jpg", "Gundam figure build laid out on a cutting mat with tools"),
      img("/portfolio/images/3d_prints/t13-figure.jpg", "T13 articulated mech figure posed on a cutting mat"),
      img("/portfolio/images/3d_prints/space-shuttle.jpg", "Space shuttle launch scene with printed smoke cloud base"),
      img("/portfolio/images/3d_prints/tanjiro-sword.jpg", "Tanjiro's nichirin blade from Demon Slayer"),
      img("/portfolio/images/3d_prints/alpaca.jpg", "White alpaca figurine perched on an Xbox Series S"),
      img("/portfolio/images/3d_prints/pegboard-wall.jpg", "Full pegboard wall displaying all prints and tools"),
      img("/portfolio/images/3d_prints/ha-bambu-dashboard.jpg", "Home Assistant dashboard with Bambu Lab printer status"),
      img("/portfolio/images/3d_prints/headphone-stand.jpg", "J-shaped headphone stand in two-tone filament"),
      img("/portfolio/images/3d_prints/demogorgon.jpg", "Demogorgon figure from Stranger Things"),
      img("/portfolio/images/3d_prints/sims-cat.jpg", "Low-poly cat wearing headphones with a Sims plumbob"),
      img("/portfolio/images/3d_prints/stormtrooper.jpg", "Articulated Stormtrooper figure from Star Wars"),
      img("/portfolio/images/3d_prints/baby-chimp.jpg", "Cute articulated baby chimp figurine"),
    ],
  },
  {
    id: "sketches",
    title: "Sketches",
    accent: "iPad + Apple Pencil",
    description:
      "Digital illustrations drawn on my iPad -- anime-inspired characters and quick studies.",
    images: [
      img("/portfolio/images/sketches/luffy.jpg", "Monkey D. Luffy from One Piece"),
      img("/portfolio/images/sketches/portrait-wip.jpg", "Portrait study of a girl in a winter coat, work in progress"),
      img("/portfolio/images/sketches/sasuke.jpg", "Sasuke Uchiha from Naruto"),
      img("/portfolio/images/sketches/zenitsu.jpg", "Zenitsu Agatsuma from Demon Slayer in action pose"),
      img("/portfolio/images/sketches/todoroki.jpg", "Shoto Todoroki from My Hero Academia"),
      img("/portfolio/images/sketches/blonde-boy.jpg", "Blonde anime boy character"),
      img("/portfolio/images/sketches/anime-girl-blue.jpg", "Anime girl with blue hair"),
      img("/portfolio/images/sketches/portrait-bold.jpg", "Bold portrait of a woman with red lips"),
      img("/portfolio/images/sketches/anime-boy-blue.jpg", "Anime boy with dark hair and blue eyes"),
      img("/portfolio/images/sketches/killua.jpg", "Killua Zoldyck from Hunter x Hunter"),
      img("/portfolio/images/sketches/anime-girl-ponytail.jpg", "Anime girl with orange ponytail"),
    ],
  },
];

const instagramSection: GallerySection = {
  id: "nerdguytheory",
  title: "Nerd Guy Theory",
  accent: "From @nerdguytheory on Instagram",
  description:
    "Latest snapshots from my nerdy hobbies feed -- synced from Instagram on each build.",
  images: instagramPosts.map((post) => ({
    src: post.src,
    thumb: post.thumb,
    alt: post.alt,
  })),
};

export const galleryData: GallerySection[] = [
  instagramSection,
  ...staticGalleryData,
].filter((section) => section.images.length > 0);
