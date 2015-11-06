/**
 * Module dependencies.
 */

var express = require('../..');   // require('express') chính nó phải lùi lại 2 cấp của thư mục /examples/auth
var hash = require('./pass').hash;  // sử dụng module pass của thư mục hiện tại
var bodyParser = require('body-parser');
var session = require('express-session');

var app = module.exports = express();   // exports luôn chức năng của exporess

// config

app.set('view engine', 'ejs');              // sét việc sử dụng view engine với những file có đuôi .ejs
app.set('views', __dirname + '/views');     // sét đường dẫn trỏ đến view là đường dẫn tới thư mục hiện tại thêm một cấp /views

// middleware

app.use(bodyParser.urlencoded({ extended: false }));    // khai báo một middleware sử sử dụng chức năng bodyParser.urlencoded({ extended: false }) của module body-parser

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

// Session-persisted message middleware

app.use(function(req, res, next){
  var err = req.session.error;        // lấy ra thông báo lỗi trong session của mỗi request đến và lưu vào biến err
  var msg = req.session.success;
  delete req.session.error;         // xóa đối tượng session.error trong rq
  delete req.session.success;
  res.locals.message = '';      // sét giá trị locals.message về ''
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';     // trả về thông báo lôi nếu có lỗi sảy ra
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// dummy database

var users = {
  tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash('foobar', function(err, salt, hash){
  if (err) throw err;
  // store the salt & hash in the "db"
  users.tj.salt = salt;    // nếu trường hợp không chuyền đủ vào 3 đối số như ở trên có 2 đối số thì giá trị salt random
  users.tj.hash = hash;     // mã hash được băm theo pass foobar
});


// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];    // lấy tên người dùng
  // query the db for the given username
  if (!user) return fn(new Error('cannot find user'));    // nếu không có user thông báo lỗi
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash(pass, user.salt, function(err, hash){    // truyền vào các tham số và kiểm tra mã băm của pass có chùng với mã băm của user.hash đã khởi tạo ở bước trc không
    if (err) return fn(err);
    if (hash == user.hash) return fn(null, user);
    fn(new Error('invalid password'));
  });
}

function restrict(req, res, next) {
  if (req.session.user) {     // nếu đã tồn tại user đã đăng nhập thì bỏ qua
    next();
  } else {
    req.session.error = 'Access denied!';   // nếu chưa tồn tại user đăng nhập lần nào sẽ thông báo lỗi session.error và chuyển về trang /login
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res){   // gọi tới hàm kiểm tra session restrict trước khi có quyền vào router này
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){  // xóa toàn bộ session bằng lệnh delete this.req.session;
    res.redirect('/');   // chuyển về trang /
  });
});

app.get('/login', function(req, res){   // render from login
  res.render('login');
});

app.post('/login', function(req, res){
  authenticate(req.body.username, req.body.password, function(err, user){  // kiểm tra chứng thực authenticate , nếu đúng sẽ trả về đúng giá trị user đó
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){  // cập nhật các thông số cho session gồm user , trạng thái success
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back');   // quay ngược trở lại trang trước đó
      });
    } else {
      req.session.error = 'Authentication failed, please check your '    // thông báo lỗi
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
    }
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
