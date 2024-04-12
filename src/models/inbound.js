const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inbound extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Inbound.init(
    {
      transactionDate: DataTypes.DATE,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'inbound',
    },
  );
  return Inbound;
};
