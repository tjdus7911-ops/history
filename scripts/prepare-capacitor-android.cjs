const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const mode = process.argv[2];
assert(['before-sync', 'before-build'].includes(mode), 'Expected before-sync or before-build.');

function assertGeneratedPath(target) {
  const resolved = path.resolve(target);
  assert(resolved.startsWith(root + path.sep), `Refusing to touch a path outside the repository: ${resolved}`);
  return resolved;
}

function clearReadOnly(target) {
  const resolved = assertGeneratedPath(target);
  if (process.platform !== 'win32' || !fs.existsSync(resolved)) return;

  // OneDrive can mark newly generated Capacitor/Gradle folders read-only. The
  // native tools need to replace these generated outputs on every sync/build.
  spawnSync('attrib.exe', ['-R', resolved], { stdio: 'ignore', windowsHide: true });
  spawnSync('attrib.exe', ['-R', path.join(resolved, '*'), '/S', '/D'], {
    stdio: 'ignore',
    windowsHide: true
  });
}

function removeGenerated(target) {
  const resolved = assertGeneratedPath(target);
  if (!fs.existsSync(resolved)) return;
  clearReadOnly(resolved);
  fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
}

if (mode === 'before-sync') {
  removeGenerated(path.join(root, 'android', 'app', 'src', 'main', 'assets', 'public'));
  removeGenerated(path.join(root, 'android', 'capacitor-cordova-android-plugins'));
} else {
  const preparedWeb = path.join(root, 'android-web');
  const nativePublic = path.join(root, 'android', 'app', 'src', 'main', 'assets', 'public');
  assert(
    fs.existsSync(preparedWeb),
    'Prepared web bundle is missing. Run `npm run android:sync` before Gradle or Android Studio builds.'
  );
  removeGenerated(nativePublic);
  fs.cpSync(preparedWeb, nativePublic, { recursive: true });

  [
    path.join(root, 'android', 'build'),
    path.join(root, 'android', 'app', 'build'),
    path.join(root, 'android', 'capacitor-cordova-android-plugins', 'build'),
    path.join(root, 'node_modules', '@capacitor', 'android', 'capacitor', 'build'),
    path.join(root, 'node_modules', '@capacitor', 'app', 'android', 'build')
  ].forEach(clearReadOnly);
}

console.log(`Prepared generated Android paths (${mode}).`);
