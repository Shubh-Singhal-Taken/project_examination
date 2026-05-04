const express = require('express');
const router  = express.Router();
const passport = require('passport')
const User = require('../models/user');


router.get('/register',(req,res)=>{
    res.render('auth/register')
});


router.post('/register',async(req,res,next)=>{
  try{
        var username         = req.body.username
        var password = req.body.password
        var nationality = req.body.nationality
        var travelStyle   = req.body.travelStyle
        var favoriteContinent = req.body.favoriteContinent

        var newUser = new User({username:username,nationality:nationality,travelStyle:travelStyle,favoriteContinent:favoriteContinent})
        var registeredUser= await User.register(newUser,password)
        console.log(registeredUser)
        req.login(registeredUser,function(err){
          if(err){
                console.log(err)
                return next(err)
            }
            req.flash('success','Welcome, '+registeredUser.username+'!')
            res.redirect('/journals')
        })
    }catch(e){
    console.log("register error: "+e)
        req.flash('error',e.message)
        res.redirect('/register')
    }
});


router.get('/login',(req,res)=>{
    res.render('auth/login')
});

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),function(req,res){
    var user=req.user
    var name=user.username
    console.log(name+" logged in")
    req.flash('success',"Welcome back, "+name+"!")
    res.redirect('/journals')
});


router.get('/logout',(req,res,next)=>{
    req.logout(function(err){
      if(err){
            console.log(err)
            return next(err)
        }
        console.log("user logged out")
        req.flash('success','Logged out successfully.')
        res.redirect('/login')
    })
});


module.exports=router;
