const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OutboundRef extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.InboundDetailModel, {
        foreignKey: 'inboundDetailId',
        as: 'inboundDetail',
      });
      this.belongsTo(models.OutboundDetailModel, {
        foreignKey: 'outboundDetailId',
        as: 'outboundDetail',
      });
    }
  }
  OutboundRef.init(
    {
      outboundDetailId: DataTypes.INTEGER,
      inboundDetailId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      buyPrice: DataTypes.INTEGER,
      currentPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'outboundRef',
    },
  );
  return OutboundRef;
};
