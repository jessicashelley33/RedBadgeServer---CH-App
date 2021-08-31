const router = require('express').Router();
const   UserModel   = require("../models/user")
const { UniqueConstrainError } = require("sequelize/lib/errors")
const jwt = require("jsonwebtoken")
// var bodyParser = require('body-parser')
const bcrypt = require("bcryptjs");
var randomstring = require("randomstring");


const isUserAdmin = (req, res, next)=>{
// console.log(req.headers) 
let token = req.headers.authorization;
const base64Url = token.split('.')[1];
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const buff = new Buffer(base64, 'base64');
const payloadinit = buff.toString('ascii');
const payload = JSON.parse(payloadinit);
console.log(payload);
console.log(payload.hasOwnProperty('isAdmin'))
if(!payload.hasOwnProperty('isAdmin')){
    return res.status(500).send('Restricted route')
}
if(payload.isAdmin){
    return next()
}
return res.status(500).send('Restricted route')
 
}

// var jsonParser = bodyParser.json()
router.post('/register', async (req, res) => {
    let { email, userName } = req.body;
    const password = randomstring.generate(9);
    //console.log(RegisterModel)
    if (!email && !userName && !password){
        return res.status(401).json({
            message: "Failed to register user"
         });
     } 
     if(email.indexOf('@') < 0 ){
         return res.status(500).json({
            message: "Failed to register user"
        })
     }
    try {
        const user = await UserModel.create({
            email,
            userName,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({id: user.id, userName: user.userName},
        process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})
        res.status(201).json({
            message: "User registered successfully",
            user: user,
            sessionToken: token
        }) 
    }  catch(err) {
        console.log(err)
       if(err instanceof UniqueConstrainError) {
             res.status(409).json({
             message: "Username already exists"
            })
         }
        console.log(err)
        res.status(500).json({
            message: "Failed to register user"
        })
    }
    
})

router.post("/login", async(req,res) => {
    let { userName, password } = req.body;

    if (!userName || !password){
       return res.status(401).json({
        message: "Incorrect username or password"
        });
    }
    try {

        let loginUser = await UserModel.findOne({
            where: {
                userName: userName,
            },
        });
        if(loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);
            if(passwordComparison){
                let isAdmin = loginUser.isAdmin;
            let token = jwt.sign({id: loginUser.id, isAdmin}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
            res.status(200).json({
                user: loginUser,
                message: "User successfully logged in!",
                sessionToken: token,
                isAdmin
            });
        } 
        } else {
            res.status(401).json({
                message: 'Incorrect username or password'
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }});

    router.get("/", async (req, res) => {
    try{
        const token = req.headers['authorization']
       // if(jwt.decode(token).userName === 'Admin1')
        const user = await UserModel.findAll({
            attributes: ['id', 'email', 'userName']
        });
        res.status(201).json({
        message: "Displaying All User's",
        users: user
        });
} catch (err) {
    res.status(500).json({
        message: "Failed to display list of User's",
    });
}
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    console.log('id', id)
    let { email, userName } = req.body;
    console.log('mybody', req.body)
    try{
    const user = await UserModel.update({
        email,
        userName},
        {where:{id}, returning: true}
    );
        res.status(201).json({
        message: "User succesfully updated",
        user: user
    });
} catch (err) {
    console.log(err)
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "User already updated",
        });
    } else {
    res.status(500).json({
        message: "Failed to update user",
    });
    }
}
});

router.delete("/:id", isUserAdmin, async (req, res) => {
    let id = req.params.id;

    try{
    await UserModel.destroy({
        
        where:{id}, returning: true}
    ); 
    res.status(201).json({
        message: "User succesfully deleted"
    });
} catch (err) {
    console.log(err)
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "User already deleted",
        });
    } else {
    res.status(500).json({
        message: "Failed to delete user",
    });
    } 
}
});



module.exports = router;
