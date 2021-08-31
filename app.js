require("dotenv").config();
const Express = require("express");
//const controllers = require("./controllers");
const app = Express();
const dbconnection = require("./db");
//const loginController = require("./controllers/loginController")
const userController = require('./controllers/userController')
// const bodyparser = require('body-parser')

app.use(Express.json()); //Must be above all routes
app.use(require("./middleware/headers"));


//app.use("/user", LoginController)
//app.use('/login', loginController);
app.use('/user', userController);

dbconnection
    .authenticate()
    .then(() => dbconnection.sync())
    .then(() => {
    app.listen(5000, () => {
        console.log(`[Server]: App is listening on 5000.`);
    });
    })
    .catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
  });


const middleware = require('./middleware');
app.use(middleware.CORS);


app.use(Express.json()); //Must be above all routes
 app.use(require("./middleware/headers"));







  
