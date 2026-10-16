/* Netanya sports forecast. Model output, not observations or a surf/safety score. */
(() => {
  'use strict';
  const state = { lang: 'he', sport: 'surf', hours: 24, weather: null, marine: null, sst: null, coastal: null,
    weatherStatus: 'loading', marineStatus: 'loading', sstStatus: 'loading', coastalStatus: 'loading', weatherFetched: null, marineFetched: null, sstFetched: null, coastalFetched: null, errors: {}, sstProvenance:'', urls: {} };
  const copy = {
    en: {
      title: 'Netanya · Surf & Wind', sub: 'Surf first. Swell, wind sea and wind forecasts for Netanya, Israel.',
      model: 'Model forecast · not a beach observation', surf: 'Surf', windsurf: 'Windsurf', kite: 'Kitesurf',
      surfGuide: 'Read wave height together with period and direction, then compare swell, wind sea and wind. These describe the modelled sea state; the height and shape of breaking waves at your particular beach are not supplied. [M]',
      windsurfGuide: 'Prioritise wind speed, direction and gusts, then compare the wave height and period for the sea state. The wind forecast is at 10 m above ground, not a measurement at the launch or at sail height. No equipment or skill-based suitability rating is calculated. [W, M]',
      kiteGuide: 'Compare wind speed, direction and gusts with the sea state, visibility and daylight. Check the actual launch, local rules and conditions with a local operator. No automatic “safe to launch” or kite-size recommendation is provided. [W, M, R]',
      hour: 'Forecast valid at', local: 'Netanya time · Asia/Jerusalem', loading: 'Loading forecast…', unavailable: 'Unavailable', ready: 'Available', refreshing: 'Refreshing…',
      seaState: 'Combined waves · significant height', period: 'Combined-wave period', direction: 'Waves come from', swell: 'Swell · significant height', swellPeak: 'Swell peak period', wind: 'Wind at 10 m', gust: 'Gusts · preceding-hour max', water: 'Water · model estimate, not measured',
      from: 'from', mean: 'Mean period', peak: 'Peak period', windSea: 'Wind sea', component: 'Component', height: 'Height', waves: 'Combined waves',
      components: 'Understand the wave components', notAdd: 'Swell and wind-sea heights are not added arithmetically. Peak period and mean period are different variables. A missing peak value is shown as unavailable, never replaced by the mean. [M]',
      waveNote: 'Significant wave height is not breaking-wave height at the beach or the maximum individual wave. No beach-specific wave height, wave propagation speed, rip-current forecast or current safety assessment is inferred. [M]',
      trend: 'Wave-height outlook', trendNote: 'Combined significant height and swell height · metres [M]', noChart: 'No wave-height series available.', combinedLegend: 'Combined Hs', swellLegend: 'Swell Hs',
      hourly: 'Hourly surf & wind forecast', h24: '24 hours', h48: '48 hours', tableHint: 'Scroll horizontally for all columns. Every timestamp is local to Netanya. “—” means missing model data, not zero.',
      time: 'Time', waveCol: 'Waves: m / s / from', swellCol: 'Swell: m / peak s', windCol: 'Wind: kn · km/h', gustCol: 'Gust: kn · km/h', windDir: 'Wind from', tempCol: 'Model water / air: °C', uvRain: 'UV / rain chance',
      extra: 'Air, daylight & exposure', air: 'Air temperature', daylight: 'Sunrise / sunset', uv: 'UV index', rain: 'Rain probability / precipitation', visibility: 'Visibility',
      sources: 'Sources, location & what this page can tell you', seaSource: 'Marine data', weatherSource: 'Wind & weather data', sstSource: 'Water temperature model', modelSst: 'No local measurement is integrated. Open-Meteo sea-surface-temperature model estimate; not a verified beach reading.', distance: 'Distance from Netanya reference', sstNote: 'Water temperature comes from a separate Open-Meteo Marine request using automatic Best Match selection. It is not a thermometer reading in Netanya. A full day can contain the same model value; a 15-minute refresh does not create a new measurement.', sourceSst: 'Open-Meteo Marine API Best Match sea-surface temperature. The exact model selected is not identified in the response; it is a forecast, not a beach thermometer. No independent local observation is integrated; the displayed number must not be presented as a verified beach measurement.', docs: 'Documentation', raw: 'Open requested API data', selected: 'Returned model grid point', requested: 'Requested Netanya reference point', fetched: 'Retrieved', valid: 'Sample valid at',
      sourceModel: 'Open-Meteo Marine API · Best Match (automatic model selection). Its documentation lists contributing providers and credits DWD. The API response does not identify the exact contributing model or model-run issue time; neither is invented here.',
      sourceWeather: 'Open-Meteo Forecast API · Best Match. Wind is at 10 m; gust values are preceding-hour maxima. Knots are calculated from the requested km/h using kn = km/h ÷ 1.852. Visibility is converted from metres to kilometres. UV, precipitation and sunrise/sunset come from this same response. [W]',
      locationNote: 'This is a reference point for Netanya, not a named surf break. The marine request selects a sea grid cell; the returned coordinates can differ from the requested coordinates. Coastal bathymetry, sandbars, shelter, water quality, access restrictions and rip currents are not resolved by this page. No onshore/offshore label is assigned without a verified launch orientation.',
      freshness: 'The page requests an update every 15 minutes. This does not mean a new model run or a new beach measurement exists every 15 minutes. “Retrieved” is the browser retrieval time; “valid at” is forecast time, not model issue time. Nulls and failed services remain unavailable.',
      official: 'Before entering the water: check official Israeli forecasts/warnings and local beach information.',
      ims: 'Israel Meteorological Service', rnli: 'RNLI activity guidance: surf, windsurf & kitesurf',
      glossary: 'How to read this for surfing', glossaryText: 'Height describes the modelled sea state; period describes the time between waves; direction says where waves come from (0° N, 90° E, 180° S, 270° W). Compare all three, rather than interpreting one number as a surf-quality score. Swell and locally wind-generated sea are shown separately. The response provides periods, not wave travel speed. Wind speed is not wave speed. [M, W]',
      sourceM: '[M] Open-Meteo Marine API: variables, units, direction conventions, model coverage and limitations', sourceW: '[W] Open-Meteo Forecast API: wind, gusts, UV, rain, visibility and sunrise/sunset', sourceR: '[R] RNLI activity-specific guidance (external reference; not local beach clearance)',
      noRows: 'Hourly forecast unavailable. Independent wind or wave data may still be shown above.', general: 'General weather · temperature, rain & five days',
      errorSea: 'Marine request failed: no current marine values are displayed.', errorWeather: 'Weather request failed: no current wind or weather values are displayed.',
      sample: 'Hourly samples; not real-time observations', sourceLink: 'Source', snapshot: 'Weather and marine timestamps are shown separately below. Values are matched only to the same local forecast hour.',
    },
    he: {
      title: 'נתניה · גלישה ורוח', sub: 'קודם כול גלישת גלים. תחזית סוואל, גלי רוח ורוח לנתניה, ישראל.',
      model: 'תחזית מודל · לא תצפית מהחוף', surf: 'גלישת גלים', windsurf: 'גלישת רוח', kite: 'קייטסרפינג',
      surfGuide: 'בודקים גובה גלים יחד עם מחזור וכיוון, ומשווים בין סוואל, גלי רוח והרוח. אלה מתארים את מצב הים במודל; גובה וצורת הגלים הנשברים בחוף המסוים אינם מסופקים. [M]',
      windsurfGuide: 'מתמקדים במהירות הרוח, בכיוון ובמשבים, ובוחנים גם גובה ומחזור גלים. תחזית הרוח מתייחסת לגובה 10 מטר מעל הקרקע, ולא למדידה בנקודת הכניסה או בגובה המפרש. לא מחושב דירוג התאמה לציוד או לרמת הגולש. [W, M]',
      kiteGuide: 'משווים מהירות, כיוון ומשבי רוח למצב הים, לראייה ולאור היום. בודקים את נקודת הכניסה, הכללים והתנאים עם גורם מקומי. לא ניתנת המלצת גודל קייט או קביעה אוטומטית שבטוח לצאת. [W, M, R]',
      hour: 'תוקף התחזית', local: 'זמן נתניה · Asia/Jerusalem', loading: 'טוען תחזית…', unavailable: 'לא זמין', ready: 'זמין', refreshing: 'מעדכן…',
      seaState: 'גלים משולבים · גובה משמעותי', period: 'מחזור הגלים המשולבים', direction: 'הגלים מגיעים מכיוון', swell: 'סוואל · גובה משמעותי', swellPeak: 'מחזור שיא של הסוואל', wind: 'רוח בגובה 10 מטר', gust: 'משבים · מרב בשעה הקודמת', water: 'מים · הערכת מודל, לא מדידה',
      from: 'מכיוון', mean: 'מחזור ממוצע', peak: 'מחזור שיא', windSea: 'גלי רוח', component: 'רכיב', height: 'גובה', waves: 'גלים משולבים',
      components: 'רכיבי הגלים — מה ההבדל?', notAdd: 'אין לחבר את גובה הסוואל וגובה גלי הרוח בחיבור רגיל. מחזור שיא ומחזור ממוצע הם משתנים שונים. ערך שיא חסר מוצג כחסר ואינו מוחלף במחזור הממוצע. [M]',
      waveNote: 'גובה גלים משמעותי אינו גובה הגל הנשבר בחוף ואינו גובה הגל הבודד המרבי. אין כאן חישוב של גובה שבירה מקומי, מהירות התקדמות הגל, תחזית זרמי סחף או קביעה שהים בטוח. [M]',
      trend: 'מגמת גובה הגלים', trendNote: 'גובה משמעותי משולב וגובה סוואל · במטרים [M]', noChart: 'סדרת גובה גלים אינה זמינה.', combinedLegend: 'גובה משולב', swellLegend: 'גובה סוואל',
      hourly: 'תחזית שעתית לגלים ולרוח', h24: '24 שעות', h48: '48 שעות', tableHint: 'אפשר לגלול לצדדים לכל העמודות. כל הזמנים הם זמני נתניה. ״—״ מציין נתון חסר, ולא אפס.',
      time: 'שעה', waveCol: 'גלים: מ׳ / שנ׳ / מכיוון', swellCol: 'סוואל: מ׳ / שנ׳ שיא', windCol: 'רוח: קשר · קמ״ש', gustCol: 'משב: קשר · קמ״ש', windDir: 'הרוח מכיוון', tempCol: 'מים במודל / אוויר: °C', uvRain: 'UV / סיכוי לגשם',
      extra: 'אוויר, אור יום וחשיפה', air: 'טמפרטורת האוויר', daylight: 'זריחה / שקיעה', uv: 'מדד UV', rain: 'סיכוי לגשם / משקעים', visibility: 'ראות',
      sources: 'מקורות, מיקום וגבולות המידע', seaSource: 'נתוני ים', weatherSource: 'נתוני רוח ומזג אוויר', sstSource: 'מודל טמפרטורת מים', modelSst: 'אין מדידה מקומית מחוברת. הערכת מודל טמפרטורת פני ים של Open-Meteo, לא מדידת חוף מאומתת.', distance: 'מרחק מנקודת הייחוס בנתניה', sstNote: 'טמפרטורת המים מגיעה מבקשה נפרדת ל־Open-Meteo בבחירת מודל אוטומטית. זו אינה מדידת מדחום בנתניה. אותו ערך עשוי להופיע יום שלם; עדכון כל 15 דקות אינו יוצר מדידה חדשה.', sourceSst: 'טמפרטורת פני הים היא הערכת מודל Open-Meteo בבחירה אוטומטית. תשובת ה־API אינה מזהה את המודל המדויק. אין חיישן חוף מקומי מחובר. לא משולבת תצפית מקומית עצמאית; אין להציג את המספר כמדידת חוף מאומתת.', docs: 'תיעוד', raw: 'פתיחת נתוני ה־API שהתבקשו', selected: 'נקודת רשת המודל שהוחזרה', requested: 'נקודת הייחוס המבוקשת בנתניה', fetched: 'מועד השליפה', valid: 'מועד תוקף הנתון',
      sourceModel: 'Open-Meteo Marine API · Best Match — בחירת מודלים אוטומטית. התיעוד מפרט ספקי מודלים ונותן קרדיט ל־DWD. תשובת ה־API אינה מזהה את המודל המדויק שתרם כל ערך או את מועד הרצת המודל; אין להמציא אותם.',
      sourceWeather: 'Open-Meteo Forecast API · Best Match. רוח בגובה 10 מטר; משבים הם מרב השעה הקודמת. קשרים מחושבים מקמ״ש באמצעות חלוקה ב־1.852. ראות מומרת ממטרים לקילומטרים. UV, משקעים וזריחה/שקיעה מגיעים מאותה תשובה. [W]',
      locationNote: 'זו נקודת ייחוס לנתניה, ולא ספוט גלישה מסוים. הבקשה הימית בוחרת תא רשת בים; הקואורדינטות שהוחזרו עשויות להיות שונות מהמבוקשות. עומק מקומי, שרטונות, מחסה, איכות מים, מגבלות כניסה וזרמי סחף אינם נפתרים בעמוד זה. לא מסווגים רוח כיבשתית או ימית בלי כיוון חוף מאומת בנקודת הכניסה.',
      freshness: 'העמוד מבקש עדכון כל 15 דקות. אין פירוש הדבר שיש הרצת מודל או מדידה חדשה בחוף בכל 15 דקות. מועד השליפה הוא זמן קבלת הנתונים בדפדפן; מועד התוקף הוא זמן התחזית ולא זמן הרצת המודל. ערכים חסרים ושירותים שכשלו נשארים לא זמינים.',
      official: 'לפני כניסה למים: בודקים תחזיות ואזהרות רשמיות בישראל ומידע מקומי בחוף.',
      ims: 'השירות המטאורולוגי הישראלי', rnli: 'הנחיות RNLI לגלישת גלים, רוח וקייט',
      glossary: 'איך לקרוא את הנתונים לגלישת גלים', glossaryText: 'גובה מתאר את מצב הים במודל; מחזור מתאר את הזמן בין הגלים; הכיוון מציין מהיכן הגלים מגיעים (0° צפון, 90° מזרח, 180° דרום, 270° מערב). בוחנים את שלושתם ולא הופכים מספר יחיד לציון איכות גלישה. סוואל וים שנוצר מרוח מוצגים בנפרד. התשובה מספקת מחזורים, לא מהירות התקדמות גלים. מהירות הרוח אינה מהירות הגל. [M, W]',
      sourceM: '[M] Open-Meteo Marine API: משתנים, יחידות, כיוונים, כיסוי מודלים ומגבלות', sourceW: '[W] Open-Meteo Forecast API: רוח, משבים, UV, גשם, ראות וזריחה/שקיעה', sourceR: '[R] הנחיות RNLI לפי פעילות (מקור חיצוני, לא אישור לחוף המקומי)',
      noRows: 'התחזית השעתית אינה זמינה. ייתכן שנתוני גלים או רוח עצמאיים עדיין מוצגים למעלה.', general: 'מזג אוויר כללי · טמפרטורה, גשם וחמישה ימים',
      errorSea: 'בקשת הים נכשלה: לא מוצגים ערכי ים עדכניים.', errorWeather: 'בקשת מזג האוויר נכשלה: לא מוצגים ערכי רוח או מזג אוויר עדכניים.',
      sample: 'נתונים שעתיים; לא תצפיות בזמן אמת', sourceLink: 'מקור', snapshot: 'זמני תחזית הים ומזג האוויר מוצגים בנפרד בהמשך. ערכים מותאמים רק לאותה שעת תחזית מקומית.',
    }
  };
  Object.assign(copy.en,{
    secondSwell:'Secondary swell',secondSwellNote:'Some models do not return secondary swell. Missing does not mean zero.',
    coast:'Ocean current (model)',coastDir:'Ocean current flows towards',seaLevel:'Sea level above mean sea level (model)',
    coastWarning:'Offshore ocean-model currents are NOT rip-current measurements. Sea-level model output is NOT a local tide table.',
    offshore:'Marine point: 32.3300°N, 34.8000°E (offshore); meteorological point: Netanya (city). Returned grid cells may differ.',
    sevenDays:'Seven-day offshore wave outlook',dayLabel:'Day',maxCombined:'Max combined waves',maxSwell:'Max swell',maxWindSea:'Max wind waves',maxPeriod:'Max period',noDaily:'Daily marine data unavailable.',
    officialChecks:'Israeli official forecasts and observations',officialNote:'Independent links only. IMS alerts and Hadera measurements are NOT automatically collected by this page.',
    imsCoast:'IMS coastal forecast (sea temperature, waves, wind)',imsAlerts:'IMS marine alerts',isramarHadera:'ISRAMAR Hadera observed waves / currents',isramarWave:'ISRAMAR wave forecast',
    seaSourceCoastal:'Marine currents / sea level',sourceCoastal:'Open-Meteo ocean-model output. Not local rip-current data or a navigation-quality tide prediction.',errorDetail:'API error'
  });
  Object.assign(copy.he,{
    secondSwell:'סוואל משני',secondSwellNote:'בחלק מהמודלים אין סוואל משני. חוסר בנתון אינו אפס.',
    coast:'זרם ימי (מודל)',coastDir:'כיוון זרימת הזרם',seaLevel:'מפלס ים ביחס לממוצע (מודל)',
    coastWarning:'זרמי מודל בים אינם מדידה של זרמי סחף בחוף. גובה המים במודל אינו טבלת גאות ושפל מקומית.',
    offshore:'נקודת הים: 32.3300° צפון, 34.8000° מזרח (בים). נתוני מזג האוויר: נתניה. נקודת רשת המודל עשויה להשתנות.',
    sevenDays:'תחזית גלים בים ל־7 ימים',dayLabel:'יום',maxCombined:'גובה גלים מרבי',maxSwell:'סוואל מרבי',maxWindSea:'גלי רוח מרביים',maxPeriod:'מחזור מרבי',noDaily:'אין נתונים יומיים לים.',
    officialChecks:'תחזיות ותצפיות רשמיות בישראל',officialNote:'קישורים להשוואה בלבד. אזהרות IMS ומדידות חדרה אינן נאספות אוטומטית באתר.',
    imsCoast:'תחזית חופי IMS (מים, גלים, רוח)',imsAlerts:'אזהרות ים IMS',isramarHadera:'מדידות גלים וזרמים בחדרה — ISRAMAR',isramarWave:'תחזית גלים ISRAMAR',
    seaSourceCoastal:'זרמי ים ומפלס ים',sourceCoastal:'מודל אוקייני Open-Meteo. לא מדידת זרמי סחף ולא תחזית גאות לשיט.',errorDetail:'שגיאת API'
  });
  Object.assign(copy.en,{
    observedTitle:'Observed sea conditions · Hadera station',
    observedNote:'Hadera is north of Netanya. These are instrument observations on the source website, not measurements at Netanya beach. Open the original to check the latest timestamp and sensor depth. Measurements are not copied or republished here.',
    haderaWater:'Hadera · measured water temperature and salinity',
    haderaWaves:'Hadera · measured waves, peak period and currents',
    modelTime:'Model valid at',modelProvider:'Model product',
    missingSst:'No valid model SST value. See the measured Hadera station or IMS coastal forecast.',
    camsTitle:'Live beach cameras · Netanya',camsNote:'External camera operators. Streams may occasionally be offline.',
    kontiki:'Kontiki beach camera',poleg:'Poleg beach camera',
    sstCompare:'Check actual measurements at Hadera'
  });
  Object.assign(copy.he,{
    observedTitle:'תנאי ים נמדדים · תחנת חדרה',
    observedNote:'חדרה נמצאת מצפון לנתניה. אלה מדידות מכשירים באתר המקור, לא מדידות מחוף נתניה. יש לבדוק שם את זמן המדידה ואת עומק החיישן. אין כאן העתקה או פרסום מחדש של המדידות.',
    haderaWater:'חדרה · טמפרטורת מים ומליחות נמדדות',
    haderaWaves:'חדרה · גלים, מחזור שיא וזרמים נמדדים',
    modelTime:'מועד תוקף המודל',modelProvider:'מוצר המודל',
    missingSst:'אין כרגע ערך תקין לטמפרטורת הים במודל. בדקו את תחנת חדרה או תחזית חופי IMS.',
    camsTitle:'מצלמות חוף בשידור חי · נתניה',camsNote:'המצלמות מופעלות על ידי צדדים שלישיים. השידור עשוי להיות לא זמין לעיתים.',
    kontiki:'מצלמת חוף קונטיקי',poleg:'מצלמת חוף פולג',
    sstCompare:'בדקו מדידות אמיתיות בחדרה'
  });
  const t = k => copy[state.lang][k] || k;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const finite = v => typeof v === 'number' && Number.isFinite(v);
  const num = (v, digits=1) => finite(v) ? v.toLocaleString(state.lang==='he'?'he-IL':'en-GB', {minimumFractionDigits:digits, maximumFractionDigits:digits, useGrouping:false}) : '—';
  const kn = v => finite(v) ? v / 1.852 : null;
  const speed = v => `${num(kn(v))} kn · ${num(v)} km/h`;
  const distance = data => { if(!finite(data?.latitude)||!finite(data?.longitude))return null;const r=x=>x*Math.PI/180;const a=Math.sin(r(data.latitude-32.3215)/2)**2+Math.cos(r(32.3215))*Math.cos(r(data.latitude))*Math.sin(r(data.longitude-34.8532)/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a))); };
  const localHour = () => {
    const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const p = Object.fromEntries(parts.map(x=>[x.type,x.value])); return `${p.year}-${p.month}-${p.day}T${p.hour}`;
  };
  const validISO = v => typeof v==='string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v);
  // Anchor on now in the destination timezone, not the viewer's timezone or a stale previous response.
  const anchor = () => localHour();
  const index = (data, hour) => Array.isArray(data?.hourly?.time) ? data.hourly.time.findIndex(x=>validISO(x) && x.slice(0,13)===hour) : -1;
  const value = (data,key,hour) => { const i=index(data,hour); const v=i>=0?data?.hourly?.[key]?.[i]:null; return finite(v)?v:null; };
  const current = (data,key,hour) => { const h=value(data,key,hour); if(h!==null)return h; return validISO(data?.current?.time) && data.current.time.slice(0,13)===hour && finite(data.current[key])?data.current[key]:null; };
  function sstSample(data,hour) {
    if(!data)return null;
    const target=Date.parse(hour+':00:00Z');
    const good=v=>finite(v)&&v>=-2&&v<=45;
    const options=[];
    if(good(data?.current?.sea_surface_temperature)&&validISO(data?.current?.time))
      options.push({time:data.current.time,value:data.current.sea_surface_temperature});
    const times=data?.hourly?.time||[],temps=data?.hourly?.sea_surface_temperature||[];
    for(let i=0;i<times.length;i++)
      if(validISO(times[i])&&good(temps[i]))options.push({time:times[i],value:temps[i]});
    const available=options.map(x=>({...x,diff:Math.abs(Date.parse(x.time+':00Z')-target)}))
      .filter(x=>Number.isFinite(x.diff)&&x.diff<=12*3600000)
      .sort((a,b)=>a.diff-b.diff);
    return available[0]||null;
  }
  const dirs = {en:['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'],he:['צפון','צפון־צפון־מזרח','צפון־מזרח','מזרח־צפון־מזרח','מזרח','מזרח־דרום־מזרח','דרום־מזרח','דרום־דרום־מזרח','דרום','דרום־דרום־מערב','דרום־מערב','מערב־דרום־מערב','מערב','מערב־צפון־מערב','צפון־מערב','צפון־צפון־מערב']};
  const direction = v => finite(v) && v>=0 && v<=360 ? `${dirs[state.lang][Math.round(v/22.5)%16]} · ${num(v,0)}°` : '—';
  const stamp = v => validISO(v) ? `${v.slice(8,10)}/${v.slice(5,7)} ${v.slice(11,16)}` : '—';
  const fetched = v => v ? new Intl.DateTimeFormat(state.lang==='he'?'he-IL':'en-GB',{timeZone:'Asia/Jerusalem',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(v) : '—';
  const source = id => `<a class="surf-source-ref" href="#source-${id}" aria-label="${escape(t('sourceLink'))} ${id.toUpperCase()}">[${id.toUpperCase()}]</a>`;
  const cited = text => escape(text).replace(/\[([MWR](?:,\s*[MWR])*)\]/g,(_,ids)=>ids.split(',').map(id=>source(id.trim().toLowerCase())).join(' '));
  const metric = (id,label,content,note,src='m') => `<article class="surf-metric"><div class="surf-label">${escape(t(label))} ${source(src)}</div><div class="surf-value" id="${id}" dir="ltr">${escape(content)}</div>${note?`<div class="surf-note">${escape(note)}</div>`:''}</article>`;
  function status(which) { const s=state[which+'Status'];return t(s==='ready'?'ready':s==='loading'?'loading':s==='refreshing'?'refreshing':'unavailable'); }
  function rows() {
    const keys = new Set([...(state.marine?.hourly?.time||[]),...(state.weather?.hourly?.time||[]),...(state.sst?.hourly?.time||[])]);
    return [...keys].filter(v=>validISO(v) && v.slice(0,13)>=anchor()).sort().slice(0,state.hours);
  }
  function chart(times) {
    const values=times.flatMap(h=>[value(state.marine,'wave_height',h.slice(0,13)),value(state.marine,'swell_wave_height',h.slice(0,13))]).filter(finite);
    if(!values.length)return `<p>${escape(t('noChart'))}</p>`;
    const max=Math.max(.5,...values)*1.15, W=820,H=180,left=42,right=12,bottom=145,top=15;
    const x=i=>left+i*(W-left-right)/Math.max(1,times.length-1),y=v=>bottom-v/max*(bottom-top);
    let paths='';
    for(const [key,color] of [['wave_height','#ffffff'],['swell_wave_height','#72e1d4']]) {
      let d='',pen=false;
      times.forEach((h,i)=>{const v=value(state.marine,key,h.slice(0,13));if(v===null){pen=false;return;}d+=`${pen?'L':'M'}${x(i).toFixed(1)},${y(v).toFixed(1)} `;pen=true;});
      paths+=`<path d="${d}" fill="none" stroke="${color}" stroke-width="3"/>`;
    }
    const grid=[0,max/2,max].map(v=>`<line x1="${left}" y1="${y(v)}" x2="${W-right}" y2="${y(v)}" stroke="#ffffff25"/><text x="${left-8}" y="${y(v)+4}" text-anchor="end" fill="#d3e5ee" font-size="11">${num(v)} m</text>`).join('');
    const labels=times.map((h,i)=>i%6===0||i===times.length-1?`<text x="${x(i)}" y="173" text-anchor="middle" fill="#d3e5ee" font-size="11">${escape(stamp(h))}</text>`:'').join('');
    return `<svg class="surf-chart" role="img" aria-label="${escape(t('trendNote'))}" viewBox="0 0 ${W} ${H}">${grid}${paths}${labels}</svg>`;
  }
  function sourceCard(which,id) {
    const data=state[which], isMarine=which!=='weather', isSst=which==='sst', isCoastal=which==='coastal';
    const point=finite(data?.latitude)&&finite(data?.longitude)?`${num(data.latitude,4)}° N, ${num(data.longitude,4)}° E`:'—';
    const validHour=index(data,anchor())>=0?anchor()+':00':data?.current?.time;
    return `<article class="surf-source-card" id="source-${id}"><h3>${escape(t(isCoastal?'seaSourceCoastal':isSst?'sstSource':isMarine?'seaSource':'weatherSource'))} [${id.toUpperCase()}]</h3><p>${escape(t(isCoastal?'sourceCoastal':isSst?'sourceSst':isMarine?'sourceModel':'sourceWeather'))}</p><dl><div><dt>${escape(t('selected'))}</dt><dd dir="ltr">${escape(point)}</dd></div><div><dt>${escape(t('distance'))}</dt><dd dir="ltr">${num(distance(data))} km</dd></div><div><dt>${escape(t('valid'))}</dt><dd dir="ltr">${escape(stamp(validHour))}</dd></div><div><dt>${escape(t('fetched'))}</dt><dd dir="ltr">${escape(fetched(state[which+'Fetched']))}</dd></div></dl><p><a href="${isMarine?'https://open-meteo.com/en/docs/marine-weather-api':'https://open-meteo.com/en/docs'}" target="_blank" rel="noopener noreferrer">${escape(t('docs'))}</a>${state.urls[which]?` · <a href="${escape(state.urls[which])}" target="_blank" rel="noopener noreferrer">${escape(t('raw'))}</a>`:''}</p>${state.errors[which]?`<p>${escape(t('errorDetail'))}: ${escape(state.errors[which])}</p>`:''}</article>`;
  }
  function render() {
    const root=document.getElementById('sportsDashboard');if(!root)return;
    const m=state.marine,w=state.weather,sst=state.sst,c=state.coastal,h=anchor(),times=rows();
    const get=k=>current(m,k,h),wind=value(w,'wind_speed_10m',h),gust=value(w,'wind_gusts_10m',h);
    const sample=sstSample(sst,h);
    const sampleText=sample?t('modelTime')+': '+stamp(sample.time):t('missingSst');
    const modelNote=(state.sstProvenance?t('modelProvider')+': '+state.sstProvenance+'. ':'')+sampleText;
    const day=w?.daily?.time?.indexOf(h.slice(0,10))??-1;
    const rise=day>=0?w?.daily?.sunrise?.[day]:null,set=day>=0?w?.daily?.sunset?.[day]:null;
    const sun=v=>validISO(v)?v.slice(11,16):'—';
    const components=[['waves','wave'],['swell','swell_wave'],['windSea','wind_wave'],['secondSwell','secondary_swell_wave']].map(([label,key])=>`<tr><th scope="row">${escape(t(label))}</th><td dir="ltr">${num(get(key+'_height'))} m</td><td dir="ltr">${escape(direction(get(key+'_direction')))}</td><td dir="ltr">${num(get(key+'_period'))} s</td><td dir="ltr">${num(get(key+'_peak_period'))} s</td></tr>`).join('');
    const d=m?.daily;
    const dailyRows=(Array.isArray(d?.time)?d.time.slice(0,7):[]).map((day,j)=>`<tr><th scope="row" dir="ltr">${escape(day.slice(8,10)+'/'+day.slice(5,7))}</th><td dir="ltr">${num(d?.wave_height_max?.[j])} m</td><td dir="ltr">${num(d?.swell_wave_height_max?.[j])} m</td><td dir="ltr">${num(d?.wind_wave_height_max?.[j])} m</td><td dir="ltr">${num(d?.wave_period_max?.[j])} s</td></tr>`).join('');
    const table=times.map(time=>{const hour=time.slice(0,13),v=(d,k)=>value(d,k,hour);return `<tr><th scope="row" dir="ltr">${escape(stamp(time))}</th><td dir="ltr">${num(v(m,'wave_height'))} / ${num(v(m,'wave_period'))} / ${escape(direction(v(m,'wave_direction')))}</td><td dir="ltr">${num(v(m,'swell_wave_height'))} / ${num(v(m,'swell_wave_peak_period'))}</td><td dir="ltr">${escape(speed(v(w,'wind_speed_10m')))}</td><td dir="ltr">${escape(speed(v(w,'wind_gusts_10m')))}</td><td dir="ltr">${escape(direction(v(w,'wind_direction_10m')))}</td><td dir="ltr">${num(v(sst,'sea_surface_temperature'))} / ${num(v(w,'temperature_2m'))}</td><td dir="ltr">${num(v(w,'uv_index'))} / ${num(v(w,'precipitation_probability'),0)}%</td></tr>`;}).join('');
    root.innerHTML=`<div class="surf-hero"><div class="surf-kicker">${escape(t('model'))}</div><h1>${escape(t('title'))}</h1><p>${escape(t('sub'))}</p><div class="surf-sport-tabs" role="group" aria-label="${escape(t('title'))}">${['surf','windsurf','kite'].map(s=>`<button type="button" data-sport="${s}" aria-pressed="${state.sport===s}">${escape(t(s))}</button>`).join('')}</div><div class="surf-service-status" aria-live="polite"><span>${escape(t('seaSource'))}: ${escape(status('marine'))}</span><span>${escape(t('weatherSource'))}: ${escape(status('weather'))}</span><span>${escape(t('sstSource'))}: ${escape(status('sst'))}</span><span>${escape(t('seaSourceCoastal'))}: ${escape(status('coastal'))}</span></div><p class="surf-time">${escape(t('hour'))}: <b dir="ltr">${escape(stamp(h+':00'))}</b> · ${escape(t('local'))}</p><div class="surf-metrics">${metric('surfHs','seaState',num(get('wave_height'))+' m',t('sample'))}${metric('surfPeriod','period',num(get('wave_period'))+' s',t('mean'))}${metric('surfDirection','direction',direction(get('wave_direction')),'')}${metric('surfSwell','swell',num(get('swell_wave_height'))+' m','')}${metric('surfPeak','swellPeak',num(get('swell_wave_peak_period'))+' s',t('peak'))}${metric('surfWind','wind',speed(wind),`${t('from')} ${direction(value(w,'wind_direction_10m',h))}`,'w')}${metric('surfGust','gust',speed(gust),'', 'w')}${metric('surfWater','water',sample?num(sample.value)+' °C':'—',modelNote,'s')}${metric('surfSecondary','secondSwell',num(get('secondary_swell_wave_height'))+' m',t('secondSwellNote'))}${metric('surfCurrent','coast',speed(current(c,'ocean_current_velocity',h)),t('coastWarning'),'c')}</div><p class="surf-water-reference"><a href="https://isramar.ocean.org.il/isramar2009/station/HaderaCTD.aspx" target="_blank" rel="noopener noreferrer">🌡 ${escape(t('sstCompare'))} ↗</a></p><p class="surf-guide">${cited(t(state.sport+'Guide'))} <a href="#surfSources">${escape(t('sources'))}</a></p><p class="surf-caveat">${cited(t('waveNote'))}</p><div class="surf-chart-head"><h2>${escape(t('trend'))}</h2><span>○ ${escape(t('combinedLegend'))} · <span class="swell-legend">○ ${escape(t('swellLegend'))}</span></span></div>${chart(times)}</div>
      <section class="surf-section"><h2>${escape(t('sevenDays'))} ${source('m')}</h2><div class="surf-table-wrap"><table class="surf-table"><thead><tr>${['dayLabel','maxCombined','maxSwell','maxWindSea','maxPeriod'].map(k=>`<th scope="col">${escape(t(k))}</th>`).join('')}</tr></thead><tbody>${dailyRows||`<tr><td colspan="5">${escape(t('noDaily'))}</td></tr>`}</tbody></table></div></section>
      <section class="surf-section"><h2>${escape(t('components'))} ${source('m')}</h2><div class="surf-table-wrap" role="region" aria-label="${escape(t('components'))}" tabindex="0"><table class="surf-table"><thead><tr>${['component','height','direction','mean','peak'].map(k=>`<th scope="col">${escape(t(k))}</th>`).join('')}</tr></thead><tbody>${components}</tbody></table></div><p class="surf-footnote">${cited(t('notAdd'))}</p></section>
      <section class="surf-section"><div class="surf-hour-head"><h2>${escape(t('hourly'))} ${source('m')}${source('w')}${source('s')}</h2><div class="surf-hour-tabs" role="group" aria-label="${escape(t('hourly'))}">${[24,48].map(n=>`<button type="button" data-hours="${n}" aria-pressed="${state.hours===n}">${escape(t('h'+n))}</button>`).join('')}</div></div><p class="surf-footnote">${escape(t('tableHint'))}</p><div class="surf-table-wrap" role="region" aria-label="${escape(t('hourly'))}" tabindex="0"><table class="surf-table surf-hourly"><caption>${escape(t('sample'))} · ${escape(t('local'))}</caption><thead><tr>${['time','waveCol','swellCol','windCol','gustCol','windDir','tempCol','uvRain'].map(k=>`<th scope="col">${escape(t(k))}</th>`).join('')}</tr></thead><tbody>${table||`<tr><td colspan="8">${escape(t('noRows'))}</td></tr>`}</tbody></table></div></section>
      <section class="surf-section"><h2>${escape(t('extra'))} ${source('w')}</h2><div class="surf-extras">${metric('surfAir','air',num(value(w,'temperature_2m',h))+' °C','','w')}${metric('surfDaylight','daylight',sun(rise)+' / '+sun(set),'','w')}${metric('surfUv','uv',num(value(w,'uv_index',h)),'','w')}${metric('surfRain','rain',num(value(w,'precipitation_probability',h),0)+'% / '+num(value(w,'precipitation',h))+' mm','','w')}${metric('surfVisibility','visibility',num(finite(value(w,'visibility',h))?value(w,'visibility',h)/1000:null)+' km','','w')}${metric('surfCurrentDir','coastDir',direction(current(c,'ocean_current_direction',h)),t('coastWarning'),'c')}${metric('surfSeaLevel','seaLevel',num(current(c,'sea_level_height_msl',h))+' m',t('coastWarning'),'c')}</div></section>
      <section class="surf-section"><h2>${escape(t('glossary'))}</h2><p>${cited(t('glossaryText'))}</p><p>${escape(t('official'))} <a href="https://ims.gov.il/en" target="_blank" rel="noopener noreferrer">${escape(t('ims'))}</a></p></section>
      <section class="surf-section">
  <h2>${escape(t('observedTitle'))}</h2>
  <p>${escape(t('observedNote'))}</p>
  <div class="surf-observation-links">
    <a href="https://isramar.ocean.org.il/isramar2009/station/HaderaCTD.aspx" target="_blank" rel="noopener noreferrer">🌡 ${escape(t('haderaWater'))} ↗</a>
    <a href="https://isramar.ocean.org.il/isramar2009/station/HaderaRDI.aspx" target="_blank" rel="noopener noreferrer">〰 ${escape(t('haderaWaves'))} ↗</a>
  </div>
</section>
<section class="surf-section">
  <h2>${escape(t('camsTitle'))}</h2>
  <p>${escape(t('camsNote'))}</p>
  <div class="surf-observation-links">
    <a href="https://www.beachhouse.co.il/pages/%D7%9E%D7%A6%D7%9C%D7%9E%D7%AA-%D7%A7%D7%95%D7%A0%D7%98%D7%99%D7%A7%D7%99" target="_blank" rel="noopener noreferrer">📷 ${escape(t('kontiki'))} ↗</a>
    <a href="https://www.wavehub.co.il/beaches/poleg" target="_blank" rel="noopener noreferrer">📷 ${escape(t('poleg'))} ↗</a>
  </div>
</section>
<section class="surf-section"><h2>${escape(t('officialChecks'))}</h2><p>${escape(t('officialNote'))}</p><ul><li><a href="https://ims.gov.il/he/coasts" target="_blank" rel="noopener noreferrer">${escape(t('imsCoast'))}</a></li><li><a href="https://ims.gov.il/en/RSS_ForecastAlerts" target="_blank" rel="noopener noreferrer">${escape(t('imsAlerts'))}</a></li><li><a href="https://isramar.ocean.org.il/isramar2009/station/HaderaRDI.aspx" target="_blank" rel="noopener noreferrer">${escape(t('isramarHadera'))}</a></li><li><a href="https://isramar.ocean.org.il/isramar2009/station/HaderaCTD.aspx" target="_blank" rel="noopener noreferrer">${escape(state.lang==='he'?'מדידת טמפרטורת מים ומליחות בחדרה — ISRAMAR':'ISRAMAR Hadera observed water temperature and salinity')}</a></li><li><a href="https://isramar.ocean.org.il/isramar2009/wave_model/default.aspx?model=swan&region=israel" target="_blank" rel="noopener noreferrer">${escape(t('isramarWave'))}</a></li></ul></section>
       <section class="surf-section surf-sources" id="surfSources"><h2>${escape(t('sources'))}</h2><p>${escape(t('requested'))}: <b dir="ltr">32.3215° N, 34.8532° E</b> · <a href="https://www.openstreetmap.org/?mlat=32.3215&amp;mlon=34.8532#map=13/32.3215/34.8532" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></p><p>${escape(t('locationNote'))}</p><p>${escape(t('offshore'))}</p><div class="surf-source-grid">${sourceCard('marine','m')}${sourceCard('weather','w')}${sourceCard('sst','s')}${sourceCard('coastal','c')}</div><p>${escape(t('sstNote'))} ${source('s')}</p><p>${escape(t('freshness'))}</p><p>${escape(t('snapshot'))}</p><ul><li><a href="https://open-meteo.com/en/docs/marine-weather-api" target="_blank" rel="noopener noreferrer">${escape(t('sourceM'))}</a></li><li><a href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer">${escape(t('sourceW'))}</a></li><li id="source-r">${escape(t('sourceR'))}: <a href="https://rnli.org/safety/choose-your-activity/surfing" target="_blank" rel="noopener noreferrer">${escape(t('surf'))}</a> · <a href="https://rnli.org/safety/choose-your-activity/windsurfing" target="_blank" rel="noopener noreferrer">${escape(t('windsurf'))}</a> · <a href="https://rnli.org/safety/choose-your-activity/kitesurfing" target="_blank" rel="noopener noreferrer">${escape(t('kite'))}</a></li></ul></section>`;
    const summary=document.getElementById('generalWeatherSummary');if(summary)summary.textContent=t('general');
  }
  const root=document.getElementById('sportsDashboard');
  root?.addEventListener('click',e=>{
    const button=e.target.closest('button[data-sport],button[data-hours]');if(!button)return;
    if(button.dataset.sport)state.sport=button.dataset.sport;
    if(button.dataset.hours)state.hours=Number(button.dataset.hours);
    const selector=button.dataset.sport?`[data-sport="${state.sport}"]`:`[data-hours="${state.hours}"]`;
    render();root.querySelector(selector)?.focus({preventScroll:true});
  });
  window.SurfDashboard={
    setLanguage(lang){state.lang=lang==='en'?'en':'he';render();},
    setUrls(weather,marine,sst,coastal){state.urls={weather,marine,sst,coastal};},
    setSstProvenance(text){state.sstProvenance=String(text||'');render();},
    loading(){for(const key of ['weather','marine','sst','coastal'])state[key+'Status']=state[key]?'refreshing':'loading';render();},
    result(which,data,reason=''){const timed=Array.isArray(data?.hourly?.time)&&data.hourly.time.some(validISO)||validISO(data?.current?.time);const valid=timed&&(which!=='sst'||!!sstSample(data,anchor()));state[which]=valid?data:null;state[which+'Status']=valid?'ready':'error';state[which+'Fetched']=valid?new Date():null;state.errors[which]=valid?'':(reason||'No valid data returned');render();}
  };
})();
