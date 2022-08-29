const moment = require("moment-timezone");
const Next = require("../models/Next");
const generateNumber = require("../helpers/generateNumber");

module.exports.getLive = async () => {
  return new Promise(async function (reslove, reject) {
    const currentDateTime = moment(new Date())
      .tz("Asia/Yangon")
      .format("D-MM-YYYY hh:mm:ss A");
    const currentDateTimeForCompare = moment(new Date())
      .tz("Asia/Yangon")
      .format("MMMM D YYYY, H:mm:ss");

    Next.find()
      .then((result) => {
        if (result.length > 0) {
          const data = result[0];
          console.log("Next Result data ", data);
          console.log("current > ", new Date(currentDateTimeForCompare));
          console.log("show data time > ", new Date(data.show_date_time));
          console.log("delete data time > ", new Date(data.delete_date_time));
          if (
            new Date(currentDateTimeForCompare) >=
              new Date(data.show_date_time) &&
            new Date(currentDateTimeForCompare) <
              new Date(data.delete_date_time)
          ) {
            returnData = {
              buy: "1." + data.buy,
              sell: "3." + data.sell,
              result: data.buy.slice(-1) + data.sell.slice(-1),
              date_time: currentDateTime,
            };
            console.log("return data > ", returnData);
            reslove(returnData);
          } else if (
            new Date(currentDateTimeForCompare) >
            new Date(data.delete_date_time)
          ) {
            console.log("✅ Delete result of next...");
            Next.deleteOne({ _id: data._id })
              .then(() => {
                returnData = generateNumber();
                reslove(returnData);
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            console.log("✅ Show result of random...");
            returnData = generateNumber();
            reslove(returnData);
          }
        } else {
          let returnData = generateNumber();
          reslove(returnData);
        }
      })
      .catch((e) => {
        console.log("something was wrong ini here");
        reject(e);
      });
  });
};
