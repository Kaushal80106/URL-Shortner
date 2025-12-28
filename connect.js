

const mongoose  = require('mongoose')

async function ConnectWithDb(url) {
  return await mongoose.connect(url);
}

module.exports = {
    ConnectWithDb ,
}