const Snack = require('../../models/Snack.js');
const Category = require('../../models/Category.js');
const Inventory = require('../../models/Inventory.js');
const Order = require('../../models/Order.js');
const OrderDetail = require('../../models/Order_Detail.js');
const User = require('../../models/User');
const sequelize = require('../database/connection.js');
const { Op, Sequelize } = require("sequelize");

// create new order
// {"id":20200324115703 "user_Id":"111", "status": "Pending", "date": 2020-03-24}
exports.createOrder = async (req, res) => {

    const { status, orderItems } = req.body;
    const user_Id = req.session.userId;
    console.log(req.session.id);
    console.log('user_cart: ' + req.session.userId);
    if (!user_Id) {
        return res.send({success: false, error: {message: 'You are not signed in.'}});
    }
    if (!status) {
        return res.send({success: false, error: {message: 'Something went wrong, please contact the developers.',}});
    }
    if (orderItems.length === 0) {
        return res.send({success: true, error: {message: 'Cart empty, no order created.',}});
    }

    const user = User.findOne({
        where: {id: user_Id}
    });

    if (!user) {
        return res.send({success: false, error: {message: 'The user is invalid, please contact the developers.',}});
    }

    // check out quantity
    const {st, msg} = await checkQuantity(orderItems);
    if (!st) {
        return res.send({success: false, error: {message: msg}});
    } 

    // create new order
    let newOrder;
    try {
        newOrder = await Order.create({
            user_Id: user_Id,
            status: status,
            // date: date // the date is the same as default created date
        })
    } catch (err) {
        return res.status(500).send({
            message: `Error: create new Order failed. ${err.message}`,
        });
    }
    // TODO: make sure the newOrder is created then process the next step.
    orderItems.map((it, index) => {
        // console.log('each: ' + JSON.stringify(it));
        // create order detail
        createOrderDetail(it, newOrder.id).then((od) => {
            // update inventory
            if (od) {
                updateInventory(it.snack_id, it.quantity);
            }
        });
    });

    return res.send({success: true});

};

const checkQuantity = async(orderItems) => {
    let ret = {st: true, msg:""};
    for (let it of orderItems) {
        const validQuantity = await Inventory.findAll({
            attributes:[
                [sequelize.fn('SUM', sequelize.col('quantity')), 'count']
            ],
            where: {
                snack_id: it.snack_id,
            },
            group: ["snack_id"],
            having: {'count': {[Op.gte]: it.quantity} }
        });
        if (validQuantity.length == 0) {
            await Snack.findOne({
                attributes:["name"],
                where: {
                    snack_Id: it.snack_id
                }
            }).then((snackName) => {
                // console.log(JSON.stringify(snackName));
                ret.st = false;
                ret.msg += "the quantity of " + snackName.name + " is not enough \n";
            })
        }
    }
    
    return ret;
}

const createOrderDetail = async(it, newOrderId) => {
    // console.log('tot pric: ' + it.unit_price * it.quantity);
    return await OrderDetail.create({
        order_id: newOrderId,
        snack_id: it.snack_id,
        quantity: it.quantity,
        unit_price: it.unit_price,
        total_price: it.unit_price * it.quantity
    });
}

const updateInventory = async (snack_id, quantity) => {
    // console.log("count: " + quantity);
    const invet = await Inventory.findAll({
        where:{
            snack_Id: snack_id,
            quantity: {[Op.gt]: 0},
        },
        order: sequelize.col('expire_date'),
    })
    // console.log(' >>> ' + JSON.stringify(invet));
    let orderQuantity = quantity;
    updateInvet(orderQuantity, invet);
}

const updateInvet = async (orderQuantity, invet) => {
    let count = orderQuantity;
    try {
        for (let i of invet) {
            if (count <=0) {
                return;
            } else {
                count = await decrement(i, count);
            }
        }
    } catch (err) {
        return res.status(500).send({
            message: `Error: update inventory failed ${err.message}`,
        });
    }
}

const decrement = async (i, count) => {
    if (i.quantity >= count) {
        i.quantity -= count;
        count = 0;
        // console.log('enough ' + count + ", " + i.quantity);
    } else {
        count -= i.quantity;
        i.quantity = 0;
        // console.log('not enough' + count + ", " + i.quantity);
    }
    await i.save();
    return count;
}

// update inventory (wait for changing)

exports.testCreatingAOrder = (req, res, next) => {
    // const id = 16401150;
    let date = new Date().toJSON().slice(0, 10);
    Order.create({
        id: 20200325,
        user_Id:"1124421",
        status:"Pending",
        date:date
    })
        .then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `errrrrrror`,
            });
        });
    console.log("Inserted a order");
}
