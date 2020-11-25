var emojiStrip = require('emoji-strip')
const fs = require('fs-extra')

module.exports = welcome = async (client, event) => {

	const wel = JSON.parse(fs.readFileSync('./lib/welcome.json'))
  	const isWel = wel.includes(event.chat)
  	try {
  		if (event.action == 'add' && isWel) {
  			const det = await client.getChatById(event.chat)
  			const person = await client.getContact(event.who)
  			await client.sendTextWithMentions(event.chat, `Welcome to *${det.contact.formattedName}!* \n\n@${event.who.replace('@c.us', '')} \n\nHave fun with us✨ \n\n *Group Description* ❤️ \n\n ${det.groupMetadata.desc}`)
  		} 
	} catch(err) {
		console.log(err)
	}
}

