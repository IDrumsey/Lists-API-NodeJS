const Express = require('express');
const Chalk = require('chalk');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const CORS = require('cors');
const CookieParser = require('cookie-parser')

let Routes = require('./routes');

let app = Express();

const PORT = 8000 || process.env.PORT;

app.use(CORS({
    origin: ['http://localhost:3000'],
    credentials: true
}));

app.use(BodyParser.urlencoded({
    extended: true
}));

app.use(BodyParser.json());

app.use(CookieParser())

Mongoose.connect('mongodb://localhost/testApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

let DB = Mongoose.connection;

if(!DB){
    console.error(Chalk.red("ERROR: Couldn't connect to the database!"));
}
else{
    console.log(Chalk.green("Connected to database!"));
}

//Point the app to the API routes obj
app.use('/api', Routes);


app.listen(PORT, ()=>{
    console.log(Chalk.yellowBright(`Server started on port ${PORT}...`));
});