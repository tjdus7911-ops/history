#!/usr/bin/env python3
"""Regression: detect omitted feet and exclude an atlas neighbor between limbs."""
import importlib.util
import sys
from pathlib import Path
import numpy as np

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('measure_art', root / 'scripts/measure-three-fullbody-art.py')
measure = importlib.util.module_from_spec(spec)
spec.loader.exec_module(measure)

labels = np.zeros((110, 90), dtype=int)
labels[5:100, 10:25] = 1
labels[5:100, 65:80] = 1
labels[5:30, 10:80] = 1
# A second portrait occupies the concave space between the first one's legs.
labels[55:105, 30:60] = 2
clip, points, count = measure.polygon(labels, 1, measure.rect(8, 3, 74, 99))
assert clip.startswith('polygon(evenodd,')
assert points > 4 and count == int(np.count_nonzero(labels == 1))

try:
    measure.polygon(labels, 1, measure.rect(8, 3, 74, 82))
except AssertionError as error:
    assert 'removes original alpha>32 subject pixels' in str(error)
else:
    raise AssertionError('The original 0.86-height crop would silently omit the feet')

# A closed arm or garment loop must remain transparent even if a neighbor is in it.
labels[80:85, 10:80] = 1
measure.polygon(labels, 1, measure.rect(8, 3, 74, 99))
print('PASS: complete source coverage; concave limb gap; closed loop; truncated crop rejected')
