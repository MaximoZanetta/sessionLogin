const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const dotenv = require("dotenv") 
const session = require("express-session") 
const cookieParser = require("cookie-parser") 
const auth = require("./middleware/auth.middleware.js") 
const mongoStore = require("connect-mongo") 


app.use(express.json())
app.set('views','./views')
app.set('view engine', 'ejs')
app.use(express.static("./src/public"))
dotenv.config()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        store: mongoStore.create({
          mongoUrl: process.env.MONGO_URI
        }),
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

app.get('',async(req,res)=>{
    const user = await req.session.user
    if(user) {
        return res.redirect('/profile')
    }
    res.sendFile(__dirname+'/public/login.html')
})

app.get('/profile',auth, async (req,res)=> {
    const user = await req.session.user
    res.render('/profile', {user})
})

app.listen(PORT,()=>{
    console.log('server is running');
})