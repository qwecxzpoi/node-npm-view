import path from 'path';
import fs from 'fs';
import request from "request";
import url from 'url';

const data = require(path.join(__dirname, 'data.json'))

const viewList: string[] = [];

if (data.packages) {
    Object.keys(data.packages).forEach(item => {
        if (item.length > 0) {
            viewList.push(data.packages[item].resolved)
        }
    })
}

if (data.dependencies) {
    Object.keys(data.dependencies).forEach(item => {
        if (item.length > 0) {
            viewList.push(data.dependencies[item].resolved)
        }
    })
}

var dirPath = path.join(__dirname, "file");
delDirectory(dirPath);

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log("文件夹创建成功");
} else {
    fs.rmSync(dirPath)
    console.log("文件夹已存在");
}


viewList.filter(Boolean).forEach(ele => {

    var writestream = fs.createWriteStream('./file/' + url.parse(ele).path!.split('/-/')[1]);
    var readstream = request(ele)
    readstream.pipe(writestream);
    readstream.on('end', function () {
        console.log(url.parse(ele).path!.split('/-/')[1] + '文件下载成功');
    });
    readstream.on('error', function (err) {
        console.log("错误信息:" + err)
        fs.appendFile('error.txt', ele + '\n', 'utf8', function (error) {
            if (error) {
                console.log(error);
                return false;
            }
        })
    })

    writestream.on("finish", function () {
        console.log(url.parse(ele).path!.split('/-/')[1] + "文件写入成功");
        writestream.end();
    });
})

//清空file文件
function delDirectory(dir: string) {
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
