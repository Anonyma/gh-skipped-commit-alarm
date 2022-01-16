
const axios = require('axios')

const GH_TOKEN = process.env.GH_TOKEN
const GH_USERNAME = process.env.GH_USERNAME
const WEBHOOK_URL = process.env.WEBHOOK_URL

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
        console.error(error)
    }
}

const postAlert = async (payload) => {
    try {
        const headers = { "Content-type": "application/json" }
        await axios.post(WEBHOOK_URL, { text: payload, }, { headers });
    } catch (error) {
        console.error(error)
    }
}

module.exports = { getContributions, postAlert }