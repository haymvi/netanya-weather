from pathlib import Path
import sys,zipfile,xml.etree.ElementTree as E,collections,json
import shapely
from shapely.geometry import Polygon,Point,box
from shapely.affinity import scale,translate
base=Path(__file__).resolve().parent;out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False)
src=base/'test-2plus2-input.3mf';ns={'m':'http://schemas.microsoft.com/3dmanufacturing/core/2015/02'};NS=ns['m'];E.register_namespace('',NS)
margin=float(sys.argv[1]);half=17.43+margin
with zipfile.ZipFile(src) as z:files={n:z.read(n) for n in z.namelist()}
r=E.fromstring(files['3D/3dmodel.model']);o=r.find(".//m:object[@id='1']",ns);v=[[float(a.get(k)) for k in ('x','y','z')] for a in o.findall('.//m:vertex',ns)];tris=[[int(a.get(k)) for k in ('v1','v2','v3')] for a in o.findall('.//m:triangle',ns)]
flat=shapely.union_all([Polygon([v[i][:2] for i in t]) for t in tris if all(abs(v[i][2]-.4)<1e-6 for i in t)])
body=scale(flat.intersection(box(-24,-24,24,24)),xfact=half/24,yfact=half/24,origin=(0,0))
ring=Point(0,29.9).buffer(7,quad_segs=100).difference(Point(0,29.7).buffer(3,quad_segs=100))
ring=translate(scale(ring,xfact=.5,yfact=.5,origin=(0,29.9)),yoff=half+2.95-29.9)
shape=body.union(ring);assert shape.is_valid and shape.geom_type=='Polygon' and len(shape.interiors)==1
vs=[];ts=[];lookup={}
def vertex(x,y,z):
 p=(round(x,7),round(y,7),z)
 if p not in lookup:lookup[p]=len(vs);vs.append(p)
 return lookup[p]
for t in shapely.constrained_delaunay_triangles(shape).geoms:
 pts=list(t.exterior.coords)[:3]
 if not shapely.is_ccw(t.exterior):pts.reverse()
 lo=[vertex(x,y,0) for x,y in pts];hi=[vertex(x,y,.4) for x,y in pts];ts.extend([lo[::-1],hi])
shape=shapely.orient_polygons(shape)
for loop in [shape.exterior,*shape.interiors]:
 for a,b in zip(loop.coords,list(loop.coords)[1:]):
  a0=vertex(*a,0);b0=vertex(*b,0);a1=vertex(*a,.4);b1=vertex(*b,.4);ts.extend([(a0,b0,b1),(a0,b1,a1)])
edges=collections.Counter(tuple(sorted((t[i],t[(i+1)%3]))) for t in ts for i in range(3));assert all(v==2 for v in edges.values())
o.remove(o.find('m:mesh',ns));mesh=E.SubElement(o,f'{{{NS}}}mesh');vv=E.SubElement(mesh,f'{{{NS}}}vertices');tt=E.SubElement(mesh,f'{{{NS}}}triangles')
for x,y,z in vs:E.SubElement(vv,f'{{{NS}}}vertex',x=str(x),y=str(y),z=str(z))
for a,b,c in ts:E.SubElement(tt,f'{{{NS}}}triangle',v1=str(a),v2=str(b),v3=str(c))
files['3D/3dmodel.model']=E.tostring(r,encoding='utf-8',xml_declaration=True)
with zipfile.ZipFile(out/'input.3mf','w',zipfile.ZIP_DEFLATED) as z:
 for n,b in files.items():z.writestr(n,b)
print(json.dumps({'body_width_mm':half*2,'overall_height_mm':shape.bounds[3]-shape.bounds[1],'white_border_mm':margin,'hole_diameter_mm':3,'base_height_mm':.4,'black_height_mm':.4,'closed_mesh':True,'black_mesh_unchanged':True}))
