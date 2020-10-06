// edit it to change the bot's name
const botname = 'Emilia' 

function help( pushname ) {
    return `Yoo 👋️Hi ${pushname}, I'm ${botname}!

Prefix - #

🌟️ Command List 🌟️

*_CMD: #profile_*
*Description: Displays the information of the user*

*_CMD: #info_*
*Description: Displays the information about the bot* 🌐️

*_CMD: #sticker_*
*Description: Turns images into stickers* 🔖️
Usage: #sticker as caption of picture

*_CMD: #gsticker <giphy URL>_*
*Description: Turns gifs into stickers* 🌠️

*_CMD: #sauce_*
*Description: Give's the title of the picture specified* ❤️
Usage: #sauce as the caption or reply of any picture

*_CMD: #pokemon_*
*Description: Returns picture of a random Pokemon* 😺️

*_CMD: #waifu_*
*Description: Returns picture of a random waifu* 💌️

*_CMD: #anime <anime name>_*
Description: Returns the information of the given anime* 📺️
Usage: #anime sakura trick

*_#tts <language-code> <text>_* [Disabled due to ban-risk]
*Description: Converts text to speech* 🗣️
Usage: #tts en I love Emilia

*_#quotemaker | quote | author |_*
*Description: Convert the given quote to an image*
Usage: #qm | Courage need not to be remembered, for it is never forgotten | Emilia 🌌️

*_#lyrics <song name>_*
*Description: Displays the lyricsof the given song* 🎶️
Usage: #lyrics Shinzou wo sasageyo
            
*_CMD: #neko_*
*Description: Displays picture of a random cat* 🐈️

*_CMD: #doggo_*
*Description: Displays picture of a random pup* 🐕️

*_CMD: #rpaper_*
*Description: Displays a random wallpaper* 🌆️

*_CMD: #animeneko_*
Description: Displays picture of an anime cat ;)* 💚️

*_CMD: #wallpaper <keyword>_*
*Description: Returns a random anime wallpaper based on the keyword* 📱️
Usage: #wallpaper Black Butler

*_CMD: #covid <country>_*
*Description: Displays the live stats of Covid-19 of the given country* 🌍️
Usage: #covid Japan

*_CMD: #meme_*
*Description: Returns a random meme 🎷️ 

*_CMD: #sr <subreddit_title>_*
*Description: Displays a post from the given subreddit* 💻️
Usage: #sr Emilia

*_CMD: #quotes_* [Disabled]
*Description: Returns a quote that will either give you existential crises or wisdom* 🌠️

*_CMD: #groupinfo_*
*Description: Displays the information of the group* ⛱️

*_CMD: #roll_*
*Description: Rolls a dice* 🎲

*_CMD: #flip_*
*Description: Flips a coin* 🟡

Admin Commands 📙️

Only group admins can execute this command

*_CMD: #ping <text>_*
*Description: Tags all members in the group* 🔊️
Usage: #ping Well, in that case

*_CMD: #delete_*
Description: Deletes the Bot's message* 💔️
Usage: Send #delete as reply to the bot's message

To execute the following commands the bot and the author needs to be admin

*_CMD: #seticon_*
*Description: Sets the quoted image as the group icon* 🎆️

*_CMD: #kick @user_*
*Description: Kicks the mentioned person from the group* 🏌️

*_CMD: #promote @user_*
*Description: Makes the metioned user admin* 👑️

*_CMD: #demote @user_*
*Description: Demotes the mentioned user from adminship* 💔️


There are many hidden and fun keywords ;)

Hope you have a great day!`
}
exports.help = help()
function info() {
    return '👋️Hi there, I\'m ${botname}\nThis project is open source, built using Javascript || Node.js and is available at GitHub https:\/\/bit.ly\/39Ld2L8 (Updated).\n\n *Creators*👑️\n\n_Emilia Yohannan (Ban Takahiro)_ \n _Somnath Das (Takeshi Stark)_ \n\n*Developers*✨\n \n _Emilia Yohannan_ \n_Somnath Das_\n_Dominik Heiing_\n\n*Contributors*💫\n\n_Miliana Blue_\n_Aman Sakuya_\n_Mystery_\n_ShellTear_'
}
exports.info = info()


