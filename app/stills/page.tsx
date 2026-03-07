import { getGalleryCaptions } from "@/lib/gallery-captions";
import StillsGallery from "./gallery";

export default function StillsPage() {
  const captions = getGalleryCaptions();
  return <StillsGallery captions={captions} />;
}
