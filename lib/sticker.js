const fs = ('fs-extra') 

module.exports = { stickerHandler }
async function stickerHandler(message, client, isAdmin, isBotGroupAdmins, adminList, color, time) {

		console.log(color('[STIK]'), color(time, 'yellow'), 'from', color(message.sender.pushname), 'in', color(message['name']))
		if ((isAdmin) && (isBotGroupAdmins) && (message.type == 'sticker') && (message.filehash == 'XM1N7CiW1xxkL8Oi6sCD2+xECehai2DI4bE37I7PIhw=')) return await client.setGroupToAdminsOnly(message.from, true)
		if ((isAdmin) && (isBotGroupAdmins) && (message.type == 'sticker') && (message.filehash == 'toFAeTndmqlzGRdBUY4K2EAnLdwCqgGF7nmMiaAX2Y0=')) return await client.setGroupToAdminsOnly(message.from, false)
		if ((isAdmin) && (message.quotedMsg) && (isBotGroupAdmins) && (message.filehash == 'UWK/E5Jf/OLg+zFgICX3bwXc0iXfPEZ+PDDf0C+3Qvw=') && (adminList.includes(message.quotedMsgObj.sender.id) == false)) return await client.removeParticipant(message.from, message.quotedMsgObj.sender.id)
		if ((isAdmin) && (message.quotedMsg) && (isBotGroupAdmins) && (message.filehash == 'BfppV7tESHi/QmrxuJG4WdXKYsO3lNTiXf0aBfasJ4E=') && (adminList.includes(message.quotedMsgObj.sender.id) == false)) return await client.promoteParticipant(message.from, message.quotedMsgObj.sender.id)
		if ((isAdmin) && (message.quotedMsg) && (isBotGroupAdmins) && (message.filehash == 'mHbEuCjA+RVWftr2AFuLieAJcyHYZnibd7waZPqvDNQ=') && (adminList.includes(message.quotedMsgObj.sender.id))) return await client.demoteParticipant(message.from, message.quotedMsgObj.sender.id)
		
}
