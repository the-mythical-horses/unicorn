// const crypto = require('crypto');
// const Sequelize = require('sequelize');
// const db = require('../db');

// const User = db.define('user', {
//   email: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false
//   },
//   password: {
//     type: Sequelize.STRING,
//     // Making `.password` act like a func hides it when serializing to JSON.
//     // This is a hack to get around Sequelize's lack of a "private" option.
//     get() {
//       return () => this.getDataValue('password');
//     }
//   },
//   salt: {
//     type: Sequelize.STRING,
//     // Making `.salt` act like a function hides it when serializing to JSON.
//     // This is a hack to get around Sequelize's lack of a "private" option.
//     get() {
//       return () => this.getDataValue('salt');
//     }
//   },
//   googleId: {
//     type: Sequelize.STRING
//   },
//   avatar: {
//     type: Sequelize.STRING,
//     defaultValue:
//       'https://i.ya-webdesign.com/images/default-image-png-1.png' ||
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSja2JU4PpfqjoRch7apTWA034JKkPygpK0SxDnPWKaVV7nfbJT&usqp=CAU' ||
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS5JMbxq6i5s51LTvg6c8WCqNsmZWzntJyHqErR8-OV2OK3JbB5&usqp=CAU' ||
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSxc7PWMDF33ay5i3rU3KS8wU3cxOAeiGi24u2-3igTIehJvJ73&usqp=CAU'
//   }
// });

// module.exports = User;

// /**
//  * instanceMethods
//  */
// User.prototype.correctPassword = function(candidatePwd) {
//   return User.encryptPassword(candidatePwd, this.salt()) === this.password();
// };

// /**
//  * classMethods
//  */
// User.generateSalt = function() {
//   return crypto.randomBytes(16).toString('base64');
// };

// User.encryptPassword = function(plainText, salt) {
//   return crypto
//     .createHash('RSA-SHA256')
//     .update(plainText)
//     .update(salt)
//     .digest('hex');
// };

// /**
//  * hooks
//  */
// const setSaltAndPassword = user => {
//   if (user.changed('password')) {
//     user.salt = User.generateSalt();
//     user.password = User.encryptPassword(user.password(), user.salt());
//   }
// };

// User.beforeCreate(setSaltAndPassword);
// User.beforeUpdate(setSaltAndPassword);
// User.beforeBulkCreate(users => {
//   users.forEach(setSaltAndPassword);
// });

module.exports = {};
