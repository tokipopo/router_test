const jwt = require('jsonwebtoken');

let secret = 'tokki';
function create(data,expiresIn = 60*60*24*7){
    let token = jwt.sign({data},secret,{expiresIn});
    return token;
}

function verify(token){
    let res;
    try{
        let result = jwt.verify(token,secret);
        res = true;
    }catch(err){
        res = false;
    }
    return res;
}

module.exports = {
    create,
    verify
}