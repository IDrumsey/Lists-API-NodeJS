// Controller for item component

// Importing the model to define the operations on
let Item = require('../Models/itemModel');

// Operations

    //create new item (POST: /api/items)
    exports.new = function (req, res) {
        // create the item and set the data
        let new_item = new Item();
        new_item.name = req.body.name;
        new_item.user_id = req.body.user_id;

        // saving the model to db
        new_item.save((err) => {
            // check for error
            if(err){
                // send error info
                res.json(err);
                return
            }

            // no error -> send data
            res.json(
                {
                    status: "New item created successfully!",
                    item: new_item
                }
            )
        })
    }

    //get all items (GET: /api/items)

    exports.index = function (req, res) {
        //use the get function to find all items
        Item.get((err, items) => {
            if(err){
                res.json({
                    status: "error",
                    error: err
                });
            }
            res.json({
                Items: items
            });
        });
    }

    //get specific item (GET: /api/items/:id)
    exports.show = function (req, res) {
        Item.findById(req.params.item_id, (err, item) => {
            if(err){
                res.json({
                    status: "error",
                    error: err
                });
            }
            res.json({
                Item: item
            });
        })
    }

    //update specific item info (PUT/PATCH: /api/items/:id)
    //get specific item (GET: /api/items/:id)
    exports.update = function (req, res) {
        Item.findById(req.params.item_id, (err, item) => {
            if(err){
                res.json({
                    status: "error",
                    error: err
                });
            }

            //check there is info to update
            if(req.body.name == undefined && req.body.user_id == undefined){
                res.json({
                    status: "error",
                    error: "No information provided"
                });
                return;
            }

            //update the info using the request
            item.name = req.body.name;
            item.user_id = req.body.user_id;

            //save the items info
            item.save(err => {
                if(err){
                    res.json({
                        status: "error",
                        error: err
                    });
                }

                res.json({
                    status: "item updated",
                    Item: item
                });
            })
        })
    }

    //delete specific item (DELETE: /api/items/:id)
    module.exports.delete = function (req, res) {
        Item.deleteOne(
            {
                _id: req.params.item_id
            },
            (err, item) => {
                if(err){
                    res.json({
                        status: "error",
                        error: err
                    });
                    return
                }

                res.json({
                    status: "Deleted item id : " + req.params.item_id
                });
            }
        )
    }