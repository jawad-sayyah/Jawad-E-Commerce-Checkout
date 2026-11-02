// 1. Sample Products
// All product information is created inside this project.
const products = [
    { id: 1, name: "Laptop Bag", price: 35, quantity: 1 },
    { id: 2, name: "Wireless Mouse", price: 20, quantity: 2 },
    { id: 3, name: "Mechanical Keyboard", price: 45, quantity: 1 }
];

// 2. Project Variables
let deliveryFee = 5;
let discountAmount = 0;
let freeDelivery = false;
let appliedPromoCode = "";
let completedOrder = null;

const checkoutForm = document.getElementById("checkout-form");
const orderItems = document.getElementById("order-items");
const itemCountElement = document.getElementById("item-count");
const subtotalElement = document.getElementById("subtotal");
const discountElement = document.getElementById("discount");
const deliveryFeeElement = document.getElementById("delivery-fee");
const finalTotalElement = document.getElementById("final-total");
const promoInput = document.getElementById("promo-code");
const promoMessage = document.getElementById("promo-message");
const cardDetails = document.getElementById("card-details");
const confirmationSection = document.getElementById("confirmation-section");

// 3. Helper Functions
function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}

function calculateSubtotal() {
    let subtotal = 0;

    for (let i = 0; i < products.length; i++) {
        subtotal += products[i].price * products[i].quantity;
    }

    return subtotal;
}

function calculateItemCount() {
    let count = 0;

    for (let i = 0; i < products.length; i++) {
        count += products[i].quantity;
    }

    return count;
}

function calculateDeliveryFee() {
    if (freeDelivery) {
        return 0;
    }

    return deliveryFee;
}

function calculateFinalTotal() {
    return calculateSubtotal() - discountAmount + calculateDeliveryFee();
}

function showFieldError(fieldId, message) {
    document.getElementById(fieldId).textContent = message;
}

function clearFieldErrors() {
    const errorElements = document.querySelectorAll(".field-error");

    for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].textContent = "";
    }
}

// 4. Display Products in the Order Summary
function renderOrder() {
    orderItems.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        const item = document.createElement("div");
        item.className = "order-item";

        const details = document.createElement("div");

        const name = document.createElement("div");
        name.className = "order-item-name";
        name.textContent = product.name;

        const quantity = document.createElement("div");
        quantity.className = "order-item-meta";
        quantity.textContent = "Qty: " + product.quantity + " × " + formatMoney(product.price);

        const price = document.createElement("div");
        price.className = "order-item-price";
        price.textContent = formatMoney(product.price * product.quantity);

        details.appendChild(name);
        details.appendChild(quantity);
        item.appendChild(details);
        item.appendChild(price);
        orderItems.appendChild(item);
    }

    itemCountElement.textContent = calculateItemCount();
}

// 5. Update the Price Breakdown
function updatePriceSummary() {
    const subtotal = calculateSubtotal();
    const delivery = calculateDeliveryFee();
    const total = calculateFinalTotal();

    subtotalElement.textContent = formatMoney(subtotal);
    discountElement.textContent = "−" + formatMoney(discountAmount);
    deliveryFeeElement.textContent = formatMoney(delivery);
    finalTotalElement.textContent = formatMoney(total);
}

// 6. Promo Code Handling
function applyPromoCode() {
    const code = promoInput.value.trim().toUpperCase();
    const subtotal = calculateSubtotal();

    // Do not allow a second code to stack with the first one.
    discountAmount = 0;
    freeDelivery = false;
    appliedPromoCode = "";

    if (code === "") {
        showPromoMessage("Please enter a promo code.", "error");
        updatePriceSummary();
        return;
    }

    if (code === "SAVE10") {
        discountAmount = subtotal * 0.10;
        appliedPromoCode = code;
        showPromoMessage("10% discount applied successfully.", "success");
    } else if (code === "WELCOME5") {
        discountAmount = 5;
        appliedPromoCode = code;
        showPromoMessage("$5 discount applied successfully.", "success");
    } else if (code === "FREESHIP") {
        freeDelivery = true;
        appliedPromoCode = code;
        showPromoMessage("Free delivery applied successfully.", "success");
    } else {
        showPromoMessage("Invalid promo code. Please try again.", "error");
    }

    updatePriceSummary();
}

function showPromoMessage(message, type) {
    promoMessage.textContent = message;
    promoMessage.className = "promo-message " + type;
}

// 7. Delivery Method
function changeDeliveryMethod() {
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');

    if (selectedDelivery.value === "express") {
        deliveryFee = 10;
    } else {
        deliveryFee = 5;
    }

    updatePriceSummary();
    updateChoiceStyles();
}

// 8. Payment Method
function changePaymentMethod() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');

    if (selectedPayment.value === "card") {
        cardDetails.classList.remove("hidden");
        document.getElementById("card-name").required = true;
        document.getElementById("card-number").required = true;
        document.getElementById("card-expiry").required = true;
        document.getElementById("card-cvv").required = true;
    } else {
        cardDetails.classList.add("hidden");
        document.getElementById("card-name").required = false;
        document.getElementById("card-number").required = false;
        document.getElementById("card-expiry").required = false;
        document.getElementById("card-cvv").required = false;
        document.getElementById("card-name").value = "";
        document.getElementById("card-number").value = "";
        document.getElementById("card-expiry").value = "";
        document.getElementById("card-cvv").value = "";
    }

    updateChoiceStyles();
}

// 9. Update Selected Choice Appearance
function updateChoiceStyles() {
    const choiceCards = document.querySelectorAll(".choice-card");

    for (let i = 0; i < choiceCards.length; i++) {
        const radio = choiceCards[i].querySelector("input");

        if (radio.checked) {
            choiceCards[i].classList.add("selected");
        } else {
            choiceCards[i].classList.remove("selected");
        }
    }
}

// 10. Validate Customer Information
function validateCustomerInformation() {
    clearFieldErrors();

    let isValid = true;

    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("delivery-address").value.trim();
    const differentBilling = document.getElementById("different-billing").checked;
    const billingAddress = document.getElementById("billing-address").value.trim();

    if (name.length < 3) {
        showFieldError("name-error", "Please enter at least 3 characters.");
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError("email-error", "Please enter a valid email address.");
        isValid = false;
    }

    if (!/^[0-9+() -]{7,20}$/.test(phone)) {
        showFieldError("phone-error", "Please enter a valid phone number.");
        isValid = false;
    }

    if (address.length < 8) {
        showFieldError("address-error", "Please enter a complete delivery address.");
        isValid = false;
    }

    if (differentBilling && billingAddress.length < 8) {
        showFieldError("billing-error", "Please enter a complete billing address.");
        isValid = false;
    }

    return isValid;
}

// 11. Validate Demo Card Information
function validateCardInformation() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    if (selectedPayment === "cash") {
        return true;
    }

    let isValid = true;

    const cardName = document.getElementById("card-name").value.trim();
    const cardNumber = document.getElementById("card-number").value.replace(/\s/g, "");
    const expiry = document.getElementById("card-expiry").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();

    if (cardName.length < 3) {
        showFieldError("card-name-error", "Enter the name shown on the card.");
        isValid = false;
    }

    if (!/^\d{13,19}$/.test(cardNumber)) {
        showFieldError("card-number-error", "Card number must contain 13 to 19 digits.");
        isValid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        showFieldError("card-expiry-error", "Use MM/YY format.");
        isValid = false;
    } else {
        const parts = expiry.split("/");
        const month = Number(parts[0]);
        const year = 2000 + Number(parts[1]);
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            showFieldError("card-expiry-error", "This card has expired.");
            isValid = false;
        }
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        showFieldError("card-cvv-error", "CVV must contain 3 or 4 digits.");
        isValid = false;
    }

    return isValid;
}

// 12. Generate an Order Number
function generateOrderNumber() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return "JWD-" + randomNumber;
}

// 13. Save Order History in This Browser
function saveOrderToHistory(order) {
    let orderHistory = [];

    try {
        const savedHistory = localStorage.getItem("jawadCheckoutHistory");

        if (savedHistory) {
            orderHistory = JSON.parse(savedHistory);
        }

        if (!Array.isArray(orderHistory)) {
            orderHistory = [];
        }
    } catch (error) {
        orderHistory = [];
    }

    orderHistory.unshift({
        orderNumber: order.orderNumber,
        date: order.date,
        customerName: order.customer.name,
        total: order.total
    });

    // Keep only the latest 10 orders.
    orderHistory = orderHistory.slice(0, 10);

    try {
        localStorage.setItem("jawadCheckoutHistory", JSON.stringify(orderHistory));
    } catch (error) {
        // The checkout can still complete if browser storage is unavailable.
    }
}

function renderOrderHistory() {
    const historyContainer = document.getElementById("order-history");
    historyContainer.innerHTML = "";

    let orderHistory = [];

    try {
        const savedHistory = localStorage.getItem("jawadCheckoutHistory");

        if (savedHistory) {
            orderHistory = JSON.parse(savedHistory);
        }

        if (!Array.isArray(orderHistory)) {
            orderHistory = [];
        }
    } catch (error) {
        orderHistory = [];
    }

    if (orderHistory.length === 0) {
        historyContainer.textContent = "No previous orders yet.";
        historyContainer.className = "history-list muted";
        return;
    }

    historyContainer.className = "history-list";

    for (let i = 0; i < orderHistory.length; i++) {
        const order = orderHistory[i];

        const item = document.createElement("div");
        item.className = "history-item";

        const details = document.createElement("div");
        const orderTitle = document.createElement("strong");
        orderTitle.textContent = order.orderNumber;

        const date = document.createElement("p");
        date.textContent = order.date + " • " + order.customerName;

        const total = document.createElement("strong");
        total.textContent = formatMoney(Number(order.total));

        details.appendChild(orderTitle);
        details.appendChild(date);
        item.appendChild(details);
        item.appendChild(total);
        historyContainer.appendChild(item);
    }
}

// 14. Create the Order
function placeOrder(event) {
    event.preventDefault();

    const customerIsValid = validateCustomerInformation();
    const cardIsValid = validateCardInformation();

    if (!customerIsValid || !cardIsValid) {
        alert("Please correct the highlighted information before placing your order.");
        return;
    }

    const selectedDelivery = document.querySelector('input[name="delivery"]:checked').value;
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    const differentBilling = document.getElementById("different-billing").checked;

    const customer = {
        name: document.getElementById("customer-name").value.trim(),
        email: document.getElementById("customer-email").value.trim(),
        phone: document.getElementById("customer-phone").value.trim(),
        deliveryAddress: document.getElementById("delivery-address").value.trim(),
        billingAddress: differentBilling
            ? document.getElementById("billing-address").value.trim()
            : document.getElementById("delivery-address").value.trim()
    };

    const orderProducts = [];

    for (let i = 0; i < products.length; i++) {
        orderProducts.push({
            name: products[i].name,
            price: products[i].price,
            quantity: products[i].quantity
        });
    }

    const order = {
        orderNumber: generateOrderNumber(),
        date: new Date().toLocaleString(),
        customer: customer,
        products: orderProducts,
        deliveryMethod: selectedDelivery === "express" ? "Express Delivery" : "Standard Delivery",
        deliveryFee: calculateDeliveryFee(),
        paymentMethod: selectedPayment === "card" ? "Credit / Debit Card (Demo)" : "Cash on Delivery",
        preferredDate: document.getElementById("preferred-date").value || "Not specified",
        promoCode: appliedPromoCode || "None",
        subtotal: calculateSubtotal(),
        discount: discountAmount,
        total: calculateFinalTotal()
    };

    completedOrder = order;
    saveOrderToHistory(order);
    showConfirmation(order);

    checkoutForm.classList.add("hidden");
    confirmationSection.classList.remove("hidden");
    renderOrderHistory();

    confirmationSection.scrollIntoView({ behavior: "smooth" });
}

// 15. Display Order Confirmation and Receipt
function showConfirmation(order) {
    document.getElementById("order-number").textContent = order.orderNumber;

    const details = document.getElementById("confirmation-details");
    details.innerHTML = "";

    const customerHeading = document.createElement("h3");
    customerHeading.textContent = "Customer and Delivery Details";
    details.appendChild(customerHeading);

    const customerLines = [
        "Name: " + order.customer.name,
        "Email: " + order.customer.email,
        "Phone: " + order.customer.phone,
        "Delivery Address: " + order.customer.deliveryAddress,
        "Billing Address: " + order.customer.billingAddress,
        "Delivery Method: " + order.deliveryMethod,
        "Preferred Date: " + order.preferredDate,
        "Payment Method: " + order.paymentMethod,
        "Promo Code: " + order.promoCode
    ];

    for (let i = 0; i < customerLines.length; i++) {
        const paragraph = document.createElement("p");
        paragraph.textContent = customerLines[i];
        details.appendChild(paragraph);
    }

    const productsHeading = document.createElement("h3");
    productsHeading.textContent = "Purchased Products";
    productsHeading.style.marginTop = "20px";
    details.appendChild(productsHeading);

    for (let i = 0; i < order.products.length; i++) {
        const product = order.products[i];

        const productLine = document.createElement("div");
        productLine.className = "confirmation-product";

        const productName = document.createElement("span");
        productName.textContent = product.name + " × " + product.quantity;

        const productPrice = document.createElement("strong");
        productPrice.textContent = formatMoney(product.price * product.quantity);

        productLine.appendChild(productName);
        productLine.appendChild(productPrice);
        details.appendChild(productLine);
    }

    const totals = [
        "Subtotal: " + formatMoney(order.subtotal),
        "Discount: −" + formatMoney(order.discount),
        "Delivery Fee: " + formatMoney(order.deliveryFee)
    ];

    for (let i = 0; i < totals.length; i++) {
        const paragraph = document.createElement("p");
        paragraph.textContent = totals[i];
        details.appendChild(paragraph);
    }

    const total = document.createElement("p");
    total.className = "confirmation-total";
    total.textContent = "Final Total: " + formatMoney(order.total);
    details.appendChild(total);
}

// 16. Start a New Order
function startNewPurchase() {
    checkoutForm.reset();

    deliveryFee = 5;
    discountAmount = 0;
    freeDelivery = false;
    appliedPromoCode = "";
    completedOrder = null;

    cardDetails.classList.add("hidden");
    document.getElementById("billing-address-field").classList.add("hidden");

    document.getElementById("card-name").required = false;
    document.getElementById("card-number").required = false;
    document.getElementById("card-expiry").required = false;
    document.getElementById("card-cvv").required = false;

    promoInput.value = "";
    showPromoMessage("Try SAVE10, FREESHIP, or WELCOME5.", "");
    clearFieldErrors();

    confirmationSection.classList.add("hidden");
    checkoutForm.classList.remove("hidden");

    changeDeliveryMethod();
    changePaymentMethod();
    updatePriceSummary();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// 17. Event Listeners
document.getElementById("apply-promo").addEventListener("click", applyPromoCode);

document.querySelectorAll('input[name="delivery"]').forEach(function (radio) {
    radio.addEventListener("change", changeDeliveryMethod);
});

document.querySelectorAll('input[name="payment"]').forEach(function (radio) {
    radio.addEventListener("change", changePaymentMethod);
});

document.getElementById("different-billing").addEventListener("change", function () {
    const billingField = document.getElementById("billing-address-field");
    const billingAddress = document.getElementById("billing-address");

    if (this.checked) {
        billingField.classList.remove("hidden");
        billingAddress.required = true;
    } else {
        billingField.classList.add("hidden");
        billingAddress.required = false;
        billingAddress.value = "";
        showFieldError("billing-error", "");
    }
});

checkoutForm.addEventListener("submit", placeOrder);

document.getElementById("print-receipt").addEventListener("click", function () {
    window.print();
});

document.getElementById("new-purchase").addEventListener("click", startNewPurchase);

document.getElementById("clear-history").addEventListener("click", function () {
    const confirmed = confirm("Are you sure you want to clear the order history saved in this browser?");

    if (confirmed) {
        localStorage.removeItem("jawadCheckoutHistory");
        renderOrderHistory();
    }
});

// 18. Initial Page Setup
renderOrder();
updatePriceSummary();
updateChoiceStyles();
renderOrderHistory();
