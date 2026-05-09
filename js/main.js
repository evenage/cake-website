document.addEventListener('DOMContentLoaded', () => {
    // Load Header
    fetch('components/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            setActiveNav();
        });

    // Load Footer
    fetch('components/footer.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
            updateDateTime();
            setInterval(updateDateTime, 1000);
        });

    displayFeaturedCakes();
    displayAllCakes();
    displayOrderCake(); 
    handleOrderSubmit(); 
});

function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || 'index.html' ;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

}function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || 'cake.html' ;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || 'contactUs.html' ;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || 'order.html' ;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || 'about.html' ;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}


function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Johannesburg'
    };
    const dateTimeString = now.toLocaleDateString('en-ZA', options);
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement) {
        datetimeElement.innerHTML = `Cape Town: ${dateTimeString}`;
    }
}

// Homepage - 3 Featured Cakes
function displayFeaturedCakes() {
    const featuredContainer = document.getElementById('featuredCakes');
    if (!featuredContainer) return;

    fetch('data/cakes.json')
        .then(res => res.json())
        .then(data => {
            const featured = data.cakes.slice(0, 3);
            featuredContainer.innerHTML = '';
            featured.forEach(cake => {
                const cakeCard = `
                    <div class="cake-card">
                        <img src="${cake.image}" alt="${cake.name}">
                        <h3>${cake.name}</h3>
                        <p class="price">R${cake.price}</p>
                        <a href="order.html?id=${cake.id}" class="btn-small">Order Now</a>
                    </div>
                `;
                featuredContainer.innerHTML += cakeCard;
            });
        })
        .catch(err => console.log('Cakes error:', err));
}

// cake.html - all cakes 
function displayAllCakes() {
    const allCakesContainer = document.getElementById('allCakes');
    if (!allCakesContainer) return;

    fetch('data/cakes.json')
        .then(res => res.json())
        .then(data => {
            renderCakes(data.cakes);
            
            // Search
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = data.cakes.filter(cake => 
                        cake.name.toLowerCase().includes(searchTerm)
                    );
                    renderCakes(filtered);
                });
            }

            // Filter by category
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.addEventListener('change', (e) => {
                    const category = e.target.value;
                    const filtered = category === 'all' 
                        ? data.cakes 
                        : data.cakes.filter(cake => cake.category === category);
                    renderCakes(filtered);
                });
            }
        });
}

function renderCakes(cakes) {
    const container = document.getElementById('allCakes');
    container.innerHTML = '';
    
    if (cakes.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No cakes found 😢 Try another search</p>';
        return;
    }

    cakes.forEach(cake => {
        const cakeCard = `
            <div class="cake-card">
                <img src="${cake.image}" alt="${cake.name}">
                <h3>${cake.name}</h3>
                <p class="price">R${cake.price}</p>
                <p class="category">${cake.category}</p>
                <a href="order.html?id=${cake.id}" class="btn-small">Order Now</a>
            </div>
        `;
        container.innerHTML += cakeCard;
    });
}

// Function to show cakes chosen on order.html
function displayOrderCake() {
    const orderContainer = document.querySelector('.order-cake-info');
    if (!orderContainer) return;

    // cake id from URL: order.html?id=5
    const urlParams = new URLSearchParams(window.location.search);
    const cakeId = urlParams.get('id');

    if (!cakeId) {
        orderContainer.innerHTML = '<p>No cake selected. <a href="cake.html">Go back to cakes</a></p>';
        return;
    }

    fetch('data/cakes.json')
        .then(res => res.json())
        .then(data => {
            const cake = data.cakes.find(c => c.id == cakeId);
            
            if (!cake) {
                orderContainer.innerHTML = '<p>Cake not found 😢 <a href="cake.html">Choose another</a></p>';
                return;
            }

            // cake details
            orderContainer.innerHTML = `
                <img src="${cake.image}" alt="${cake.name}">
                <h3>${cake.name}</h3>
                <p class="price">R${cake.price}</p>
                <p class="category">Category: ${cake.category}</p>
                <p class="desc">${cake.description || 'Delicious cake made with love ❤️'}</p>
            `;

            //  PRICE BUTTON 
            const orderPriceElement = document.getElementById('orderPrice');
            if (orderPriceElement) {
                orderPriceElement.textContent = cake.price;
            }
        })
        .catch(err => {
            console.log('Error loading cake:', err);
            orderContainer.innerHTML = '<p>Failed to load cake details 😢</p>';
        });
}

// Handle form submit for WHATSAPP
function handleOrderSubmit() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        //  cake details 
        const cakeNameElement = document.querySelector('.order-cake-info h3');
        const cakePriceElement = document.getElementById('orderPrice');
        
        if (!cakeNameElement || !cakePriceElement) {
            alert('Error: Cake details not loaded. Please refresh the page.');
            return;
        }
        
        const cakeName = cakeNameElement.textContent;
        const cakePrice = cakePriceElement.textContent;
        
        // customers details
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const email = document.getElementById('customerEmail').value;
        const date = document.getElementById('deliveryDate').value;
        const message = document.getElementById('message').value;
        const requests = document.getElementById('specialRequests').value;
        
        //  WhatsApp message
        const whatsappMsg = `*NEW CAKE ORDER* 🎂%0A%0A` +
            `*Cake:* ${cakeName}%0A` +
            `*Price:* R${cakePrice}%0A%0A` +
            `*Customer Details*%0A` +
            `Name: ${name}%0A` +
            `Phone: ${phone}%0A` +
            `Email: ${email}%0A` +
            `Delivery Date: ${date}%0A%0A` +
            `*Message on Cake:* ${message || 'None'}%0A` +
            `*Special Requests:* ${requests || 'None'}`;
        
        // app
        const yourWhatsAppNumber = "+27695941217"; 
        
        // open WhatsApp
        window.open(`https://wa.me/${yourWhatsAppNumber}?text=${whatsappMsg}`, '_blank');
        
        //  thank you message
        alert(`Thank you ${name}! 🎉\nYour order has been sent to our WhatsApp.\nWe will contact you shortly to confirm.`);
        
        form.reset();
    });
}

