const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify( token = '') {

  console.log("cliente_ID",process.env.GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  console.log( payload);
  // const userid = payload['sub'];
  const { name, picture, email} = ticket.getPayload();


  return {
    nombre: name, 
    img: picture, 
    correo: email
  } 
}


module.exports= {
    googleVerify
}