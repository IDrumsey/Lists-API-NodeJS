// Model for the user component

let Mongoose = require('mongoose');

/*
    User(){
        firstName
        lastName
        email
        password
    }
*/

let UserSchema = new Mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }
);

//create test model and export
let User = Mongoose.model('User', UserSchema);

module.exports = User;

//define the find method
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}