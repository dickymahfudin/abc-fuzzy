const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Product.init(
    {
      sku: DataTypes.STRING,
      name: DataTypes.STRING,
      buyPrice: DataTypes.INTEGER,
      currentPrice: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'product',
    },
  );
  return Product;
};
