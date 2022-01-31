const { Sequelize } = require("sequelize");
const Inventory = require("../../models/Inventory");
// const Snack = require("../../models/Snack");
let Snack;

const injectSnackObj = (externalSnack) => {
    if (externalSnack) {
        Snack = externalSnack;
    } else {
        Snack = require('../../models/Snack');
    }
}

const querySnacks = async () => {
	return await Snack.findAll({
        attributes: {
            include: [
                [Sequelize.col("inventories.unit_price"), "price"],
                [Sequelize.fn("SUM", Sequelize.col("inventories.quantity")), "quantity"],
            ],
            exclude: ['createdAt', 'updatedAt']
        },
        where: {
            status: "existing"
        }, 
        include:[
            {
                model: Inventory,
                attributes:[],
                required:false
            }
        ],
        group: "snack_Id"
    })
}

const getAllSnacks = async (req, res) => {
    injectSnackObj();
    console.log(req.session.id);
    console.log('user_snack: ' + req.session.userId);
    const snacks = await querySnacks();
	
    return res.send(snacks);
};

exports.injectSnackObj = injectSnackObj;
exports.querySnacks = querySnacks;
exports.getAllSnacks = getAllSnacks;

/*
exports.getAllSnacksByUser = async (req, res) => {
    const { id } = req.params;

    const snacksWithVotes = await Snack.findAll({
        attributes: {
            include: [
                [Sequelize.fn("COUNT", Sequelize.col("votes.snack_Id")), "vote"],
                [Sequelize.col("inventories.unit_price"), "price"]
            ],
            exclude: ['createdAt', 'updatedAt']
        },
        include:[
            {
                model: Vote,
                attributes: [],
                where:{
                    user_Id: id
                },
                required:false
            },
            {
                model: Inventory,
                attributes:[],
                required:false
            }
        ],
        group: ['snack.snack_Id']
    })
    // console.log('ret: ' + JSON.stringify(snacksWithVotes));

    return res.send(snacksWithVotes);
};
*/

