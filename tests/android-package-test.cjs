const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'capacitor.config.json'), 'utf8'));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const origin = JSON.parse(fs.readFileSync(path.join(root, 'config', 'deployment-asset-origin.json'), 'utf8'));
const androidPrep = fs.readFileSync(path.join(root, 'scripts', 'prepare-capacitor-android.cjs'), 'utf8');
const androidGradleRunner = fs.readFileSync(path.join(root, 'scripts', 'run-android-gradle.cjs'), 'utf8');
const secureReleaseRunner = fs.readFileSync(path.join(root, 'scripts', 'build-android-release.ps1'), 'utf8');
const signingSetupRunner = fs.readFileSync(path.join(root, 'scripts', 'setup-android-release-signing.ps1'), 'utf8');

assert.equal(config.appId, 'korea.history_app');
assert.equal(config.appName, '눈떠보니 한국사');
assert.equal(config.webDir, 'android-web');
assert(!Object.hasOwn(config, 'server'), 'Production config must not contain a development server URL.');
assert.equal(config.plugins?.SystemBars?.insetsHandling, 'css');

assert.equal(pkg.dependencies['@capacitor/core'], '8.5.3');
assert.equal(pkg.dependencies['@capacitor/android'], '8.5.3');
assert.match(pkg.dependencies['@capacitor/app'], /^8\./);
assert.equal(pkg.devDependencies['@capacitor/cli'], '8.5.3');
assert.equal(pkg.engines.node, '>=22');
assert(androidPrep.includes("['before-sync', 'before-build']"));
assert(androidPrep.includes('Refusing to touch a path outside the repository'));
assert(androidPrep.includes('Prepared web bundle is missing'));
assert(pkg.scripts['android:test'].startsWith('npm run android:sync &&'));
assert.equal(pkg.scripts['android:setup:release'], 'powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-android-release-signing.ps1');
assert.equal(pkg.scripts['android:build:release'], 'powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-android-release.ps1');
assert.equal(pkg.scripts['android:build:release:secure'], 'powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-android-release.ps1');
assert(secureReleaseRunner.includes("bundleRelease --no-daemon --no-configuration-cache"));
assert(secureReleaseRunner.includes('Unprotect-DpapiString'));
assert(secureReleaseRunner.includes('Add-Type -AssemblyName System.Security'));
assert(secureReleaseRunner.includes('[System.Security.Cryptography.ProtectedData]::Unprotect'));
assert(secureReleaseRunner.includes('[Parameter(Mandatory = $true)]'));
assert(secureReleaseRunner.includes('Clear-ReleaseEnvironment'));
assert(secureReleaseRunner.includes('Restore-ReleaseEnvironment'));
assert(signingSetupRunner.includes('Read-Host -AsSecureString'));
assert(signingSetupRunner.includes('Protect-DpapiSecureString'));
assert(signingSetupRunner.includes('Add-Type -AssemblyName System.Security'));
assert(signingSetupRunner.includes('[System.Security.Cryptography.ProtectedData]::Protect'));
assert(signingSetupRunner.includes('must be stored outside the Git repository'));
assert(signingSetupRunner.includes("applicationId = 'korea.history_app'"));
assert(androidGradleRunner.includes('JDK 21 was not found'));
assert(androidGradleRunner.includes("'platforms', 'android-36'"));
assert(androidGradleRunner.includes("'AppData', 'Local', 'Android', 'Sdk'"));
assert(androidGradleRunner.includes("const command = isWindows ? 'gradlew.bat' : 'sh'"));
assert(androidGradleRunner.includes('[wrapper, ...gradleArgs]'));

childProcess.execFileSync(process.execPath, ['scripts/prepare-android-web.cjs'], { cwd: root, stdio: 'inherit' });

const nativeRoot = path.join(root, config.webDir);
assert(!fs.existsSync(path.join(nativeRoot, 'assets')), 'The 1+ GB remote media snapshot must not be embedded in the APK.');
for (const name of ['three-preview.html', 'three-preview-app.js', 'three-preview-editorial-ui.js', 'ui-review.html', 'ui-review-game.html', 'ui-review-storage.js', 'ui-review-fixtures.js']) {
  assert(!fs.existsSync(path.join(nativeRoot, name)), `${name} must not bypass the release policy in Android.`);
}
const nativeIndex = fs.readFileSync(path.join(nativeRoot, 'index.html'), 'utf8');
const nativeData = fs.readFileSync(path.join(nativeRoot, 'data.js'), 'utf8');
const nativePwa = fs.readFileSync(path.join(root, 'dist', 'pwa.js'), 'utf8');
const nativeRuntime = fs.readFileSync(path.join(nativeRoot, 'capacitor-runtime.js'), 'utf8');
const nativeProtoStory = fs.readFileSync(path.join(nativeRoot, 'proto-story-data.js'), 'utf8');
const buildInfo = JSON.parse(fs.readFileSync(path.join(nativeRoot, 'android-build-info.json'), 'utf8'));
const nativeExplanations = JSON.parse(fs.readFileSync(path.join(nativeRoot, 'official-exam-explanations.json'), 'utf8'));
const remoteBase = `https://raw.githubusercontent.com/${origin.repository}/${origin.commit}/${origin.sourcePath}`;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

assert(nativeIndex.includes('<meta name="capacitor-native" content="true">'));
assert(nativeIndex.includes('<script src="capacitor-runtime.js"></script>'));
assert(!nativeIndex.includes('<script src="pwa.js"></script>'));
assert(nativeIndex.indexOf('story-release-policy.js') < nativeIndex.indexOf('capacitor-runtime.js'));
assert(nativeData.includes(remoteBase + '/scenes/'));
assert(!nativeData.includes("src:`assets/"));
assert(nativePwa.includes('!isNativeCapacitor'));
assert(nativeRuntime.includes('backButton'));
assert(nativeRuntime.includes('appStateChange'));
assert(nativeProtoStory.includes("proto_prologue_museum"));
assert.deepEqual(
  fs.readFileSync(path.join(nativeRoot, 'media', 'proto-v4', 'ancient-modern-museum.jpg')),
  fs.readFileSync(path.join(root, 'dist', 'media', 'proto-v4', 'ancient-modern-museum.jpg')),
  'The bundled museum prologue illustration must be copied byte-for-byte into Android.'
);
assert.equal(buildInfo.serviceWorkerEnabled, false);
assert.equal(buildInfo.assetSnapshot.commit, origin.commit);
assert(buildInfo.rewrittenFiles >= 35);
assert(buildInfo.rewrittenReferences > 1000);
assert.equal(nativeExplanations.schemaVersion, 3);
assert.equal(nativeExplanations.records.length, 1850);
assert.deepEqual(Object.keys(nativeExplanations).sort(), ['canonicalChoiceCount', 'records', 'schemaVersion']);
assert(buildInfo.officialExplanations.packagedBytes < 4_000_000);
assert(buildInfo.officialExplanations.sourceBytes > buildInfo.officialExplanations.packagedBytes * 5);

const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.webmanifest', '.txt']);
const residualRuntimeAssets = [];
const forbiddenServerUrls = [];
for (const file of walk(nativeRoot)) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (/(?:^|["'`(=,:;\s])\/?assets\//m.test(source)) residualRuntimeAssets.push(path.relative(nativeRoot, file));
  if (/https?:\/\/(?:localhost|127\.0\.0\.1|history-iota-one\.vercel\.app)(?=[:/]|$)/i.test(source)) {
    forbiddenServerUrls.push(path.relative(nativeRoot, file));
  }
}
assert.deepEqual(residualRuntimeAssets, [], `Unrewritten runtime assets remain: ${residualRuntimeAssets.join(', ')}`);
assert.deepEqual(forbiddenServerUrls, [], `Development or hosted-web server URLs remain: ${forbiddenServerUrls.join(', ')}`);

const provenance = fs.readFileSync(path.join(nativeRoot, 'ox-quiz-curation.js'), 'utf8');
assert(provenance.includes('dist/assets/'), 'Source provenance paths must not be rewritten as runtime URLs.');

const policy = fs.readFileSync(path.join(nativeRoot, 'story-release-policy.js'), 'utf8');
assert(policy.includes("PUBLIC_ERA='proto-kingdoms'"));
assert(policy.includes('스토리 준비 중'));

const androidManifest = fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml'), 'utf8');
const androidStrings = fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml'), 'utf8');
const androidVariables = fs.readFileSync(path.join(root, 'android', 'variables.gradle'), 'utf8');
const androidRootBuild = fs.readFileSync(path.join(root, 'android', 'build.gradle'), 'utf8');
const androidAppBuild = fs.readFileSync(path.join(root, 'android', 'app', 'build.gradle'), 'utf8');
const androidGitignore = fs.readFileSync(path.join(root, 'android', '.gitignore'), 'utf8');
const androidStyles = fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'values', 'styles.xml'), 'utf8');
const androidGradleProperties = fs.readFileSync(path.join(root, 'android', 'gradle.properties'), 'utf8');
const androidWrapperProperties = fs.readFileSync(path.join(root, 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties'), 'utf8');
const mainActivity = fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'java', 'com', 'nuntteoboni', 'history', 'MainActivity.java'), 'utf8');
const instrumentedTest = fs.readFileSync(path.join(root, 'android', 'app', 'src', 'androidTest', 'java', 'com', 'nuntteoboni', 'history', 'ExampleInstrumentedTest.java'), 'utf8');
const permissions = [...androidManifest.matchAll(/<uses-permission android:name="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(permissions, ['android.permission.INTERNET']);
assert(androidManifest.includes('android:windowSoftInputMode="adjustResize"'));
assert(androidManifest.includes('android:icon="@mipmap/ic_launcher"'));
assert(androidManifest.includes('android:roundIcon="@mipmap/ic_launcher_round"'));
assert(androidStrings.includes('<string name="app_name">눈떠보니 한국사</string>'));
assert(androidStrings.includes('<string name="package_name">korea.history_app</string>'));
assert(androidVariables.includes('minSdkVersion = 24'));
assert(androidVariables.includes('compileSdkVersion = 36'));
assert(androidVariables.includes('targetSdkVersion = 36'));
assert(androidStyles.includes('<item name="windowSplashScreenBackground">@color/colorPrimary</item>'));
assert(androidStyles.includes('<item name="windowSplashScreenAnimatedIcon">@drawable/app_icon</item>'));
assert(androidGradleProperties.includes('android.overridePathCheck=true'));
assert(androidWrapperProperties.includes('distributionSha256Sum=ed1a8d686605fd7c23bdf62c7fc7add1c5b23b2bbc3721e661934ef4a4911d7c'));
assert(androidRootBuild.includes('HISTORY_ANDROID_BUILD_ROOT'));
assert(androidAppBuild.includes("tasks.register('prepareCapacitorAssets', Exec)"));
assert(androidAppBuild.includes("tasks.register('exportDebugApk', Copy)"));
assert(androidAppBuild.includes("HISTORY_RELEASE_STORE_FILE"));
assert(androidAppBuild.includes("HISTORY_RELEASE_STORE_PASSWORD"));
assert(androidAppBuild.includes("HISTORY_RELEASE_KEY_ALIAS"));
assert(androidAppBuild.includes("HISTORY_RELEASE_KEY_PASSWORD"));
assert(androidAppBuild.includes("HISTORY_ANDROID_VERSION_CODE"));
assert(androidAppBuild.includes("tasks.register('exportReleaseBundle', Copy)"));
assert(androidAppBuild.includes('Release signing is not configured'));
assert(/^\*\.jks$/m.test(androidGitignore));
assert(/^\*\.keystore$/m.test(androidGitignore));
assert(/^keystore\.properties$/m.test(androidGitignore));
assert(mainActivity.includes('EdgeToEdge.enable(this)'));
assert(instrumentedTest.includes('assertEquals("korea.history_app", appContext.getPackageName())'));
assert.deepEqual(
  fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'drawable-nodpi', 'app_icon.png')),
  fs.readFileSync(path.join(root, 'dist', 'icons', 'icon-maskable-512.png'))
);

console.log('PASS: Capacitor Android package contract, native lifecycle bridge, story policy and immutable assets verified.');
