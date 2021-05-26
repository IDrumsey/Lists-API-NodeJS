// Controller for list component

// Importing the model to define the operations on
let List = require('../Models/listModel');

let User = require('../Models/userModel');

// Operations

    //create new list (POST: /api/lists)
    exports.new = function (req, res) {
        // create the list and set the data
        let new_list = new List();
        new_list.name = req.body.name;
        new_list.user_id = req.body.user_id;
        new_list.item_ids = req.body.items;

        // saving the model to db
        new_list.save((err) => {
            // check for error
            if(err){
                // send error info
                res.json(err);
                return
            }

            // no error -> send data
            res.json(
                {
                    status: "success",
                    list: new_list
                }
            )
        })
    }

    //get all lists (GET: /api/lists)

    exports.index = function (req, res) {
        //use the get function to find all lists
        List.get((err, lists) => {
            if(err){
                res.json({
                    status: "error",
                    error: err
                });
            }
            res.json({
                List: lists
            });
        });
    }

    //get specific list (GET: /api/lists/:id)
    exports.show = function (req, res) {
        List.findById(req.params.list_id, (err, list) => {
            if(err){
                res.json({
                    status: "error",
                    error: err
                });
                return
            }
            res.json({
                List: list
            });
        })
    }

    //update specific list info (PUT/PATCH: /api/lists/:id)
    //get specific list (GET: /api/lists/:id)
    exports.update = function (req, res) {
        List.findById(req.params.list_id, (err, list) => {
            if(err){
                return res.json({
                    status: "error",
                    error: err
                });
            }


            //check there is info to update
            if(req.body.name == undefined && req.body.user_id == undefined && req.body.remove_item == undefined && req.body.new_item == undefined){
                res.json({
                    status: "error",
                    error: "No information provided"
                });
                return
            }

            //create new items array
            let new_arr = list.item_ids || [];
            if(req.body.new_item != undefined){
                //add the new item
                new_arr.push(req.body.new_item);
            }
            if(req.body.remove_item != undefined){
                //remove the item => get index and slice
                let i = new_arr.indexOf(req.body.remove_item);

                if(i != -1){
                    //remove from array
                    new_arr.splice(i, 1)
                }
            }

            //update the info using the request
            list.name = req.body.name || list.name;
            list.user_id = req.body.user_id || list.user_id;
            list.item_ids = new_arr

            //save the lists info
            list.save(err => {
                if(err){
                    res.json({
                        status: "error",
                        error: err
                    });
                    return
                }

                res.json({
                    status: "list updated",
                    List: list
                });
                return
            })
        })
    }

    // Add contributors
    module.exports.addContributor = function (req, res) {
        List.findById(req.params.list_id, (err, list) => {
            if(err){
                return res.json({
                    status: "error",
                    error: err
                });
            }

            // check if user is set
            if(!req.body.user_email){
                // no user specified
                return res.json({
                    status: "error",
                    error: "No user specified"
                });
            }

            // find the user
            User.findOne({email: req.body.user_email}, (err, user) => {
                //check if err
                if(err){
                    return res.json({
                        status: "error",
                        error: err
                    });
                }

                //check for no user
                if(!user){
                    return res.json({
                        status: "error",
                        error: "No user with email : " + req.body.user_email
                    });
                }

                //found user -> update contributors arr
                let all_contributors = [
                    ...list.contributors,
                    user._id
                ];

                list.contributors = all_contributors;

                //attempt to save the new arr

                list.save(err => {
                    // check for err
                    if(err){
                        return res.json({
                            status: "error",
                            error: "Couldn't save the new contributor to the list"
                        });
                    }

                    //saved -> respond with success message
                    return res.json({
                        status: "success",
                        list: list
                    });
                })
            })
        })
    }

    //remove contributor
    module.exports.removeContributor = function(req, res) {
        //find the list
        List.findById(req.params.list_id, (err, list) => {
            //check for server err
            if(err){
                return res.json({
                    status: "error",
                    error: err
                });
            }

            //check for no list
            if(!list){
                return res.json({
                    status: "error",
                    error: "List " + req.params.list_id + " not found"
                });
            }

            //found list -> remove user from contributors
            let found_user = false;
            let found_user_obj;

            //flags for breaking
            let stop = false;

            for(let i = 0; i < list.contributors.length; i++){
                console.log("test1")
                let contributor = list.contributors[i]; // contributor id

                // find by id and compare emails
                User.findById(contributor, (err, user) => {
                    //check for server err
                    if(err){
                        return res.json({
                            status: "error",
                            error: err
                        });
                    }

                    //check if no user
                    if(!user){
                        //return with err since continue isn't working in here
                        return;
                    }

                    //found user -> compare emails
                    console.log("temp email : ", user.email)
                    if(user.email == req.body.user_email){
                        console.log("found")
                        // set found flag
                        found_user = true;
                        console.log(found_user)
                        // set found user for reference later
                        found_user_obj = user;
                        // set stop flag
                        stop = true;

                        //stop searching
                        return;
                    }
                })

                if(stop){
                    break;
                }
            }
            console.log(found_user)

            console.log("test2")

            //check if not in contributors list
            if(!found_user){
                console.log("user not found")
                return res.json({
                    status: "error",
                    error: "User with email " + req.body.user_email + " isn't a contributor for list " + list._id
                })
            }

            //remove from the list contributors
            let user_index = list.contributors.find(element => element === found_user_obj._id);

            console.log(user_index)

            //check if not found (this should be handled above), but just in case
            if(user_index === -1){
                return res.json({
                    status: "error",
                    error: "User with email " + req.body.user_email + " isn't a contributor for list " + list._id
                })
            }

            // found index -> remove it
            let updated_contributors = list.contributors.splice(user_index, 1);

            list.contributors = updated_contributors;

            // attempt to save update list
            list.save(err => {
                // check for server error
                if(err){
                    return res.json({
                        status: "error",
                        error: err
                    })
                }

                // good save
                return res.json({
                    status: "success",
                    List: list
                })
            })
        })
    }

    //delete specific list (DELETE: /api/lists/:id)
    module.exports.delete = function (req, res) {
        List.deleteOne(
            {
                _id: req.params.list_id
            },
            (err, list) => {
                if(err){
                    res.json({
                        status: "error",
                        error: err
                    });
                    return
                }

                res.json({
                    status: "success"
                });
            }
        )
    }