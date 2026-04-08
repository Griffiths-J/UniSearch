
const hostelData = [
    {
        id: 1,
        name: "Crystal Rose",
        uni: "KNUST",
        price: "GHS 4,500/yr",
        dist: "5 mins walk to Engineering gate",
        tags: ["WiFi", "AC", "Gym"],
        image: "https://images.unsplash.com/photo-1555854817-5b2260d50c4e?q=80&w=600"
    },
    {
        id: 2,
        name: "Evandy Hostel",
        uni: "UG",
        price: "GHS 5,200/yr",
        dist: "Near University of Ghana Main Gate",
        tags: ["Shuttle", "Pharmacy", "Generator"],
        image: "https://images.unsplash.com/photo-1595181814923-d3444453b341?q=80&w=600"
    },
    {
        id: 3,
        name: "Pentagon Hall",
        uni: "UG",
        price: "GHS 3,800/yr",
        dist: "Inside University of Ghana Campus",
        tags: ["Security", "WiFi", "Study Room"],
        image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=600"
    }
];

const grid = document.getElementById('hostelGrid');
const filter = document.getElementById('uniFilter');


function displayHostels(uniFilter = 'all') {
    grid.innerHTML = "";
    
    const filteredHostels = hostelData.filter(h => uniFilter === 'all' || h.uni === uniFilter);

    filteredHostels.forEach(h => {
        const card = `
            <div class="hostel-card">
                <div class="card-img" style="background-image: url('${h.image}')">
                    <span class="uni-tag">${h.uni}</span>
                </div>
                <div class="card-body">
                    <div class="card-header">
                        <h4>${h.name}</h4>
                        <span class="price">${h.price}</span>
                    </div>
                    <span class="location">📍 ${h.dist}</span>
                    <div class="amenities">
                        ${h.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <button class="btn-details" onclick="openEnquiry('${h.name}', '${h.uni}')">
                        Enquire for Details
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}


function openEnquiry(hostelName, university) {
    const myNumber = "233256689934";
    const text = `Hello UniLift! I saw ${hostelName} (${university}) on your website. Is it still available for booking?`;
    window.open(`https://wa.me/${myNumber}?text=${encodeURIComponent(text)}`, '_blank');
}


document.getElementById('notifyBtn').addEventListener('click', () => {
    const email = document.getElementById('waitlistEmail').value;
    if (email.includes('@')) {
        const btn = document.getElementById('notifyBtn');
        btn.innerText = "You're on the list! ✅";
        btn.style.background = "#10b981";
        document.getElementById('waitlistEmail').value = "";
    } else {
        alert("Please enter a valid student email.");
    }
});

filter.addEventListener('change', (e) => displayHostels(e.target.value));


displayHostels();