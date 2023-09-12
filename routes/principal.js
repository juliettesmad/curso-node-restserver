const {Router} = require('express'); 

const routerPrincipal = Router();

routerPrincipal.get('/', async(req,res) => {
    res.json({
        error: false,
        msg: 'Territorio Juliette',
        payload: []
    })
});




module.exports = routerPrincipal;

