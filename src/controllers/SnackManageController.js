const Snack = require('../../models/Snack.js');
const Category = require('../../models/Category.js');
const Inventory = require('../../models/Inventory.js');
// Get all employees to display
exports.getAllSnacks = (req, res) => {
    Snack.findAll().then((snacks) => {
        res.send(snacks);
    })
};

exports.deleteSnacks = async (req, res) => {
    const { id } = req.body;
    console.log(id);
    if (id == null) {
        return res.status(400).send({
            message: 'Please provide a id for the user you are trying to delete!',
        });
    }
    const snack = await Snack.findOne({
        where: {
            snack_Id: id,
        },
    });
    if (!snack) {
        return res.status(400).send({
            message: `No user found with the id ${id}`,
        });
    }

    try {
        await snack.destroy();
        return res.status(200).send({
            message: `Snack ${id} has been deleted!`,
        });
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};
exports.editSnack = async (req, res) => {

    const {snack_Id, name, category_id,  imageURL, status, vote_count} = req.body;


    if (!snack_Id||snack_Id===""||!name||name===""||!category_id||category_id===0||!imageURL||imageURL===""||status===""||!status) {
        console.log(JSON.stringify(req.body));
        return res.status(400).send({
            message: 'Please fill in all rows',
        });
    }
    const category = await Category.findOne({
        where: {
            category_id,
        },
    });
    if (!category) {
        return res.status(400).send({
            message: `Category invalid`,
        });
    }
    const snack = await Snack.findOne({
        where: {
            snack_Id
        },
    });
    if (!snack) {
        return res.status(400).send({
            message: `No snacks found with the id ${id}`
        })
    }
    try {
        if (name && imageURL && category_id !== undefined) {
            snack.name = name;
            snack.image_url = imageURL;
            snack.category_id = category_id;
            snack.status = status;
            snack.vote_count = vote_count;
        }
        snack.save();
        return res.send({
            message: `Snack ${snack_Id} has been updated!`,
        });
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};
exports.addSnack = async (req, res) => {

    const {name, category_id, imageURL, vote_count} = req.body;

    const category = await Category.findOne({
        where: {
            category_id,
        },
    });
    if (!category) {
        return res.status(400).send({
            message: `Category invalid`,
        });
    }
    if (name === null || name === "" || category_id === null || vote_count === null) {
        return res.status(400).send({
            message: 'Snack name and category cannot be empty',
        });
    }
    let image_url = imageURL
    if (imageURL === ""){
        image_url = "https://i.loli.net/2021/04/11/g1rA2ZaNbBqyOEi.jpg";
    }
    try {
        let newSnack = await Snack.create({
            name:name,
            category_id:category_id,
            image_url:image_url,
            vote_count:vote_count,
            status:""
        });
        console.log(newSnack);
        return res.send(newSnack);
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};
exports.getCategory = async (req, res) => {
    Category.findAll().then((categories) => {
        // console.log(users);
        res.send(categories);
    })
};
exports.getNewSnack = async (req, res) => {
    let newSnack = await Snack.create({
        category_id:1,
    });
    res.send({snack_Id: newSnack.snack_Id});
};


// inventory methods
exports.getInventory = async (req, res) => {
    Inventory.findAll({
        where: {
            snack_Id: req.body.id
        }
    }).then((Inventories) => {
        res.status(200).send(Inventories);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({
            message:"fetch failed"
        })
    });
};
exports.updateInventory = async (req, res) => {
    const { inventories } = req.body;
    let failed=[];

    await inventories.map((inventory)=>{
        console.log(JSON.stringify(inventory))
        console.log(!inventory.id);
        if (!inventory.id){
            addInventory(inventory).then((incomplete)=>{
                if(incomplete){
                    failed.push(incomplete)
                }
            }).catch(err =>{
                console.log(err);
                console.log(JSON.stringify(inventory))
            });
        } else {
            editInventory(inventory).then((incomplete)=>{
                if(incomplete){
                    failed.push(incomplete)
                }
            }).catch(err =>{
                console.log(err);
                console.log(JSON.stringify(inventory))
            });
        }
    })
    return res.status(200).send({
        failed:failed
    });
};

exports.deleteInventory = async (req,res) => {
    const {id} = req.body;
    if (!id){
        return res.status(400).send({
            message: "Unknown Invent id"
        });
    }
    let del = await Inventory.findOne({
        where: {
            id
        }
    })
    try {
        await del.destroy();
        return res.status(200).send({
            message: `Inventory ${id} has been deleted!`,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};
const editInventory = async (inventory) => {
    const {id, unit_price, expire_date, quantity} = inventory;
    if (unit_price === undefined || quantity === undefined || !expire_date){
        return id;
    }
    const edit = await Inventory.findOne({
        where: {
            id
        }
    })
        if(!edit){
            console.log("not found");
            return id;
        }
    try{
        edit.unit_price = unit_price;
        edit.expire_date = expire_date;
        edit.quantity = quantity;
        edit.save();
        console.log(id+" successfully edited")
    }catch (err){
        console.log(err);
        return id;
    }
};
const addInventory = async (inventory) => {
    const {snack_Id, unit_price, expire_date, quantity} = inventory;
    console.log(JSON.stringify(inventory))
    if ( !snack_Id || !unit_price || !expire_date ||!quantity){
        return "New";
    }
    try{
        let invent = await Inventory.create({
        snack_Id: snack_Id,
        unit_price : unit_price,
        expire_date : expire_date,
        quantity: quantity
    });
        console.log(JSON.stringify(invent))
    return;
    }catch(err) {
        console.log(err);
        return "New";
    };
};