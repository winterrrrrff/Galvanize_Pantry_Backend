const Category = require("../../models/Category");

exports.getCategories = (req, res, next) => {
	Category.findAll({
        attributes:["category_id", "name"]
    }).then((cate) => {
        // manually add "All" category
        res.send([{"category_id":0, "name": "All"}].concat(cate));
	})
};