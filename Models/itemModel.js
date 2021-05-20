// Model for the item component

let Mongoose = require('mongoose');

/*
    Item(){
        name
        user_id
    }
*/

let ItemSchema = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        user_id: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // list: {
        //     type: Mongoose.Schema.Types.ObjectId,
        //     ref: 'List'
        // }
    }
);

//create test model and export
let Item = Mongoose.model('Item', ItemSchema);

module.exports = Item;

//define the find method
module.exports.get = function (callback, limit) {
    Item.find(callback).limit(limit);
}