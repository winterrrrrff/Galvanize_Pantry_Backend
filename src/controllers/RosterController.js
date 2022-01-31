let User;
// For mock object injection:
exports.injectUserObj = (externalUser) => {
  if (externalUser) {
    User = externalUser;
  } else {
    User = require('../../models/User.js');
  }
}

exports.getAllEmployees = (req, res, next) => {
	return User.findAll().then((users) => {
		res.send(users);
    return users;
	})
}

// e.g. http://localhost:4399/api/users/16401150
exports.getUser = async (req, res) => {
    const { id } = req.params;
  
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
    return res.send(user);
  };



/*

In postman, hit the URL: http://localhost:4399/api/createUser
with JSON below as the post body:
{
    "id": 1, 
    "name": "PeterLi"
}
*/
exports.createUser = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).send({
        message: 'Please provide an id and a username to create a user',
      });
    }
  
    let userIdExists = await User.findOne({
      where: {
        id,
      },
    });
  
    if (userIdExists) {
      return res.status(400).send({
        message: 'An account with that id already exists',
      });
    }
  
    try {
      let newUser = await User.create({
        id,
        name,
      });
      return res.send(newUser);
    } catch (err) {
      return res.status(500).send({
        message: `Error: ${err.message}`,
      });
    }
  };

/*
In postman, hit the URL: http://localhost:4399/api/deleteUser
with JSON below as the post body:
{
    "id": 1
}
*/
exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  if (!id) {
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

  try {
    await user.destroy();
    return res.send({
      message: `User ${id} has been deleted!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};

/*

In postman, hit the URL: http://localhost:4399/api/update/1
with JSON below as the post body:
{
    "name": "Bruce Wayne"
}

*/
exports.updateUser = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

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

  try {
    if (name) {
      user.name = name;
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

// testing method:
exports.testCreatingAUser = (req, res, next) => {
    const id = 16401150;
	User.create({
        id: 16401150,
        name: "Peter"
    })
    .then(() => {res.sendStatus(200);})
    .catch((err) => {
        console.error("Err :" + err);
        return res.status(400).send({
            message: `A user already created with the id ${id}`,
        });
    });

    console.log("Inserted a user called peter");
}
