
const axios = require('axios')

async function getContributions(token, username) {
    const headers = {
        'Authorization': `bearer ${token}`,
    }
    const body = {
        query: `query {
              user(login: "${username}") {
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
        const { data } = await axios('https://api.github.com/graphql', { method: 'POST', data: JSON.stringify(body), headers: headers })
        return data
    } catch (error) {
        console.error(error)
    }
}

const postAlert = async (payload) => {
    try {
        const headers = { "Content-type": "application/json" }
        await axios.post('WEBHOOK_URL', { text: payload, }, { headers });
    } catch (error) {
        console.error(error)
    }
}

module.exports = { getContributions, postAlert }