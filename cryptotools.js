// crypto tools

const two = BigInt("2");
const one = BigInt("1");

//https://en.wikipedia.org/wiki/Modular_exponentiation#Pseudocode
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
    return BigInt("100");
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



// const g = BigInt("32768");
// let x = BigInt("12345");
// let p = BigInt("4634044778280839892961483251879153268607");

// let y = gen_y(g,p,x);
// let r = BigInt("14512321387124123");
// let C = gen_C(g,p,r);


// ans = prove_1(g,p,r,x);
// console.log(verify_1(g,p,C,y,ans))

// console.log(p)
// console.log("Power is " + mpow(g, x, p));
module.exports = {mpow,gen_y,gen_r,gen_C,prove_1,verify_1,prove_2,verify_2}