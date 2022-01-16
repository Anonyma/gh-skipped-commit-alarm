const cron = require('node-cron');
const { getContributions, postAlert } = require('./utils');

cron.schedule('0 19 * * *', async () => {
  const data = await getContributions('TOKEN', 'USERNAME')
  const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
  const lastContribs = weeks[weeks.length - 1].contributionDays
  const today = lastContribs[lastContribs.length - 1]

  if (today.contributionCount == 0) {
    postAlert("you skipped commit day!")
  }
});