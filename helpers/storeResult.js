const Result = require("../models/Result");
const generateNumber = require("./generateNumber");

const storeResult = async (time) => {
  const data = generateNumber();
  console.log("Storing data...");
  console.log(data);
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const result = new Result({
    buy: data.buy,
    sell: data.sell,
    result: data.result,
    date: dd + "/" + mm + "/" + yyyy,
    time: time,
  });

  try {
    const savedResult = await result.save();
    console.log("saved result", savedResult);
  } catch (error) {
    console.log("saved error", error);
  }
};

module.exports = storeResult;
