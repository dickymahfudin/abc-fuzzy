const { generateOutbound } = require('../../src/helpers/dataLaporan');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('outboundRef', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      outboundDetailId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'outboundDetail',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      inboundDetailId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inboundDetail',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      buyPrice: {
        type: Sequelize.INTEGER,
      },
      currentPrice: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await generateOutbound();
  },
  async down(queryInterface) {
    await queryInterface.dropTable('outboundRef');
  },
};
