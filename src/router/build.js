// 不进行读取的文件名称
const fs = require('fs')
const path = require('path')
const filePath = path.resolve('./src/pages');

/*
* fileSrc：读取路径
* type: 是否读取子文件
* fileType；文件类型后缀，例如js或者vue或者txt
* */

const promise = new Promise((resolve) => {
    fs.readdir(filePath, (error, files) => {
        if (error) {
            console.log(error)
        }
        // 如果目录下不存在文件
        if (files.length === 0) {
            return resolve(files)
        } else {
            console.log(files)
        }
    })
})

promise.then(res => {
    console.log(res)
})



// class getFilePath {
//     constructor({src, type = false, fileName}) {
//         this.src = src
//         this.type = type
//         this.fileName = fileName
//         this.myRouterArray = []
//     }
//
//     fileDisplay() {
//         // console.log(34324234)
//         // if (!this.src) {
//         //     return this.myRouterArray
//         // }
//         // if (!this.fileName) {
//         //     return this.myRouterArray
//         // }
//         // fs.require(this.src, function (err, files) {
//         //
//         // })
//     }
// }
//
// const myRouter = new getFilePath(filePath, false, 'js')
// myRouter.fileDisplay()

