// the logic behind the scene of jsonwebtoken
// const { SHA256 } = require('crypto-js');

// var message = 'frank here';
// var hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = { id: 4 };

// var token = { data, hash: SHA256(JSON.stringify(data) + 'secret').toString() };

// console.log('token: ', token);
// var resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();
// console.log('resulthash: ', resultHash);


// //try to temper with the token
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data) + 'secret').toString();


// if (resultHash === token.hash) {
//     console.log('data was not changed');
// } else {
//     console.log('data was changed...');
// }


//=================using json web token : npm jsonwebtoken===============================
// const jwt = require('jsonwebtoken');

// var data = { id: 10 };

// var token = jwt.sign(data, `123abc`);
// console.log(token);

// var decoded = jwt.verify(token, '123abc');

// console.log('decoded', decoded);

//==========npm bcryptjs ================
const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$LnrFg78of/6Ix/s0cF/Ii./u8/yW08IUKr7s3Nb0JxZxWM4rHqof2';

bcrypt.compare('123abc', hashedPassword, (err, res) => {
    console.log(res);//true
});
