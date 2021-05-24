// https://www.youtube.com/watch?v=zYi9PguVFx8

let jwt = require('jsonwebtoken');
let config = require('../config');

exports.auth = () => {
    return    (req, res, next) => {

        let token = req.headers['authorization'];

        if(!token){
            return res.json({
                status: "unauthorized",
            });
        }

        token = token.slice(7);

        jwt.verify(token, config.secret, (err, decoded) => {
            if(err){
                return res.json({
                    status: "unauthorized"
                });
            }
            next();
        });
    }
}