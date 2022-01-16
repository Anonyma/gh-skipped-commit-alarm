const dotenv = require('dotenv')
dotenv.config()

const cron = require('node-cron');
const { getContributions, postAlert } = require('./utils');

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 19 * * *'

cron.schedule(CRON_SCHEDULE, async () => {
  const data = await getContributions()
  const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
  const lastContribs = weeks[weeks.length - 1].contributionDays
  const today = lastContribs[lastContribs.length - 1]

  if (today.contributionCount == 0) {
    postAlert("you skipped commit day!")
  }
});