const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Outbound extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.OutboundDetailModel, {
        sourceKey: 'id',
        foreignKey: 'outboundId',
        as: 'detail',
      });
    }
  }
  Outbound.init(
    {
      transactionDate: DataTypes.DATE,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'outbound',
    },
  );
  return Outbound;
};
