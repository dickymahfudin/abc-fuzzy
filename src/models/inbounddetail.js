const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InboundDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  InboundDetail.init(
    {
      inboundId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      soldAmount: DataTypes.INTEGER,
      buyPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'inboundDetail',
    },
  );
  return InboundDetail;
};
