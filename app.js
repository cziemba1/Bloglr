const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const express = require("express");
const expressSanitizer = require("express-sanitizer");
const app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/bloglr");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

//INDEX
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW
app.get("/blogs/new", (req, res) => {
  res.render("new");
});
//CREATE
app.post("/blogs", (req, res) => {
  //sanitize
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});
//SHOW
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

//EDIT- route
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//UPDATE route
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

//DELETE route

app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndDelete(req.params.id, (err, deleteBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, () => {
  console.log("server is running");
});
