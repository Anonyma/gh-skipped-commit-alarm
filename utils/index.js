
const axios = require('axios')

const GH_TOKEN = process.env.GH_TOKEN
const GH_USERNAME = process.env.GH_USERNAME
const WEBHOOK_URL = process.env.WEBHOOK_URL
const NOTIFY_ON_WEEKEND = process.env.NOTIFY_ON_WEEKEND || false

const GH_API_URL = 'https://api.github.com/graphql'

async function getContributions() {
  const headers = {
    'Authorization': `bearer ${GH_TOKEN}`,
  }
  const body = {
    query: `query {
              user(login: "${GH_USERNAME}") {
                name
                contributionsCollection {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                        weekday
                      }
                    }
                  }
                }
              }
            }`
  }

  try {
    const { data } = await axios(GH_API_URL, { method: 'POST', data: JSON.stringify(body), headers: headers })
    return data
  } catch (error) {
    console.error("Error when retrieving contributions: ", formatAxiosError(error))
    throw new Error(error)
  }
}

async function getTodaysContributions() {
  try {
    const { data } = await getContributions()
    const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
    const lastContribs = weeks[weeks.length - 1].contributionDays
    return lastContribs[lastContribs.length - 1]
  } catch (error) {
    console.error("Error when retrieving contributions: ", formatAxiosError(error))
  }
}

const postAlert = async (payload) => {
  try {
    const headers = { "Content-type": "application/json" }
    await axios.post(WEBHOOK_URL, { text: payload, }, { headers });
  } catch (error) {
    console.error("Error when posting alert: ", formatAxiosError(error))
  }
}

const shouldNotify = async (weekday) => {
  if (NOTIFY_ON_WEEKEND == false) {
    if (weekday == 0 || weekday == 6) return false
  }
  return true
}

const formatAxiosError = (error) => `${error.response.status} - ${error.response.statusText} - ${error.response.data.message}`

module.exports = { getTodaysContributions, postAlert }