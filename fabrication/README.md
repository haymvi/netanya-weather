> **Correction after physical testing:** the user reported an entirely white print.
> IFS activation and physical slot mapping are NOT validated. T0/T1 in the G-code
> did not demonstrate a real colour change. The four-layer reduced test is pending.
> See [current consolidated HOWTO](../HOWTO.md) and
> [Codex execution record](../docs/CODEX-HISTORICO.md). The material below records
> reproduction of the original, not approval for multicolour production.

# Netanya Weather: website → QR keyring → AD5X G-code

This is the reproducible record of the AI-assisted project. ChatGPT created the
original 3MF in an earlier conversation, as confirmed by the user. That earlier
CAD command history is not available in this checkout: the exact supplied 3MF is
included instead. The user directed the work, made small adjustments, managed
GitHub and operated the printer. ChatGPT and Codex performed the documented
inspection, troubleshooting, coding, slicing and digital validation.

## 1. Establish and publish the URL

The existing repository is https://github.com/haymvi/netanya-weather and the QR
encodes exactly https://haymvi.github.io/netanya-weather/ . For a new equivalent
project, create the repository in GitHub, commit `index.html` to `main`, then use
Settings → Pages → Deploy from a branch → main → /(root). If an existing Actions
workflow deploys Pages, retain it. Wait for deployment and verify the HTTPS URL
on a phone before generating a QR. A changed repository/path can break physical
QR codes already printed. Account creation and the original Pages deployment
preceded the session documented here; they were not re-executed during this work.

## 2. Website and languages

The weather page is static HTML/CSS/JavaScript, with no backend, build or API
keys. The later surf-focused revision loads sports.js and sports.css alongside
index.html; publish those assets together. It adds marine hourly waves, swell,
wind sea, periods/directions, wind/gusts in knots and exposure/daylight data.
See ../docs/SURF-SOURCES.md for current sources and live verification. It requests public Open-Meteo forecast and marine data for 32.3215, 34.8532,
timezone Asia/Jerusalem, refreshes every 15 minutes and supports Hebrew RTL and
English LTR. The language preference uses `netanya-weather-lang` in localStorage;
`?lang=he` and `?lang=en` override it. The red footer link opens
`how-it-was-made.html` in the same language. This guide also links back in that
language. Network access is needed to api.open-meteo.com and
marine-api.open-meteo.com. During initial onboarding these APIs were blocked by
the proxy; local serving, UI controls and error handling were validated. Do not
confuse those checks with validation of live weather data.

To serve locally from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `/index.html?lang=en` and `/how-it-was-made.html?lang=he` on that server in
your browser. To publish the changes, review and commit the site files, the
`fabrication/` directory and `downloads/` ZIPs to the existing Pages source.
Local file changes alone are not a deployment. Check the actual deployment and
the download links after publishing.

## 3. QR and model

For a new design: encode the exact published HTTPS URL, scan the QR image before
CAD, keep at least four blank modules around the pattern, extrude black modules
as a separate part over a white base and preserve registration. For this exact
design, use the included original 3MF rather than regenerating an approximation.

- Original: `Netanya_Weather_AD5X_Branco1_Preto2.3mf`.
- SHA-256: `ce28f59fcc6133cdc2f2e28960243f615bc32b27235c72a504f3b9a99efc4912`.
- Body width: 48 mm; height including ring: 60.899975 mm.
- Base and ring: Z=0–1.2 mm; black relief: Z=1.2–2.2 mm.
- Hole: 6 mm. Its centre is (0,29.7), offset from the outer ring's centre;
  fitting the circular hole boundary gave 6.00000002 mm.
- Black QR bounds: ±17.43 mm in X/Y, 34.86 mm total; nominal side margin 6.57 mm.
- White mesh: 2,304 vertices, 4,608 triangles. Black: 1,544 vertices, 3,188 triangles.
- ZIP integrity passed. Both meshes were closed, with zero boundary edges,
  non-manifold edges and degenerate triangles.
- Part 1/extruder 1 is white; part 2/extruder 2 is black. The grouped object
  remains assembled and QR faces upward. No mesh scaling/reshaping was performed.

## 4. Tools and profile provenance

Actual slicing engine: official OrcaSlicer 2.3.1 Linux AppImage:
https://github.com/OrcaSlicer/OrcaSlicer/releases/tag/v2.3.1

Machine/process/PLA profiles came from the manufacturer repository:
https://github.com/FlashForge/Orca-Flashforge
Commit: `c45cc8216c184574c36873314ae7caea67c7a1ad`.
Profile names: `Flashforge AD5X 0.4 nozzle`, `0.20mm Standard @FF AD5X`, and
`Flashforge PLA Basic @FF AD5X`. JSON inheritance was resolved into the complete
profiles included here. The slicer executable was OrcaSlicer, not Orca-Flashforge.
The Flashforge release checked offered Windows/macOS installers.

Use the confirmed 0.4 mm nozzle. The filament brand was not supplied, so PLA Basic
is the official baseline rather than a measured brand-specific calibration.
The bed setting is Textured PEI Plate at 60 °C; nozzle 215 °C initially, then 210.
Retraction: 0.8 mm at 30 mm/s. Material flow limit: 21 mm³/s; cooling target: 8 s.
The machine start profile was supplemented with units, homing, tool selection and
M109 heat wait before the official priming moves. The end sequence adds a Z lift
and heater/fan shutdown. These are custom additions; this is not an unmodified
manufacturer-generated file.

Linux installation used `--appimage-extract` to avoid a FUSE requirement. The
runtime needed `libwebkit2gtk-4.1-0`, `libjavascriptcoregtk-4.1-0`,
`libharfbuzz-icu0`, `libmanette-0.2-0`, `libhyphen0`, `libhidapi-hidraw0` in
addition to libraries already installed. Use your distribution's signed package
manager to install missing dependencies. On this Debian 13 cloud instance they
were downloaded using signed APT indexes and extracted into a local directory;
that directory was passed through LD_LIBRARY_PATH. Verification was not disabled.
AppRun also prepends the AppImage's own binary/library directory.

## 5. Two distinct process versions

| Setting | First conservative file | Official-speed file |
|---|---:|---:|
| Outer wall (mm/s) | 30 | 200 |
| Inner wall (mm/s) | 45 | 300 |
| Top surface (mm/s) | 25 | 200 |
| Solid infill (mm/s) | 45 | 250 |
| First layer (mm/s) | 20 | 50 |
| Travel (mm/s) | 150 | 500 |
| Outer wall acceleration (mm/s²) | 1,000 | 5,000 |
| Travel acceleration (mm/s²) | 2,500 | 10,000 |
| Slicer estimate | 30m24s | 13m17s |

The first file was deliberately slow across the entire model, causing the user's
reported slow print. The new version uses the official process's speed and
acceleration settings, without an intermediate manual cap. The machine profile
lists XY hardware speed limits of 600 mm/s and acceleration limits of
20,000 mm/s²; the manufacturer's feature-specific process speeds are lower. Official cooling,
small-perimeter, overhang and volumetric-flow limits still apply, so short QR
paths do not necessarily reach the listed maximums. The ~56% time reduction is
an estimate, not a physical timing measurement. The intermediate trial profile
was discarded and is not offered in the kit.

Both versions retain 0.20 mm first/normal layer height, 3 walls, 100% infill,
6 top/bottom shells, no supports or object brim, a separate prime tower, and the
same two source meshes. The official default first layer is 0.25 mm; changing it
to 0.20 is necessary to make six white layers exactly 1.2 mm. Object exclusion and
arc fitting are disabled; speed/acceleration settings in the official version
are unchanged from the resolved official process. Layer count is 11. Extrusion
is white T0 through Z=1.2, then black T1 from Z=1.4 through Z=2.2. There is one
effective colour change, automatically commanded by T1, not a manual pause.
White-to-black flush volume calculated by Orca is 80 mm³; prime volume is 40 mm³.
Physical mapping can be changed by printer firmware: confirm white slot 1 and
black slot 2 on the printer before starting.

## 6. Repeat the real slicing

The helper uses Python 3 standard library only and calls the real installed
slicer. It is deliberately specific to this model. It validates input bounds and
assignments, constructs a compatible temporary 3MF while preserving original
mesh XML byte-for-byte, slices, and checks actual output layers/tools/heating.
The original plate metadata crashed Orca 2.3.1; omitting it from the temporary
copy solved the import issue without touching the geometry.

From the extracted kit root:

```sh
python3 fabrication/slice_keyring.py \
  --orca /absolute/path/to/squashfs-root/AppRun \
  --preset official \
  --output ./new-official-slice
```

Use `--preset conservative` to reproduce the first process. Each output directory
must be new to prevent accidentally validating stale files. Set LD_LIBRARY_PATH
only if you chose local dependency extraction instead of system installation.
The helper's `command.json` records the precise arguments. Core command:

```sh
/path/to/AppRun \
  --load-settings '/path/to/profiles/machine.json;/path/to/profiles/official.json' \
  --load-filaments '/path/to/profiles/white.json;/path/to/profiles/black.json' \
  --arrange 1 --slice 0 --outputdir /path/to/new-output /path/to/input.3mf
```

`plate_1.gcode` is the actual sliced output. Read `slice.log`, `result.json` and
`validation.json`. Nonzero exit status or failing checks is not a successful job.
The helper and official preset were executed together successfully during this
work. Exact bytes may vary across runs because the G-code contains timestamps.
Both exported reference files are supplied alongside checksums.

## 7. Verify QR toolpaths independently

Optional dependencies: NumPy, Pillow, zxing-cpp (3.1.1 used here).

```sh
python3 -m pip install numpy pillow zxing-cpp==3.1.1
python3 fabrication/verify_qr.py \
  --gcode ./new-official-slice/plate_1.gcode \
  --output ./qr-check
```

The verifier projects the original black mesh, rasterises the top-layer linear
extrusion paths and decodes renderings at 600/300/240/200 pixels. It is specific
to the documented arranged position of this model; do not treat it as a general
G-code simulator. At native 1200 px the raster can fail detection due to line
aliasing, while all four downsampled sizes decoded successfully. This is digital
verification, not proof of physical print quality or a camera scan.

## 8. Download, print and record the result

Use the ZIP downloads to avoid UI G-code preview issues. Extract the `.gcode`
and transfer it through the AD5X's supported USB/workflow. The document icon seen
on the printer is consistent with the missing compatible thumbnail; a thumbnail
was not generated or validated. Do not treat the icon as proof of either success
or failure. Confirm IFS mapping, bed adhesion and the change after the sixth
white layer. Scan the cooled print from a phone and confirm the URL.

Current physical evidence: the user subsequently reported an entirely white
print. Physical multicolour validation failed; physical QR readability remains
unconfirmed. The latest four-layer test result is pending.
The new official-speed file has only digital validation. Keep these outcomes
separate from successful slicing and QR decoding on simulated toolpaths.

## Credits

ChatGPT (AI conversation and original model, per user confirmation), Codex
(tool execution, website edits, slicing, validation and documentation), user
(project direction, small adjustments and physical printing), Open-Meteo
(forecast data), Flashforge (machine/material profiles), OrcaSlicer (slicing),
ZXing-C++ (QR decoding), GitHub Pages (hosting). No manufacturer endorsement is
claimed. No credentials or secret values are included in this kit.

## Reproduce the reduced 2+2 geometry

This is a test only; the original 11-layer helper must not be used to validate
four-layer output. The included thin input preserves XY and contains 0.4 mm
white and 0.4 mm black. Its vertical transform is documented in the Codex record.
With Shapely 2.2.0 installed, from the kit root:

```sh
python3 -m pip install shapely==2.2.0
python3 fabrication/tests/resize.py 3.285 ./new-reduced-geometry
```

The script preserves the black mesh, reduces the border to the chosen value,
halves the ring including its hole, verifies closed edge incidence and writes
input.3mf. Slice this with the same machine, official process and two filament
profiles documented above, using a new output directory. Check only four layers:
Z=0.2/0.4 in T0 and Z=0.6/0.8 in T1. The physical IFS result remains pending.
