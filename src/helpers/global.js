/* eslint-disable */
const createError = require('../errorHandlers/ApiErrors');
const Passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/dbconfig');
const bcrypt = require('bcrypt');
const aws = require('aws-sdk');
const fs = require('fs');
const { Readable } = require('stream');
const { Paket_soal } = require('../models');

const payload = (user) => {  
  return {
    id: user.id,
    username: user.username, 
    email: user.email
  }  
}

module.exports = {  

  /** 
   * @param {object} user
   * @returns 
   */

  generateAccessToken(user) {    
    const time = '10m'
    const signed = jwt.sign( payload(user), config.auth.accessTokenSecret, {
      expiresIn: time
    });
    return {
      token: signed,
      expiration: time
    }
  },

  /** 
   * @param {object} user
   * @returns 
   */

  generateRefreshToken(user) {
    // dconst time = '7d'
    const signed = jwt.sign( payload(user), config.auth.refreshTokenSecret);    
    return {
      token: signed
    }
  },

  /** 
   * @param {Number} pages
   * @param {Number} limits
   * @param {Object} options
   * @returns {Object}
   */
  
  async paginator(model, pages, limits, options) {       
    const page = pages
    const limit = limits
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.count()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }    
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    if(options){
      if( 'countModel' in options){
        if (endIndex < await options.countModel.count()) {
          results.next = {
              page: page + 1,
              limit: limit
          }
        }        
        delete options.countModel
        results.results = await model.findAll(options)
      } else {
        results.results = await model.findAll(options)
      }          
    } else {
      results.results = await model.findAll({
          offset:startIndex,
          limit:limit
      })
    }        
    return results
  },

  /** 
   * @param {Object} opt
   * @param {Number} pages
   * @param {Number} limits
   * @returns {Object}
   */

  async paginatorMN(opt, pages, limits){
    const page = pages
    const limit = limits
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await opt.model.count()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }    
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    results.results = opt.finder
    return results
  },

  async auther(opt) {    
    return new Promise((resolve, reject) => {
      let x = opt.auth_name;
      Passport.authenticate(x, { session: false }, (err, user) => {
        if (err) {
          reject(err)
        } else if (!user) {         
          reject(createError.Unauthorized('Access denied, please re-login.'))
        }
        resolve(user)
      })(opt.req, opt.res, opt.next);
    })
  },

  todaysdate() {
    let today = new Date();
    let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let time = today.getHours() + '.' + today.getMinutes();
    let dateTime = date+'_'+time;
    return dateTime
  },

  dateFull() {
    var today = new Date();
    const monthNames = ["Januari", "Februari", "Maret", "April", "May", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    var dd = String(today.getDate());
    var mm = monthNames[today.getMonth()];
    var yyyy = today.getFullYear();
    today = dd + ' ' + mm + ' ' + yyyy;
    return today
  },

  /** 
   * @param {Object} obj
   * @param {Function} functn
   * @returns {Object} 
   */

  objectMap(obj, functn) {
    return Object.fromEntries(
      Object.entries(obj).map(
        ([k, v], i) => [k, functn(v, k, i)]
      )
    )
  },

  /** 
   * @param {Number} length
   * @returns {String} 
   */

  async createKode(length) {
    let kdPaket = '', paketExist;
    var characters       = config.codegen.char;
    var charactersLength = characters.length;
    function shuffle(char){
      var a = char.split(""), n = a.length;  
      for(var i = n - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = a[i];
          a[i] = a[j];
          a[j] = tmp;
      }
      return a.join("");
    }   
    do {
      for ( var i = 0; i < length; i++ ) {
        kdPaket += characters.charAt(Math.floor(Math.random() * charactersLength));
      }  
      paketExist = await Paket_soal.findOne({  //paketExist = null
        attributes:['kode_paket'],
        where: {kode_paket: kdPaket}
      });
      characters = shuffle(characters);
    } while(paketExist) // false
    return kdPaket;
  },

  shuffleArray() {
    var arrLength = 0;
    var argsLength = arguments.length;
    var rnd, tmp;
    var isArray = Array.isArray || function (value) {
      return {}.toString.call(value) !== "[object Array]"
    };
  
    for (var index = 0; index < argsLength; index += 1) {
      if (!isArray(arguments[index])) {
        throw new TypeError("Argument is not an array.");
      }
  
      if (index === 0) {
        arrLength = arguments[0].length;
      }
  
      if (arrLength !== arguments[index].length) {
        throw new RangeError("Array lengths do not match.");
      }
    }
  
    while (arrLength) {
      rnd = Math.floor(Math.random() * arrLength);
      arrLength -= 1;
      for (argsIndex = 0; argsIndex < argsLength; argsIndex += 1) {
        tmp = arguments[argsIndex][arrLength];
        arguments[argsIndex][arrLength] = arguments[argsIndex][rnd];
        arguments[argsIndex][rnd] = tmp;
      }
    }
  },

  /**
   * @param {String} start 
   * @param {String} end 
   * @returns {String} 
   */
  
  timeDiff(start, end) {
    function hmsToSeconds(s) {
      var b = s.split(':');
      return b[0] * 3600 + b[1] * 60 + (+b[2] || 0);
    }
    
    function secondsToHMS(secs) {
      function z(n) { return (n < 10 ? '0' : '') + n; }
      var sign = secs < 0 ? '-' : '';
      secs = Math.abs(secs);
      return sign + z(secs / 3600 | 0) + ':' + z((secs % 3600) / 60 | 0) + ':' + z(secs % 60);
    }
    
    var startTime = hmsToSeconds(start);
    var endTime = hmsToSeconds(end);
    
    var diff = secondsToHMS(endTime - startTime);
    
    var r = Number(diff.split(':')[0]) * 60 * 60 * 1000 + Number(diff.split(':')[1]) * 60 * 1000;
    
    var diffHrs = Math.floor((r % 86400000) / 3600000);
    var diffMins = Math.round(((r % 86400000) % 3600000) / 60000);
    
    let durasi;
    if(diffHrs){
      durasi = `${diffHrs} jam ${diffMins} menit`
    } else {
      durasi = `${diffMins} menit`
    }
    return durasi;
  }, 

  async hashed() {
    return new Promise((resolve, reject) => {
      bcrypt.hash(config.auth.defaultPass, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      })
    })
  },// hash default password, ada di .env

  getAwsInstance() {
    aws.config.update({
      secretAccessKey: config.aws.s3.secretAccessKey,
      accessKeyId: config.aws.s3.accessKeyId,
      region: config.aws.s3.region
    });
     
    return new aws.S3(); 
  },

  /** 
   * @param {Object} file Object with fileKey and buffer prop
   * @param {String} file.fileKey fileKey in string or
   * @param {String} [file.filename] filename in string;
   * @param {Buffer} file.buffer buffer for file or
   * @param {String} [file.path] pathname for streamable;
   * @param {String} file.mimetype exact mimetype of file
   * @returns promise of file
   */
  uploadFile(file) {
    let fileStream;
    if(file.buffer){
      fileStream = Readable.from(file.buffer);
    } else {
      fileStream = fs.createReadStream(file.path);
    }
    const uploadParams = {
      Bucket: config.aws.s3.bucketName,
      Body: fileStream,
      Key: () => {
        let url;
        switch(file.mimetype) {
          case 'image/jpeg':
          case 'image/png':
          case 'image/gif':
          case 'image/jpg':
            url = `images/${file.fileKey || file.filename}`;
          break;
          case 'audio/mid':
          case 'audio/mpeg':
          case 'audio/vnd.wav':
          case 'audio/mp4':
          case 'audio/ogg':
            url = `audios/${file.fileKey || file.filename}`;
          break;
          case 'video/mp4':
          case 'video/MP2T':
          case 'video/webm':
          case 'video/quicktime':
          case 'video/x-msvideo':
          case 'video/x-ms-wmv':
          case 'video/x-flv':
          case 'video/3gpp':
            url = `videos/${file.fileKey || file.filename}`;
          break;
          default:
            url = `excels/${file.fileKey || file.filename}`;
        }
        return url;
      }
    }  
    return module.exports.getAwsInstance()
    .upload(uploadParams)
    .promise().then(function(data) { return }, function(err) {
      if(err) return new Error(err.message);
    });
  },

  /** 
   * @param {String} fileKey filekey name
   * @param {String} fileType filetype name
   * @returns callback of file
   */
  getFileStream(fileKey, fileType) {
    const downloadParams = {
      Key: (function string() {        
        let url;
        switch(fileType) {
          case 'image':
            url = `images/${fileKey}`;
          break;
          case 'audio':
            url = `audios/${fileKey}`;
          break;
          case 'video':
            url = `videos/${fileKey}`;
          break;
          default:
            url = `excels/${fileKey}`;
        }
        return url;
      })(),
      Bucket: config.aws.s3.bucketName
    }
    return module.exports.getAwsInstance()
    .getObject(downloadParams)
    .createReadStream();
  },

  /** 
   * @param {Array} arrayOffileswithsuffix array of file with suffix
   * @returns callback of file
   */
  deleteFiles(arrayOffileswithsuffix){
    const deleteParams = {
      Bucket: config.aws.s3.bucketName,
      Delete: {
        Objects: arrayOffileswithsuffix,
        Quiet: true
      },
    }
    return module.exports.getAwsInstance().deleteObjects(deleteParams, function(err, data) {
      if (err) console.error(err, err.stack);
      else  console.log(`successfully deleted ${data.Deleted.length} data(s) from bucket`)
    });
  }

}