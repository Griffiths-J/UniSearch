const universityData = [
  {
    id: 'knust',
    name: 'Kwame Nkrumah University of Science and Technology',
    short: 'KNUST',
    type: 'Public',
    location: 'Kumasi, Ashanti Region',
    rank: '#1',
    logo: 'images/kwame-nkrumah-university-of-science-technology-seeklogo.png',
    image:'images/kwame-nkrumah-university-of-science-technology-seeklogo.png',
    faculties: ['Engineering', 'Science', 'Nursing', 'Architecture'],
    description: 'KNUST is Ghana\'s top science and technology university, renowned for engineering, applied sciences, and strong research programmes.'
  },
  {
    id: 'ug',
    name: 'University of Ghana',
    short: 'UG',
    type: 'Public',
    location: 'Legon, Greater Accra Region',
    rank: '#2',
    logo: 'images/university-of-ghana-seeklogo.svg',
     image:'images/kwame-nkrumah-university-of-science-technology-seeklogo.png',
    faculties: ['Social Sciences', 'Business', 'Law', 'Health Sciences'],
    description: 'UG is Ghana\'s oldest and largest university offering a wide range of humanities, social sciences, engineering, and health programmes.'
  },
  {
    id: 'ucc',
    name: 'University of Cape Coast',
    short: 'UCC',
    type: 'Public',
    location: 'Cape Coast, Central Region',
    rank: '#3',
    logo: 'images/ucc.png',
     image:'images/kwame-nkrumah-university-of-science-technology-seeklogo.png',
    faculties: ['Education', 'Humanities', 'Science', 'Business'],
    description: 'UCC is known for strong education, humanities and teacher training programmes, with a scenic campus by the ocean.'
  },
  {
    id: 'umat',
    name: 'University of Mines and Technology',
    short: 'UMAT',
    type: 'Public',
    location: 'Tarkwa, Western Region',
    rank: '#4',
    logo: 'images/umat.png',
    image:'images/kwame-nkrumah-university-of-science-technology-seeklogo.png',
    faculties: ['Mining Engineering', 'Geology', 'Computer Science'],
    description: 'UMAT specializes in mining, geology and technology disciplines with a practical strong industry focus.'
  },
  {
    id: 'upsa',
    name: 'University of Professional Studies, Accra',
    short: 'UPSA',
    type: 'Public',
    location: 'Accra, Greater Accra Region',
    rank: '#5',
    logo: 'images/upsa.png',
     image:'images/kwame-nkrumah-university-of-science-technology-seeklogo.png',
    faculties: ['Business', 'Law', 'Technology'],
    description: 'UPSA is Ghana\'s leading business school with strong programmes in accounting, finance, and professional studies.'
  },
  {
    id: 'ashesi',
    name: 'Ashesi University',
    short: 'Ashesi',
    type: 'Private',
    location: 'Berekuso, Eastern Region',
    rank: '#6',
    logo: 'images/ashesi.png',
    image:'images/kwame-nkrumah-university-of-science-technology-seeklogo.png',
    faculties: ['Computer Science', 'Business', 'Engineering'],
    description: 'Ashesi is a top private university focused on leadership, ethics, and innovation with strong computer science and business degrees.'
  }
];

const grid = document.getElementById('universityGrid');
const searchInput = document.querySelector('.search input');
const modal = document.getElementById('uniModal');
const modalClose = document.getElementById('modalClose');

function renderCards(data) {
  if (!grid) return;
  grid.innerHTML = data.map((uni) => `
    <div class="card uni-card" data-id="${uni.id}">
      <div class="topsec">
        <img class="card-img" src="${uni.logo}" alt="${uni.short} logo">
        <div>
          <p class="card-sch">${uni.short}</p>
          <p class="location">${uni.location}</p>
        </div>
        <div class="rank">${uni.rank}</div>
      </div>
      <div class="middlesec">
        <div class="card-sch-type">${uni.type}</div>
      </div>
      <div class="downsec">
        <button class="view-profile-btn" data-id="${uni.id}">View Profile</button>
      </div>
    </div>
  `).join('');
}

function openUniversityModal(id) {
  const selected = universityData.find((u) => u.id === id);
  if (!selected || !modal) return;

  document.getElementById('modalLogo').src = selected.logo;
  document.getElementById('modalLogo').alt = `${selected.short} logo`;
  document.getElementById('modalTitle').innerText = selected.name;
  document.getElementById('modalType').innerText = `${selected.type} · ${selected.rank}`;
  document.getElementById('modalDescription').innerText = selected.description;
  document.getElementById('modalLocation').innerText = selected.location;
  document.getElementById('modalFaculties').innerText = selected.faculties.join(', ');
  document.getElementById('modalimage').src=selected.image;
  document.getElementById('modalimage').alt=`${selected.short}`;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeUniversityModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

renderCards(universityData);

grid?.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.matches('.view-profile-btn')) {
    const id = target.dataset.id;
    if (id) openUniversityModal(id);
  }
});

searchInput?.addEventListener('input', (event) => {
  const query = (event.target.value || '').toLowerCase().trim();
  const filtered = universityData.filter((uni) =>
    uni.name.toLowerCase().includes(query) ||
    uni.short.toLowerCase().includes(query) ||
    uni.location.toLowerCase().includes(query)
  );
  renderCards(filtered);
});

modalClose?.addEventListener('click', closeUniversityModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeUniversityModal();
});
