const core = require('@actions/core');

const origin = JSON.parse(core.getInput('pkglist'))
const out = {
    'builds-on-x86_64': [
        // ...origin.x86_64.map(repo => ({
        //     repo,
        //     arch: 'x86_64'
        // })),
        ...origin['aarch64-packonly'].map(repo => ({
            repo,
            arch: 'aarch64'
        })),
        ...origin['loongarch64-packonly'].map(repo => ({
            repo,
            arch: 'loongarch64'
        }))
    ],
    'builds-on-aarch64': origin['aarch64-compile'],
    'builds-on-i686': origin.i686,
    'builds-on-loongarch64': origin['loongarch64-compile'],
}

core.setOutput('pkglist', JSON.stringify(out))
