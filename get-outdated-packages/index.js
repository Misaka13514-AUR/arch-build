const core = require('@actions/core');
const fs = require('fs');

const buildInfo = JSON.parse(fs.readFileSync('build-info.json', 'utf-8'))
const repoList = JSON.parse(fs.readFileSync('repo-list.json', 'utf-8'))

const buildList = Object.entries(buildInfo.packages).flatMap(it => it[1])
for (const pkg of buildList) {
    pkg.filename = pkg.filename.replace(/：/g, ':')
}

const removeList = []
for (const pkgFile of repoList) {
    const pkgName = pkgFile.Name.replace(/：/g, ':')
    if (!buildList.some(it => it.filename === pkgName)) {
        removeList.push(pkgFile.Name)
    }
}

console.log(removeList.join(' '));
core.setOutput('pkglist', removeList.join(' '))
