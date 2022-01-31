import express from 'express';
var session = require('express-session')
var cookieParser = require("cookie-parser");
const db = require("../src/database/connection.js");
require("../src/server/bootstrap.js")();

const cors = require('cors')
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
router.use(cors({
  credentials:true,
  origin: ["http://localhost:3000","https://galvanize-pantry.herokuapp.com"]
}));
router.use(session({
  cookie: {maxAge: 10000*1000, secure:true, httpOnly:false, path:'/', sameSite: "None"},
  secret: "placeholder",
  proxy: true,
  resave: true,
  saveUninitialized: false
}));
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./testData/testData_peter.json', 'utf8'));
const data_cart = JSON.parse(fs.readFileSync('./testData/cart_snacks.json', 'utf8'));

const Sequelize = require("sequelize");


//#region This is the region for sequelize
db.authenticate()
    .then(() => console.log('datebase connected...'))
    .catch(err => console.error("Error: " + err));


exports.db = db;

//#endregion

// Add controllers:
const userDeleteController = require("../src/controllers/UserDeleteController.js");
router.post("/deleteUser", userDeleteController.deleteUser);
router.get("/getAllEmployees", userDeleteController.getAllEmployees);

const userEditController = require("../src/controllers/UserEditController.js");
// router.get("/getAllEmployees", userEditController.getAllEmployees);
router.post("/editUser", userEditController.getUserInformation);

const rosterController = require("../src/controllers/RosterController.js");
router.get("/testCreatingAUser", rosterController.testCreatingAUser);
// router.get("/getAllEmployees", rosterController.getAllEmployees);

// examples:
router.get("/users/:id", rosterController.getUser);
router.post("/createUser", rosterController.createUser);
router.post("/deleteUser", rosterController.deleteUser);
router.post("/update/:id", rosterController.updateUser);

// Other controllers(starts here):


// Controller for managing snack
const snackManageController = require ("../src/controllers/SnackManageController.js")
router.post("/addSnack", snackManageController.addSnack);
router.post("/editSnack", snackManageController.editSnack);
router.post("/deleteSnack", snackManageController.deleteSnacks);
router.get("/getCategories", snackManageController.getCategory);
router.get("/getSnacks", snackManageController.getAllSnacks);
router.get("/getNewSnack", snackManageController.getNewSnack);

// Controller for managing inventory
router.post("/getInventory", snackManageController.getInventory);
router.post("/updateInventory", snackManageController.updateInventory);
router.post("/deleteInventory", snackManageController.deleteInventory);

const snackController = require("../src/controllers/SnackController");
const categoryController = require("../src/controllers/CategoryController");
router.get("/snacks", snackController.getAllSnacks);
router.get("/categories", categoryController.getCategories);


// Controller for Order History
const orderHistoryController = require("../src/controllers/OrderHistoryController.js");
router.get("/testOrderHistory", orderHistoryController.simpleTestCase);
router.get("/order", orderHistoryController.getAllOrderHistory);
router.get("/createOrderDetail", orderHistoryController.createOrderDetail);

//controller for reports
const currentInventoryController = require("../src/controllers/CurrentInventoryReportController.js");
router.get("/getAllInventory", currentInventoryController.getAllInventory);
router.get("/getAllCategoryName", currentInventoryController.getAllCategory);
router.get("/getAllSnackName", currentInventoryController.getAllSnack);
router.get("/getSelectSnack", currentInventoryController.createSnack);

const staleInventoryController = require("../src/controllers/StaleInventoryReportController.js");
router.get("/getAllStaleInventory", staleInventoryController.getAllStaleInventory);

const voteReportController = require("../src/controllers/VoteReportController.js");
router.get("/getAllVote", voteReportController.getAllVote);

const paymentReportController = require("../src/controllers/PaymentReportController.js");
router.get("/getAllPayment", paymentReportController.getAllPayment);
router.get("/getAllUserName", paymentReportController.getAllUser);
router.get("/getAllStatus", paymentReportController.getAllStatus);


const fileUpload = require('express-fileupload');
router.use(fileUpload());
const uploadController =  require("../src/controllers/UploadController");
router.post("/uploadUserImage" ,uploadController.uploadUserImage);
router.get("/getUserImg/:id" ,uploadController.getUserImageFile);
router.post("/uploadSnackImage" ,uploadController.uploadSnackImage);
router.get("/getSnackImg/:id" ,uploadController.getSnackImageFile);
//#endregion

// const authController = require("../src/controllers/AuthController");
// router.post("/google", authController.loginWithGoogleTest);


router.post("/auditOrder", orderHistoryController.getAllOrderHistoryForAdmin);
router.post("/updateOrderStatus", orderHistoryController.updateOrder);


// const fileUpload = require('express-fileupload');
// router.use(fileUpload());
// const uploadController =  require("../src/controllers/UploadController");
// router.post("/uploadUserImage" ,uploadController.uploadUserImage);
// router.get("/getUserImg/:id" ,uploadController.getUserImageFile);

// Controller for Vote
const voteController = require("../src/controllers/voteController.js");
router.get("/testVote", voteController.voteTestCase);
router.post("/updateVote",voteController.updateVoteCount);
router.post("/createVoteSnack",voteController.createNewRecommandSnack);

// Controller for Cart
const cartController = require("../src/controllers/cartController.js");
router.post("/createOrder",cartController.createOrder)
router.get("/testCreatingAOrder", cartController.testCreatingAOrder);


const authController = require("../src/controllers/AuthController");
router.post("/google",
    // For proxy/VPN users, modify and use loginWithGoogleTest if network error occurs. (seems to fail auth connection)
    authController.loginWithGoogle);

router.post("/rosterLogin", authController.login);
// example for getting user id
router.get("/getUserId",authController.testSession);
router.get("/verifyUser", authController.verifyUser);
router.get("/verifyAdmin", authController.verifyAdmin);
// example for logout
router.get("/logout",authController.logout);

export default router;
