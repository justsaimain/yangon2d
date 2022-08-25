const generateNumber = require("../helpers/generateNumber");
const CloseDay = require("../models/CloseDay");
const Next = require("../models/Next");
const Result = require("../models/Result");
const moment = require("moment");
const _ = require("lodash");

module.exports.getIndex = async (req, res) => {
  res.send("API Index Page");
};

module.exports.getLive = async (req, res) => {
  const currentDateTime = moment(new Date())
    .tz("Asia/Yangon")
    .format("D-MM-YYYY hh:mm:ss A");
  const currentDateTimeForCompare = moment(new Date())
    .tz("Asia/Yangon")
    .format("MMMM D YYYY, H:mm:ss");

  Next.find().then((result) => {
    if (result.length > 0) {
      const data = result[0];
      console.log("Next Result data ", data);
      console.log("current > ", new Date(currentDateTimeForCompare));
      console.log("show data time > ", new Date(data.show_date_time));
      console.log("delete data time > ", new Date(data.delete_date_time));
      if (
        new Date(currentDateTimeForCompare) >= new Date(data.show_date_time) &&
        new Date(currentDateTimeForCompare) < new Date(data.delete_date_time)
      ) {
        returnData = {
          buy: "1." + data.buy,
          sell: "3." + data.sell,
          result: data.buy.slice(-1) + data.sell.slice(-1),
          date_time: currentDateTime,
        };
        console.log("return data > ", returnData);
        res.status(200).json(returnData);
      } else if (
        new Date(currentDateTimeForCompare) > new Date(data.delete_date_time)
      ) {
        console.log("✅ Delete result of next...");
        Next.deleteOne({ _id: data._id })
          .then(() => {
            returnData = generateNumber();
            res.status(200).json(returnData);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("✅ Show result of random...");
        returnData = generateNumber();
        res.status(200).json(returnData);
      }
    } else {
      let returnData = generateNumber();
      res.status(200).json(returnData);
    }
  });
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
  const data = await Result.find();

  const grouped = _.mapValues(_.groupBy(data, "date"), (dList) =>
    dList.map((d) => _.omit(d, "date"))
  );

  res.status(200).json(grouped);
};
