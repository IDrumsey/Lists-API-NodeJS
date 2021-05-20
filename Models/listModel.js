// Model for the list component

let Mongoose = require('mongoose');

/*
    List(){
        name
        user_id
        items[]
    }
*/

let ListSchema = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        user_id: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        item_ids: [
            {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Item'
            }
        ]
    }
);

// Add the unique composite key
ListSchema.index({name: 1, user_id: 1}, { unique: true });

//create test model and export
let List = Mongoose.model('List', ListSchema);

module.exports = List;

//define the find method
module.exports.get = function (callback, limit) {
    List.find(callback).limit(limit);
}