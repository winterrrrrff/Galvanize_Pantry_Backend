const User = require('../../models/User.js');
const {OAuth2Client} = require('google-auth-library')
const googleConfigs = require('./googleApp.js')
exports.verifyUser = async (req,res) =>{
    // let id = req.session.userId;
    let id = 2;
    if (!id){
        return res.status(500).send({
            message: 'Please login first',
        });
    }
    let userIdExists = await User.findOne({
        where: {
            id,
        },
    });

    if (!userIdExists) {
        return res.status(500).send({
            message: 'Invalid user',
        });
    }
    return res.status(200);
}
exports.verifyAdmin = async (req,res) =>{
    let id = 2;
    // let id = req.session.userId;
    if (!id){
        return res.status(500).send({
            message: 'Please login first',
        });
    }
    let userIdExists = await User.findOne({
        where: {
            id,
        },
    });
    if (!userIdExists || !userIdExists.isAdmin) {
        return res.status(500).send({
            message: 'Invalid user',
        });
    }
    return res.status(200);
}
exports.logout = async (req, res) => {
    await req.session.destroy()
    console.log("Session destroyed")
    res.status(200).send({
        message: "Logged out successfully"
    })
}
exports.loginWithGoogleTest = async (req, res) => {
    const testId = "2";
    req.session.userId = testId;

    /*  let newUser = await User.create({
        id: testid,
        name: "name",
        source: "source",
        source_account: "source_account",
        token: "fakeToke",
        isAdmin: "isAdmin",
        image_url: "image_url",
        email: "email"
    });*/
    return res.status(200).send({
        id: req.session.userId
    });
}
exports.testSession = async(req, res) => {
    return res.status(200).send({
        id: req.session.userId
    });
}
exports.login = async (req,res) => {
    const {id} =req.body;
    if (!id) {
        return res.status(400).send({
            message: "ID cannot be null",
        });
    }
    let userIdExists = await User.findOne({
        where: {
            id,
        },
    });

    if (userIdExists) {
        req.session.userId = id;
        console.log(req.session.id)
        console.log(req.session.userId)
        return res.status(200).send({
            message: 'An account with that id already exists',
        });
    }
}
exports.loginWithGoogle = async (req, res) => {
    const { token }  = req.body;
    const client = new OAuth2Client(googleConfigs.client_id, googleConfigs.secret, googleConfigs.redirect_uris);
    let ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleConfigs.client_id
    });
    // let { email } = ticket.getPayload();
    // console.log(ticket.getPayload());
    // res.json({email: email});

    /*
    example payload:
    {
      iss: 'accounts.google.com',
      azp: '151515184899-oemjj6mkoi036v3spidcpktl2aua7eav.apps.googleusercontent.com',
      aud: '151515184899-oemjj6mkoi036v3spidcpktl2aua7eav.apps.googleusercontent.com',
      sub: '100704760087428006571',
      email: 'yancongli1996@gmail.com',
      email_verified: true,
      at_hash: 'hTzFlDvMccz698Z1Y-EqgQ',
      name: 'Yancong Li',
      picture: 'https://lh3.googleusercontent.com/a-/AOh14GiAJuc-wd6_Ma2UFbVb_N8s1kALlc5aIEq5I04o-Q=s96-c',
      given_name: 'Yancong',
      family_name: 'Li',
      locale: 'en-GB',
      iat: 1616373970,
      exp: 1616377570,
      jti: '5d7d233b3168456274f705ee323c06c6b41d4974'
    }
    */

    const payload = ticket.getPayload();
    console.log(payload);

    const { sub, name, picture, email, email_verified } = payload;
    const id = sub;
    const source = "Google";
    const source_account = "Google?";
    // const token = token;
    const isAdmin = false;
    let image_url = picture;

    if (!picture ) {
        image_url = "http://localhost:4399/api/getUserImg/default.png";
    }
    if (!id || !name || !source || ! source_account || !token || isAdmin || !email_verified) {
      return res.status(400).send({
        message: 'Some info is missing/wrong while creating a user from google signin',
      });
    }
  
    let userIdExists = await User.findOne({
      where: {
        id,
      },
    });
  
    if (userIdExists) {
      // TODO: should not send error code 400, redirect the user to next page instead
        req.session.userId = id;

      return res.status(200).send({
        message: 'An account with that id already exists',
      });
    }

    try {
      console.log(id, name, source);
      // object to change for db.
      let newUser = await User.create({
        id: id,
        name: name,
        source: source,
        source_account: source_account,
        token: "fakeToke",
        isAdmin: isAdmin,
        image_url: image_url,
        email: email
      });
      console.log(newUser);
      req.session.userId = id;
      return res.send(newUser);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: `Error: ${err.message}`,
      });
    }
  };
