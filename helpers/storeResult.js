const Result = require("../models/Result");
const liveService = require("../services/liveService");
const storeResult = async (time) => {
  try {
    await liveService
      .getLive()
      .then((r) => {
        console.log("Storing data...");
        console.log(r);
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        const result = new Result({
          buy: r.buy,
          sell: r.sell,
          result: r.result,
          date: dd + "/" + mm + "/" + yyyy,
          time: time,
        });
        result.save();
        console.log("saved result ", result);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = storeResult;
