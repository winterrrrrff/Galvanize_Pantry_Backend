const Order = require('../../models/Order.js');
const Order_Detail = require('../../models/Order_Detail.js');
const Snack = require('../../models/Snack.js');
const Category = require('../../models/Category.js');
const Sequelize = require("sequelize");

exports.simpleTestCase = (req, res, next) => {
    let id = 160001;
    Category.create({
        category_id: 160001,
        name: "Beverage"
    }).then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `A category is already created with the id ${id}`,
            });
        });
    id = 170001;
    Snack.create({
        snack_Id: 170001,
        category_id: 160001,
        name: "Lemon Tea"
    }).then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `A snack is already created with the id ${id}`,
            });
        });

    id = 180001;
    Order.create({
        id: 180001,
        user_Id: 16401150,
        status: "Pending"
    }).then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `A order is already created with the id ${id}`,
            });
        });

    id = 190001;
    Order_Detail.create({
        id: 190001,
        order_id: 180001,
        snack_id: 170001,
        quantity: 2,
        unit_price: 18.8,
        total_price: 37.6
    }).then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `A order_detail is already created with the id ${id}`,
            });
        });
}


exports.createOrderDetail = (req, res, next) => {
    const id = 190002;
    Order_Detail.create({
        id: 190002,
        order_id: 180002,
        snack_id: 170001,
        quantity: 2,
        unit_price: 1.0,
        total_price: 2.0
    }).then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `A order_detail is already created with the id ${id}`,
            });
        });
}
exports.getAllOrderHistory = (req, res, next) => {
    Order.findAll({
        where: {user_Id: req.session.userId},
        attributes: {  include: [
                // [Sequelize.col("OrderDetails->Snack.name"), "name"],
                "status", "createdAt"
            ] , exclude: ["updatedAt"]},
        order: Sequelize.col("createdAt"),
        // attributes: ["status", "date"],
        include: [{model: Order_Detail,
            attributes: { include: [[Sequelize.col("quantity"), "amount"],
                    [Sequelize.col("unit_price"), "price"]],
                exclude: ["createdAt", "updatedAt", "total_price", "unit_price", "quantity", "order_id", "id"]},
            where:{},
            raw: true,
            required: false,
            include: {model: Snack,
                raw: true,
                attributes: ["name", "image_url"], required: false}}]
    }).then((orders) => {
        // orders = JSON.parse(orders);
        // console.log(orders);
        // orders["Snack"] = orders["Snack"]["name"];
        // console.log(orders["OrderDetails"]);
        res.send(orders);
        //res.send(orders);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}

exports.getAllOrderHistoryForAdmin = (req, res, next) => {
    Order.findAll({
        where: {user_Id: req.body.id},
        attributes: {  include: [
                "status", "createdAt", "id"
            ] , exclude: ["updatedAt", "user_Id"]},
        include: [{model: Order_Detail,
            attributes: { include: [[Sequelize.col("quantity"), "amount"],
                    [Sequelize.col("total_price"), "price"]],
                exclude: ["createdAt", "updatedAt", "total_price", "unit_price", "quantity", "order_id", "id", "snack_id"]},
            where:{},
            raw: true,
            required: false,
            include: {model: Snack,
                raw: true,
                attributes: ["name"], required: false}}]
    }).then((orders) => {
        res.send(orders);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}

// make order as Paid give list of ids
exports.updateOrder = async (req, res, next) => {
    const {ids} = req.body;
    let order_list = ids;
    for (let orderId of order_list) {
        let actual_order = await Order.findOne({
            where: {id : orderId}
        });
        if (!actual_order) {
            return res.status(400).send({
                message: `Order cannot be found`,
            });
        }

        try {
            actual_order.status = "Paid";

            actual_order.save();

        } catch (err) {
            return res.status(500).send({
                message: `Error: ${err.message}`,
            });
        }
    }
    return res.send({
        message: `Order status has been updated!`,
        success: true
    });
}

exports.getPendingOrderHistory = (req, res, next) => {
    Order.findAll({
        where: {status: "Pending"},
        attributes: ["status", "date"],
        include: [{model: Order_Detail,
            attributes: {exclude: ["createdAt", "updatedAt", "total_price"]},
            where:{},
            include: {model: Snack,
                attributes: ["name"]}}]
    }).then((orders) => {
        // console.log(users);
        res.send(orders);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}

exports.getPaidOrderHistory = (req, res, next) => {
    Order.findAll({
        where: {status: "Paid"},
        attributes: ["status", "date"],
        include: [{model: Order_Detail,
            attributes: {exclude: ["createdAt", "updatedAt", "total_price"]},
            where:{},
            include: {model: Snack,
                attributes: ["name"]}}]
    }).then((orders) => {
        // console.log(users);
        res.send(orders);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}

