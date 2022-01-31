import 'regenerator-runtime/runtime'

// Little fix for Jest, see https://stackoverflow.com/a/54175600
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('test snackController', () => {
    var SnackMock;
    var expectedRes;
    var InventoryMock;
    // var snackController = require("../../src/controllers/SnackController");
    beforeAll(() => {
      /* Runs before all tests */
      const db = require("../../src/database/connection.js");//this line runs the db connection

      var SequelizeMock = require('sequelize-mock');
      var DBConnectionMock = new SequelizeMock();
        expectedRes = {
            'snack_id': '1',
            'name': 'testSnack',
            'category_id': 'beverage',
            'status': 'existing',
        };
        SnackMock = DBConnectionMock.define('Snack', expectedRes, {
            instanceMethods: {
                myTestFunc: function () {
                    return 'Test snack';
                },
            },
        });

        // InventoryMock = DBConnectionMock.define('Inventory', {
        //     'id' : 1,
        //     'snack_Id': 1,
        //     'quantity': 20,
        //     'unit_price': 3.99,
        //     }, {
        //         instanceMethods: {
        //             myTestFunc: function () {
        //                 return 'Test User';
        //             },
        //         },
        //     });
        
        // SnackMock.hasMany(InventoryMock, {foreignKey: "snack_Id", sourceKey: "snack_Id"});
        // InventoryMock.belongsTo(SnackMock, {foreignKey: "snack_Id", sourceKey: "snack_Id"});

        // SnackMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
        //     if (query === 'findAll') {
        //         return SnackMock.build({
        //             'snack_id': '1',
        //             'name': 'testSnack',
        //             'category_id': 'beverage',
        //             'status': 'existing',
        //         });
        //     }
        // });

        // snackController = require("../../src/controllers/SnackController");
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
    
    test('test querySnacks()', async () => {
        var snackController = require("../../src/controllers/SnackController");
        snackController.injectSnackObj(SnackMock);
        // const myMock = jest.fn();
        // const a = new myMock();
        
        // const bound = myMock.bind(snackController);
        // bound();
        
        const res = await snackController.querySnacks();
        expect(res[0].name).toBe(expectedRes.name);
        expect(res[0].snack_id).toBe(expectedRes.snack_id);
        
        console.log("res: " + JSON.stringify(res));

        // snackController.injectSnackObj(UserMock);
        // let expectedUsers = [];
        // const mockRes = {send: (users) => {expectedUsers = users}};
        // const actual = await rosterController.getAllEmployees(null, mockRes);
        // expect(actual).toBe(expectedUsers);
    });

  })