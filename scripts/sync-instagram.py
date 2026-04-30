"""
Build-time sync of @nerdguytheory (or any public IG handle) into the site.

- Uses instaloader to read profile metadata (anonymous works for public profiles;
  authenticated session via INSTAGRAM_LOGIN_USER avoids most rate limits).
- Classifies each post as a photo or a reel (any video post).
- Downloads media into:
    public/instagram/posts/<shortcode>[_<idx>].jpg
    public/instagram/reels/<shortcode>.mp4 + <shortcode>.jpg
- Writes consolidated metadata to data/instagram.json -- the single source of
  truth consumed by lib/instagram.ts on the Next.js side.

Run:
    pip install instaloader
    python scripts/sync-instagram.py

Env:
    INSTAGRAM_USERNAME    handle to fetch (default: nerdguytheory)
    INSTAGRAM_MAX_POSTS   how many recent posts to scan (default: 24)
    INSTAGRAM_LOGIN_USER  optional: your IG handle whose `instaloader --login`
                          session is on disk; used for higher rate limits
"""

from __future__ import annotations

import json
import os
import shutil
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    import instaloader
except ImportError:
    print(
        "[instagram] instaloader is not installed. Run:\n"
        "    source ~/Workspace/set-proxy.sh && pip install instaloader",
        file=sys.stderr,
    )
    sys.exit(2)


USERNAME = os.environ.get("INSTAGRAM_USERNAME", "nerdguytheory").strip()
LOGIN_USER = os.environ.get("INSTAGRAM_LOGIN_USER", "").strip() or None
try:
    MAX_POSTS = max(1, int(os.environ.get("INSTAGRAM_MAX_POSTS", "24")))
except ValueError:
    MAX_POSTS = 24

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "public" / "instagram" / "posts"
REELS_DIR = REPO_ROOT / "public" / "instagram" / "reels"
DATA_FILE = REPO_ROOT / "data" / "instagram.json"

DOWNLOAD_TIMEOUT = 30
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


def ensure_dirs() -> None:
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    REELS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)


def download(url: str, dest: Path) -> bool:
    """Download `url` to `dest` if not already present. Returns True on success."""
    if dest.exists() and dest.stat().st_size > 0:
        return True
    tmp = dest.with_suffix(dest.suffix + ".part")
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=DOWNLOAD_TIMEOUT) as resp, open(tmp, "wb") as fh:
            shutil.copyfileobj(resp, fh)
        tmp.replace(dest)
        return True
    except Exception as exc:  # noqa: BLE001 -- best-effort downloader
        print(f"[instagram] download failed {url} -> {dest.name}: {exc}", file=sys.stderr)
        if tmp.exists():
            tmp.unlink(missing_ok=True)
        return False


def thumb_path(public_src: str) -> str:
    """Mirror the existing _thumbs/<name>.webp convention used by the Stills gallery."""
    head, _, tail = public_src.rpartition("/")
    name, _, _ = tail.rpartition(".")
    return f"{head}/_thumbs/{name}.webp"


def make_alt(caption: str, fallback: str) -> str:
    if not caption:
        return fallback
    first_line = caption.splitlines()[0].strip()
    if len(first_line) > 140:
        first_line = first_line[:137].rstrip() + "..."
    return first_line or fallback


def build_loader() -> "instaloader.Instaloader":
    L = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
    )
    if LOGIN_USER:
        try:
            L.load_session_from_file(LOGIN_USER)
            print(f"[instagram] loaded saved session for @{LOGIN_USER}")
        except FileNotFoundError:
            print(
                f"[instagram] no saved session for @{LOGIN_USER}; run "
                f"`instaloader --login={LOGIN_USER}` once to create one. "
                "Continuing anonymously.",
                file=sys.stderr,
            )
    return L


def serialize_photo_post(post: "instaloader.Post") -> list[dict[str, Any]]:
    """Returns one entry per displayable image (carousels expand into multiple)."""
    sc = post.shortcode
    caption = (post.caption or "").strip()
    taken_at = post.date_utc.replace(tzinfo=timezone.utc).isoformat()
    permalink = f"https://www.instagram.com/p/{sc}/"
    out: list[dict[str, Any]] = []

    if post.typename == "GraphSidecar":
        for idx, node in enumerate(post.get_sidecar_nodes()):
            if node.is_video:
                continue  # skip embedded videos in carousels for the photo gallery
            dest = POSTS_DIR / f"{sc}_{idx}.jpg"
            if download(node.display_url, dest):
                src = f"/instagram/posts/{sc}_{idx}.jpg"
                out.append({
                    "shortcode": sc,
                    "index": idx,
                    "caption": caption,
                    "src": src,
                    "thumb": thumb_path(src),
                    "alt": make_alt(caption, f"Instagram post {sc}"),
                    "permalink": permalink,
                    "takenAt": taken_at,
                })
    else:
        dest = POSTS_DIR / f"{sc}.jpg"
        if download(post.url, dest):
            src = f"/instagram/posts/{sc}.jpg"
            out.append({
                "shortcode": sc,
                "index": 0,
                "caption": caption,
                "src": src,
                "thumb": thumb_path(src),
                "alt": make_alt(caption, f"Instagram post {sc}"),
                "permalink": permalink,
                "takenAt": taken_at,
            })
    return out


def serialize_reel(post: "instaloader.Post") -> dict[str, Any] | None:
    sc = post.shortcode
    caption = (post.caption or "").strip()
    taken_at = post.date_utc.replace(tzinfo=timezone.utc).isoformat()
    video_dest = REELS_DIR / f"{sc}.mp4"
    thumb_dest = REELS_DIR / f"{sc}.jpg"

    video_url = getattr(post, "video_url", None)
    if not video_url:
        return None
    if not download(video_url, video_dest):
        return None
    download(post.url, thumb_dest)  # thumbnail is best-effort

    return {
        "shortcode": sc,
        "caption": caption,
        "title": make_alt(caption, f"Reel {sc}"),
        "video": f"/instagram/reels/{sc}.mp4",
        "thumb": f"/instagram/reels/{sc}.jpg",
        "permalink": f"https://www.instagram.com/reel/{sc}/",
        "takenAt": taken_at,
    }


def main() -> int:
    ensure_dirs()
    L = build_loader()

    try:
        profile = instaloader.Profile.from_username(L.context, USERNAME)
    except instaloader.exceptions.ProfileNotExistsException:
        print(f"[instagram] profile @{USERNAME} does not exist", file=sys.stderr)
        return 1
    except Exception as exc:  # noqa: BLE001
        print(f"[instagram] failed to load profile @{USERNAME}: {exc}", file=sys.stderr)
        return 1

    posts: list[dict[str, Any]] = []
    reels: list[dict[str, Any]] = []
    seen_posts = 0
    seen_reels = 0
    seen_shortcodes: set[str] = set()

    # 1. Main feed (photos + cross-posted videos). On modern IG most reels do
    #    NOT appear here -- the Reels tab is a separate feed handled below.
    try:
        for post in profile.get_posts():
            if seen_posts >= MAX_POSTS:
                break
            seen_posts += 1
            seen_shortcodes.add(post.shortcode)
            try:
                if post.is_video:
                    reel = serialize_reel(post)
                    if reel:
                        reels.append(reel)
                        print(f"[instagram] reel  {post.shortcode} (from feed)")
                else:
                    entries = serialize_photo_post(post)
                    posts.extend(entries)
                    if entries:
                        print(f"[instagram] photo {post.shortcode} ({len(entries)} image(s))")
            except Exception as exc:  # noqa: BLE001 -- per-post failures should not abort
                print(f"[instagram] skipped {post.shortcode}: {exc}", file=sys.stderr)
    except Exception as exc:  # noqa: BLE001
        print(f"[instagram] feed iteration failed after {seen_posts}: {exc}", file=sys.stderr)

    # 2. Reels tab. instaloader 4.10+ exposes Profile.get_reels(); we de-dupe
    #    against shortcodes already pulled from the feed in case some overlap.
    if hasattr(profile, "get_reels"):
        try:
            for post in profile.get_reels():
                if seen_reels >= MAX_POSTS:
                    break
                if post.shortcode in seen_shortcodes:
                    continue
                seen_reels += 1
                seen_shortcodes.add(post.shortcode)
                try:
                    reel = serialize_reel(post)
                    if reel:
                        reels.append(reel)
                        print(f"[instagram] reel  {post.shortcode} (from reels tab)")
                except Exception as exc:  # noqa: BLE001
                    print(f"[instagram] skipped reel {post.shortcode}: {exc}", file=sys.stderr)
        except Exception as exc:  # noqa: BLE001
            print(f"[instagram] reels iteration failed after {seen_reels}: {exc}", file=sys.stderr)
    else:
        print("[instagram] instaloader does not expose get_reels(); skipping reels tab", file=sys.stderr)

    if not posts and not reels:
        return 1

    payload = {
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "username": USERNAME,
        "scanned": seen_posts + seen_reels,
        "scannedPosts": seen_posts,
        "scannedReels": seen_reels,
        "posts": posts,
        "reels": reels,
    }
    DATA_FILE.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(
        f"[instagram] wrote {len(posts)} photo(s), {len(reels)} reel(s) "
        f"(scanned {seen_posts} feed post(s) + {seen_reels} reel(s)) "
        f"-> {DATA_FILE.relative_to(REPO_ROOT)}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
