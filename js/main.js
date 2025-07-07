// Cart functionality
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Currency symbol - Ghana Cedis
const CURRENCY_SYMBOL = '₵';

// Restaurant location coordinates (REPLACE WITH YOUR ACTUAL COORDINATES)
const RESTAURANT_LOCATION = {
    lat: 5.6037,  // Example: Accra, Ghana latitude
    lng: -0.1870, // Example: Accra, Ghana longitude
    address: "123 Restaurant Street, Accra, Ghana" // REPLACE WITH YOUR ACTUAL ADDRESS
};

// Social media links (REPLACE WITH YOUR ACTUAL SOCIAL MEDIA URLS)
const SOCIAL_MEDIA_LINKS = {
    facebook: "https://facebook.com/your-restaurant-page", // REPLACE WITH YOUR FACEBOOK URL
    instagram: "https://instagram.com/your-restaurant-handle", // REPLACE WITH YOUR INSTAGRAM URL
    whatsapp: "https://wa.me/233XXXXXXXXX", // REPLACE WITH YOUR WHATSAPP NUMBER (Ghana format)
    twitter: "https://twitter.com/your-restaurant-handle" // REPLACE WITH YOUR TWITTER URL
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCart();
    initializeAnimations();
    initializeModals();
    loadCartFromStorage();
    initializeLocationFeatures();
    initializeSocialMedia();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuButton?.querySelector('i');
    
    if (mobileMenuButton && mobileMenu) {
        console.log('Mobile menu elements found and initialized');
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Mobile menu button clicked');
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                // Show menu
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('show');
                
                // Change icon to close
                if (menuIcon) {
                    menuIcon.className = 'ri-close-line ri-lg';
                }
            } else {
                // Hide menu
                mobileMenu.classList.remove('show');
                
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                
                // Change icon back to menu
                if (menuIcon) {
                    menuIcon.className = 'ri-menu-line ri-lg';
                }
            }
        });
    }

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('show');
                
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                
                // Change icon back to menu
                if (menuIcon) {
                    menuIcon.className = 'ri-menu-line ri-lg';
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenuButton && 
            !mobileMenuButton.contains(e.target) && 
            !mobileMenu.contains(e.target) && 
            !mobileMenu.classList.contains('hidden')) {
            
            mobileMenu.classList.remove('show');
            
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            
            // Change icon back to menu
            if (menuIcon) {
                menuIcon.className = 'ri-menu-line ri-lg';
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background on scroll
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'transparent';
                header.style.backdropFilter = 'none';
            }
        });
    }
}

// Cart functionality
function initializeCart() {
    const cartButton = document.getElementById('cart-button');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckout = document.getElementById('close-checkout');
    const checkoutOverlay = document.getElementById('checkout-overlay');

    // Open cart sidebar
    if (cartButton && cartSidebar) {
        cartButton.addEventListener('click', function() {
            cartSidebar.classList.remove('translate-x-full');
        });
    }

    // Close cart sidebar
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.add('translate-x-full');
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartSidebar && !cartSidebar.contains(e.target) && !cartButton.contains(e.target)) {
            if (!cartSidebar.classList.contains('translate-x-full')) {
                cartSidebar.classList.add('translate-x-full');
            }
        }
    });

    // Open checkout modal
    if (checkoutButton && checkoutModal) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length > 0) {
                updateCheckoutSummary();
                checkoutModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                showAlert('Your cart is empty!', 'error');
            }
        });
    }

    // Close checkout modal
    function closeCheckoutModal() {
        if (checkoutModal) {
            checkoutModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    if (closeCheckout) {
        closeCheckout.addEventListener('click', closeCheckoutModal);
    }

    if (checkoutOverlay) {
        checkoutOverlay.addEventListener('click', closeCheckoutModal);
    }

    // Add to cart buttons - Updated selector to match the actual button class
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            addToCart(button);
        }
    });

    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }

    // Order type radio buttons
    const orderTypeRadios = document.querySelectorAll('input[name="order-type"]');
    const deliveryDetails = document.getElementById('delivery-details');
    
    orderTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'delivery') {
                deliveryDetails.classList.remove('hidden');
            } else {
                deliveryDetails.classList.add('hidden');
            }
        });
    });

    // Use location button
    const useLocationButton = document.getElementById('use-location');
    if (useLocationButton) {
        useLocationButton.addEventListener('click', function() {
            if (navigator.geolocation) {
                showAlert('Getting your location...', 'info');
                navigator.geolocation.getCurrentPosition(function(position) {
                    // In a real app, you'd reverse geocode these coordinates
                    const addressField = document.getElementById('address');
                    if (addressField) {
                        addressField.value = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
                    }
                    showAlert('Location detected!', 'success');
                }, function() {
                    showAlert('Unable to detect location', 'error');
                });
            } else {
                showAlert('Geolocation is not supported by this browser', 'error');
            }
        });
    }
}

// Add item to cart
function addToCart(button) {
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    const image = button.getAttribute('data-image');

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    updateCartUI();
    saveCartToStorage();
    showAlert(`${name} added to cart!`, 'success');
    
    // Add animation to button
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Update cart UI
function updateCartUI() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Update cart count
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }

    // Update cart subtotal with Ghana Cedis
    const cartSubtotal = document.getElementById('cart-subtotal');
    if (cartSubtotal) {
        cartSubtotal.textContent = `${CURRENCY_SYMBOL}${cartTotal.toFixed(2)}`;
    }

    // Update cart items
    updateCartItems();
}

// Update cart items display
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart text-center py-10">
                <div class="w-16 h-16 mx-auto mb-4 text-gray-500">
                    <i class="ri-shopping-cart-line ri-3x"></i>
                </div>
                <p class="text-gray-400">Your cart is empty</p>
                <button onclick="showMenuChoice()" class="mt-4 px-6 py-2 bg-primary text-white rounded-button hover:bg-opacity-90 transition-all">Browse Menu</button>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item flex items-center space-x-4 p-4 bg-gray-900 rounded-lg mb-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-medium text-white">${item.name}</h4>
                    <p class="text-primary font-medium">${CURRENCY_SYMBOL}${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="quantity-btn minus w-8 h-8 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors" data-id="${item.id}">-</button>
                    <span class="text-white font-medium w-8 text-center">${item.quantity}</span>
                    <button class="quantity-btn plus w-8 h-8 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item text-red-500 hover:text-red-400 transition-colors" data-id="${item.id}">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `).join('');

        // Add event listeners for quantity buttons and remove buttons
        cartItemsContainer.addEventListener('click', function(e) {
            const itemId = e.target.getAttribute('data-id') || e.target.closest('[data-id]')?.getAttribute('data-id');
            
            if (e.target.classList.contains('minus') || e.target.closest('.minus')) {
                updateQuantity(itemId, -1);
            } else if (e.target.classList.contains('plus') || e.target.closest('.plus')) {
                updateQuantity(itemId, 1);
            } else if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                removeFromCart(itemId);
            }
        });
    }
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartUI();
            saveCartToStorage();
        }
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
    saveCartToStorage();
    showAlert('Item removed from cart', 'info');
}

// Update checkout summary
function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutDelivery = document.getElementById('checkout-delivery');
    const checkoutTotal = document.getElementById('checkout-total');

    if (checkoutItems) {
        checkoutItems.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center">
                <div>
                    <span class="text-white">${item.name}</span>
                    <span class="text-gray-400 ml-2">x${item.quantity}</span>
                </div>
                <span class="text-white">${CURRENCY_SYMBOL}${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }

    const deliveryFee = 10.00; // Updated delivery fee for Ghana
    const total = cartTotal + deliveryFee;

    if (checkoutSubtotal) checkoutSubtotal.textContent = `${CURRENCY_SYMBOL}${cartTotal.toFixed(2)}`;
    if (checkoutDelivery) checkoutDelivery.textContent = `${CURRENCY_SYMBOL}${deliveryFee.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `${CURRENCY_SYMBOL}${total.toFixed(2)}`;
}

// Process order
function processOrder() {
    const formData = new FormData(document.getElementById('checkout-form'));
    const orderData = {
        orderId: 'ORD-' + Date.now(),
        timestamp: new Date().toISOString(),
        items: cart,
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            orderType: formData.get('order-type'),
            address: formData.get('address'),
            notes: formData.get('notes')
        },
        total: cartTotal + 10.00,
        currency: 'GHS',
        status: 'pending'
    };

    // Store order in localStorage (temporary solution)
    const existingOrders = JSON.parse(localStorage.getItem('pokytosOrders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('pokytosOrders', JSON.stringify(existingOrders));

    // Simulate order processing
    showAlert('Processing your order...', 'info');
    
    setTimeout(() => {
        // Clear cart
        cart = [];
        updateCartUI();
        saveCartToStorage();
        
        // Close modals
        document.getElementById('checkout-modal').classList.add('hidden');
        document.getElementById('cart-sidebar').classList.add('translate-x-full');
        document.body.style.overflow = 'auto';
        
        showAlert(`Order #${orderData.orderId} placed successfully! We'll contact you soon.`, 'success');
    }, 2000);
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('pokytosCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('pokytosCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Show menu choice modal
function showMenuChoice() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl font-bold text-white mb-6 text-center">Choose Menu</h3>
            <div class="space-y-4">
                <a href="food-menu.html" class="block w-full py-3 px-6 bg-primary text-white rounded-button text-center hover:bg-opacity-90 transition-all">
                    <i class="ri-restaurant-line mr-2"></i>Food Menu
                </a>
                <a href="drinks-menu.html" class="block w-full py-3 px-6 bg-secondary text-white rounded-button text-center hover:bg-opacity-90 transition-all">
                    <i class="ri-cup-line mr-2"></i>Drinks Menu
                </a>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="mt-4 w-full py-2 text-gray-400 hover:text-white transition-colors">
                Cancel
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Initialize location features
function initializeLocationFeatures() {
    // Find Us button functionality
    const findUsButton = document.getElementById('find-us-btn');
    if (findUsButton) {
        findUsButton.addEventListener('click', function() {
            openRestaurantLocation();
        });
    }
}

// Open restaurant location in map
function openRestaurantLocation() {
    const mapUrl = `https://www.google.com/maps?q=${RESTAURANT_LOCATION.lat},${RESTAURANT_LOCATION.lng}`;
    window.open(mapUrl, '_blank');
}

// Initialize social media links
function initializeSocialMedia() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        const platform = link.getAttribute('data-platform');
        if (SOCIAL_MEDIA_LINKS[platform]) {
            link.href = SOCIAL_MEDIA_LINKS[platform];
            link.target = '_blank';
        }
    });
}

// Show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="ri-${type === 'success' ? 'check' : type === 'error' ? 'error-warning' : 'information'}-line"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Show alert
    setTimeout(() => alertDiv.classList.add('show'), 100);
    
    // Hide alert after 3 seconds
    setTimeout(() => {
        alertDiv.classList.add('hide');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Initialize animations
function initializeAnimations() {
    // GSAP animations if available
    if (typeof gsap !== 'undefined') {
        // Animate menu items on scroll
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.utils.toArray('.menu-item-enhanced').forEach((item, index) => {
            gsap.fromTo(item, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }
}

// Initialize modals
function initializeModals() {
    // Menu category filtering
    const tabButtons = document.querySelectorAll('.tab-button');
    const menuItems = document.querySelectorAll('.menu-item-enhanced');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // Animate in if GSAP is available
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(item, 
                            { opacity: 0, scale: 0.8 },
                            { opacity: 1, scale: 1, duration: 0.3 }
                        );
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}