 let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let checkoutButton = document.querySelector('.checkout');
let discountField = document.querySelector('.discount');
let discountApplyButton = document.querySelector('.applyDiscount');
let searchInput = document.getElementById('searchInput');
let cart = [];
let discount = 0;

let products = [

    { id: 1, name: 'woofer', image: 'woofer.jpeg', price: 6500, stock: 15 },
    { id: 2, name: 'Hp laptop', image: 'hp laptop.webp', price: 22000, stock: 15 },
    { id: 3, name: 'Extention', image: 'Extentions.jpeg', price: 2000, stock: 35 },
    { id: 9, name: 'hp laptop', image: 'laptop hp.webp', price: 29000, stock: 17 },
    { id: 5, name: 'Earponds', image: 'earpods.jpeg', price: 850, stock: 15 },
    { id: 6, name: 'Flamingo cables', image: 'powerbank.jpg', price: 500, stock: 14 },
    { id: 7, name: 'Lenovo laptop', image: 'hp laptop.webp', price: 20000, stock: 15 },
    { id: 8, name: 'Orimo powerBank', image: 'images.jpeg', price: 1100, stock: 20 },
    { id: 4, name: 'Digital printers', image: 'Digital-printing.jpg', price: 30000, stock: 15 },
    { id: 10, name: 'phone case', image: 'phone case1.jpg', price: 700, stock: 14 },
    { id: 11, name: 'power bank', image: 'powerbank.jpg', price: 2500, stock: 17 },
    { id: 12, name: 'Smart watch', image: 'watch.webp', price: 2000, stock: 35 },
    { id: 13, name: 'chargers', image: 'charger.jpeg', price: 500, stock: 15 },

];

openShopping.addEventListener('click', () => {
    body.classList.add('active');
});
closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
});

// Add event listener to the quantity span to show/hide the cart
quantity.addEventListener('click', () => {
    body.classList.toggle('active');
})

function initApp() {
    products.forEach((product) => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}">
            <div class="title">${product.name}</div>
            <div class="price">${product.price.toLocaleString()}</div>
            <button onclick="addToCart(${product.id})">Add To Cart</button>`;
        list.appendChild(newDiv);
    });
}
initApp();

function addToCart(productId) {
    let product = products.find(p => p.id === productId);
    let cartItem = cart.find(c => c.productId === productId);

    if (product && product.stock > 0) {
        if (cartItem) {
            if (product.stock > cartItem.quantity) {
                cartItem.quantity++;
            } else {
                alert('Not enough stock!');
            }
        } else {
            cart.push({ productId: productId, quantity: 1 });
        }
        product.stock--;
        updateProductOnServer(product);
    } else {
        alert('Out of stock!');
    }

    reloadCart();
}

function updateProductOnServer(product) {
    return fetch(`http://localhost:5500/products/${product.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    }).then(response => response.json())
    .then(data => {
        alert('Product updated successfully:', data);
    })
    .catch(error => {
        console.error('Error updating product:', error);
    });
}

function fetchProducts() {
    fetch('http://localhost:5500/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            initApp();
        })
        .catch(error => console.error('Error fetching products:', error));
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function filterProducts(searchTerm) {
    return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

searchInput.addEventListener('input', function() {
    let searchTerm = this.value.trim();
    let filteredItems = searchTerm ? filterProducts(searchTerm) : products;
    renderProductList(filteredItems);
});

function renderProductList(filteredProducts) {
    list.innerHTML = '';
    filteredProducts.forEach((product) => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}">
            <div class="title">${product.name}</div>
            <div class="price">${product.price.toLocaleString()}</div>
            <button onclick="addToCart(${product.id})">Add To Cart</button>`;
        list.appendChild(newDiv);
    });
}

function addRating(productId, rating) {
    let product = products.find(p => p.id === productId);
    product.ratings.push(rating);
    renderProducts(products);
}

function loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
        reloadCart();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const spanElement = document.getElementById('span');

    if (username) {
        spanElement.textContent = `Hi, ${username}`;
    }
});

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

window.addEventListener('load', loadCartFromStorage);

function reloadCart() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    cart.forEach((cartItem) => {
        let product = products.find(p => p.id === cartItem.productId);
        if (product) {
            let subtotal = product.price * cartItem.quantity;
            totalPrice += subtotal;
            count += cartItem.quantity;

            let newDiv = document.createElement('li');
newDiv.innerHTML = `
    <div>${product.name}</div>
    <div>${subtotal.toLocaleString()}</div>
    <div style="display: flex; align-items: center;">
        <button onclick="changeQuantity(${product.id}, ${cartItem.quantity - 1})" style="font-size: 16px;">&#9660;</button>
        <div class="count" style="margin: 0 10px;">${cartItem.quantity}</div>
        <button onclick="changeQuantity(${product.id}, ${cartItem.quantity + 1})" style="font-size: 16px;">&#9650;</button>
    </div>
    <div><button onclick="removeFromCart(${product.id})">Remove</button></div>`;
listCard.appendChild(newDiv);

        }
    });

    totalPrice = totalPrice * (1 - discount / 100);
    total.innerText = totalPrice.toLocaleString();
    quantity.innerText = count;
    saveCartToStorage();
}

function changeQuantity(productId, newQuantity) {
    let cartItem = cart.find(c => c.productId === productId);
    let product = products.find(p => p.id === productId);

    if (cartItem && product) {
        if (newQuantity === 0) {
            product.stock += cartItem.quantity;
            cart = cart.filter(c => c.productId !== productId);
        } else if (newQuantity > cartItem.quantity) {
            if (product.stock > 0) {
                product.stock--;
                cartItem.quantity++;
            } else {
                alert('Not enough stock!');
            }
        } else {
            product.stock += cartItem.quantity - newQuantity;
            cartItem.quantity = newQuantity;
        }
    }
    reloadCart();
}

function removeFromCart(productId) {
    let cartItem = cart.find(c => c.productId === productId);
    let product = products.find(p => p.id === productId);

    if (cartItem && product) {
        product.stock += cartItem.quantity;
        cart = cart.filter(c => c.productId !== productId);
    }
    reloadCart();
}

discountApplyButton.addEventListener('click', () => {
    discount = parseFloat(discountField.value);
    if (isNaN(discount) || discount < 0) {
        discount = 0;
    }
    reloadCart();
});

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    confirm("Checkout successful! Thank you for your purchase.");
    cart.forEach((cartItem) => {
        let product = products.find(p => p.id === cartItem.productId);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    });
    cart = [];
    reloadCart();
    localStorage.removeItem('cart');
});

function saveProducts() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("products", JSON.stringify(products));
}
