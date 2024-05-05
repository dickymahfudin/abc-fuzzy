const { generateInbound } = require('../../src/helpers/dataLaporan');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inboundDetail', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      inboundId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inbound',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      soldAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      buyPrice: {
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
    await generateInbound();
  },
  async down(queryInterface) {
    await queryInterface.dropTable('inboundDetail');
  },
};
