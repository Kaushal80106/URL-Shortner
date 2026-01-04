const express = require('express') 
const path = require('path')
const cookieParser  =  require('cookie-parser')
const { ConnectWithDb } = require('./connect')
const URL = require('./models/url')



const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const { checkForAuthentication , restrictTo } = require('./middlewares/auth')

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
app.use("/css", express.static("views/css"));


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentication)


app.use('/',staticRoute)

app.use('/url',restrictTo(["NORMAL","ADMIN"]),urlRoute)

app.use('/user',userRoute)
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    
    // Find the entry in the database
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } },
        { new: true }  // Return the updated document
    );

    // Check if entry exists before trying to access redirectURL
    if (!entry || !entry.redirectURL) {
        return res.status(404).send('URL not found');
    }

    // Redirect to the URL stored in redirectURL field
    res.redirect(entry.redirectURL);
});








app.listen(PORT , ()=>{
console.log(`Server started at ${PORT}`)
})