
const hostelData = [
    {
        id: 1,
        name: "P3",
        uni: "KNUST",
        price: "GHS 4,500/yr",
        dist: "5 mins walk to Engineering gate",
        tags: ["WiFi", "AC", "Gym" , "3 IN 1"],
        image: ""
    },
    {
        id: 2,
        name: "Evandy Hostel",
        uni: "UG",
        price: "GHS 5,200/yr",
        dist: "Near University of Ghana Main Gate",
        tags: ["Shuttle", "Pharmacy", "Generator" ,"2 IN 1"],
        image: ""
    },
    {
        id: 3,
        name: "Pentagon Hall",
        uni: "UG",
        price: "GHS 3,800/yr",
        dist: "Inside University of Ghana Campus",
        tags: ["Security", "WiFi", "Study Room", " 2 IN 1"],
        image: ""
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
                <div class="card-img card-img1" style="background-image: url('${h.image}')">
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


 const advertBtn = document.querySelector('.advertNotice');

document.getElementById('notifyBtn').addEventListener('click', () => {
    const email = document.getElementById('waitlistEmail').value;

    const checkEmail = localStorage.getItem('waitlistEmail');
    if (checkEmail && checkEmail === email) {
       advertBtn.innerText = "You're already on the waitlist! We'll notify you as soon as direct booking is available.";

       setTimeout(() => {
        advertBtn.innerText = "";
       }, 2500);
        return;
    }


   
    if (email.includes('@')) {
        const btn = document.getElementById('notifyBtn');
        if (btn.innerText === "You're on the list! ✅") {
            advertBtn.innerText = "You're already on the waitlist! We'll notify you as soon as direct booking is available.";

            setTimeout(() => {
            advertBtn.innerText = "";
           }, 2500);
            return;
        }

        

        btn.innerText = "You're on the list! ✅";
        btn.style.background = "#10b981";
        setTimeout(() => {
            btn.innerText = "Get Notified";
        }, 2500);

        document.getElementById('waitlistEmail').value = "";
        localStorage.setItem('waitlistEmail', email);
    } else {
       advertBtn.innerText = "⚠️ Please enter a valid student email to join the waitlist.";
       setTimeout(() => {
        advertBtn.innerText = "";
       }, 3000);
    }
});



filter.addEventListener('change', (e) => displayHostels(e.target.value));


displayHostels();