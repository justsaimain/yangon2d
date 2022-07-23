const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.TOKEN_SECRET;
const jwtExpirySeconds = 300; // second
const localStorage = require("localStorage");
const CloseDay = require("../models/CloseDay");
const { default: mongoose } = require("mongoose");

module.exports.getIndex = async (req, res) => {
  res.render("admin/index");
};

module.exports.getLogin = async (req, res) => {
  res.render("admin/login");
};

module.exports.postLogin = async (req, res) => {
  const token = localStorage.getItem("token");
  if (token) {
    localStorage.removeItem("token");
  }

  const { username, password } = req.body;

  Admin.find({}, {}, {}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (username !== "" || password !== "") {
        const filtered = result.filter((admin) => admin.username === username);
        if (filtered.length > 0) {
          if (filtered[0].password === password) {
            const token = jwt.sign({ username }, jwtKey, {
              algorithm: "HS256",
              expiresIn: jwtExpirySeconds,
            });
            localStorage.setItem("token", token);
            res.redirect("/panel");
          } else {
            localStorage.removeItem("token");
            res.redirect("/panel/login");
          }
        } else {
          localStorage.removeItem("token");
          res.redirect("/panel/login");
        }
      } else {
        localStorage.removeItem("token");
        res.redirect("/panel/login");
      }
    }
  });
};

module.exports.getCloseDay = async (req, res) => {
  const data = await CloseDay.find().sort({ createdAt: -1 });
  res.render("admin/closeday", { data: data });
};

module.exports.saveCloseDay = async (req, res) => {
  const closeDay = new CloseDay({
    date: req.body.date,
    time: req.body.time,
  });

  try {
    const savedResult = await closeDay.save();
    console.log("saved result", savedResult);
    res.redirect("/panel/close-days");
  } catch (error) {
    console.log("saved error", error);
    res.redirect("/panel/close-days");
  }
};

module.exports.deleteCloseDay = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);

  try {
    await CloseDay.deleteOne({ _id: id })
      .then((result) => {
        console.log(result);
        res.json({ success: true });
      })
      .catch((e) => {
        console.log(e);
        res.json({ success: false });
      });
  } catch (e) {
    console.log(e);
  }
};
