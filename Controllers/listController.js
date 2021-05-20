// Controller for list component

// Importing the model to define the operations on
let List = require('../Models/listModel');

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
                res.json({
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
                    let test = [1, 2]
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