const Order = require('../../models/Order.js');
const User = require('../../models/User.js');
const Order_Detail = require('../../models/Order_Detail.js');



exports.getAllPayment = (req, res, next) => {
    Order_Detail.findAll({
        where: {},
        attributes: ["order_id", "total_price"],
        include: [{model: Order,
            attributes: ["status"],
        where:{},
        include: {model: User,
            attributes: ["id","name","image_url"]}
    }]
    }).then((payment) => {
        res.send(payment);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}
exports.getAllUser = (req, res, next) => {
    User.findAll({
        where: {},
        attributes: ["name"],
        
    }).then((user) => {
        res.send(user);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}

exports.getAllStatus = (req, res, next) => {
    Order.findAll({
        where: {},
        attributes: ["status"],
        
    }).then((user) => {
        res.send(user);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}



