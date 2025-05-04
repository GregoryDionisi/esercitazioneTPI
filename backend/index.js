const express = require(`express`);
const app = express();
app.use(express.json());

let posts = [
  { id: 1, title: "Primo post" },
  { id: 2, title: "Secondo post" },
];

// Endpoint GET /api/posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// Endpoint POST /api/posts
app.post("/api/posts", (req, res) => {
  const newPost = { id: posts.length + 1, title: req.body.title };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.listen(3000, () => console.log("Server in ascolto su http://localhost:3000"));