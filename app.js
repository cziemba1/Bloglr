const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/bloglr");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//MONGOOSE MODEL CONFIG
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  //created es la fecha de creacion del blog
  created: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

app.listen(3000, () => {
  console.log("server is running");
});
