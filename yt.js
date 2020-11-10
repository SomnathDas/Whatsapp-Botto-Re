/*
Author: Fredwuz (frederic23.mai@gmail.com) <-- awesome guy ;)
yt.js (c) 2020
Desc: YT downloader logic
Created:  10/24/2020
Modified: 11/8/2020
*/

const nrc = require('node-run-cmd')
const fs = require('fs')
const youtubedl = require('youtube-dl')
const queuejs = require('./queue')

exports.mp3 = async function (message) {
	const path = './media/audio/' + message.from + '.mp3';
  console.log(amdownloaden)
  if (amdownloaden.indexOf(message.from) > -1) {
    gclient.sendText(message.from, 'Audio added to Queue')
    queuemp3.push(message)
    return
  } else {
  }
  amdownloaden.push(message.from)

  var link = String(message.body.match(/\bhttps?:\/\/\S+/gi))
  if (link == 'null') {
    gclient.sendText(message.from, 'No Video Link')
    for (let index = 0; index < amdownloaden.length; index++) {
      if (amdownloaden[index] == message.from) {
        amdownloaden.splice([index], 1)
      }
    }
    return
  }
  console.log(link)
  // await gclient.sendText(message.from, 'Audio downloading')
  await gclient.reply(message.from, 'Audio downloading', message.id.toString())
  // waiter = await downloadmp3(link, message.from)
  // console.log(waiter)
  // Working Shit : youtube-dl --extract-audio --audio-quality 0 --audio-format mp3  --output "./media/audio/558188263143-1604302614@g.us.%(ext)s" https://www.youtube.com/watch?v=KDN3AQijLU8
  console.log('youtube-dl --extract-audio --audio-quality 0 --audio-format mp3  --output ' + `"./media/audio/${message.from}.%(ext)s" `  + link)
  await nrc.run('youtube-dl --extract-audio --audio-quality 0 --audio-format mp3  --output ' + `"./media/audio/${message.from}.%(ext)s" ` + link)
  if (Math.round(fs.statSync('./media/audio/' + message.from + '.mp3').size / 1000000) > 99) {
    gclient.sendText(message.from, "File bigger then 100 Mb can't send file")
    if (queuemp3.length != 0) {
      queuejs.mp3(message)
    }
    return
  }
  await gclient.sendPtt(from, './media/audio/' + message.from + '.mp3', id)
  //await gclient.sendFile(message.from, './media/audio/' + message.from + '.mp3', '', '')
  if (Math.round(fs.statSync('./media/audio/' + message.from + '.mp3').size / 1000000) == 0) {
    var größe = Math.round(fs.statSync('./media/audio/' + message.from + '.mp3').size / 1000) + ' kB'
  } else {
    var größe = Math.round(fs.statSync('./media/audio/' + message.from + '.mp3').size / 1000000) + ' MB'
  }

  await gclient.sendText(message.from, 'Audio sending \nSize: ' + größe)
  console.log('Audio sending to ' + message.from)
  for (let index = 0; index < amdownloaden.length; index++) {
    if (amdownloaden[index] == message.from) {
      amdownloaden.splice([index], 1)
    }
  }
  if (queuemp3.length != 0) {
    queuejs.mp3(message)
  }
  delete require.cache[require.resolve('./queue')]
}

exports.mp4 = async function (message) {
  console.log(amdownloaden)
  if (amdownloaden.indexOf(message.from) > -1) {
    gclient.sendText(message.from, 'Video added to Queue')
    queuemp4.push(message)
    return
  } else {
  }
  // amdownloaden.push(message.from)

  var link = String(message.body.match(/\bhttps?:\/\/\S+/gi))
  if (link == 'null') {
    await gclient.sendText(message.from, 'No Video Link')
    for (let index = 0; index < amdownloaden.length; index++) {
      if (amdownloaden[index] == message.from) {
        amdownloaden.splice([index], 1)
      }
    }
    return
  }
  console.log(link)
  await gclient.sendText(message.from, 'Video downloading')
  // console.log('youtube-dl --format mp4 --no-continue  --output "/home/pi/venom-bot-WhatsappWebBot/video/' + message.from + '.%(ext)s" ' + link)
  await nrc.run('youtube-dl --format mp4 --no-continue  --output "./media/video/' + message.from + '.%(ext)s" ' + link)
  if (Math.round(fs.statSync('./media/video/' + message.from + '.mp4').size / 1000000) > 63) {
    gclient.sendText(message.from, "File bigger then 64 Mb can't send file")
    if (queuemp4.length != 0) {
      queuejs.mp4(message)
    }
    return
  }
  await gclient.sendFile(message.from, './media/video/' + message.from + '.mp4', '', '')

  if (Math.round(fs.statSync('./media/video/' + message.from + '.mp4').size / 1000000) == 0) {
    var größe = Math.round(fs.statSync('./media/video/' + message.from + '.mp4').size / 1000) + ' kB'
  } else {
    var größe = Math.round(fs.statSync('./media/video/' + message.from + '.mp4').size / 1000000) + ' MB'
  }

  await gclient.sendText(message.from, 'Video sending\nSize: ' + größe)
  console.log('Video sending to ' + message.from)
  Sleep(10000)
  for (let index = 0; index < amdownloaden.length; index++) {
    if (amdownloaden[index] == message.from) {
      amdownloaden.splice([index], 1)
    }
  }
  if (queuemp4.length != 0) {
    queuejs.mp4(message)
  }
  delete require.cache[require.resolve('./queue')]
}

function Sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

var dataCallback = function (data) {
  daten = data
}
