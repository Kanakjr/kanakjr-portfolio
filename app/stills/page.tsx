import { getGalleryCaptions } from "@/lib/gallery-captions";
import { instagramHighlights, instagramUsername } from "@/lib/instagram";
import StillsGallery from "./gallery";

export default function StillsPage() {
  const captions = getGalleryCaptions();
  return (
    <StillsGallery
      captions={captions}
      highlights={instagramHighlights}
      instagramUsername={instagramUsername}
    />
  );
}
