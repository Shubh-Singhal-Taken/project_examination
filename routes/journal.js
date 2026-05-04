const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    next();
};

const isAuthor = async (req, res, next) => {
    try {
        const journal = await Journal.findById(req.params.id);
        if (!journal) {
            req.flash('error', 'Journal not found.');
            return res.redirect('/journals');
        }
        if (!journal.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that.');
            return res.redirect('/journals');
        }
        next();
    } catch (e) {
        req.flash('error', 'Something went wrong.');
        res.redirect('/journals');
    }
};

// GET /journals
router.get('/', isLoggedIn, async (req, res) => {
    const journals = await Journal.find({ author: req.user._id }).sort({ arrivalDate: -1 });
    res.render('journals/index', { journals });
});

// GET /journal/new
router.get('/new', isLoggedIn, (req, res) => {
    res.render('journals/new');
});

// POST /journal
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const journal = new Journal({ ...req.body.journal, author: req.user._id });
        await journal.save();
        req.flash('success', 'Journal entry created!');
        res.redirect(`/journals/${journal._id}`);
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/journals/new');
    }
});

// GET /journals/:id
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id).populate('author');
        if (!journal) {
            req.flash('error', 'Journal not found.');
            return res.redirect('/journals');
        }
        res.render('journals/show', { journal });
    } catch (e) {
        req.flash('error', 'Journal not found.');
        res.redirect('/journals');
    }
});

// GET /journals/:id/edit
router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const journal = await Journal.findById(req.params.id);
    res.render('journals/edit', { journal });
});

// PUT /journals/:id  (destination excluded — immutable)
router.put('/:id', isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { arrivalDate, departureDate, experience, rating } = req.body.journal;
        await Journal.findByIdAndUpdate(req.params.id, { arrivalDate, departureDate, experience, rating });
        req.flash('success', 'Journal entry updated!');
        res.redirect(`/journals/${req.params.id}`);
    } catch (e) {
        req.flash('error', e.message);
        res.redirect(`/journals/${req.params.id}/edit`);
    }
});

// DELETE /journals/:id
router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
    await Journal.findByIdAndDelete(req.params.id);
    req.flash('success', 'Journal entry deleted.');
    res.redirect('/journals');
});

module.exports = router;
