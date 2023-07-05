const User = require('../users/users-model');
const bcrypt = require('bcryptjs');

/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli() {

}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req, res, next) {
  const {username} = req.body;
  const [user] = await User.goreBul({username: username});
  if(user) {
    next({status: 422, message: "Username kullaniliyor"});
  } else {
    next();
  }
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req, res, next) {
  const {username} = req.body;
  const [user] = await User.goreBul({username: username});
  if(!user) {
    res.status(401).json({message: "Geçersiz kriter"});
  } else {
    req.user = user;
    next();
  }
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
async function sifreGecerlimi(req, res, next) {
  const {password} = req.body;
  if(!password || password.length < 3) {
    res.status(422).json({message: "Şifre 3 karakterden fazla olmalı"});
  } else {
      const hashedPassword = bcrypt.hashSync(password, HASH_ROUNDS);
      req.hashedPassword = hashedPassword;
      next();
    }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.

module.exports = {
  sinirli,
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi,
};