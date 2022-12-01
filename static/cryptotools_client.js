
// ================= cryptographic constants =====================

const g = BigInt("32768"); //schnorr group generator
const p = BigInt("4634044778280839892961483251879153268607"); //schnorr group prime
// p is a ~132 bit prime number 

const two = BigInt("2");
const one = BigInt("1");

// ===============================================================


const n64 = BigInt('64');
const n8 = BigInt('8');


function random_bigint(n_bits){
  n_bytes = parseInt(Math.ceil(n_bits/8));

  const array = new Uint8Array(n_bytes);
  crypto.getRandomValues(array);

  var a = BigInt('0');
  for (let i =0;i<array.length;i++) {
    a = a + (BigInt(array[i]) << (BigInt(i)*n8));
  }
  var lshift = (n_bytes*8)-n_bits;
  a = a >> BigInt(lshift);
  return a
}

function bigint_log2(n){
  var i = 0;
  while(n > 0){
    n = n >> BigInt('1');
    i++;
  }
  return i

}

function bigint_randrange(max_val){
  var n_bits = bigint_log2(p);
  var ret = max_val;
  while(ret >=max_val){
    ret = random_bigint(n_bits)
  }
  return ret;

}

function mpow(b,e,m){
    //taken from psudocode of Applied Cryptography (Bruce Schneier)
    if (m == 1){
        return 0;
    }
    var res = BigInt("1");
    b = b%m;
    while(e > 0){
        if(e%two == 1){
            res = (res*b)%m;
        }
        e = e >> one;
        b = (b*b)%m;

    }
    return res
}

function gen_y(g,p,x){
    return mpow(g,x,p);
}

function gen_r(p){
    // return random.randint(0,p-2)
    // return BigInt("1234567");
    return bigint_randrange(p-two)
}

function gen_C(g,p,r){
    return mpow(g,r,p)
}

function prove_1(g,p,r,x){
    return (x+r)%(p-one)
}

function verify_1(g,p,C,y,ans){
    return (C*y)%p == mpow(g,ans,p)
}

function prove_2(r){
    return r 
}
function verify_2(g,p,C,ans){
    return C == mpow(g,ans,p)
}

// module.exports = {mpow,gen_y,gen_r,gen_C,prove_1,verify_1,prove_2,verify_2}