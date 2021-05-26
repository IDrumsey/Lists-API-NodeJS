// https://www.youtube.com/watch?v=zYi9PguVFx8

let jwt = require('jsonwebtoken');
let config = require('../config');

exports.auth = () => {
    return    (req, res, next) => {

        let token = req.headers['authorization'];

        // checks if there wasn't a token
        if(!token){
            return res.json({
                auth: false
            });
        }

        token = token.slice(7);

        jwt.verify(token, config.secret, (err, decoded) => {
            if(err){
                return res.json({
                    auth: false
                });
            }

            // no issues -> move on
            next();
        });
    }
}