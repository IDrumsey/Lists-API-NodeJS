let Router = require('express').Router();

let { auth } = require('./Middleware/authMiddleware');

//Define paths

    // Include the user controller
    let UserController = require('./Controllers/userController');

    //User routes

        // -> get all users (GET)
        // -> create new user (POST)
        Router.route('/users')
            .post(UserController.new)
            .get(UserController.index) // protected

        Router.route('/auth/login')
            .post(UserController.login)

        Router.route('/auth')
            .get(UserController.auth)

        // -> get specific user info (GET)
        // -> update specific user info (PUT)
        // -> delete specific user (DELETE)
        Router.route('/users/:user_id')
            .all(auth())
            .get(UserController.show) // protected
            .put(UserController.update) // protected
            .delete(UserController.delete) // protected

        // -> get specific user info by email (GET)
        Router.route('/users/:user_email')
            .all(auth())
            .get(UserController.showByEmail) // protected

//==================================================================================================================================

    // Include the list controller
    let ListController = require('./Controllers/listController');

    //list routes

        // -> get all lists (GET)
        // -> create new list (POST)
        Router.route('/lists')
            .all(auth())
            .get(ListController.index) // protected
            .post(ListController.new); // protected

        // -> get specific list info (GET)
        // -> update specific list info (PUT)
        // -> delete specific list (DELETE)
        Router.route('/lists/:list_id')
            .all(auth())
            .get(ListController.show) // protected
            .put(ListController.update) // protected
            .delete(ListController.delete) // protected

        // -> add contributor (POST)
        Router.route('/lists/:list_id/contributor')
            .all(auth())
            .post(ListController.addContributor) // protected
            .delete(ListController.removeContributor) // protected

//==================================================================================================================================

    // Include the user controller
    let ItemController = require('./Controllers/itemController');

    //item routes

        // -> get all items (GET)
        // -> create new item (POST)
        Router.route('/items')
            .all(auth())
            .get(ItemController.index) // protected
            .post(ItemController.new);// protected

        // -> get specific item info (GET)
        // -> update specific item info (PUT)
        // -> delete specific item (DELETE)
        Router.route('/items/:item_id')
            .all(auth())
            .get(ItemController.show) // protected
            .put(ItemController.update) // protected
            .delete(ItemController.delete) // protected

//export the router obj which contains all the routes

module.exports = Router;