#!/bin/sh
# Downloads the official DownDraft STEP file (zipped in the repo) and assembly manual into source/
# from a pinned commit of VoronDesign/voron-downdraft (GPL-3.0). They are too big to keep in git.
set -e
COMMIT=c1fbbd00bca80a59a633dccc43d0cc3b640d2e81
BASE="https://raw.githubusercontent.com/VoronDesign/voron-downdraft/$COMMIT"
cd "$(dirname "$0")/.."
mkdir -p source
get() { [ -f "$2" ] || curl -fsSL -o "$2" "$BASE/$1"; }
get CAD/Downdraft_Toolheads.zip source/Downdraft_Toolheads.zip
get Manual/DownDraft_Assembly_Manual.pdf source/DownDraft_Assembly_Manual.pdf
[ -f source/Downdraft_Toolheads.step ] || unzip -oq source/Downdraft_Toolheads.zip -d source
echo "source/ is up to date"
