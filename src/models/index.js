const { Sequelize } = require('sequelize');
const process = require('process');

const env = process.env.NODE_ENV || 'development';
const config = require('../../database/config/config')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.UserModel = require('./user')(sequelize, Sequelize.DataTypes);
db.ProductModel = require('./product')(sequelize, Sequelize.DataTypes);
db.InboundModel = require('./inbound')(sequelize, Sequelize.DataTypes);
db.InboundDetailModel = require('./inbounddetail')(sequelize, Sequelize.DataTypes);
db.OutboundModel = require('./outbound')(sequelize, Sequelize.DataTypes);
db.OutboundDetailModel = require('./outbounddetail')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
