const universityData = [
  {
    id: "knust",
    name: "Kwame Nkrumah University of Science and Technology",
    short: "KNUST",
    type: "Public",
    location: "Kumasi, Ashanti Region",
    rank: "#1",
    logo: "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
    image: "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
    faculties: ["Engineering", "Science", "Nursing", "Architecture"],
    description:
      "KNUST is Ghana's top science and technology university, renowned for engineering, applied sciences, and strong research programmes.",
    established: "1952",
    website: "www.knust.edu.gh",
    contact: "+233-36-2060-100",
    accreditation: "NAB (National Accreditation Board)",
    studentPopulation: "35,000+",
    admissionRequirement:
      "Minimum aggregate of 8-10 in relevant subjects, WASSCE results required",
    facilities:
      "Modern libraries, research laboratories, sports facilities, hostels, health centers",
    gallery: [
      "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
      "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
      "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
    ],
  },
  {
    id: "ug",
    name: "University of Ghana",
    short: "UG",
    type: "Public",
    location: "Legon, Greater Accra Region",
    rank: "#2",
    logo: "images/university-of-ghana-seeklogo.svg",
    image: "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
    faculties: ["Social Sciences", "Business", "Law", "Health Sciences"],
    description:
      "UG is Ghana's oldest and largest university offering a wide range of humanities, social sciences, engineering, and health programmes.",
    established: "1948",
    website: "www.ug.edu.gh",
    contact: "+233-30-2500-905",
    accreditation: "NAB (National Accreditation Board)",
    studentPopulation: "40,000+",
    admissionRequirement:
      "Minimum aggregate of 6-8 in relevant subjects, WASSCE results required",
    facilities:
      "University of Ghana Library, sports complex, medical center, student hostels, ICT centers",
    gallery: [
      "images/university-of-ghana-seeklogo.svg",
      "images/university-of-ghana-seeklogo.svg",
      "images/university-of-ghana-seeklogo.svg",
    ],
  },
  {
    id: "ucc",
    name: "University of Cape Coast",
    short: "UCC",
    type: "Public",
    location: "Cape Coast, Central Region",
    rank: "#3",
    logo: "images/ucc.png",
    image: "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
    faculties: ["Education", "Humanities", "Science", "Business"],
    description:
      "UCC is known for strong education, humanities and teacher training programmes, with a scenic campus by the ocean.",
    established: "1961",
    website: "www.ucc.edu.gh",
    contact: "+233-33-2192-130",
    accreditation: "NAB (National Accreditation Board)",
    studentPopulation: "15,000+",
    admissionRequirement:
      "Minimum aggregate of 7-9 in relevant subjects, WASSCE results required",
    facilities:
      "Coastal campus, academic libraries, sports facilities, student accommodation, health clinic",
    gallery: ["images/ucc.png", "images/ucc.png", "images/ucc.png"],
  },
  {
    id: "umat",
    name: "University of Mines and Technology",
    short: "UMAT",
    type: "Public",
    location: "Tarkwa, Western Region",
    rank: "#4",
    logo: "images/umat.png",
    image: "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
    faculties: ["Mining Engineering", "Geology", "Computer Science"],
    description:
      "UMAT specializes in mining, geology and technology disciplines with a practical strong industry focus.",
    established: "1952",
    website: "www.umat.edu.gh",
    contact: "+233-33-2090-430",
    accreditation: "NAB (National Accreditation Board)",
    studentPopulation: "8,000+",
    admissionRequirement:
      "Minimum aggregate of 7-9 with strong science grades, WASSCE results required",
    facilities:
      "Mining museum, geology laboratory, computer centers, student hostels, library",
    gallery: ["images/umat.png", "images/umat.png", "images/umat.png"],
  },
  {
    id: "upsa",
    name: "University of Professional Studies, Accra",
    short: "UPSA",
    type: "Public",
    location: "Accra, Greater Accra Region",
    rank: "#5",
    logo: "images/upsa.png",
    image: "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
    faculties: ["Business", "Law", "Technology"],
    description:
      "UPSA is Ghana's leading business school with strong programmes in accounting, finance, and professional studies.",
    established: "2000",
    website: "www.upsa.edu.gh",
    contact: "+233-30-2757-190",
    accreditation: "NAB (National Accreditation Board)",
    studentPopulation: "12,000+",
    admissionRequirement:
      "Minimum aggregate of 8-10, WASSCE results required, competitive selection",
    facilities:
      "Modern classrooms, computer labs, business center, student accommodation, library",
    gallery: ["images/upsa.png", "images/upsa.png", "images/upsa.png"],
  },
  {
    id: "ashesi",
    name: "Ashesi University",
    short: "Ashesi",
    type: "Private",
    location: "Berekuso, Eastern Region",
    rank: "#6",
    logo: "images/ashesi.png",
    image: "images/kwame-nkrumah-university-of-science-technology-seeklogo.png",
    faculties: ["Computer Science", "Business", "Engineering"],
    description:
      "Ashesi is a top private university focused on leadership, ethics, and innovation with strong computer science and business degrees.",
    established: "2002",
    website: "www.ashesi.edu.gh",
    contact: "+233-30-2744-100",
    accreditation: "NAB (National Accreditation Board)",
    studentPopulation: "3,500+",
    admissionRequirement:
      "Minimum aggregate of 6-8, strong academic record, entrance examination, WASSCE results required",
    facilities:
      "State-of-the-art IT labs, modern campus facilities, student residence halls, recreational facilities",
    gallery: ["images/ashesi.png", "images/ashesi.png", "images/ashesi.png"],
  },
];

const grid = document.getElementById("universityGrid");
const searchInput = document.querySelector(".search input");
const modal = document.getElementById("uniModal");
const modalClose = document.getElementById("modalClose");

function renderCards(data) {
  if (!grid) return;
  grid.innerHTML = data
    .map(
      (uni) => `
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
  `,
    )
    .join("");
}

function openUniversityModal(id) {
  const selected = universityData.find((u) => u.id === id);
  if (!selected || !modal) return;

  document.getElementById("modalLogo").src = selected.logo;
  document.getElementById("modalLogo").alt = `${selected.short} logo`;
  document.getElementById("modalTitle").innerText = selected.name;
  document.getElementById("modalType").innerText =
    `${selected.type} · ${selected.rank}`;
  document.getElementById("modalDescription").innerText = selected.description;
  document.getElementById("modalLocation").innerText = selected.location;
  document.getElementById("modalFaculties").innerText =
    selected.faculties.join(", ");
  document.getElementById("modalEstablished").innerText = selected.established;
  document.getElementById("modalWebsite").innerText = selected.website;
  document.getElementById("modalContact").innerText = selected.contact;
  document.getElementById("modalAccreditation").innerText =
    selected.accreditation;
  document.getElementById("modalStudentPop").innerText =
    selected.studentPopulation;
  document.getElementById("modalAdmission").innerText =
    selected.admissionRequirement;
  document.getElementById("modalFacilitiesInfo").innerText =
    selected.facilities;
  document.getElementById("modalimage").src = selected.image;
  document.getElementById("modalimage").alt = `${selected.short}`;

  // Populate gallery
  const galleryContainer = document.getElementById("modalGallery");
  if (galleryContainer) {
    if (selected.gallery && selected.gallery.length > 0) {
      galleryContainer.innerHTML = selected.gallery
        .map(
          (imgSrc) =>
            `<div class="gallery-image-container">
              <img src="${imgSrc}" alt="University campus image" />
            </div>`,
        )
        .join("");
    } else {
      galleryContainer.innerHTML =
        '<div class="no-gallery">No images available</div>';
    }
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeUniversityModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

renderCards(universityData);

grid?.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.matches(".view-profile-btn")) {
    const id = target.dataset.id;
    if (id) openUniversityModal(id);
  }
});

searchInput?.addEventListener("input", (event) => {
  const query = (event.target.value || "").toLowerCase().trim();
  const filtered = universityData.filter(
    (uni) =>
      uni.name.toLowerCase().includes(query) ||
      uni.short.toLowerCase().includes(query) ||
      uni.location.toLowerCase().includes(query),
  );
  renderCards(filtered);
});

modalClose?.addEventListener("click", closeUniversityModal);

