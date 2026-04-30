"""
One-shot helper: convert an Instagram `sessionid` cookie (copied from your
browser's DevTools > Application > Cookies on instagram.com) into a saved
instaloader session file that scripts/sync-instagram.py can reuse.

Usage:
    pbpaste | python scripts/setup-instagram-session.py        # macOS clipboard
    echo '<sessionid>' | python scripts/setup-instagram-session.py

Reads the sessionid from stdin so it doesn't end up in shell history or
in `ps -ef` output. Prints the resolved username on success; that's the
value to put in INSTAGRAM_LOGIN_USER.
"""

from __future__ import annotations

import sys

try:
    import instaloader
except ImportError:
    print("instaloader not installed. Run: pip install --user instaloader", file=sys.stderr)
    sys.exit(2)


def main() -> int:
    raw = sys.stdin.read().strip()
    if not raw:
        print("no sessionid on stdin", file=sys.stderr)
        return 1

    # Browser cookies often store the value URL-encoded (`%3A` instead of `:`).
    # Instagram accepts either form, but normalize for cleanliness.
    sessionid = raw.replace("%3A", ":")

    user_id = sessionid.split(":", 1)[0]
    if not user_id.isdigit():
        print("sessionid does not look like a valid Instagram cookie", file=sys.stderr)
        return 1

    L = instaloader.Instaloader(quiet=True)
    cookie_jar = L.context._session.cookies  # type: ignore[attr-defined]
    cookie_jar.set("sessionid", sessionid, domain=".instagram.com", path="/")
    cookie_jar.set("ds_user_id", user_id, domain=".instagram.com", path="/")

    try:
        username = L.test_login()
    except Exception as exc:  # noqa: BLE001
        print(f"login test failed: {exc}", file=sys.stderr)
        return 1

    if not username:
        print("sessionid was rejected by Instagram (probably expired)", file=sys.stderr)
        return 1

    L.context.username = username
    L.save_session_to_file()

    print(username)
    return 0


if __name__ == "__main__":
    sys.exit(main())
