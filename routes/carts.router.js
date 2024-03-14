import express from 'express';
const router = express.Router();
import CartManagerDAO from '../dao/cart.dao.js';

function publicRouteAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        res.redirect("http://localhost:8080/login");
    } else {
        next();
    }
}

router.post('/addToCart', publicRouteAuth, async (req, res) => {
    const { cartId, productId } = req.query;

    const result = await CartManagerDAO.addProductToCart(cartId, productId);

    res.json(result);
});

router.get('/', publicRouteAuth, async (req, res) => {
    try {
        const cartId = '65dd1855e6e9fa1e5b043821'; 
        
        const cartDataString = await CartManagerDAO.getCartData(cartId);

        const cartDataArray = JSON.parse(cartDataString);

        const cartData = cartDataArray[0];
        let productsData = cartData.products
        res.render('cart', { productsData });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error al obtener los datos del carrito: ' + error });
    }
});

router.post('/', publicRouteAuth, async (req, res) => {
    const { cartId, productId, quantityToAdd } = req.body;

    await CartManagerDAO.increaseProductQuantity(cartId, productId, quantityToAdd);

    res.redirect("http://localhost:8080/api/cart");
});

router.delete("/clear/:cartId", publicRouteAuth, async (req, res) => {
    const cartId = req.params.cartId

    const result = await CartManagerDAO.clearCart(cartId);

    res.redirect("http://localhost:8080/api/cart");
});

router.delete("/removeProduct/:cartId/:productId", publicRouteAuth, async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        await CartManagerDAO.deleteProduct(cartId, productId);
        res.redirect("http://localhost:8080/api/cart");
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar producto del carrito: ' + error.message });
    }
});



export default router;
