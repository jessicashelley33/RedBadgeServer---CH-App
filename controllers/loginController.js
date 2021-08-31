const router = require('express').Router();
const { LoginModel }  = require("../models/login")
const  UniqueConstrainError  = require("sequelize/lib/errors")
const jwt = require("jsonwebtoken")
// var bodyParser = require('body-parser')
const bcrypt = require("bcryptjs");

// var jsonParser = bodyParser.json()

router.post("/", async(req,res) => {
    let { userName, password } = req.body;

    try {
        let loginUser = await LoginModel.findOne({
            where: {
                userName: userName,
                
            },
        });
        if(loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);
        if(passwordComparison){
            let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
            res.status(200).json({
                login: loginUser,
                message: "User successfully logged in!",
                sessionToken: token
            });
        } else{
            res.status(401).json({
                message: "Incorrect username or password"
            })
        }} } catch(err) {
        console.log(err)
       //if(err instanceof UniqueConstrainError) 
       {
             res.status(409).json({
             message: "Username already exists"
            })
         }
        console.log(err)
        res.status(500).json({
            message: "Failed to login user"
        })
    }
 
});

router.get("/", async (req, res) => {
    let { email, userName } = req.body;
    try{
    const loginUser = await LoginModel.findAll({
        email,
        userName,
        
    });
    res.status(201).json({
        message: "Displaying All User's",
        loginUser: loginUser
        });
} catch (err) {
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "No User's have been created",
        });
    } else {
    res.status(500).json({
        message: "Failed to display list of User's",
    });
    }
}
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    //console.log('id', id)
    let { email, userName } = req.body;
    //console.log('mybody', req.body)
    try{
    const loginUser = await LoginModel.update({
        email,
        userName},
        {where:{id}, returning: true}
    );
        res.status(201).json({
        message: "User succesfully updated and Logged in",
        loginUser: loginUser
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

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let { email, userName } = req.body;
    try{
    const loginUser = await LoginModel.destroy({
        
        where:{id}, returning: true}
    ); 
    res.status(201).json({
        message: "User succesfully deleted",
        loginUser: loginUser
       
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
