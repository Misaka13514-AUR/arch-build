const fs = require('fs')
const path = require('path')
const subdirs = fs.readdirSync('pkgdb')
const { PKGNAME, PKGVER, PKGREL, EPOCH } = process.env
const newVer = `${EPOCH ? EPOCH + ':' : ''}${PKGVER}-${PKGREL}`
console.log(`::notice::包名称: ${PKGNAME}
目标版本: ${newVer}`)

for (const subdir of subdirs) {
    const content = fs.readFileSync(path.join('pkgdb', subdir, 'desc'), 'utf-8')
    const lines = content.split('\n')
    const indexOfBase = lines.indexOf('%BASE%')
    if (indexOfBase < 0) {
        console.log(`::warning::在对数据库已有的包的检查中，文件夹 ${subdir} 未能找到 %BASE% 行`)
        continue
    }
    const thisBase = lines[indexOfBase + 1]
    if (thisBase !== PKGNAME) continue
    // 以下内容为找到包时发生
    const indexOfVersion = lines.indexOf('%VERSION%')
    if (indexOfVersion < 0) {
        console.log(`::warning::在对数据库已有的包的检查中，包 ${thisBase} 未能找到 %VERSION% 行`)
        continue
    }
    const thisVersion = lines[indexOfVersion + 1]
    if (newVer === thisVersion) {
        console.log(`::notice::包 ${PKGNAME} 已是最新，无需构建
::set-output name=is-needed::false`)
        return
    }
    // 版本不是最新，需要找老版本的文件
    const indexOfFilename = lines.indexOf('%FILENAME%')
    if (indexOfFilename < 0) {
        console.log(`::warning::在对数据库已有的包的检查中，包 ${thisBase} 未能找到 %FILENAME% 行`)
    }
    else {
        console.log(`::set-output name=old-package-name::${lines[indexOfFilename + 1]}`)
    }
    console.log(`::notice::包 ${PKGNAME} 过期，需要构建
::set-output name=is-needed::true`)
}
// 包不存在
console.log(`::notice::包 ${PKGNAME} 不存在，需要构建
::set-output name=is-needed::true`)
