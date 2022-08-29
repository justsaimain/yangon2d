const CloseDay = require("../models/CloseDay");
const Result = require("../models/Result");
const liveService = require("../services/liveService");
const _ = require("lodash");

module.exports.getIndex = async (req, res) => {
  res.send("API Index Page");
};

module.exports.getLive = async (req, res) => {
  try {
    await liveService
      .getLive()
      .then((r) => {
        res.json(r);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("error", err);
  }
};

module.exports.getTodayResult = async (req, res) => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const fullDate = dd + "/" + mm + "/" + yyyy;
  const data = await Result.find({ date: fullDate });
  data.sort(function (a, b) {
    return (
      Date.parse("1970/01/01 " + a.time.slice(0, -2) + " " + a.time.slice(-2)) -
      Date.parse("1970/01/01 " + b.time.slice(0, -2) + " " + b.time.slice(-2))
    );
  });
  res.json(data);
};

module.exports.getCloseDays = async (req, res) => {
  const data = await CloseDay.find().sort({ createdAt: -1 });
  res.status(200).json(data);
};

module.exports.getAlertText = async (req, res) => {
  const data = await AlertDoc.findOne().sort({ createdAt: -1 });
  res.status(200).json(data);
};

module.exports.getResult = async (req, res) => {
  const data = await Result.find().sort({ date: -1 });

  const grouped = _.mapValues(_.groupBy(data, "date"), (dList) =>
    dList.map((d) => _.omit(d, "date"))
  );

  res.status(200).json(grouped);
};
