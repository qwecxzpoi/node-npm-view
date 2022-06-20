const path = require('path');
const fs = require('fs');
const request = require("request");
const url = require('url');

const viewList = []; //此处填写你需要批量下载的包名加版本 例：react-dom@18.2.0
var urlList = [];
viewList.forEach(ele=>{
    urlList.push('https://registry.npmmirror.com/'+ele.split('@')[0]+'/-/'+ele.split('@')[0]+'-'+ele.split('@')[1]+'.tgz')
})
console.log(urlList);
var dirPath = path.join(__dirname, "file");
delDirectory(dirPath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  console.log("文件夹创建成功");
} else {
  console.log("文件夹已存在");
}

urlList.forEach(ele=>{
    var writestream = fs.createWriteStream('./file/'+url.parse(ele).path.split('/-/')[1]);
    var readstream  = request(ele)
    readstream.pipe(writestream);
    readstream.on('end', function () {
        console.log(url.parse(ele).path.split('/-/')[1]+'文件下载成功');
    });
    readstream.on('error', function (err) {
        console.log("错误信息:" + err)
    })

    writestream.on("finish", function () {
        console.log(url.parse(ele).path.split('/-/')[1]+"文件写入成功");
        writestream.end();
    });
})

//清空file文件
function delDirectory(dir) {
    let files = [];
    if (fs.existsSync(dir)) {
        files = fs.readdirSync(dir);
        files.forEach((file, index) => {
            let curPath = path.join(dir, file);
            var stat = fs.statSync(curPath);
            if (stat.isDirectory()) {
                delDirectory(curPath); //递归删除文件夹
            } else if (stat.isFile()) {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(dir);
        console.log('删除file文件夹成功')
    }
}