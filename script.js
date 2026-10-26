
// STYLEHAVEN FASHION STORE

const products = [
    {
        id: 1,
        name: "Classic Black Hoodie",
        category: "Men",
        price: 35000,
        description: "A comfortable everyday essential.",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Casual White Sneakers",
        category: "Shoes",
        price: 60000,
        description: "Clean sneakers for everyday outfits.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Denim Jacket",
        category: "Women",
        price: 70000,
        description: "A timeless addition to your wardrobe.",
        image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Leather Handbag",
        category: "Accessories",
        price: 45000,
        description: "A stylish accessory for your daily look.",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Essential Black T-Shirt",
        category: "Men",
        price: 18000,
        description: "Simple, versatile and easy to style.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Everyday Sunglasses",
        category: "Accessories",
        price: 22000,
        description: "Complete your outfit with confidence.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Women's Casual Outfit",
        category: "Women",
        price: 42000,
        description: "An effortless look for casual occasions.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Classic Wristwatch",
        category: "Accessories",
        price: 55000,
        description: "A polished finishing touch.",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=80"
    }
];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const cartCount = document.getElementById("cart-count");
const emptyMessage = document.getElementById("empty-message");

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("stylehaven-cart") || "[]"
    );

    if (
        Array.isArray(savedCart) &&
        savedCart.every(item =>
            item &&
            Number.isInteger(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            products.some(product => product.id === item.id)
        )
    ) {
        cart = savedCart;
    }
} catch (error) {
    cart = [];
}


// FORMAT PRICES IN NAIRA

function formatPrice(price) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(price);
}


// DISPLAY PRODUCTS

function displayProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOption = sortFilter.value;

    let filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortOption === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    productGrid.innerHTML = "";

    emptyMessage.hidden = filteredProducts.length !== 0;

    filteredProducts.forEach(product => {
        const card = document.createElement("article");

        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.alt = product.name + " image unavailable";
        });

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const button = document.createElement("button");
        button.className = "add-cart";
        button.type = "button";
        button.textContent = "Add to Cart";

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        bottom.append(price, button);
        info.append(category, name, description, bottom);
        card.append(image, info);

        productGrid.appendChild(card);
    });
}


// ADD PRODUCTS TO CART

function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    updateCart();

    alert("Product added to your cart!");
}


// UPDATE CART COUNT AND STORAGE

function updateCart() {
    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;

    try {
        localStorage.setItem(
            "stylehaven-cart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn("Cart could not be saved in this browser.");
    }
}


// SEARCH AND FILTER EVENTS

searchInput.addEventListener("input", displayProducts);

categoryFilter.addEventListener("change", displayProducts);

sortFilter.addEventListener("change", displayProducts);


// CATEGORY BUTTONS

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        categoryFilter.value = button.dataset.category;

        displayProducts();

        document.getElementById("shop").scrollIntoView({
            behavior: "smooth"
        });
    });
});


// MOBILE NAVIGATION

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});


// NEWSLETTER FORM

const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");

newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    newsletterMessage.textContent =
        "Thanks for your interest! Newsletter registration needs to be connected to a service.";

    newsletterForm.reset();
});


// CURRENT YEAR

document.getElementById("year").textContent =
    new Date().getFullYear();


// INITIALIZE THE WEBSITE

displayProducts();
updateCart();
