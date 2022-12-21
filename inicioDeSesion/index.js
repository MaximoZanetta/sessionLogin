const express = require('express')
const app = express()
const PORT = process.argv[2] || 8080
const os = require('os')
const cluster = require('cluster')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
const passport = require('passport')
const session = require('express-session')
const { fork } = require('child_process')
const clusterMode = process.argv[3] === "CLUSTER"
const cpus = os.cpus().length


require('./middlewares/passport')
//middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//views
app.set('views', path.join(__dirname, 'views') )
app.set('view engine', 'ejs')

//routes
app.use(require('./routes/users.routes'))

//ruta info
app.get('/info', (req, res) => {
    res.json({cpus: cpus, sistemaOperativo: process.platform, versionNode: process.version, memoriaTotal: process.memoryUsage(), idProceso: process.pid, carpetaDelProyecto: process.cwd(), tituloDelProceso: process.title})
})


//ruta random
app.get('/random', (req, res) => {
    console.log(req.query);
    const computo = fork('./calculateRandom.js')
    computo.on('message', (data) => {
        res.json({resltado: data})
    })
})
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_MONGO_URI).then(()=> console.log('database connected')).catch((err)=> console.log(err))

if(clusterMode && cluster.isPrimary){
    for(let i= 0; i < cpus; i++) {
        cluster.fork()
    }
} else {

    app.listen(PORT, ()=> {
        console.log('server running');
    })
}
