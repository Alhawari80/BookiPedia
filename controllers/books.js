const router = require('express').Router()

const Book = require('../models/book');

// API's/ Routes/ Main Functionality

router.get('/', async(req, res) => {
  const books = await Book.find().populate('owner');
  res.render('Book/index.ejs', { books });
});

router.get('/new', async (req, res) => {
  res.render('Book/new.ejs');
});
// to validate the checkbox in save (add book)
router.post('/', async (req, res) => {

  if (req.body.availability === "on") {
    req.body.availability = true;
  } else {
    req.body.availability = false;
  }

  req.body.owner = req.session.user._id;
  await Book.create(req.body);
  res.redirect('/books');
});

router.get("/:bookId", async (req, res) => {
  const book = await Book.findById(req.params.bookId).populate('owner');

  const userHasFavorited = book.favoritedByUser.some((user) => 
    user.equals(req.session.user._id)
  );

  res.render('Book/show.ejs', { book, userHasFavorited });
});

router.delete('/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (book.owner.equals(req.session.user._id)) {
      await book.deleteOne();
      res.redirect('/books');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.get('/:bookId/edit', async (req, res) => {
  try {
    const currentBook = await Book.findById(req.params.bookId);
    res.render('Book/edit.ejs', {
      book: currentBook,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:bookId', async (req, res) => {
  try {

  if (req.body.availability === "on") {
    req.body.availability = true;
  } else {
    req.body.availability = false;
  }

    const currentBook = await Book.findById(req.params.bookId);
    if (currentBook.owner.equals(req.session.user._id)) {
      await currentBook.updateOne(req.body);
      res.redirect('/books');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/books');
  }
});

router.post('/:bookId/favorited-by/:userId', async (req, res) => {
  await Book.findByIdAndUpdate(req.params.bookId, {
    $push: {favoritedByUser: req.params.userId}
  });
  res.redirect(`/books/${req.params.bookId}`);
});

router.delete('/:bookId/favorited-by/:userId', async (req, res) => {
  await Book.findByIdAndUpdate(req.params.bookId, {
    $pull: {favoritedByUser: req.params.userId}
  });
  res.redirect(`/books/${req.params.bookId}`);
});

module.exports = router;