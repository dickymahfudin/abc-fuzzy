/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('outboundDetail', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      outboundId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'outbound',
          key: 'id',
        },
      },
      inboundId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inbound',
          key: 'id',
        },
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product',
          key: 'id',
        },
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
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('outboundDetail');
  },
};
