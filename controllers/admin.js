const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.TOKEN_SECRET;
const jwtExpirySeconds = 300; // second
const localStorage = require("localStorage");
const CloseDay = require("../models/CloseDay");
const AlertDoc = require("../models/Alert");
const { default: mongoose } = require("mongoose");
const moment = require("moment-timezone");

const Next = require("../models/Next");
const Result = require("../models/Result");

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

module.exports.getAlert = async (req, res) => {
  const data = await AlertDoc.findOne().sort({ createdAt: -1 });
  res.render("admin/alert", { data: data?.text });
};

module.exports.postAlert = async (req, res) => {
  const query = {},
    update = { text: req.body.alert ? req.body.alert : null },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  AlertDoc.findOneAndUpdate(query, update, options, function (error, result) {
    if (error) return;
    res.redirect("/panel/alert");
  });
};

module.exports.getNext = async (req, res) => {
  const data = await Next.findOne();
  console.log("data", data);
  res.render("admin/next", { data });
};

module.exports.postNext = async (req, res) => {
  const { sell, buy } = req.body;
  const currentDateTime = moment(new Date())
    .tz("Asia/Yangon")
    .format("MMMM D YYYY, H:mm:ss");
  const showTime = [
    moment()
      .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
      .format("MMMM D YYYY, H:mm:ss"),
    moment()
      .set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
      .format("MMMM D YYYY, H:mm:ss"),
    moment()
      .set({ hour: 15, minute: 0, second: 0, millisecond: 0 })
      .format("MMMM D YYYY, H:mm:ss"),
    moment()
      .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
      .format("MMMM D YYYY, H:mm:ss"),
    moment()
      .set({ hour: 20, minute: 0, second: 0, millisecond: 0 })
      .format("MMMM D YYYY, H:mm:ss"),
  ];

  let showDateTime;

  console.log("current date time", currentDateTime);
  console.log("show date time", showTime);

  if (new Date(currentDateTime) >= new Date(showTime[4])) {
    showDateTime = moment()
      .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
      .add(1, "days")
      .subtract(1, "minutes")
      .format("MMMM D YYYY, H:mm:ss");
    console.log(
      "🚨 load static data for tomorrow 9 AM before 1 minutes : 8:59 AM"
    );
  } else if (new Date(currentDateTime) >= new Date(showTime[3])) {
    showDateTime = moment()
      .set({ hour: 20, minute: 0, second: 0, millisecond: 0 })
      .subtract(1, "minutes")
      .format("MMMM D YYYY, H:mm:ss");
    console.log("🚨 load static data for 8 PM before 1 minutes : 7:59 PM");
  } else if (new Date(currentDateTime) >= new Date(showTime[2])) {
    showDateTime = moment()
      .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
      .subtract(1, "minutes")
      .format("MMMM D YYYY, H:mm:ss");
    console.log("🚨 load static data for 5 PM before 1 minutes : 4:59 PM");
  } else if (new Date(currentDateTime) >= new Date(showTime[1])) {
    showDateTime = moment()
      .set({ hour: 15, minute: 0, second: 0, millisecond: 0 })
      .subtract(1, "minutes")
      .format("MMMM D YYYY, H:mm:ss");
    console.log("🚨 load static data for 3 PM before 1 minutes : 2:59 PM");
  } else if (new Date(currentDateTime) >= new Date(showTime[0])) {
    showDateTime = moment()
      .set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
      .subtract(1, "minutes")
      .format("MMMM D YYYY, H:mm:ss");
    console.log("🚨 load static data for 12 PM before 1 minutes : 11:59 AM");
  } else {
    showDateTime = moment()
      .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
      .subtract(1, "minutes")
      .format("MMMM D YYYY, H:mm:ss");
    console.log("🚨 load static data for 9 AM before 1 minutes : 8:59 AM");
  }

  const deleteDateTime = moment(new Date(showDateTime))
    .add(3, "minutes")
    .format("MMMM D YYYY, H:mm:ss");

  var query = {},
    update = {
      sell,
      buy,
      show_date_time: showDateTime,
      delete_date_time: deleteDateTime,
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  Next.findOneAndUpdate(query, update, options, function (error, result) {
    if (error) return;
    console.log("res", result);
    res.redirect("/panel/next");
  });
};

module.exports.deleteNext = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);

  try {
    await Next.deleteOne({ _id: id })
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

module.exports.getResult = async (req, res) => {
  const data = await Result.find().sort({ created_at: -1 });
  console.log("result", data);
  res.render("admin/result", { data });
};

module.exports.addResultPage = async (req, res) => {};

module.exports.addResult = async (req, res) => {};

module.exports.updateResult = async (req, res) => {
  res.render("admin/result");
};

module.exports.deleteResult = async (req, res) => {
  res.render("admin/result");
};
