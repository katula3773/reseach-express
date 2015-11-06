var express = require('../../');
var app = module.exports = express();
var users = require('./db');

// so either you can deal with different types of formatting
// for expected response in index.js


app.get('/', function(req, res){
  res.format({
    html: function(){
      res.send('<ul>' + users.map(function(user){
        return '<li>' + user.name + '</li>';
      }).join('') + '</ul>');
    },

    text: function(){
      res.send(users.map(function(user){
        return ' - ' + user.name + '\n';
      }).join(''));
    },

    json: function(){
      res.json(users);
    }
  });
});

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:

function format(path) {
  console.log(path);
  var obj = require(path);
  console.log(obj);
  return function(req, res){
    console.log("~~~~~~~~",obj);
    res.format(obj);    // ở trong list các định rạng được trả về thì định rạng html sẽ được trả về trước
  };
}

app.get('/users', format('./users'));

//// $ node foo.js
//   console.log(module.parent); // `null`
//// require('./foo')
//   console.log(module.parent); // `{ ... }`
// dùng để kiểm tra module đã chạy chưa

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
