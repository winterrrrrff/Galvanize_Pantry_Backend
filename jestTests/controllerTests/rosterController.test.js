import 'regenerator-runtime/runtime'

// Little fix for Jest, see https://stackoverflow.com/a/54175600
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('test RosterController', () => {
    var UserMock;
    beforeAll(() => {
      /* Runs before all tests */
      const db = require("../../src/database/connection.js");//this line runs the db connection

      var SequelizeMock = require('sequelize-mock');
      var DBConnectionMock = new SequelizeMock();
      UserMock = DBConnectionMock.define('User', {
        'email': 'email@example.com',
        'username': 'blink',
        'picture': 'user-picture.jpg',
        }, {
            instanceMethods: {
                myTestFunc: function () {
                    return 'Test User';
                },
            },
        });

    })
    afterAll(() => {
      /* Runs after all tests */
    })
    beforeEach(() => {
      /* Runs before each test */
    })
    afterEach(() => {
      /* Runs after each test */
    })
    
    test('test getAllEmployees()', async () => {
        const rosterController = require("../../src/controllers/RosterController");
        rosterController.injectUserObj(UserMock);
        let expectedUsers = [];
        const mockRes = {send: (users) => {expectedUsers = users}};
        const actual = await rosterController.getAllEmployees(null, mockRes);
        expect(actual).toBe(expectedUsers);
    })
  })