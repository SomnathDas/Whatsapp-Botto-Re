var level = require('level')

async function profile (client, from, pushname, cmd, sender, ban) {
        client.sendText(from, `*${pushname}* profile\n\n *Ban from using the bot:* ${ban} `)
}

module.exports = {
    profile
}