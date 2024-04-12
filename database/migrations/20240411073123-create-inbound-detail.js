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
      soldAmount: {
        type: Sequelize.INTEGER,
      },
      buyPrice: {
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
    await queryInterface.dropTable('inboundDetail');
  },
};
