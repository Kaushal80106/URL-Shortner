const express = require('express');
const URL = require('../models/url');
const { restrictTo } = require('../middlewares/auth');

const router = express.Router() ;

router.get('/admin/urls',restrictTo(["ADMIN"]),async (req,res,)=>{
   const Allurls = await URL.find({ })
   
   const totalClicks = Allurls.reduce((acc, url) => acc + (url.visitHistory ? url.visitHistory.length : 0), 0);

     return res.render("home",{
        urls : Allurls,
        totalClicks,
        user: req.user
     })
})


router.get('/',restrictTo(["NORMAL","ADMIN"]),async (req,res)=>{
   
    let Allurls ;
    let totalClicks ;

    if(req.user.role === 'ADMIN') {
        Allurls = await URL.find({})
        totalClicks = Allurls.reduce((acc, url) => acc + (url.visitHistory ? url.visitHistory.length : 0), 0);
    } else {
        Allurls = await URL.find({createdBy : req.user._id})
    }
   
     return res.render("home",{
        urls : Allurls,
        totalClicks,
        user: req.user
     })
})


router.get('/signup',(req,res)=>{
   return res.render("signup",{ user: req.user })
})


router.get('/login',(req,res)=>{
   return res.render("login",{ user: req.user })
})

// Sign out route - clears auth cookie and redirects to login
router.get('/logout', (req, res) => {
   res.clearCookie('token');
   return res.redirect('/login');
});



module.exports = router;