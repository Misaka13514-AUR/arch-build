const core = require('@actions/core');
const fs = require('fs')
const path = require('path')
const pkglist = JSON.parse(core.getInput('pkglist'))

// 获取一个属性的所有值，适用于 DEPENDS 那种
const getPkgAttrMulti = (lines, attr) => {
    let index = lines.indexOf(`%${attr}%`)
    if (index < 0) {
        return []
    }
    let res = []
    while (lines[index + 1] !== '') {
        index++
        res.push(lines[index])
    }
    return res
}

// 获取一个属性，可以是多行的
const getPkgAttr = (lines, attr) => getPkgAttrMulti(lines, attr).join('\n')


const aurPackages = [...pkglist['builds-on-x86_64'].map(pkg => pkg.repo), ...pkglist['builds-on-aarch64']]

const res = {
    buildTime: new Date().toISOString(),
    packages: {}
}

const processArch = (arch) => {
    res.packages[arch] = []
    const subdirs = fs.readdirSync('pkgdb_' + arch)
    // 遍历每个文件夹
    for (const subdir of subdirs) {
        const content = fs.readFileSync(path.join('pkgdb_' + arch, subdir, 'desc'), 'utf-8')
        const lines = content.split('\n')
        res.packages[arch].push({
            name: getPkgAttr(lines, 'NAME'),
            desc: getPkgAttr(lines, 'DESC'),
            version: getPkgAttr(lines, 'VERSION'),
            csize: getPkgAttr(lines, 'CSIZE'),
            isize: getPkgAttr(lines, 'ISIZE'),
            url: getPkgAttr(lines, 'URL'),
            provides: getPkgAttrMulti(lines, 'PROVIDES'),
            depends: getPkgAttrMulti(lines, 'DEPENDS'),
            conflicts: getPkgAttrMulti(lines, 'CONFLICTS'),
            buildTime: new Date(Number.parseInt(getPkgAttr(lines, 'BUILDDATE')) * 1000).toISOString(),
            isAur: aurPackages.includes(getPkgAttr(lines, 'BASE')),
            filename: getPkgAttr(lines, 'FILENAME'),
        })
    }
}

for (arch of ['x86_64', 'i686', 'aarch64', 'loongarch64', 'riscv64']) {
    processArch(arch)
}

fs.writeFileSync('build-info.json', JSON.stringify(res, null, 0), 'utf-8')
