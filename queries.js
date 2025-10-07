// queries.js
// This file contains all MongoDB queries for the "books" collection
// =====================================

// Switch to the database
use("plp_bookstore");

// -------------------------------
// BASIC CRUD OPERATIONS
// -------------------------------

// 1.Find all books in a specific genre (e.g., Fiction)
db.books.find({ genre: "Fiction" });

// 2.Find books published after a certain year (e.g., after 2010)
db.books.find({ published_year: { $gt: 2010 } });

// 3.Find books by a specific author
db.books.find({ author: "Paulo Coelho" });

// 4.Update the price of a specific book
db.books.updateOne(
  { title: "The Alchemist" },
  { $set: { price: 160 } }
);

// 5.Delete a book by its title
db.books.deleteOne({ title: "1984" });


// -------------------------------
// ADVANCED QUERIES
// -------------------------------

// 6.Find books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 7.Projection – show only title, author, and price
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// 8.Sort books by price ascending
db.books.find().sort({ price: 1 });

// 9.Sort books by price descending
db.books.find().sort({ price: -1 });

// Pagination – 5 books per page
// Page 1
db.books.find().skip(0).limit(5);
// Page 2
db.books.find().skip(5).limit(5);


// -------------------------------
// AGGREGATION PIPELINES
// -------------------------------

// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", average_price: { $avg: "$price" } } }
]);

// Find the author with the most books
db.books.aggregate([
  { $group: { _id: "$author", total_books: { $sum: 1 } } },
  { $sort: { total_books: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      decade: { $concat: [{ $toString: { $multiply: ["$_id", 10] } }, "s"] },
      count: 1,
      _id: 0
    }
  }
]);


// -------------------------------
// INDEXING
// -------------------------------

// Create an index on the title field
db.books.createIndex({ title: 1 });

// Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain() to check performance before and after indexing
db.books.find({ title: "The Alchemist" }).explain("executionStats");