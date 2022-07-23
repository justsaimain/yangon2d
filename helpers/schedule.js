const cron = require("node-cron");
const CloseDay = require("../models/CloseDay");
const storeResult = require("./storeResult");

const round_one = cron.schedule(
  "0 9 * * *",
  () => {
    storeResult();
  },
  { scheduled: true, timezone: "Asia/Yangon" }
);
const round_two = cron.schedule(
  "0 12 * * *",
  () => {
    storeResult();
  },
  { scheduled: true, timezone: "Asia/Yangon" }
);
const round_three = cron.schedule(
  "0 15 * * *",
  () => {
    storeResult();
  },
  { scheduled: true, timezone: "Asia/Yangon" }
);
const round_four = cron.schedule(
  "0 17 * * *",
  () => {
    storeResult();
  },
  { scheduled: true, timezone: "Asia/Yangon" }
);
const round_five = cron.schedule(
  "0 20 * * *",
  () => {
    storeResult();
  },
  { scheduled: true, timezone: "Asia/Yangon" }
);

const test_round = cron.schedule(
  "39 23 * * *",
  () => {
    storeResult();
  },
  { scheduled: true, timezone: "Asia/Yangon" }
);

const test_round_2 = cron.schedule(
  "40 23  * * *",
  () => {
    storeResult();
  },
  { scheduled: true, timezone: "Asia/Yangon" }
);

cron.schedule(
  "0 38 23 * * *",
  async () => {
    console.log("Schedule Start Working...");
    round_one.start();
    round_two.start();
    round_three.start();
    round_four.start();
    round_five.start();
    test_round.start();
    test_round_2.start();

    const closeDays = await CloseDay.find();
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const date = dd + "/" + mm + "/" + yyyy;

    closeDays.forEach((off) => {
      if (off.date === date) {
        if (off.time === "9:00 AM") {
          round_one.stop();
          console.log("Today 9:00 AM is closed");
        }
        if (off.time === "12:00 PM") {
          round_two.stop();
          console.log("Today 12:00 PM is closed");
        }
        if (off.time === "3:00 PM") {
          round_three.stop();
          console.log("Today 3:00 PM is closed");
        }
        if (off.time === "5:00 PM") {
          round_four.stop();
          test_round_2.stop();
          console.log("Today 5:00 PM is closed");
        }
        if (off.time === "8:00 PM") {
          round_five.stop();
          console.log("Today 8:00 PM is closed");
        }
      }
    });
  },
  { scheduled: true, timezone: "Asia/Yangon" }
);
