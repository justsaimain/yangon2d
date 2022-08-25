const Alert = require("../models/Alert");
const Result = require("../models/Result");
const _ = require("lodash");

module.exports.getIndex = async (req, res) => {
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

  const alert = await Alert.findOne().sort({ createdAt: -1 });

  res.render("user/index", {
    todayData: data,
    alert: alert ? alert.text : null,
  });
};

module.exports.getResult = async (req, res) => {
  const data = await Result.find();

  const grouped = _.mapValues(_.groupBy(data, "date"), (dList) =>
    dList.map((d) => _.omit(d, "date"))
  );

  const dateList = _.uniqBy(_.map(data, "date"));

  res.render("user/result", { results: grouped, date: dateList });
};
