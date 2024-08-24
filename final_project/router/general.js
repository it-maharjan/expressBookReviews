const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    res.status(404).json({ message: "Username &/ Password are not provided." });
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Using Promise callbacks
public_users.get("/using_promise/", function (req, res) {
  axios
    .get("http://localhost:5000/") // Replace with actual path if fetching from an external API
    .then((response) => {
      // Assuming response.data contains the list of books
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error fetching books", error: error.message });
    });
});

// Using async-await
public_users.get("/using_async", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/"); // Replace with actual path if fetching from an external API
    // Assuming response.data contains the list of books
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Using Promise callbacks
public_users.get("/using_promise/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  axios
    .get(`http://localhost:5000/isbn/${isbn}`) // Replace with the actual API endpoint
    .then((response) => {
      // Assuming response.data contains the book details
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      res.status(404).json({ message: "Book not found", error: error.message });
    });
});

// Using async-await
public_users.get("/using_async/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Replace with the actual API endpoint
    // Assuming response.data contains the book details
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Book not found", error: error.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author
  );

  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks));
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Using Promise callbacks
public_users.get("/using_promise/author/:author", function (req, res) {
  const author = req.params.author;
  console.log(author);
  axios
    .get(`http://localhost:5000/author/${author}`) // Replace with actual API endpoint or path
    .then((response) => {
      const filteredBooks = Object.values(response.data).filter(
        (book) => book.author.toLowerCase() === author.toLowerCase()
      );

      if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
      } else {
        res.status(404).json({ message: "No books found for this author" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error fetching books", error: error.message });
    });
});

// Using async-await
public_users.get("using_async/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`); // Replace with actual API endpoint or path
    const filteredBooks = Object.values(response.data).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      return res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
      return res
        .status(404)
        .json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title
  );

  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks));
  } else {
    res.status(404).json({ message: "No books found for this title" });
  }
});

// Using async-await
public_users.get("/using_async/title/:title", async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`); // Replace with actual API endpoint or path
    const filteredBooks = Object.values(response.data).filter(
      (book) => book.title.toLowerCase() === title
    );

    if (filteredBooks.length > 0) {
      return res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for this title" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Using Promise callbacks
public_users.get("/using_promise/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();

  axios
    .get(`http://localhost:5000/title/${title}`) // Replace with actual API endpoint or path
    .then((response) => {
      const filteredBooks = Object.values(response.data).filter(
        (book) => book.title.toLowerCase() === title
      );

      if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
      } else {
        res.status(404).json({ message: "No books found for this title" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error fetching books", error: error.message });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    if (books[isbn].reviews) {
      res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      res.status(404).json({ message: "Review Not found" });
    }
  } else {
    res.status(404).json({ message: "Review Not found" });
  }
});

module.exports.general = public_users;
