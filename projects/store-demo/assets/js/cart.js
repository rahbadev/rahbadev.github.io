// assets/js/cart.js

const CartService = {
    getCart() {
        return JSON.parse(localStorage.getItem('store_cart')) || [];
    },

    addToCart(product) {
        let cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        this.saveCart(cart);
        return cart;
    },

    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        return cart;
    },

    updateQuantity(productId, change) {
        let cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                return this.removeFromCart(productId);
            }
        }

        this.saveCart(cart);
        return cart;
    },

    clearCart() {
        localStorage.removeItem('store_cart');
        return [];
    },

    saveCart(cart) {
        localStorage.setItem('store_cart', JSON.stringify(cart));
    },

    calculateTotal(cart) {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
};