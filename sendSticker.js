const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const mime = require('mime-types')
const nrc = require('node-run-cmd')
const sizeOf = require('image-size')
const gifFrames = require('gif-frames')
const Jimp = require('jimp')
const { GifFrame, GifUtil, GifCodec } = require('gifwrap')
const queuejs = require('./queue')

module.exports.sendAnimatedSticker = async function (message) {
 try {
   console.log(sendingAnimatedSticker)
  if (sendingAnimatedSticker.indexOf(message.from) > -1) {
    queueAnimatedSticker.push(message)
    return
  } else {
  }
  sendingAnimatedSticker.push(message.from)
  const buffer = await decryptMedia(message)
  const fileName = `./media/sticker/temp${message.from}.${mime.extension(message.mimetype)}`
  await fs.writeFileSync(fileName, buffer)
  await nrc.run(`ffmpeg -y -i ./media/sticker/temp${message.from}.mp4 ./media/sticker/${message.from}.gif`)
  await gifFrames({ url: './media/sticker/' + message.from + '.gif', frames: 'all' }).then(function (frameData) {
    frameData[0].getImage().pipe(fs.createWriteStream('./media/sticker/firstframe' + message.from + '.png'))
    frames = frameData
  })
  //  console.log(frames.length)

  if (frames.length < 7) {
    await nrc.run('convert ' + './media/sticker/' + message.from + '.gif ./media/sticker/' + message.from + '.gif  ./media/sticker/' + message.from + '.gif')
  }

  await nrc.run('convert ' + './media/sticker/' + message.from + '.gif -coalesce -delete 0 ./media/sticker/' + message.from + '.gif')
  var dimensions = await sizeOf('./media/sticker/' + message.from + '.gif')
  success = true
  while (success) {
    await Jimp.read('./media/sticker/firstframe' + message.from + '.png')
      .then((image) => {
        for (let i = 1; i < dimensions.width; i++) {
          for (let j = 1; j < dimensions.height; j++) {
            Sleep(1)
            colors = Jimp.intToRGBA(image.getPixelColor(i, j))
            if (colors.r > 155) {
              colors.r = colors.r - 5
            } else {
              colors.r = colors.r + 5
            }
            if (colors.g > 155) {
              colors.g = colors.g - 5
            } else {
              colors.g = colors.g + 5
            }
            if (colors.b > 155) {
              colors.b = colors.b - 5
            } else {
              colors.b = colors.b + 5
            }
            if (colors.a > 155) {
              colors.a = colors.a - 5
            } else {
              colors.a = colors.a + 5
            }

            hex = Jimp.rgbaToInt(colors.r, colors.g, colors.b, colors.a)

            //     console.log(hex)
            image.setPixelColor(hex, i, j) // sets the colour of that pixel
            success = false
          }
        }
        image.write('./media/sticker/firstframe' + message.from + '.png')
      })
      .catch((err) => {
        console.log('ERROR: ' + err)
      })
  }
  await Sleep(1000)
  console.log(dimensions.width + '  ' + dimensions.height)
  if (dimensions.width < dimensions.height) {
    await nrc.run('mogrify -bordercolor transparent -border ' + (dimensions.height - dimensions.width) / 2 + 'x0 ./media/sticker/' + message.from + '.gif')
    await nrc.run('mogrify -bordercolor transparent -border ' + (dimensions.height - dimensions.width) / 2 + 'x0 ./media/sticker/firstframe' + message.from + '.png')
  } else if (dimensions.width > dimensions.height) {
    await nrc.run('mogrify -bordercolor transparent -border 0x' + (dimensions.width - dimensions.height) / 2 + ' ./media/sticker/' + message.from + '.gif')
    await nrc.run('mogrify -bordercolor transparent -border 0x' + (dimensions.width - dimensions.height) / 2 + ' ./media/sticker/firstframe' + message.from + '.png')
  } else {
  }
  await nrc.run('convert ' + './media/sticker/firstframe' + message.from + '.png' + ' ./media/sticker/' + message.from + '.gif -resize 256x256' + ' ./media/sticker/' + message.from + '.gif')
  stats = fs.statSync('./media/sticker/' + message.from + '.gif')
  console.log(stats['size'])
  try {
    await nrc.run(`gif2webp ./media/sticker/${message.from}.gif -o ./media/sticker/${message.from}.webp`)
    await nrc.run(`webpmux -set exif ./media/sticker/data.exif ./media/sticker/${message.from}.webp -o ./media/sticker/${message.from}.webp`)
    if (fs.existsSync(`./media/sticker/${message.from}.webp`)) {
    const contents = await fs.readFile(`./media/sticker/${message.from}.webp`, {encoding: 'base64'}) 
    await sclient.sendRawWebpAsSticker(message.from, contents)
    } else {
    const gifData = await fs.readFile(`./media/sticker/${message.from}.webp`, {encoding: 'base64'})
    await sclient.sendImageAsSticker(message.from, `data:image/gif;base64,${gifData}`)
    }
  } catch (error) {
    console.log(error)
    if (String(error) == 'Error: Processed image is too large for the WebP format') {
      sclient.reply(message.from, String(error), message.id.toString()) //Error: Processed image is too large for the WebP format
    }
  }

  for (let index = 0; index < sendingAnimatedSticker.length; index++) {
    if (sendingAnimatedSticker[index] == message.from) {
      sendingAnimatedSticker.splice([index], 1)
    }
  }
  if (queueAnimatedSticker.length != 0) {
    queuejs.sendAnimatedSticker(message)
  }
  delete require.cache[require.resolve('./queue')]

  } catch(err) {
     console.log(err)
}
}

function Sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
