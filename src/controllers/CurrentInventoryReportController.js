
const Snack = require('../../models/Snack.js');
const Category = require('../../models/Category.js');
const Inventory = require('../../models/Inventory.js');

const { Sequelize, Op } = require("sequelize");



exports.createSnack = async (req, res) => {
    const cateId = 3;
    const {quantity} = req.query;
    await Category.findAll({
        attributes: {
            include: [
                [Sequelize.col("Category.name"), "category"],
                [Sequelize.col("Snacks.image_url"), "image"],
                [Sequelize.col("Snacks.name"), "name"],
                [Sequelize.fn("SUM", Sequelize.col("Snacks->Inventories.quantity")), "count"],
            ],
            exclude: ['createdAt', 'updatedAt']
        },
        where: {
            
        },
        include:[
            {
                model: Snack,
                attributes: [],
                where: {
                    status:"existing"
                },
                required:false,
                include: [
                    {
                        model: Inventory,
                        attributes:[],
                        required:false
                    }
                ]
            },
        ],
        group: ['Snacks.category_id'],
        having: {'count': {[Op.lt]: quantity}}
    }).then((t) => {res.send(t); }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });
}


exports.getAllInventory = (req, res, next) => {
    Snack.findAll({
        where: {vote_status:"existing"},
        attributes: ["image_url", "name","quantity"],
        include: [{model: Category,
            attributes: ["name"],
        where:{}
          }]
    }).then((inventoryies) => {
        res.send(inventoryies);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}

exports.getAllCategory = (req, res, next) => {
    Category.findAll({
        where: {},
        attributes: ["name"],
       
    }).then((cate) => {
        res.send(cate);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}

exports.getAllSnack = (req, res, next) => {
    Snack.findAll({
        where: {status:"existing"},
        attributes: ["name"],
       
    }).then((snack) => {
        res.send(snack);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}



