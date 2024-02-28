const router = require("express").Router();
const bookController = require("../controllers/book");
const fs = require('fs');
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

router.get("/upload", (req, res) => {
  res.render("form");
})

// image is same as input name in the view file
router.post("/upload", upload.single("image"), (req, res) => {
  res.json("image uploaded");
})

router.get("/images/:bookname", (req, res) => {
  const imagePath = 'images/' + req.params.bookname;
  const readStream = fs.createReadStream(imagePath);
  res.setHeader('Content-Type', 'image/jpg');   // optional but nice to have
  readStream.pipe(res);
})

router.get("/", async (req, res, next) => {
  
  const page = req.query.page || 0;
  const booksPerPage = 4;
  
  await bookController
    .getAllBooks(page, booksPerPage)
    .then((books) =>
      books.length >= 1
        ? res.status(200).json(books)
        : res.status(404).send({ Message: "No data" }),
    )
    .catch((err) => next(err));
});

router.get("/:id", async (req, res, next) => {
  await bookController
    .getOneBook(req.params.id)
    .then((bookData) =>
    bookData
        ? res.status(200).json(bookData)
        : res.status(404).send({ Message: "No data" }),
    )
    .catch((err) => next(err));
});

router.post("/", async (req, res, next) => {
  await bookController
    .createBook(req.body)
    .then((createdBook) =>
      createdBook
        ? res.status(200).json({ Message: "Done", Data: createdBook })
        : res.status(404).send({ Message: "Error just occured" }),
    )
    .catch((err) => next(err));
});


router.put("/:id", async (req, res, next) => {
  await bookController
    .updateBook({ id: req.params.id, data: req.body })
    .then((book) =>
      book
        ? res.status(200).json({ Message: "Done", Data: book })
        : res.status(404).send({ Message: "No data" }),
    )
    .catch((err) => next(err));
});

router.delete("/:id", async (req, res, next) => {
  await bookController
    .deleteBook(req.params.id)
    .then((deleted) =>
      deleted
        ? res.status(200).json({ Message: "Done | Deleted", Data: deleted })
        : res.status(404).send({ Message: "No data" }),
    )
    .catch((err) => next(err));
});

router.put("/rate/:id", async (req, res, next) => {
  await bookController
    .updateBookRates({ id: req.params.id, data: req.body })
    .then((book) =>
      book
        ? res.status(200).json({ Message: "Done", Data: book })
        : res.status(404).send({ Message: "No data" }),
    )
    .catch((err) => next(err));
});

module.exports = router;
