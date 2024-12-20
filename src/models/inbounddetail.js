const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InboundDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.ProductModel, {
        foreignKey: 'productId',
        as: 'product',
      });
      this.belongsTo(models.InboundModel, {
        foreignKey: 'inboundId',
        as: 'inbound',
      });
      this.hasMany(models.OutboundRefModel, {
        sourceKey: 'id',
        foreignKey: 'inboundDetailId',
        as: 'refs',
      });
    }
  }
  InboundDetail.init(
    {
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
