// Run against a local static server: SITE_URL=http://127.0.0.1:8001 node tests/surf-smoke.cjs
// Deterministic synthetic forecasts are TEST FIXTURES ONLY, never shipped as page data.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.SITE_URL||'http://127.0.0.1:8001';
const hours=Array.from({length:144},(_,i)=>new Date(Date.UTC(2026,9,16,i)).toISOString().slice(0,16));
const a=(v,n=144)=>Array(n).fill(v);
function fixtures(){
  const weather={latitude:32.32,longitude:34.85,timezone:'Asia/Jerusalem',utc_offset_seconds:10800,current:{time:'2026-10-16T12:00',temperature_2m:25,apparent_temperature:26,relative_humidity_2m:60,pressure_msl:1012,wind_speed_10m:18.52,wind_direction_10m:270,wind_gusts_10m:37.04,cloud_cover:20,weather_code:1,is_day:1},hourly:{time:hours,temperature_2m:a(25),precipitation_probability:a(10),precipitation:a(0),weather_code:a(1),uv_index:a(4),wind_speed_10m:a(18.52),wind_gusts_10m:a(37.04),wind_direction_10m:a(270),visibility:a(12000)},daily:{time:hours.filter((_,i)=>i%24===0).map(s=>s.slice(0,10)),temperature_2m_max:a(28,6),temperature_2m_min:a(20,6),weather_code:a(1,6),precipitation_sum:a(0,6),precipitation_probability_max:a(10,6)}};
  weather.daily.sunrise=weather.daily.time.map(s=>s+'T06:45');weather.daily.sunset=weather.daily.time.map(s=>s+'T18:10');
  const marine={latitude:32.35,longitude:34.75,timezone:'Asia/Jerusalem',utc_offset_seconds:10800,current:{time:'2026-10-16T12:00',wave_height:1.2,sea_surface_temperature:26},hourly:{time:hours.slice(0,72)}};
  for(const [k,v] of Object.entries({wave_height:1.2,wave_direction:270,wave_period:6,wave_peak_period:8,swell_wave_height:.8,swell_wave_direction:280,swell_wave_period:7,swell_wave_peak_period:9,wind_wave_height:.5,wind_wave_direction:260,wind_wave_period:4,wind_wave_peak_period:5,sea_surface_temperature:26}))marine.hourly[k]=a(v,72);
  return {weather,marine,sst:{...structuredClone(marine),latitude:32.375,longitude:34.875015,hourly_units:{sea_surface_temperature:'°C'},current_units:{sea_surface_temperature:'°C'}}};
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
  const context=await browser.newContext({timezoneId:'America/New_York',viewport:{width:1280,height:900}});const page=await context.newPage();await page.clock.install({time:new Date('2026-10-16T09:05:00Z')});
  let data=fixtures(),failMarine=false,failWeather=false,failSst=false;const errors=[];let seaUrl,weatherUrl;
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://api.open-meteo.com/**',async r=>{weatherUrl=new URL(r.request().url());failWeather?await r.abort():await r.fulfill({json:data.weather});});
  await page.route('https://marine-api.open-meteo.com/**',async r=>{const u=new URL(r.request().url());if(u.searchParams.get('models')==='meteofrance_currents'){failSst?await r.abort():await r.fulfill({json:data.sst});}else{seaUrl=u;failMarine?await r.abort():await r.fulfill({json:data.marine});}});
  const ready=()=>page.waitForFunction(()=>!document.getElementById('refreshBtn').disabled);
  const refresh=async()=>{await page.click('#refreshBtn');await ready();};
  await page.goto(base+'/?lang=en');await ready();
  assert.equal(await page.locator('#surfHs').innerText(),'1.2 m');assert.equal(await page.locator('#surfPeak').innerText(),'9.0 s');assert.equal(await page.locator('#surfPeriod').innerText(),'6.0 s');assert.equal(await page.locator('#surfWind').innerText(),'10.0 kn · 18.5 km/h');assert.equal(await page.locator('#surfGust').innerText(),'20.0 kn · 37.0 km/h');assert.equal(await page.locator('#surfDaylight').innerText(),'06:45 / 18:10');assert.equal(await page.locator('#surfVisibility').innerText(),'12.0 km');
  assert.equal(await page.locator('.surf-hourly tbody tr').count(),24);assert.match(await page.locator('.surf-hourly tbody tr').first().innerText(),/16\/10 12:00/);
  assert.equal(seaUrl.searchParams.get('timezone'),'Asia/Jerusalem');assert.equal(seaUrl.searchParams.get('cell_selection'),'sea');assert.match(seaUrl.searchParams.get('hourly'),/swell_wave_peak_period/);assert.match(weatherUrl.searchParams.get('hourly'),/wind_gusts_10m/);assert.match(weatherUrl.searchParams.get('daily'),/sunrise/);
  await page.click('[data-hours="48"]');assert.equal(await page.locator('.surf-hourly tbody tr').count(),48);await page.click('[data-sport="kite"]');assert.match(await page.locator('.surf-guide').innerText(),/kite-size/);
  await page.click('#langHe');assert.equal(await page.locator('html').getAttribute('dir'),'rtl');assert.equal(await page.locator('[data-sport="kite"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.surf-hourly tbody tr').count(),48);
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.click('#langEn');
  // Null peak must never borrow mean period; zero is a legitimate value, not missing.
  data.marine.hourly.swell_wave_peak_period=a(null,72);data.marine.hourly.wave_height=a(0,72);data.weather.hourly.wind_speed_10m=a(0);data.weather.hourly.wind_direction_10m=a(0);await refresh();assert.equal(await page.locator('#surfPeak').innerText(),'— s');assert.equal(await page.locator('#surfHs').innerText(),'0.0 m');assert.equal(await page.locator('#surfWind').innerText(),'0.0 kn · 0.0 km/h');
  // Clear failed service values instead of presenting previous success as fresh.
  failMarine=true;await refresh();assert.equal(await page.locator('#surfHs').innerText(),'— m');assert.equal(await page.locator('#surfWind').innerText(),'0.0 kn · 0.0 km/h');assert.match(await page.locator('.surf-service-status').innerText(),/Marine data: Unavailable/);
  failMarine=false;failWeather=true;await refresh();assert.equal(await page.locator('#surfWind').innerText(),'— kn · — km/h');assert.equal(await page.locator('#surfHs').innerText(),'0.0 m');await page.click('#langHe');await page.click('#langEn');assert.equal(await page.locator('#surfWind').innerText(),'— kn · — km/h');
  failWeather=false;data=fixtures();data.marine={};await refresh();assert.match(await page.locator('.surf-service-status').innerText(),/Marine data: Unavailable/);
  data=fixtures();await refresh();for(const id of ['source-m','source-w','source-s','source-r','surfSources'])assert.equal(await page.locator('#'+id).count(),1);assert.equal(await page.locator('#howLink').getAttribute('href'),'howto.html?lang=en');
  assert.equal(await page.locator('#surfWater').innerText(),'26.0 °C');
  assert.match(await page.locator('#surfWater').locator('..').innerText(),/not.*measurement|No local measurement/);
  assert.match(await page.locator('.surf-hourly thead').innerText(),/Wind: kn · km\/h/);
  assert.equal(await page.locator('.surf-hourly thead th').count(),8);
  assert.match(await page.locator('.surf-hourly tbody tr').first().innerText(),/10.0 kn · 18.5 km\/h/);
  await page.locator('#generalWeatherSummary').click();assert.match(await page.locator('#wind').innerText(),/kn.*km\/h/);assert.match(await page.locator('#gust').innerText(),/kn.*km\/h/);
  failSst=true;await refresh();assert.equal(await page.locator('#surfWater').innerText(),'— °C');assert.equal(await page.locator('#surfHs').innerText(),'1.2 m');
  failSst=false;data.sst.hourly_units.sea_surface_temperature='K';await refresh();assert.equal(await page.locator('#surfWater').innerText(),'— °C');
  data=fixtures();await refresh();await page.click('#langHe');await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert(!/NaN|undefined/.test(await page.locator('#sportsDashboard').innerText()));assert.deepEqual(errors,[]);
  console.log('PASS: query variables; Netanya timezone in foreign viewer timezone; wave/swell periods; knots conversion; null/zero; independent service failures; stale-data clearing; HE/EN; 24/48 hours; sport tabs; mobile overflow; source links; existing HOWTO link. All weather inputs were synthetic fixtures.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
