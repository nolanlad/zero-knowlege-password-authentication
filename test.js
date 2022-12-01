var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const Schema = mongoose.Schema;

var crypto = require('crypto');

const userSchema = Schema({
  uname: String,
  y: String,
});
const userModel = mongoose.model("users", userSchema);

userModel.find({ uname: 'fucker' },"uname y", (err, users) => {
    if (err) return handleError(err);
    console.log(users);
    
});

// const n64 = BigInt('64');
// const n8 = BigInt('8');


// function random_bigint(n_bits){
//   n_bytes = parseInt(Math.ceil(n_bits/8));

//   const array = new Uint8Array(n_bytes);
//   crypto.getRandomValues(array);

//   var a = BigInt('0');
//   for (let i =0;i<array.length;i++) {
//     a = a + (BigInt(array[i]) << (BigInt(i)*n8));
//   }
//   var lshift = (n_bytes*8)-n_bits;
//   a = a >> BigInt(lshift);
//   return a
// }

// function bigint_log2(n){
//   var i = 0;
//   while(n > 0){
//     n = n >> BigInt('1');
//     i++;
//   }
//   return i

// }

// function bigint_randrange(max_val){
//   var n_bits = bigint_log2(p);
//   var ret = max_val;
//   while(ret >=max_val){
//     ret = random_bigint(n_bits)
//   }
//   return ret;

// }

// const p = BigInt("4634044778280839892961483251879153268607");
// for(let i=0;i<100;i++){
// console.log(bigint_randrange(p));
// }
// // console.log(bigint_randrange(p));