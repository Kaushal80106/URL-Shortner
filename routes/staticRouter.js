const express = require('express');
const URL = require('../models/url');
const { restrictTo } = require('../middlewares/auth');

const router = express.Router() ;

router.get('/admin/urls',restrictTo(["ADMIN"]),async (req,res,)=>{
   const Allurls = await URL.find({ })
   
   const totalClicks = Allurls.reduce((acc, url) => acc + (url.visitHistory ? url.visitHistory.length : 0), 0);

     return res.render("home",{
        urls : Allurls,
        totalClicks
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
        totalClicks
     })
})


router.get('/signup',(req,res)=>{
   return res.render("signup")
})


router.get('/login',(req,res)=>{
   return res.render("login")
})



module.exports = router;