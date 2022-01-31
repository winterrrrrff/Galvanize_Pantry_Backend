const User = require('../../models/User.js');

// Get all employees to display
exports.getAllEmployees = (req, res) => {
    User.findAll().then((users) => {
        // console.log(users);
        res.send(users);
    })
};

exports.getUserInformation = async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);
    const { id, name, email, imageURL, isAdmin } = req.body;
    if (requestBody.id === null || requestBody.id === "" || requestBody.name === null || requestBody.name === ""
        || requestBody.isAdmin === null ||
        requestBody.imageURL === null || requestBody.email === "" || requestBody.email === null) {
        return res.status(400).send({
            message: 'User name, email, role or id cannot be empty',
        });
    }
    if (!imageURL) {
        return res.status(400).send({
            message: 'User has to upload a image',
        });
    }
    const user = await User.findOne({
        where: {
            id,
        },
    });

    if (!user) {
        return res.status(400).send({
            message: `No user found with the id ${id}`
        })
    }
    try {
        if (name && imageURL && isAdmin !== undefined) {
            user.name = name;
            user.image_url = imageURL;
            user.isAdmin = isAdmin;
            user.email = email;
        }
        user.save();
        return res.send({
            message: `User ${id} has been updated!`,
        });
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};


