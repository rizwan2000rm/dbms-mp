const express = require("express"),
  app = express();
var path = require("path");

//EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "12345",
  database: "socialmedia"
});

con.connect((err) => {
  if (err) {
    console.log("Error connecting to Db");
    return;
  }
  console.log("Connection established");
});

app.get("/", (req, res) => {
  con.query("select * from users", (err, rows) => {
    if (err) {
      console.log(err);
    }
    res.render("index", { rows: rows, page: "index" });
  });
});

app.get("/old", (req, res) => {
  con.query("SELECT * FROM users ORDER BY created_at LIMIT 5 ", (err, rows) => {
    if (err) {
      console.log(err);
    }
    res.render("old", { rows: rows, page: "old" });
  });
});

app.get("/popular", (req, res) => {
  // Find the five most popular hashtags from db
  con.query(
    "SELECT DAYNAME(created_at) AS day,COUNT(*) AS total FROM users GROUP BY day ORDER BY total DESC LIMIT 2",
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.render("popular", { rows: rows, page: "popular" });
    }
  );
});

app.get("/inactive", (req, res) => {
  con.query(
    "SELECT username FROM users LEFT JOIN photos ON users.id = photos.user_id WHERE photos.id IS NULL",
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      console.log(rows);
      res.render("inactive", { rows: rows, page: "inactive" });
    }
  );
});

app.get("/top", (req, res) => {
  con.query(
    "SELECT username,photos.id,photos.image_url, COUNT(*) AS total FROM photos INNER JOIN likes ON likes.photo_id = photos.id INNER JOIN users ON photos.user_id = users.id GROUP BY photos.id ORDER BY total DESC LIMIT 1",
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.render("top", { rows: rows, page: "top" });
    }
  );
});

app.get("/bot", (req, res) => {
  con.query(
    "SELECT username, Count(*) AS num_likes FROM   users INNER JOIN likes ON users.id = likes.user_id GROUP  BY likes.user_id HAVING num_likes = (SELECT Count(*) FROM   photos)",
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.render("bot", { rows: rows, page: "bot" });
    }
  );
});

app.get("/avg", (req, res) => {
  // Find the five most popular hashtags from db
  con.query(
    "SELECT (SELECT Count(*) FROM photos) / (SELECT Count(*) FROM users) AS avg",
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.render("avg", { rows: rows, page: "avg" });
    }
  );
});

app.get("/hashtags", (req, res) => {
  // Find the five most popular hashtags from db
  con.query(
    "SELECT tags.tag_name, Count(*) AS total FROM photo_tags JOIN tags ON photo_tags.tag_id = tags.id GROUP BY tags.id ORDER BY total DESC LIMIT 5",
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.render("hashtags", { rows: rows, page: "hashtags" });
    }
  );
});

app.listen(4000, (req, res) => {
  console.log("The QuickBites Server is Running.....");
});
