const User = require('../../models/User.js');
const Order = require('../../models/Order.js');

// Get all employees to display
exports.getAllEmployees = (req, res) => {
    User.findAll().then((users) => {
        // console.log(users);
        res.send(users);
    })
};

exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    console.log(id);
    if (id == null) {
        return res.status(400).send({
            message: 'Please provide a id for the user you are trying to delete!',
        });
    }
    const user = await User.findOne({
        where: {
            id,
        },
    });
    if (!user) {
        return res.status(400).send({
            message: `No user found with the id ${id}`,
        });
    }

    // check order status
    await Order.findAll({
        where: {
            user_Id: id,
            status: "Pending"
        }
    }).then((orders) => {
        console.log(orders);
        if (orders.length > 0) {
            return res.status(200).send({
                message: `User ${id} has pending orders which cannot be deleted.`
            });
        } else {
            user.destroy();
            return res.status(200).send({
                message: `User ${id} has been deleted!`,
            });
        }
    }).catch((err) => {
        return res.status(400).send({
            message: `Error: ${err.message}`,
        });
    });

};
