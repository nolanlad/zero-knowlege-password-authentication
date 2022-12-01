var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var crypto = require('crypto')
var cookieParser = require('cookie-parser');

var cryptotools = require('./cryptotools.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// ================= cryptographic constants =====================

const g = BigInt("32768"); //schnorr group generator
const p = BigInt("4634044778280839892961483251879153268607"); //schnorr group prime
const N_CHALLENGES = 40;
// ===============================================================


//=================       database           ===================== 

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const Schema = mongoose.Schema;

const userSchema = Schema({
  uname: String,
  y: String,
});
const userModel = mongoose.model("users", userSchema);

// ===============================================================



//generate_auth_token
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}


function get_y(uname){
    var currUser = users.filter(function(movie){
        if(movie.uname == uname){
           return true;
        }
     });
     return currUser[0].y;
}

function add_user(uname,y){
    userModel.find({ uname: uname },"uname y", (err, users) => {
        if (err) return handleError(err);
        if (users.length > 0){
            return
        }
        const user = new userModel({ uname: uname, y:y});
        user.save((err) => {
            if (err) return handleError(err);
            console.log('user added');
            // Bob now has his story
        });
    });
}

var users = []

var challenge = 0;
var challenge_passed = 1;
var authenticated = 0;
var n_challenges_passed = 0;


const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'static')))


app.post('/zauth/signup', function(req, res) {
    //this is not safe for SQL injection lmao
   var username = req.body.uname;
   var y = req.body.y;
   users.push({uname:username,y:y,
    n_challenges_passed:0,
    authenticated:0,
    challenge_passed:1,
    C:-1,
    Cs:[],
    challenge:0,
    challenges:[],
})
    console.log(users)
    add_user(username,y);
   res.json({message: "New user created."});
});

app.post('/zauth/challenges',function(req,res){
    uname = req.body.uname;
    userModel.find({ uname: uname },"uname y", (err, userinfo) => {
        if (err) return handleError(err);
        if (userinfo.length > 0){
            console.log(userinfo);
            //start challenge 
            users.push({uname:userinfo[0].uname,y:userinfo[0].y,
                n_challenges_passed:0,
                authenticated:0,
                challenge_passed:1,
                C:-1,
                Cs:[],
                challenge:0,
                challenges:[],
            })

            uname = req.body.uname;
            var user = users.filter(function(movie){
                if(movie.uname == uname){
                return true;
                }
            });
            console.log(req.body.C);
            // var Cs = JSON.parse(req.body.C);
            var Cs = req.body.C;
            var user = users.filter(function(movie){
                if(movie.uname == uname){
                movie.Cs = Cs;
                }
            });
            var challenges =[];
            for(let i=0;i<N_CHALLENGES;i++){
                challenges.push( Math.floor(Math.random()*2))
            }
            var user = users.filter(function(movie){
                if(movie.uname == uname){
                movie.challenges = challenges;
                }
            });
            console.log(users);
            res.json(challenges)
        }
        else{
            res.json({message:'user does not exist'})
        }
    });

})

app.post('/zauth/answer',function(req,res){
    uname = req.body.uname;
    userModel.find({ uname: uname },"uname y", (err, userinfo) => {
        if (err) return handleError(err);
        if (userinfo.length > 0){

            var user = users.filter(function(movie){
                if(movie.uname == uname){
                return true;
                }
            });
            // var answers = JSON.parse(req.body.answers);
            var answers = req.body.answers;
            console.log(user);
            var challenges = user[0].challenges;
            var Cs = user[0].Cs;
            var y = BigInt(get_y(uname));
            console.log(challenges)
            for(let i = 0;i<N_CHALLENGES;i++){
                var x = BigInt(answers[i]);
                var challenge = challenges[i];
                
                if (challenge == 1){
                    if(cryptotools.verify_2(g,p,BigInt(Cs[i]),x)){
                        console.log('passed');
                    }
                    else{
                        console.log('failed')
                        res.send('failed');
                        return
                    }
                }
                if (challenge == 0){
                    if(cryptotools.verify_1(g,p,BigInt(Cs[i]),y,x)){
                        console.log('passed');
                    }
                    else{
                        console.log('failed')
                        res.send('failed');
                        return
                    }
                }
            }
            res.cookie('AuthToken', 'jeansimmons');
            res.json({message:'authenticated'});
            // res.redirect('/protected');
        }
        else{
            //throw a 400 error 
            res.json({'message':'no challenges were sent'})
        }
    });


})


app.get('/protected', function(req, res) {
    if(req.cookies.AuthToken!='jeansimmons'){
        res.status(400);
        res.send('You are not authenticated to access this resource');
    }
    else{
        // console.log(req.cookies);
        res.send('You can see the secret page');
    }
});
app.listen(3030);