const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const androidRoot = path.join(root, 'android');
const gradleArgs = process.argv.slice(2);
if (!gradleArgs.length) gradleArgs.push('assembleDebug');

function javaMajor(javaHome) {
  try {
    const release = fs.readFileSync(path.join(javaHome, 'release'), 'utf8');
    const version = /JAVA_VERSION="(\d+)/.exec(release)?.[1];
    return version ? Number(version) : null;
  } catch {
    return null;
  }
}

function directoryCandidates(directory) {
  if (!directory || !fs.existsSync(directory)) return [];
  const result = [directory];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) result.push(path.join(directory, entry.name));
  }
  return result;
}

const candidates = [];
if (process.env.JAVA_HOME) candidates.push(process.env.JAVA_HOME);
if (process.platform === 'win32') {
  const publicDirectory = process.env.PUBLIC || 'C:\\Users\\Public';
  candidates.push(
    ...directoryCandidates(path.join(publicDirectory, 'history-jdk21')),
    ...directoryCandidates(path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Microsoft')),
    ...directoryCandidates(path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Eclipse Adoptium')),
    ...directoryCandidates(path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Java'))
  );
}

const javaHome = candidates.find((candidate) =>
  javaMajor(candidate) === 21 && fs.existsSync(path.join(candidate, 'bin', process.platform === 'win32' ? 'java.exe' : 'java'))
);
assert(javaHome, 'JDK 21 was not found. Set JAVA_HOME to a JDK 21 installation.');

const env = { ...process.env, JAVA_HOME: javaHome };
const pathKey = process.platform === 'win32' ? 'Path' : 'PATH';
env[pathKey] = `${path.join(javaHome, 'bin')}${path.delimiter}${env[pathKey] || env.PATH || ''}`;

if (process.platform === 'win32') {
  const publicDirectory = env.PUBLIC || 'C:\\Users\\Public';
  env.GRADLE_USER_HOME ||= path.join(publicDirectory, 'history-gradle-cache');
  env.ANDROID_USER_HOME ||= path.join(publicDirectory, 'history-android-home');
  const sdkCandidates = [
    env.ANDROID_HOME,
    env.ANDROID_SDK_ROOT,
    env.LOCALAPPDATA && path.join(env.LOCALAPPDATA, 'Android', 'Sdk'),
    env.USERPROFILE && path.join(env.USERPROFILE, 'AppData', 'Local', 'Android', 'Sdk')
  ].filter(Boolean);
  const defaultSdk = sdkCandidates.find((candidate) => fs.existsSync(candidate));
  if (!env.ANDROID_HOME && defaultSdk) env.ANDROID_HOME = defaultSdk;
  env.ANDROID_SDK_ROOT ||= env.ANDROID_HOME;
  fs.mkdirSync(env.GRADLE_USER_HOME, { recursive: true });
  fs.mkdirSync(env.ANDROID_USER_HOME, { recursive: true });
}

assert(env.ANDROID_HOME || env.ANDROID_SDK_ROOT, 'Android SDK was not found. Set ANDROID_HOME.');
const sdkRoot = env.ANDROID_HOME || env.ANDROID_SDK_ROOT;
assert(fs.existsSync(path.join(sdkRoot, 'platforms', 'android-36')), 'Android SDK Platform 36 is required.');

const isWindows = process.platform === 'win32';
const wrapper = path.join(androidRoot, isWindows ? 'gradlew.bat' : 'gradlew');
const command = isWindows ? 'gradlew.bat' : 'sh';
const commandArgs = isWindows ? gradleArgs : [wrapper, ...gradleArgs];
console.log(`Using JDK 21: ${javaHome}`);
console.log(`Using Android SDK: ${sdkRoot}`);

const result = spawnSync(command, commandArgs, {
  cwd: androidRoot,
  env,
  stdio: 'inherit',
  windowsHide: true,
  shell: isWindows
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
