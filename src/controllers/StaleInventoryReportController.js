
const Snack = require('../../models/Snack.js');
const Category = require('../../models/Category.js');
const Inventory = require('../../models/Inventory.js');


exports.getAllStaleInventory = (req, res, next) => {
    Inventory.findAll({
        where: {quantity:{
            gt: 0
        }},
        attributes: ["id", "expire_date","quantity"],
        include: [{model: Snack,
            attributes: ["image_url", "name"],
        where:{},
            include: {model: Category,
            attributes: ["name"]}}]
    }).then((inventoryies) => {
        res.send(inventoryies);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}



