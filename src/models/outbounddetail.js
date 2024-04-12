const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OutboundDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  OutboundDetail.init(
    {
      outboundId: DataTypes.INTEGER,
      inboundId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      buyPrice: DataTypes.INTEGER,
      currentPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'outboundDetail',
    },
  );
  return OutboundDetail;
};
