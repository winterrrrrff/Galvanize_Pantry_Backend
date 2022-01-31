const Snack = require('../../models/Snack.js');
const Category = require('../../models/Category.js');
const Inventory = require('../../models/Inventory.js');

exports.voteTestCase = (req, res, next) => {
    let id = 160002;
    Category.create({
        category_id: 160002,
        name: "Beverage"
    }).then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `A category is already created with the id ${id}`,
            });
        });
    id = 170002;
    Snack.create({
        snack_Id: 170002,
        category_id: 160002,
        name: "Lemon Tea",
        image_url:"https://i.loli.net/2021/02/21/7VmFrESk4RiCAJH.png"
    }).then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `A snack is already created with the id ${id}`,
            });
        });
    id = 170002;
    Inventory.create({
        snack_Id: 170002,
        unit_price: 1.35
    }).then(() => {res.sendStatus(200);})
        .catch((err) => {
            console.error("Err :" + err);
            return res.status(400).send({
                message: `The inventory is already created with the id ${id}`,
            });
        });
    id = 19422947;
    // Vote.create({
    //     user_Id: 19422947,
    //     snack_Id: 170002
    // }).then(() => {res.sendStatus(200);})
    //     .catch((err) => {
    //         console.error("Err :" + err);
    //         return res.status(400).send({
    //             message: `The vote is already created with the user id ${id}`,
    //         });
    //     });
}

exports.updateVoteCount = async (req, res) => {
    const {snack_Id,vote_count} = req.body;

    const snack = await Snack.findOne({
        where: {
            snack_Id,
        },
    });

    if (!snack) {
        return res.status(400).send({
            message: `No snack found with the id ${snack_Id}`,
        });
    }

    try {
        if (vote_count) {
            snack.vote_count = vote_count;
        }

        snack.save();
        return res.send({
            message: `User ${id} has been updated!`,
        });
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};

// create new recommended snack
// {"category_id":3, "name": anyNameYouWant, "vote_count":1, "status": "new"}
exports.createNewRecommandSnack = async (req, res) => {

    const { name, category } = req.body;

    if (!name) {
        return res.status(400).send({
            message: 'Please provide an name for your new recommendation',
        });
    }
    if (category === 0) {
        return res.send("Please select a category.");
    }

    // create new snack
    let newSnack;
    try {
        newSnack = await Snack.create({
            category_id:category,
            name: name,
            image_url: "https://i.loli.net/2021/04/11/g1rA2ZaNbBqyOEi.jpg",
            vote_count: 1,
            status:"new"
        })
    } catch (err) {
        return res.status(500).send({
            message: `Error: create new Order failed. ${err.message}`,
        });
    }
    return res.send("Success");

};