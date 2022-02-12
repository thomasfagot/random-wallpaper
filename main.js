const config = require('./config');
const Bing = require('node-bing-api')({accKey: config.accessKey});
const Wallpaper = require('wallpaper');
const Axios = require('axios');
const Fs = require('fs');
const searches = JSON.parse(Fs.readFileSync('./searches.json'));

function setRandom(searches, term) {
  let offset = Math.floor(Math.random() * searches[term].length)
  let image = searches[term][offset];
  let path = config.destinationFile + '.' + image.encodingFormat.replace('jpeg', 'jpg');

  downloadImage(image.contentUrl, path)
    .then(() => {
      console.log('Setting result ' + offset + ' / ' + searches[term].length + ' from search "' + term + '".');
      setTimeout(() => Wallpaper.set(path), 500);
    })
    .catch(err => {
      console.error(err.message);
    })
  ;
}

async function downloadImage (url, path) {
  const writer = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

let term = config.terms[Math.floor(Math.random() * config.terms.length)];
if (typeof searches[term] === 'undefined' || searches[term].length === 0) {
  Bing.images(term, {
    count: 150,
    safeSearch: config.safeSearch,
    size: 'Wallpaper',
    aspect: 'Wide',
    minWidth: Math.floor(config.screenWidth * (1 - config.minScreenSizeTolerance / 100)),
    minHeight: Math.floor(config.screenHeight * (1 - config.minScreenSizeTolerance / 100))
  }, function (error, res, body) {
    if (error !== null) {
      return console.error(error);
    }
    if (typeof body.value === 'undefined') {
      return console.error('Invalid response', body);
    }

    searches[term] = body.value;
    Fs.writeFileSync('./searches.json', JSON.stringify(searches));
    setRandom(searches, term);
  });
} else {
    setRandom(searches, term);
}
