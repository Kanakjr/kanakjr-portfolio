import { extname, basename, dirname } from "path";

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

export const galleryData: GallerySection[] = [
  {
    id: "xsr",
    title: "Yamaha XSR",
    accent: "The Neo-Retro Ride",
    description:
      "My Yamaha XSR -- a neo-retro machine that matches the aesthetic of everything I build.",
    images: [
      img("/portfolio/images/xsr/1766057467722~2.jpg", "Yamaha XSR shot 1"),
      img("/portfolio/images/xsr/1769835130126~3.jpg", "Yamaha XSR shot 2"),
      img(
        "/portfolio/images/xsr/PXL_20260119_045206060~4.jpg",
        "Yamaha XSR shot 3"
      ),
      img(
        "/portfolio/images/xsr/PXL_20260123_084138501.MP~3.jpg",
        "Yamaha XSR shot 4"
      ),
      img(
        "/portfolio/images/xsr/PXL_20260124_123336217~3 (1).jpg",
        "Yamaha XSR shot 5"
      ),
    ],
  },
  {
    id: "3d_prints",
    title: "3D Prints",
    accent: "Bambu Lab Creations",
    description:
      "Things I design and print on my Bambu Lab printer -- from functional parts to creative builds.",
    images: [
      img(
        "/portfolio/images/3d_prints/PXL_20250716_183504049.MP.jpg",
        "3D print project 1"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250718_034742705~2.jpg",
        "3D print project 2"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250721_025507177.jpg",
        "3D print project 3"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250726_163810766_exported_5723~2.jpg",
        "3D print project 4"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250727_045652202.jpg",
        "3D print project 5"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250727_121004178.jpg",
        "3D print project 6"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250727_133711372.PORTRAIT.ORIGINAL.jpg",
        "3D print project 7"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250802_122610839.PORTRAIT.jpg",
        "3D print project 8"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250809_065436314.jpg",
        "3D print project 9"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250809_110654069.PORTRAIT.jpg",
        "3D print project 10"
      ),
      img(
        "/portfolio/images/3d_prints/PXL_20250817_070143283.jpg",
        "3D print project 11"
      ),
      img(
        "/portfolio/images/3d_prints/ha-dashboard-bambulab.jpg",
        "Home Assistant dashboard with Bambu Lab printer status"
      ),
    ],
  },
  {
    id: "sketches",
    title: "Sketches",
    accent: "iPad + Apple Pencil",
    description:
      "Digital illustrations drawn on my iPad -- anime-inspired characters and quick studies.",
    images: [
      img(
        "/portfolio/images/sketches/PXL_20230105_124643880~2.jpg",
        "Sketch 1"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230105_1347595.jpg",
        "Sketch 2"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230105_134759544.jpg",
        "Sketch 3"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230126_093522091.jpg",
        "Sketch 4"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230411_143355061.jpg",
        "Sketch 5"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230415_100324592~2.jpg",
        "Sketch 6"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230604_091205214.jpg",
        "Sketch 7"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230625_051909277~2.jpg",
        "Sketch 8"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230725_042100823~2.jpg",
        "Sketch 9"
      ),
      img(
        "/portfolio/images/sketches/PXL_20230903_163303086.MP~2.jpg",
        "Sketch 10"
      ),
      img(
        "/portfolio/images/sketches/PXL_20231220_152024543.jpg",
        "Sketch 11"
      ),
    ],
  },
];
