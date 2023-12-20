"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PurchaseOrders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      po_id: {
        type: Sequelize.INTEGER,
      },
      company_name: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "companies",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      address: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      fax: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      po_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order_date: {
        type: Sequelize.DATE,
      },
      delivery_date: {
        type: Sequelize.DATE,
      },
      vendor_name: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vendors",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      ship_to: {
        type: Sequelize.STRING,
      },
      ship_via: {
        type: Sequelize.STRING,
      },
      term: {
        type: Sequelize.TEXT,
      },
      order_by: {
        type: Sequelize.STRING,
      },
      confirm_with: {
        type: Sequelize.STRING,
      },
      placed_via: {
        type: Sequelize.STRING,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      updated_by: {
        type: Sequelize.INTEGER,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deleted_by: {
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("PurchaseOrders");
  },
};
