const dotenv = require('dotenv')
dotenv.config()

const cron = require('node-cron');
const { getTodaysContributions, postAlert } = require('./utils');

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 19 * * *'

cron.schedule(CRON_SCHEDULE, async () => {
  const today = await getTodaysContributions()

  if (today.contributionCount == 0) {
    postAlert("you skipped commit day!")
  }
});