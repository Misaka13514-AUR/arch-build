const core = require('@actions/core');
const github = require('@actions/github');

const origin = JSON.parse(core.getInput('pkglist'))
const out = {
    'builds-on-x86_64': [
        ...origin.x86_64.map(repo => ({
            repo,
            arch: 'x86_64'
        })),
        ...origin['aarch64-packonly'].map(repo => ({
            repo,
            arch: 'aarch64'
        })),
        ...origin['loongarch64-packonly'].map(repo => ({
            repo,
            arch: 'loongarch64'
        }))
    ]
}

core.setOutput('pkglist', JSON.stringify(out))
