
const passport=require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.serializeUser(function(user,done){
    done(null,user)
})
passport.deserializeUser(function(user,done){
    done(null,user)
})

passport.use(new GoogleStrategy({
    clientID:"710290063066-na521135smc77vr3hgkihtmpc2stq2n5.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile)
     return done(null,profile)
  }
));
