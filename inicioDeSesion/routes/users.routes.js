const { Router } = require('express')
const router = Router()
const passport = require('passport')

router.get('/signup', (req, res, next)=>{
    res.render('register')
})
router.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}))
router.get('/signin',(req, res, next)=>{
    res.render('login')
})
router.post('/signin', passport.authenticate('local-signin',{
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}))

router.get('/logout', (req, res, next)=> {
    req.logOut()
    res.redirect('/signin')
})

router.get('/profile',isAuthenticate, (req,res, next)=>{ 
    res.render('profile')
})

function isAuthenticate(req, res ,next){
    if(req.isAuthenticate()) {
        return next()
    }
    res.redirect('/signin')
}

module.exports = router