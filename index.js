const { create } = require('@open-wa/wa-automate')
const msgHandler = require('./msgHandler')
const serverOption = {
    headless: true,
    cacheEnabled: false,
    useChrome: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
    serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async (client) => {
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
        })
        // listening on message
        client.onMessage((message) => {
            msgHandler(client, message)
        })

        client.onGlobalParicipantsChanged((x) => {
            const { action, who , chat} = x
            const groupPic = client.getProfilePicFromServer(chat.id)
            const { desc } = chat.groupMetadata
            console.log(x)
            console.log(chat.id)
            console.log(chat.groupMetadata)
            if (action === 'add') return client.sendFileFromUrl(chat, groupPic, 'groupPic.jpg', `Hello New Member!, Welcome to *${chat.name}* Group description ✨️ \n ${desc}`)
        })
        
        client.onAddedToGroup((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 30) { 
            	client.sendText(chat.id, `This group only has ${totalMem} members, Its needs atleast 30 members to activate the services`).then(() => client.leaveGroup(chat.id))
            	client.deleteChat(chat.id)
            } else {
                client.sendText(chat.groupMetadata.id, `Thanks for adding me *${chat.contact.name}*. Use #help to see the usable commands`)
            }
        })

        // listening on Incoming Call
        client.onIncomingCall((call) => {
            client.sendText(call.peerJid, '...')
            client.contactBlock(call.peerJid)
            ban.push(call.peerJid)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        })
    }

create('Zelda', serverOption)
    .then(async (client) => startServer(client))
    .catch((error) => console.log(error))
