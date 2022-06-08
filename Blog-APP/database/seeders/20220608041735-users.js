'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('users', [{
      id:7,
      email: "ramesh@exmaple.com",
      password: "pass12369",
      role: "admin",
      refreshtoken: "scedyveydvesbuebu  ",
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  
  },

  

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
