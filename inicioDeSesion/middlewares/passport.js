const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../models/user')


const salt = () => bcrypt.genSaltSync(10)
const createHash = ( password ) => bcrypt.hashSync(password, salt())
const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

passport.use('local-signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const userFound = await User.findOne({email: email})
    if(userFound) {
        return done(null, false)
    } else {

        const user = new User()
        user.email = email
        user.password = createHash(password)
        await user.save()
        done(null, user)
    }


}))

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async ( req, email, password, done ) => {
    const user = await User.findOne({email: email})
    if(!user) {
        return done(null, false)
    } 
    if(!isValidPassword(user, password)) {
        return done(null, false)
    }
    done(null, user)
}))

passport.serializeUser((user, done) => {
    console.log('inside serialized');
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    console.log('inside deserialized');
    const user = await User.findById({_id: id})
    done(null, user)
})