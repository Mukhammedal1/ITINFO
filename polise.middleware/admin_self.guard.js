const { createViewPage } = require("../helpers/create_view_page");

module.exports = async function (req, res, next) {
  try {
    if (!req.admin.is_creator) {
      // console.log("is_creator",req.admin.is_creator)
      
    return  res.render(createViewPage("unAuthorized"),{
        title:"Not Creator"
      })
      // console.log(createViewPage("unAuthorized"), {
      //   title: "Not Creator",
      // });

      // res.status(403).send({ msg: "Sizda bunday huquq yo'q" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: error.message });
  }
};
