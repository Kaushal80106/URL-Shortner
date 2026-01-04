const User = require("../models/user");
const { v4 : uuidv4} = require('uuid')
const { setUser } = require('../service/auth')

async function handleUserSignup(req ,res) {
     const { name , email , password } = req.body ;
     await User.create({
        name ,
        email ,
        password,
     });

     return res.render("home",{ user: req.user })
}


async function handleUserLogin(req ,res) {
     const { email , password } = req.body ;
     const user = await User.findOne({email,password}) ;
     if(!user) {
        return res.redirect("/signup")
     }
     const token = setUser(user) ;
     
     res.cookie("token",token)
     
     return res.redirect("/")
}



module.exports = {
    handleUserSignup ,
    handleUserLogin ,
}