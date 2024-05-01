const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OutboundDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.OutboundRefModel, {
        sourceKey: 'id',
        foreignKey: 'outboundDetailId',
        as: 'refs',
      });
      this.belongsTo(models.OutboundModel, {
        foreignKey: 'outboundId',
        as: 'outbound',
      });
      this.belongsTo(models.ProductModel, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }
  OutboundDetail.init(
    {
      outboundId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      currentPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'outboundDetail',
    },
  );
  return OutboundDetail;
};
