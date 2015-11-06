
// check out https://github.com/tj/node-pwd

/**
 * Module dependencies.
 */

var crypto = require('crypto');

/**
 * Bytesize.
 */

var len = 128;

/**
 * Iterations. ~300ms
 */

var iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */

exports.hash = function (pwd, salt, fn) {   // khai báo một chức năng hàm và xuất khẩu luôn nó

    // đối số fn chính là hàm hash được gọi đệ quy

  if (3 == arguments.length) {  // kiểm tra nếu đối số đủ là 3 thông số như yêu cầu
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){               // các thông tin được chuyển thành mã base64

      // example
      //> console.log(new Buffer("Hello World").toString('base64'));
      //SGVsbG8gV29ybGQ=
      //> console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
      //Hello World

      fn(err, hash.toString('base64'));
    });
  } else {      // nếu thông số thứ 3 là fn (đây là vị trí truyền vào hàm callback) nếu chưa có mà lại lằm ở salt thì logic viết dưới đây mục đích là sinh thêm một đối số lữa cho đủ để tạo salt và hash
    console.log("-----ZZZ",fn);
    fn = salt;
    console.log("~~~~~0", pwd);
    console.log("+++++1",salt);
    console.log("-----2", typeof fn);
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      console.log("!!!!!!!  ", salt);
      // random ra một mã băm base64 cho đối số salt
      salt = salt.toString('base64');
      console.log("######",salt);
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        console.log("12345  ",hash);
        console.log("45678  ", hash.toString('base64'));
        // thực hiện lại việc băm passwork
        fn(null, salt, hash.toString('base64')); // trả về salt và mã băm được băm theo giá trị salt vì
                                                // fn = salt; ở đoạn code trên thưc chất là hash(salt) hash thực chất là salt.base64
      });
    });
  }
};
