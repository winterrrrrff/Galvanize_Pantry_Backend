
const Snack = require('../../models/Snack.js');
const Category = require('../../models/Category.js');



exports.getAllVote = (req, res, next) => {
    Snack.findAll({
        where: {},
        attributes: ["image_url", "name","vote_count","status"],
        include: [{model: Category,
            attributes: ["name"],
        where:{}}]
    }).then((vote) => {
        res.send(vote);
    }).catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `Something went wrong`,
        });
    });

}



