module.exports = async function (req, res, next) {
  try {
    if (!req.user.is_creator) {
      return res
        .status(403)
        .send({ msg: "Sizda bunday huquq yo'q! qo'sholmaysiz" });
    }
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).send({ error: error.message });
  }
};
