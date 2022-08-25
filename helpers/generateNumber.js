const seedRandom = require("seedrandom");
const moment = require("moment-timezone");
const Next = require("../models/Next");

const generateNumber = () => {
  const interval = 60 * 123458;
  const currentDateTime = moment(new Date())
    .tz("Asia/Yangon")
    .format("D-MM-YYYY hh:mm:ss A");

  const randomGenerate1 = seedRandom(
    Math.floor(((new Date().getTime() * new Date().getDate()) / interval) * 60)
  );
  const randomGenerate2 = seedRandom(
    Math.floor(((new Date().getTime() * new Date().getDate()) / interval) * 60)
  );

  const num_one = randomGenerate1().toString().split(".")[1].substring(0, 4);
  const num_two = randomGenerate2().toString().split(".")[1].slice(-4);

  const data = {
    buy: "1." + num_one,
    sell: "3." + num_two,
    result: num_one.slice(-1) + num_two.slice(-1),
    date_time: currentDateTime,
  };

  return data;
};

module.exports = generateNumber;
