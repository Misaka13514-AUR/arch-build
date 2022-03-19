const core = require('@actions/core');
const fs = require('fs')
const path = require('path')

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

const res = []
const resAny = []

const subdirs = fs.readdirSync('pkgdb')
// 遍历每个文件夹
for (const subdir of subdirs) {
    const content = fs.readFileSync(path.join('pkgdb', subdir, 'desc'), 'utf-8')
    const lines = content.split('\n')
    if (getPkgAttr(lines, 'ARCH') === 'any') {
        resAny.push({
            pkgname: getPkgAttr(lines, 'PKGNAME'),
            pkgbase: getPkgAttr(lines, 'PKGBASE'),
            pkgver: getPkgAttr(lines, 'PKGVER'),
            pkgrel: getPkgAttr(lines, 'PKGREL'),
            epoch: getPkgAttr(lines, 'EPOCH'),
            arch: getPkgAttr(lines, 'ARCH'),
            filename: getPkgAttr(lines, 'FILENAME'),
        })
    }
    else {
        res.push(getPkgAttr(lines, 'BASE'))
    }
}

console.log({
    pkglist: res,
    anylist: resAny,
})

core.setOutput('data', {
    pkglist: res,
    anylist: resAny,
})
