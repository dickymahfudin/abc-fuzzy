const dataLaporan = require('../../src/helpers/dataLaporan');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sku: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      buyPrice: {
        type: Sequelize.INTEGER,
      },
      currentPrice: {
        type: Sequelize.INTEGER,
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
    await queryInterface.bulkInsert('product', dataLaporan.product);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('product');
  },
};
