/**
 * Module dependencies.
 */

var express = require('../..');     // require('express') sử dụng chính các chức năng của nó từ việc require thư mục của chính nó
var logger = require('morgan');     // sử dụng morgan
var app = express();                // khai báo hàm tổng quát

app.set('views', __dirname);        // vì file view hiển thị lằm cùng cấp với
app.set('view engine', 'jade');

var pets = [];

var n = 1000;
while (n--) {                                                 // tạo dữ liệu giả 1000 bản
  pets.push({ name: 'Tobi', age: 2, species: 'ferret' });
  pets.push({ name: 'Loki', age: 1, species: 'ferret' });
  pets.push({ name: 'Jane', age: 6, species: 'ferret' });
}

app.use(logger('dev'));

app.get('/', function(req, res){                                // render trả về view khối dữ liệu đó
  res.render('pets', { pets: pets });
});

/* istanbul ignore next */
if (!module.parent) {    // nếu module chưa chạy
  app.listen(3000);
  console.log('Express started on port 3000');
}
