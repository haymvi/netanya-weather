#!/usr/bin/env python3
"""Slice this exact keyring using an installed OrcaSlicer 2.3.1 CLI. No mesh edits."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent
NS = {'m': 'http://schemas.microsoft.com/3dmanufacturing/core/2015/02'}


def validate(gcode):
    text = gcode.read_text()
    layer, tool = 0, None
    layers, selections = {}, []
    for line in text.splitlines():
        if line.startswith(';Z:'):
            layer = round(float(line[3:]), 3)
            layers.setdefault(layer, set())
        if re.fullmatch(r'T\d+', line):
            new_tool = int(line[1:])
            if new_tool != tool:
                selections.append((layer, new_tool))
            tool = new_tool
        if re.match(r'G[01]\s', line) and re.search('[XY]', line):
            extrusion = re.search(r'E(-?\d*\.?\d+)', line.split(';')[0])
            if extrusion and float(extrusion[1]) > 0 and layer:
                layers[layer].add(tool)
    expected = {round(i / 5, 1): {0 if i <= 6 else 1} for i in range(1, 12)}
    if layers != expected or selections != [(0, 0), (1.4, 1)]:
        raise ValueError(f'Unexpected layers/tools: {layers}; {selections}')
    for command in ['G28', 'M109 S215', 'M190 S60', 'M140 S0']:
        if command not in text.splitlines():
            raise ValueError(f'Missing startup/shutdown command: {command}')
    if '; enable_support = 0' not in text or '; nozzle_diameter = 0.4' not in text:
        raise ValueError('Unexpected support/nozzle settings')
    return {'layers': {str(k): sorted(v) for k, v in layers.items()},
            'tool_selections': selections, 'sha256': hashlib.sha256(gcode.read_bytes()).hexdigest(),
            'statistics': [s for s in text.splitlines() if any(k in s for k in
                           ['estimated printing time', 'filament used [g]', 'total filament change'])],
            'validation': 'Digital checks only; physical printing and IFS mapping must be verified on the printer.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--orca', required=True, help='Path to OrcaSlicer 2.3.1 executable or AppRun')
    parser.add_argument('--preset', choices=['conservative', 'official'], default='conservative')
    parser.add_argument('--output', type=Path, required=True, help='New output directory')
    args = parser.parse_args()
    out = args.output.resolve()
    out.mkdir(parents=True, exist_ok=False)
    source = ROOT / 'Netanya_Weather_AD5X_Branco1_Preto2.3mf'
    with zipfile.ZipFile(source) as z:
        if z.testzip() is not None:
            raise ValueError('Damaged input archive')
        model = ET.fromstring(z.read('3D/3dmodel.model'))
        for oid, bounds in [('1', [( -24,24),(-24,36.899975),(0,1.2)]),
                            ('2', [(-17.43,17.43),(-17.43,17.43),(1.2,2.2)])]:
            obj = model.find(f".//m:object[@id='{oid}']", NS)
            vertices = [[float(v.get(k)) for k in ('x','y','z')]
                        for v in obj.findall('.//m:vertex', NS)]
            for axis, (lo,hi) in enumerate(bounds):
                if abs(min(v[axis] for v in vertices)-lo)>1e-5 or abs(max(v[axis] for v in vertices)-hi)>1e-5:
                    raise ValueError('Unexpected source dimensions; this script is for the supplied keyring only')
        settings = ET.fromstring(z.read('Metadata/model_settings.config'))
        for part in settings.findall('./object/part'):
            ext = part.find("metadata[@key='extruder']")
            if ext is None or ext.get('value') != part.get('id'):
                raise ValueError('Unexpected source filament assignment')
        # Orca 2.3.1 crashes on the original plate metadata. Keep original XML meshes
        # byte-for-byte, along with object/part assignments; omit plate/project metadata.
        clean = ET.Element('config')
        for obj in settings.findall('object'):
            clean.append(obj)
        with zipfile.ZipFile(out / 'input.3mf', 'w', zipfile.ZIP_DEFLATED) as dest:
            for name in ['[Content_Types].xml', '_rels/.rels', '3D/3dmodel.model']:
                dest.writestr(name, z.read(name))
            dest.writestr('Metadata/model_settings.config', ET.tostring(clean))
    profiles = ROOT / 'profiles'
    cmd = [str(Path(args.orca).resolve()), '--load-settings',
           f'{profiles / "machine.json"};{profiles / (args.preset + ".json")}',
           '--load-filaments', f'{profiles / "white.json"};{profiles / "black.json"}',
           '--arrange', '1', '--slice', '0', '--outputdir', str(out), str(out / 'input.3mf')]
    (out / 'command.json').write_text(json.dumps(cmd, indent=2))
    with (out / 'slice.log').open('w') as log:
        result = subprocess.run(cmd, stdout=log, stderr=subprocess.STDOUT)
    if result.returncode:
        raise RuntimeError(f'Orca exited {result.returncode}; inspect {out / "slice.log"}')
    result = json.loads((out / 'result.json').read_text())
    if result.get('return_code') != 0:
        raise RuntimeError(f'Orca reported failure: {result}')
    report = validate(out / 'plate_1.gcode')
    report['preset'] = args.preset
    report['source_sha256'] = hashlib.sha256(source.read_bytes()).hexdigest()
    (out / 'validation.json').write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
