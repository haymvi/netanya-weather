import zipfile,xml.etree.ElementTree as E,sys,re,json,argparse
from pathlib import Path
a=argparse.ArgumentParser();a.add_argument('--gcode',required=True,type=Path);a.add_argument('--output',required=True,type=Path);args=a.parse_args();args.output.mkdir(parents=True,exist_ok=True)
import numpy as np
from PIL import Image,ImageDraw
import zxingcpp
p=Path(__file__).resolve().parent/'Netanya_Weather_AD5X_Branco1_Preto2.3mf';n={'m':'http://schemas.microsoft.com/3dmanufacturing/core/2015/02'}
with zipfile.ZipFile(p) as z:r=E.fromstring(z.read('3D/3dmodel.model'))
o=r.find(".//m:object[@id='2']",n);v=np.array([[float(a.get(k)) for k in ('x','y','z')] for a in o.findall('.//m:vertex',n)]);t=np.array([[int(a.get(k)) for k in ('v1','v2','v3')] for a in o.findall('.//m:triangle',n)])
scale=25
xy=lambda x,y:((x+24)*scale,(24-y)*scale)
im=Image.new('RGB',(48*scale,48*scale),'white');draw=ImageDraw.Draw(im)
for tri in t:
 if all(abs(v[i,2]-2.2)<1e-6 for i in tri):draw.polygon([xy(*v[i,:2]) for i in tri],fill='black')
im.save(args.output/'QR_geometry.png');print('GEOMETRY QR:',[(x.text,x.error) for x in zxingcpp.read_barcodes(im)])
# Render only extruded paths in the final object layer. Excludes tower by XY clipping.
im=Image.new('RGB',(48*scale,48*scale),'white');draw=ImageDraw.Draw(im)
x=y=0;layer=0;width=.4;tool=0;paths=0
for line in open(args.gcode):
 if line.startswith(';Z:'):layer=float(line[3:])
 if line.startswith(';WIDTH:'):width=float(line[7:])
 if re.match(r'^T\d+',line):tool=int(line[1:].strip())
 if re.match(r'^G[01]\s',line):
  vals={k:float(a) for k,a in re.findall(r'([XYE])(-?\d*\.?\d+)',line.split(';')[0])};xx=vals.get('X',x);yy=vals.get('Y',y)
  # position of object is recovered separately from known centering: body center at (110,103.55)
  if abs(layer-2.2)<1e-6 and vals.get('E',0)>0 and ('X'in vals or 'Y'in vals) and tool==1 and 80<xx<140 and 75<yy<130:
   a=xy(x-110,y-103.5500125);b=xy(xx-110,yy-103.5500125);draw.line([a,b],fill='black',width=max(1,round(width*scale)));rad=width*scale/2;[draw.ellipse((u-rad,v-rad,u+rad,v+rad),fill='black') for u,v in (a,b)];paths+=1
  x,y=xx,yy
im.save(args.output/'QR_toolpaths.png');print('TOOLPATH QR:',[(x.text,x.error) for x in zxingcpp.read_barcodes(im)],'segments',paths)

expected='https://haymvi.github.io/netanya-weather/'
results={}
for size in [600,300,240,200]:
 found=[b.text for b in zxingcpp.read_barcodes(im.resize((size,size))) if not b.error]
 results[str(size)]=found
if not any(expected in v for v in results.values()):
 raise RuntimeError('No successful toolpath QR decode')
(args.output/'qr-validation.json').write_text(json.dumps({'expected_url':expected,'toolpath_decodes':results,'note':'Raster simulation, not a physical scan.'},indent=2))
print(json.dumps(results,indent=2))
