
var http = require('http');
var express = require('..');  //require đến chính nó bên ngoài <=> require('express');
var app = express();

// number of middleware

var n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

while (n--) {
  app.use(function(req, res, next){     // sử dụng middleware
    next();
  });
}

var body = new Buffer('Hello World');        // xin cấp một vùng nhớ cho chuỗi string và lưu vào biến body

app.use(function(req, res, next){
  res.send(body);                        // khi người dùng chạy vào đường link http://localhost:3333/ sẽ được tự động dowload về một file có nội dung là Hello World
});

app.listen(3333);
