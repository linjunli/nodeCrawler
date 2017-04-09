const cheerio = require('cheerio');
const mkdirp = require('mkdirp');
const fs = require('fs');
const request = require('request');

//目标url
var url = 'http://jandan.net/ooxx';
//开始页
var curr_page = 1;
//url前部
var url_page_start = 'http://jandan.net/ooxx/page-';
//url后部
var url_page_end = '#comments';
//爬虫页数
var pageNum = 10;
//目标选择器
var selector = '.commentlist .text p a';

//创建文件夹
var dir = './images1'
mkdirp(dir, (err) => {
    if(err){
        console.log(err)
    }
})
for(var j = 1; j <= pageNum; j++){
    //利用闭包传入j的值
    (function(j){
        //请求选项
        var option = {
            url: url_page_start + j + url_page_end,
            method: 'get',
            headers: {
                'host': 'jandan.net',
                'connection': 'keep-alive',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
            }
        }
        request(option, (error, res, body) => {
        if(!error && res.statusCode == 200){
            var $ = cheerio.load(body);
            var pic_urls = [];
            $(selector).each((index, item) => {
                let href = item.attribs.href;
                if(href.substr(-4,4) == '.jpg'){
                    pic_urls.push('http:' + href)
                }
            });

            for(var i = 0, num = pic_urls.length; i < num; i++){
                console.log(`当前正在下载第${j}页，第${i+1}张照片...`)
                download(pic_urls[i], dir)
            }
        }
        });
    })(j)

}

var download = function(url, dir){
    request(url, (err, res, body) => {
        if(err){
            console.log(err);
            return;
        }
    }).pipe(fs.createWriteStream(dir + '/' + Math.floor(Math.random() * 100000) + url.substr(-4, 4)));
}