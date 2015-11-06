
var users = require('./db'); // gọi đến thư mục db để lấy dữ liệu

console.log("=======");
// ở đây module trả về html sẽ được ưu tiên trước dù sắp xếp thế nào trong mảng đi nữa

exports.html = function(req, res){
  console.log("1111");
  res.send('<ul>' + users.map(function(user){
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
};

exports.text = function(req, res){
  console.log("2222");
  res.send(users.map(function(user){
    return ' - ' + user.name + '\n';
  }).join(''));
};

exports.json = function(req, res){
  console.log("1111");
  res.json(users);
};
