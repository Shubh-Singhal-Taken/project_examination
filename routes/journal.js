const express = require('express')
const router = express.Router()
const Journal = require('../models/journal')

const isLoggedIn = (req, res, next) => {
        if (!req.isAuthenticated()) {
        req.flash('error', 'YOU ARE NOT LOGGED IN BRO')
                return res.redirect('/login')
    }
    next()
}

const isAuthor = async (req, res, next) => {
    try {
            const journal = await Journal.findById(req.params.id)
        if (!journal) {
            req.flash('error', 'journal not found idk why')
            return res.redirect('/journals')
        }
        if (!journal.author.equals(req.user._id)) {
            req.flash('error', 'this is not ur journal go away')
                        return res.redirect('/journals')
        }
        next()
    } catch (e) {
        console.log(e)
        console.log("something broke here")
        req.flash('error', 'idk what happened lol')
        res.redirect('/journals')
    }
}




router.get('/', isLoggedIn, async (req, res) => {
    var journals = await Journal.find({ author: req.user._id }).sort({ arrivalDate: -1 })
    res.render('journals/index', { journals: journals })
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('journals/new')
})

router.post('/', isLoggedIn, async (req, res) => {
    try {
        var data = req.body.journal
        var journal = new Journal(data)
        journal.author = req.user._id
        await journal.save()
        console.log("journal saved!!")
        req.flash('success', 'journal created yay!!')
        res.redirect(`/journals/${journal._id}`)
    } catch (e) {
        console.log("ERROR WHILE SAVING", e)
        req.flash('error', e.message)
        res.redirect('/journals/new')
    }
})

router.get('/:id', isLoggedIn, isAuthor, async (req, res) => {
    var id = req.params.id
    var journal = await Journal.findById(id)
    res.render('journals/show', { journal})
}
)

router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const journal = await Journal.findById(req.params.id)
    res.render('journals/edit', { journal })
})

router.put('/:id', isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { arrivalDate, departureDate, experience, rating } = req.body.journal
        await Journal.findByIdAndUpdate(req.params.id, { arrivalDate, departureDate, experience, rating })
        console.log("updated successfully i think")
        req.flash('success', 'journal updated!!')
        res.redirect(`/journals/${req.params.id}`)
    } catch (e) {
        console.log(e)
        req.flash('error', e.message)
        res.redirect(`/journals/${req.params.id}/edit`)
    }
})

router.delete('/:id', isLoggedIn, isAuthor, async (req, res) =>{
    try {
        await Journal.findByIdAndDelete(req.params.id)
        console.log("deleted!!")
        req.flash('success', 'Journal entry deleted')
        res.redirect('/journals')
    }
    catch (e) {
        await Journal.findById(req.params.id)
        req.flash("BIG BANG ERROR")
        res.redirect('journals')
    }
}
)




module.exports =router
