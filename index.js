const express = require('express') 
const path = require('path')
const urlRoute = require('./routes/url')
const staticRouter = require('./routes/staticRouter')
const { ConnectWithDb } = require('./connect')
const URL = require('./models/url')

const app = express() 
const PORT = 8001

ConnectWithDb("mongodb://127.0.0.1:27017/short-url")
.then(()=>{
    console.log("Connected with DB Successfully")
})
.catch(()=>{
   console.log("Error in Connect with DB")
})

app.set("view engine"  , "ejs") 
app.set("views",path.resolve("./views")) ;


app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use('/',staticRouter)
// app.get("/test", async (req,res) =>{
//    const allUrls = await URL.find({});

//    return res.render('home',{
//       urls : allUrls,
      
//    })
// })




app.use('/url',urlRoute)






app.get('/:shortId',async (req,res)=>{
   const shortId = req.params.shortId ;
 const entry =   await URL.findOneAndUpdate({shortId},{
    $push :{
       visitHistory:{ timestamp : Date.now()},
    },
   });
  
   res.redirect(entry.redirectURL)

}) 

app.listen(PORT , ()=>{
console.log(`Server started at ${PORT}`)
})