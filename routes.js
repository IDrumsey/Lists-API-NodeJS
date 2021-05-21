let Router = require('express').Router();

//Define paths

    // Include the user controller
    let UserController = require('./Controllers/userController');

    //User routes

        // -> get all users (GET)
        // -> create new user (POST)
        Router.route('/users')
            .get(UserController.index)
            .post(UserController.new);

        Router.route('/auth')
            .get(UserController.auth)

        // -> get specific user info (GET)
        // -> update specific user info (PUT)
        // -> delete specific user (DELETE)
        Router.route('/users/:user_id')
            .get(UserController.show)
            .put(UserController.update)
            .delete(UserController.delete)

//==================================================================================================================================

    // Include the list controller
    let ListController = require('./Controllers/listController');

    //list routes

        // -> get all lists (GET)
        // -> create new list (POST)
        Router.route('/lists')
            .get(ListController.index)
            .post(ListController.new);

        // -> get specific list info (GET)
        // -> update specific list info (PUT)
        // -> delete specific list (DELETE)
        Router.route('/lists/:list_id')
            .get(ListController.show)
            .put(ListController.update)
            .delete(ListController.delete)

//==================================================================================================================================

    // Include the user controller
    let ItemController = require('./Controllers/itemController');

    //item routes

        // -> get all items (GET)
        // -> create new item (POST)
        Router.route('/items')
            .get(ItemController.index)
            .post(ItemController.new);

        // -> get specific item info (GET)
        // -> update specific item info (PUT)
        // -> delete specific item (DELETE)
        Router.route('/items/:item_id')
            .get(ItemController.show)
            .put(ItemController.update)
            .delete(ItemController.delete)

//export the router obj which contains all the routes

module.exports = Router;