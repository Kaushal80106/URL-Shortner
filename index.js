require("dotenv").config();

const express = require('express') 
const path = require('path')
const cookieParser  =  require('cookie-parser')
const { ConnectWithDb } = require('./connect')
const URL = require('./models/url')
const PORT = process.env.PORT || 8001;



const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const { checkForAuthentication , restrictTo } = require('./middlewares/auth')

const app = express() 


ConnectWithDb(process.env.MONGO_URL)
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

// Preview page for a short URL — useful for frontend display and sharing
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOne({ shortId });

    if (!entry) {
        return res.status(404).send('URL not found');
    }

    return res.render('preview', {
        url: entry,
        host: req.get('host'),
        user: req.user
    });
});

// Redirect route — trigger visit tracking then redirect to original URL
app.get('/r/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } },
        { new: true }
    );

    if (!entry || !entry.redirectURL) {
        return res.status(404).send('URL not found');
    }

    res.redirect(entry.redirectURL);
});

// API endpoint (admin-only) for metadata/analytics
app.get('/api/:shortId', restrictTo(['ADMIN']), async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOne({ shortId });

    if (!entry) return res.status(404).json({ error: 'URL not found' });

    return res.json({
        shortId: entry.shortId,
        redirectURL: entry.redirectURL,
        totalClicks: entry.visitHistory ? entry.visitHistory.length : 0,
        createdBy: entry.createdBy,
        createdAt: entry.createdAt
    });
});








app.listen(PORT , ()=>{
console.log(`Server started at ${PORT}`)
})