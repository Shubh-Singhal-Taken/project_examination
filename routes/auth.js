const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res, next) => {
    try {
        const { username, password, nationality, travelStyle, favoriteContinent } = req.body;
        const user = new User({ username, nationality, travelStyle, favoriteContinent });
        const registered = await User.register(user, password);
        req.login(registered, err => {
            if (err) return next(err);
            req.flash('success', `Welcome, ${registered.username}!`);
            res.redirect('/journals');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    req.flash('success', `Welcome back, ${req.user.username}!`);
    res.redirect('/journals');
});

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Logged out successfully.');
        res.redirect('/login');
    });
});

module.exports = router;
