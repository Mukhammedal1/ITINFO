const { createViewPage } = require("../helpers/create_view_page");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.render(createViewPage("index"), {
    title: "Asosiy sahifa",
    isHome: true,
  });
});

router.get("/dictionary", async (req, res) => {
  const lugatlar = await fetch("http://localhost:3030/api/dict/all");
  const dicts = await lugatlar.json();
  res.render(createViewPage("dictionary"), {
    dicts: dicts,
    title: "Lug'atlar",
    isDict: true,
  });
});
router.get("/topics", async (req, res) => {
  const mavzular = await fetch("http://localhost:3030/api/topic/all");
  const topics = await mavzular.json();
  // console.log(topics);
  
  res.render(createViewPage("topics"), {
    topics: topics,
    title: "Maqolalar",
    isTopic: true,
  });
});


router.get("/authors", async (req, res) => {
  // const avtorlar = await fetch("http://localhost:3030/api/author/all");
  // const authors = await avtorlar.json();
  // console.log(authors);
  res.render(createViewPage("authors"), {
    // authors: authors,
    title: "Mualliflar",
    isAuthor: true,
  });
});

router.get("/admins", async (req, res) => {
  res.render(createViewPage("admins"), {
    title: "Adminlar",
    isAuthor: true,
  });
});

router.get("/login_author", (req, res) => {
  res.render(createViewPage("login_author"), {
    title: "Tizimga kirish",
    isLogin: true,
  });
});

router.get("/login_admin", (req, res) => {
  res.render(createViewPage("login_admin"), {
    title: "Tizimga kirish",
    isLogin: true,
  });
});


router.get("/add_author", (req, res) => {
  res.render(createViewPage("add_author"), {
    title: "Add Authors",
    isAdd: true,
  });
});

module.exports = router;
