# Netanya Weather · איך זה נוצר / How it was made

**Languages: עברית · English**  
**Live dashboard:** https://haymvi.github.io/netanya-weather/  
**Visual step-by-step tutorial / מדריך חזותי:** [עברית](howto.html?lang=he) · [English](howto.html?lang=en)

---

# עברית — מדריך מלא

## 1. מה בונים?

עמוד מזג אוויר חי לנתניה, עם מידע לגלישת גלים, גלישת רוח וקייטסרפינג, וקוד QR שמפנה אליו ממחזיק מפתחות מודפס בתלת־ממד. האתר מתעדכן עצמאית מהמחזיק: כל עוד הכתובת הציבורית נשמרת, הקוד המודפס נשאר תקף.

הדפסה דו־צבעית של המחזיק **הצליחה בפועל** במדפסת Flashforge AD5X, לאחר הפעלת **Enable IFS** במסך המדפסת.

## 2. בניית אתר מזג האוויר

האתר בנוי מ־HTML/CSS/JavaScript ופועל כאתר סטטי ב־GitHub Pages. אין צורך בשרת יישומים, חשבון משתמש או מפתח API לשימוש הלא־מסחרי של Open-Meteo בהתאם לתנאי השירות.

קבצים מרכזיים:

- **index.html** — האתר הראשי.
- **sports.js** — מידע, גרפים והסברים על גלישה, רוח וים.
- **sports.css** — עיצוב המידע הימי.
- **howto.html** — מדריך חזותי בעברית ובאנגלית.
- **HOWTO.md** — ההוראות הטכניות האלה.

פרטי מיקום:

| פרמטר | ערך |
|---|---|
| תחזית יבשתית | 32.3215°N, 34.8532°E |
| נקודת מודל בים | 32.33°N, 34.80°E |
| אזור זמן | Asia/Jerusalem |
| רענון האתר | כל 15 דקות |

מקורות:

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs) — טמפרטורת אוויר, רוח, משבים, גשם, לחות, UV ועוד.
- [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api) — גובה/כיוון/מחזור גלים, סוואל, גלי רוח ותחזית טמפרטורת פני הים.
- [ISRAMAR Hadera — מדידת טמפרטורת מים ומליחות](https://isramar.ocean.org.il/isramar2009/station/HaderaCTD.aspx).
- [ISRAMAR Hadera — מדידות גלים וזרמים](https://isramar.ocean.org.il/isramar2009/station/HaderaRDI.aspx).

**כלל נתונים:** תחזית מודל אינה מדידת מכשיר. אין להציג נתון חסר כ־0, או נתון מודל כאילו נמדד בחוף. מקורות חדרה מוצגים להשוואה, ואין לייחס אותם ישירות לחוף בנתניה.

האתר נפתח בעברית, `lang="he"` ו־`dir="rtl"`, ומאפשר מעבר לאנגלית, `lang="en"` ו־`dir="ltr"`. בחירת השפה נשמרת בדפדפן.

## 3. העלאה ל־GitHub Pages

1. נכנסים ל־[GitHub](https://github.com) ויוצרים מאגר **Public** בשם `netanya-weather`.
2. במאגר חדש וריק: לוחצים על **uploading an existing file** מתחת ל־Quick setup. במאגר שכבר מכיל קבצים: **Add file → Upload files**.
3. מעלים את `index.html`, `sports.js`, `sports.css` ושאר קבצי האתר ולוחצים על **Commit changes**.
4. פותחים **Settings → Pages → Deploy from a branch → main → /(root) → Save**. אם כבר קיימת פריסה דרך GitHub Actions, שומרים על השיטה הקיימת.
5. מחכים שהפריסה תושלם, פותחים את הכתובת בטלפון ובודקים את התצוגה בשתי השפות.

הכתובת של הפרויקט הזה:

**https://haymvi.github.io/netanya-weather/**

זוהי הכתובת המדויקת שיש לקודד ב־QR. **אין לקודד כתובת של קובץ GitHub או קישור לתצוגת המאגר.**

## 4. יצירת QR ומודל תלת־ממדי

1. יוצרים קוד QR מהכתובת המלאה בעזרת מחולל שמאפשר ייצוא **SVG**.
2. שומרים מודולים שחורים, רקע לבן, ללא לוגו חוסם ומומלץ להשאיר **אזור שקט של ארבעה מודולים לפחות** מכל צד.
3. סורקים את ה־SVG בטלפון ובודקים שהוא פותח את האתר.
4. ממירים את המודולים השחורים לגאומטריה מוצקה ומוגבהת, ומוסיפים בסיס לבן וטבעת/חור למפתחות. המודולים אינם תמונה שמודבקת על פני השטח.
5. מייצאים STL או שני רכיבים מיושרים המאפשרים שיוך צבעים ב־OrcaSlicer.

מידות **נומינליות** של דגם הבדיקה:

| רכיב | גובה Z | צבע |
|---|---|---|
| בסיס וטבעת | 0–0.40 mm | לבן, פילמנט 1 |
| מודולי QR מוגבהים | 0.40–0.80 mm | שחור, פילמנט 2 |
| גובה כולל | 0.80 mm | שני צבעים |

רוחב הדגם היה כ־**41.43 mm** וגובהו כולל הטבעת כ־**47.88 mm**. טבעת בעובי 0.4 mm דקה יחסית; להפקה קבועה יש לבדוק עמידות ולשקול עיבוי.

## 5. הגדרת OrcaSlicer למדפסת AD5X

1. פותחים **OrcaSlicer / Orca-Flashforge** ובוחרים **Flashforge AD5X, nozzle 0.4 mm**.
2. לעבודת הבדיקה הקיימת פותחים את **QR_4_CAMADAS.3mf**, ששומר את שיוך שני הפילמנטים. אם מתחילים מקובץ STL בלבד, משייכים את הבסיס והחלקים המוגבהים באמצעות חלקים מיושרים או כלי **Color Painting → Height Range**, לפי המבנה.
3. מגדירים **Filament 1 = PLA לבן** ו־**Filament 2 = PLA שחור**.
4. מוודאים שהבסיס והטבעת הם חומר 1 וה־QR הבולט הוא חומר 2.
5. כדי לתכנן בדיוק שתי שכבות של 0.20 mm בכל צבע, מגדירים גם **First layer height = 0.20 mm** וגם **Layer height = 0.20 mm**. פרופיל של 0.16 mm לשכבות הרגילות עלול להפיק מספר שכבות אחר; יש לבדוק את הגובה בפועל.
6. לוחצים **Slice plate → Preview**, בוחרים **Filament** ומוודאים שהחלק התחתון לבן, החלק העליון שחור ויש מעבר כלי ביניהם.

צבעים נכונים ב־Preview אינם מחליפים בדיקה של שיוך הפילמנטים ושל פקודות ההדפסה.

## 6. שמירת הפרויקט וייצוא G-code

- **File → Save Project As → .3mf**: שמירה של הפרויקט הניתן לעריכה, כולל הגאומטריה והגדרות הפילמנטים.
- **Export plate sliced file → .gcode**: הקובץ החתוך שהמדפסת תפעיל.

בקובץ G-code אפשר לחפש את הפקודות **T0** (פילמנט ראשון) ו־**T1** (פילמנט שני), ולבדוק שהמעבר נמצא בגובה Z המתאים. בהדפסה שבוצעה בפועל, הפקודות האלה היו בקובץ והחלפת הצבע הופעלה בהצלחה לאחר הפעלת IFS.

## 7. ההדפסה ב־Flashforge AD5X — **Enable IFS הוא שלב חובה**

1. מוודאים כי **ערוץ פיזי 1 של IFS מכיל PLA לבן**, ו־**ערוץ פיזי 2 מכיל PLA שחור**.
2. מעבירים למדפסת את קובץ ה־**G-code** המתאים ל־AD5X, למשל באמצעות USB.
3. **בוחרים את קובץ ההדפסה במסך המדפסת. מיד לאחר בחירת הקובץ מפעילים את האפשרות Enable IFS.**
4. מוודאים שהיא נשארת פעילה ורק אז לוחצים **Print / Start**.
5. עוקבים אחרי ההדפסה: בסיס לבן תחילה, מעבר אוטומטי לפילמנט השחור, ואז הדפסת מודולי ה־QR.

**זהו סדר הפעולות שנבדק בהדפסה פיזית והצליח.** אין צורך לייצר מחדש את הגאומטריה או ה־G-code כדי לבצע את אותה החלפה בקובץ שכבר הוכח.

ל־G-code ול־3MF חתוך קיימים מסלולי מיפוי ערוצי IFS שונים. המדריך כאן מתייחס לקובץ ה־**G-code** שהודפס בהצלחה.

## 8. בדיקת איכות

1. מקררים את המשטח ומסירים את המחזיק בזהירות.
2. בודקים שהבסיס/הטבעת לבנים ושה־QR המוגבה שחור.
3. **סורקים את ההדפסה הפיזית בטלפון** ובודקים שהכתובת הנכונה נפתחת.
4. בודקים את חוזק הטבעת לפני שימוש יומיומי.
5. שומרים ביחד את קובץ ה־STL, הפרויקט `.3mf`, קובץ `.gcode` ואת הגדרות המדפסת.

**אימות:** החלפת הצבע בהדפסה הפיזית הצליחה. סריקה ועמידות הן בדיקות נפרדות לכל חלק.

## 9. תחזוקה

ניתן לעדכן את `index.html`, `sports.js` ו־`sports.css`, לבצע Commit ולהמתין לעדכון GitHub Pages. יש **לשמור על הכתובת הציבורית** כדי שה־QR המודפס ימשיך לעבוד. עדכון תחזית, טקסט או עיצוב אינו מצריך G-code חדש.

---

# English — Complete build guide

## 1. What are we building?

A live Netanya weather dashboard with surf, windsurf and kitesurf forecasts, accessed from a QR code on a two-colour 3D-printed keyring. The website can be updated independently of the printed object. As long as its public URL stays the same, existing QR codes remain valid.

**The physical two-colour print succeeded** on a Flashforge AD5X after the **Enable IFS** option was activated on the printer screen.

## 2. Build the weather website

The site uses static HTML, CSS and JavaScript hosted on GitHub Pages. No custom application server or login is necessary. Open-Meteo provides key-free access for eligible non-commercial use, subject to its terms.

Core files:

- **index.html** — live weather homepage.
- **sports.js** — surf, windsurf and kitesurf metrics and source information.
- **sports.css** — layout and styles for marine forecasts.
- **howto.html** — responsive Hebrew/English tutorial.
- **HOWTO.md** — these technical instructions.

| Parameter | Value |
|---|---|
| City weather reference | 32.3215°N, 34.8532°E |
| Offshore marine reference | 32.33°N, 34.80°E |
| Timezone | Asia/Jerusalem |
| Refresh interval | 15 minutes |

Data sources:

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs) — air temperature, wind, gusts, rain, humidity, UV and related variables.
- [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api) — wave height/direction/period, swell, wind waves and modelled sea-surface temperature.
- [ISRAMAR Hadera — measured water temperature and salinity](https://isramar.ocean.org.il/isramar2009/station/HaderaCTD.aspx).
- [ISRAMAR Hadera — measured waves and currents](https://isramar.ocean.org.il/isramar2009/station/HaderaRDI.aspx).

**Data rule:** distinguish model forecasts from instrument measurements. Do not display missing values as zero or pass model output off as a local beach observation. Hadera stations are a nearby reference, not on-beach Netanya instruments.

Default interface: Hebrew, `lang="he"` / `dir="rtl"`. Optional English: `lang="en"` / `dir="ltr"`. Store the preference in the browser.

## 3. Publish with GitHub Pages

1. Sign in to [GitHub](https://github.com) and create a **Public** repository called `netanya-weather`.
2. In an empty repository use **uploading an existing file** under Quick setup. In an existing repository use **Add file → Upload files**.
3. Upload `index.html`, `sports.js`, `sports.css` and supporting site files; click **Commit changes**.
4. Select **Settings → Pages → Deploy from a branch → main → /(root) → Save**. Preserve an existing GitHub Actions deployment if one is already configured.
5. Wait for deployment. Open the published HTTPS URL on a phone and test both languages.

The current published site is **https://haymvi.github.io/netanya-weather/**.

Use this **exact published URL** for the QR, not a GitHub source-code link.

## 4. Generate the QR and 3D geometry

1. Generate a vector **SVG** QR code containing the published HTTPS URL.
2. Use black modules over white, no central obstruction, and ideally a **quiet zone of at least four modules** on each side.
3. Scan the QR image to verify the URL before creating geometry.
4. Convert the black vector modules into real raised solids. Add a white backing body and integral keyring loop.
5. Export aligned multi-part geometry or an STL that can be assigned by height in OrcaSlicer.

**Nominal thin-test geometry:**

| Component | Nominal Z | Filament |
|---|---|---|
| Base and loop | 0–0.40 mm | White / 1 |
| Raised QR | 0.40–0.80 mm | Black / 2 |
| Total thickness | 0.80 mm | Two materials |

The test model was approximately **41.43 mm wide** and **47.88 mm tall including the loop**. A 0.4 mm thick loop is mechanically delicate and should be strengthened for long-term use as a keyring.

## 5. Configure OrcaSlicer for AD5X

1. Select **Flashforge AD5X, 0.4 mm nozzle** in OrcaSlicer or Orca-Flashforge.
2. For the working model, open `QR_4_CAMADAS.3mf`, which contains the two material assignments. When starting from STL, import aligned parts or use **Color Painting → Height Range**, as the geometry permits.
3. Configure **Filament 1 = white PLA** and **Filament 2 = black PLA**.
4. Verify that base/loop use material 1 and upper QR modules use material 2.
5. To obtain exactly two 0.20 mm layers per colour, set **both first-layer height and regular layer height to 0.20 mm**. A regular-layer preset of 0.16 mm can produce a different actual layer count.
6. Choose **Slice plate → Preview → Filament**. Confirm the white base, black raised QR and planned tool transition.

A two-colour visual preview is not a substitute for proper material assignment and tool-change instructions.

## 6. Save the project and export G-code

- **File → Save Project As → .3mf:** editable geometry, material mapping and slicer settings.
- **Export plate sliced file → .gcode:** the actual sliced toolpaths for the printer.

Inspect the G-code for **T0** (first filament) and **T1** (second filament) at the appropriate Z transition. Those tool selections were already present in the successfully printed test file.

## 7. Print on Flashforge AD5X — **Enable IFS is mandatory**

1. Load the IFS with **physical slot 1 = white PLA** and **physical slot 2 = black PLA**.
2. Transfer the correctly sliced **G-code** to the AD5X, e.g. with USB.
3. **Select the print file on the printer screen. Immediately after file selection, turn ON the Enable IFS option.**
4. Verify that IFS remains enabled, then press **Print / Start**.
5. Observe the automatic transition from the white base to the raised black QR.

**This exact sequence was confirmed by a successful physical two-colour print.** There is no need to regenerate a known-good STL/3MF/G-code solely to perform the same colour change.

The printer's sliced-3MF workflow may use different channel-mapping screens. These steps document the **G-code** workflow that succeeded.

## 8. Quality control

1. Allow the build plate to cool; remove the part carefully.
2. Verify the white base/loop and raised black QR modules.
3. **Scan the printed QR with a phone** and confirm it opens the exact website URL.
4. Evaluate the loop's strength before using it as a daily keyring.
5. Preserve the STL, editable 3MF, G-code, slicer profile and material mapping together.

**Confirmed:** the physical filament colour change succeeded. QR scanning and mechanical strength must be checked separately for every finished part.

## 9. Maintain the website

Update `index.html`, `sports.js` or `sports.css`, commit to GitHub and wait for Pages deployment. **Keep the public URL unchanged** so existing printed codes continue to work. Updating weather displays, text or layout does not require another 3D print.

---

**Credits / קרדיטים:** Project requirements and physical testing by the user, with technical assistance from ChatGPT and Codex. GitHub Pages hosting; Open-Meteo forecasts; ISRAMAR observation references; OrcaSlicer slicing; Flashforge AD5X IFS printing.
