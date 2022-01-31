module.exports = async () => {
    //Require models
   
    const Category = require("../../models/Category");
    const Inventory = require("../../models/Inventory");
    const Order_Detail = require("../../models/Order_Detail");
    const Order = require("../../models/Order");
    const Snack = require("../../models/Snack");
    const User = require("../../models/User");
   

    //Create Relations 
    User.hasMany(Order, {foreignKey: "user_Id", sourceKey: "id", onDelete: 'cascade', onUpdate: 'cascade'});
    //User.hasMany(Order, { onDelete: 'cascade', onUpdate: 'cascade'});
   

    Order.belongsTo(User, {foreignKey: "user_Id", sourceKey: "id"});
  

    Order.hasMany(Order_Detail, {foreignKey: "order_id", sourceKey: "id", onDelete: 'cascade', onUpdate: 'cascade'});
    //Order.hasMany(Order_Detail, { onDelete: 'cascade', onUpdate: 'cascade'});
    Order_Detail.belongsTo(Order, {foreignKey: "order_id", sourceKey: "id"});

    Order_Detail.hasOne(Snack, {foreignKey: "snack_Id", sourceKey: "snack_id"});
    Snack.belongsTo(Order_Detail, {foreignKey: "snack_Id", sourceKey: "snack_id"});

    Category.hasMany(Snack, {foreignKey: "category_id", sourceKey: "category_id"});
    Snack.belongsTo(Category, {foreignKey: "category_id", sourceKey: "category_id"});

    Snack.hasMany(Inventory, {foreignKey: "snack_Id", sourceKey: "snack_Id", onDelete: 'cascade', onUpdate: 'cascade'});
    //Snack.hasMany(Inventory, { onDelete: 'cascade', onUpdate: 'cascade'});
    Inventory.belongsTo(Snack, {foreignKey: "snack_Id", sourceKey: "snack_Id"});
  };