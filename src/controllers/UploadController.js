
const fs = require('fs');
const User = require('../../models/User.js');
const Snack = require('../../models/Snack.js');

const userImgPath = `${__dirname}/userImgUploads/`

const removeFileHelper = (id) => {
    const extensionName = ['.jpg', '.png', '.jpeg'];
    const potentialImgFileNames = [];
    for (let extension of extensionName) {
        potentialImgFileNames.push(id + extension);
    }
    for (let potentialName of potentialImgFileNames) {
        const path = `${userImgPath}${potentialName}`;
        try {
            if (fs.existsSync(path)) {
                //file exists
                fs.unlinkSync(path);
                //file removed
            }
        } catch(err) {
            console.error(err);
            throw err;
        }
    }
};

exports.uploadUserImage = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    const file = req.files.file;
    const user_id =  file.name.split('.').slice(0, -1).join('.');

    if (!file.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return res.status(400).send('Only image files are allowed!');
    }

    const filePath = `${userImgPath}${file.name}`;
    try {
        removeFileHelper(user_id);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
        return;
    }
    file.mv(filePath, err => {
        if (err) {
            return res.status(500).send(err);
        }
        // TODO: get the server url dynamicly, dont hard code this, otherwise will fail on deloyment
        // const imageUrl = "http://localhost:4399/api/getUserImg/" + user_id; local
        const imageUrl = "https://mysterious-coast-30450.herokuapp.com/api/getUserImg/" + user_id;
        console.log(imageUrl);
        res.send(imageUrl);

    });
};

exports.getUserImageFile = async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({
        where: {
            id,
        },
    });

    if (!user) {
        return res.status(400).send({
            message: `No user found with the id ${id}, so no image will be returned`,
        });
    }

    const extensionName = ['.jpg', '.png', '.jpeg','.JPG','.PNG','.JPEG'];
    const potentialImgFileNames = [];
    for (let extension of extensionName) {
        potentialImgFileNames.push(id + extension);
    }

    let imgFileName = "";
    let extName = "";
    for (let potentialName of potentialImgFileNames) {
        const path = `${__dirname}/userImgUploads/${potentialName}`;
        try {
            if (fs.existsSync(path)) {
                //file exists
                imgFileName = potentialName;
                extName = imgFileName.split('.').pop();
                break;
            }
        } catch(err) {
            console.error(err)
        }
    }

    if (imgFileName === "") {
        /*return res.status(500).send({
            message: `No user image in the server found with the id ${id}, no image will be returned`,
        });*/
        imgFileName = "default.png";
    }

    const directoryPath = `${__dirname}/userImgUploads/`;

    fs.readFile(directoryPath + imgFileName, function(err, data) {
        if (err) throw err; // Fail if the file can't be read.
        res.writeHead(200, {'Content-Type': ('image/' + extName)});
        res.end(data) // Send the file data to the browser.
    });

}
exports.uploadSnackImage = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    const file = req.files.file;

    console.log(req);
    console.log(file);

    if (!file.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        console.error(req.fileValidationError);
        return res.status(400).send('Only image files are allowed!');
    }


    file.mv(`${__dirname}/snackImgUploads/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        // TODO: get the server url dynamicly, dont hard code this, otherwise will fail on deloyment
        //const imageUrl = "http://localhost:4399/api/getSnackImg/" + file.name;
        const imageUrl = "https://mysterious-coast-30450.herokuapp.com/api/getSnackImg/" + file.name;
        res.send(imageUrl);
    });
}
exports.getSnackImageFile = async (req, res) => {
    const { id } = req.params;

    let imgFileName = "";
    let extName = "";
    const path = `${__dirname}/snackImgUploads/${id}`;
    try {
        if (fs.existsSync(path)) {
            //file exists
            imgFileName = id;
            extName = imgFileName.split('.').pop();
        }
        else{
            imgFileName = "default.jpg";
            extName = imgFileName.split('.').pop();
        }
    } catch(err) {
        console.error(err)
    }
    if (imgFileName === "") {
        return res.status(500).send({
            message: `No snack image in the server found with the id ${id}, no image will be returned`,
        });
    }

    const directoryPath = `${__dirname}/snackImgUploads/`;

    fs.readFile(directoryPath + imgFileName, function(err, data) {
        if (err) throw err; // Fail if the file can't be read.
        res.writeHead(200, {'Content-Type': ('image/' + extName)});
        res.end(data) // Send the file data to the browser.
    });

}
