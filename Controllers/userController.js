// Controller for user component

// Importing the model to define the operations on
let User = require('../Models/userModel');

// used for encryption
let bcrypt = require('bcryptjs');

// used for authorization
let jwt = require('jsonwebtoken');

let config = require('../config');

// Operations

    // jwt authentication
    // https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/

    //create new user (POST: /api/users) : IE Register
    exports.new = function (req, res) {
        // create the user and set the data
        let new_user = new User();
        new_user.firstName = req.body.firstName;
        new_user.lastName = req.body.lastName;
        new_user.email = req.body.email;
        // new_user.password = req.body.password; //not hashed

        // hash the user's password
        new_user.password = bcrypt.hashSync(req.body.password, 15);

        // saving the model to db
        new_user.save((err) => {
            // check for error
            if(err){
                // send error info
                res.json(err);
                return
            }

            //create a token
            let token = jwt.sign(
                // token payload
                {
                    id: new_user._id
                },
                //secret
                config.secret,
                //options
                {
                    expiresIn: 7200 //2 hour limit
                }
            )

            res.cookie('accessToken', token, {
                httpOnly: true,
                // secure: true,
                // maxAge: 7200,
                // signed: true
            });

            // no error -> reroute/send data
            res.json(
                {
                    status: "New user created successfully!",
                    user: {
                        id: new_user._id,
                        firstName: new_user.firstName,
                        lastName: new_user.lastName,
                        email: new_user.email
                    },
                    auth: true,
                    token: token
                }
            )
        })
    }

    // login user (POST: /api/auth/login)
    exports.login = function (req, res) {
        //check if user exists using email
        User.findOne(
            //filter
            {
                email: req.body.email
            },
            //callback
            (err, user) => {

                //check for server err
                if(err) {
                    res.status(500).json({
                        status: "Server error"
                    })
                    return
                }
                //check for no user
                if(!user) {
                    res.status(200).json({
                        auth: false,
                        code: 1
                    })
                    return
                }

                //check the password
                if(!bcrypt.compareSync(req.body.password, user.password)){
                    //bad pass
                    res.status(200).json({
                        auth: false,
                        code: 2
                    })
                    return
                }

                //no err -> create a token

                let token = jwt.sign(
                    // token payload
                    {
                        id: user._id
                    },
                    //secret
                    config.secret,
                    //options
                    {
                        expiresIn: 7200 //2 hour limit
                    }
                );

                //respond with token
                res.status(200).json({
                    auth: true,
                    token: token
                });
            }
        )
    }

    // authenticate user
    exports.auth = function (req, res) {
        //get the token
        let token = req.headers['x-access-token'];

        //check if no token
        if(!token){
            //no token provided
            res.status(401).json({
                auth: false,
                status: 'Invalid credentials'
            });
        }

        //verify the token
        jwt.verify(token, config.secret, (err, decoded) => {
            // check for error
            if(err){
                return res.status(500).json({
                    auth: false,
                    status: "Error: couldn't authenticate credentials"
                })
            }

            // no error -> return res
            res.json({
                status: decoded
            })
        })

        //respond
    }

    //get all users (GET: /api/users)

    exports.index = function (req, res) {
        //use the get function to find all users
        User.get((err, users) => {
            if(err){
                res.json({
                    status: "error",
                    error: err
                });
            }
            res.json({
                Users: users
            });
        });
    }

    //get specific user (GET: /api/users/:id)
    exports.show = function (req, res) {
        User.findById(req.params.user_id, (err, user) => {
            if(err){
                res.json({
                    status: "error",
                    error: err
                });
            }
            res.json({
                User: user
            });
        })
    }

    //update specific user info (PUT/PATCH: /api/users/:id)
    //get specific user (GET: /api/users/:id)
    exports.update = function (req, res) {
        User.findById(req.params.user_id, (err, user) => {
            if(err){
                res.json({
                    status: "error",
                    error: err
                });
                return
            }

            //check for not found
            if(!user){
                return res.json({
                    status: "not found"
                })
            }

            //check there is info to update
            if(req.body.firstName == undefined && req.body.lastName == undefined && req.body.email == undefined && req.body.password == undefined && req.body.new_list == undefined && req.body.remove_list == undefined){
                res.json({
                    status: "error",
                    error: "No information provided"
                });
                return;
            }

            //add or remove list
            let new_arr = user.list_ids || [];
            if(req.body.new_list != undefined){
                //add the new item
                new_arr.push(req.body.new_list);
            }
            if(req.body.remove_list != undefined){
                //remove the item => get index and slice
                let i = new_arr.indexOf(req.body.remove_list);

                if(i != -1){
                    //remove from array
                    new_arr.splice(i, 1)
                }
            }

            //update the info using the request
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            user.password = req.body.password || user.password;
            user.list_ids = new_arr;

            //save the users info
            user.save(err => {
                if(err){
                    res.json({
                        status: "error",
                        error: err
                    });
                }

                res.json({
                    status: "User updated",
                    User: user
                });
            })
        })
    }

    //delete specific user (DELETE: /api/users/:id)
    module.exports.delete = function (req, res) {
        User.deleteOne(
            {
                _id: req.params.user_id
            },
            (err, user) => {
                if(err){
                    res.json({
                        status: "error",
                        error: err
                    });
                }

                res.json({
                    status: "Deleted user id : " + req.params.user_id
                });
            }
        )
    }