import './style.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- DATA ---

const artifactDetails = {
  indus: {
    title: "Dancing Girl of Mohenjo-Daro",
    period: "c. 2300 – 1750 BCE (Indus Valley)",
    desc: "A prehistoric bronze sculpture made using the lost-wax casting technique. It measures just 10.5 centimeters tall and depicts a young woman in a confident, relaxed posture.",
    context: "The Dancing Girl is a masterpiece of the Harappan civilization. It provides crucial evidence of the metallurgical skills of the Indus Valley people and offers a rare glimpse into their fashion, entertainment, and social life.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/58/Dancing_girl.jpg"
  },
  ajanta: {
    title: "Ajanta Cave 17 Frescoes",
    period: "c. 5th Century CE (Vakataka Dynasty)",
    desc: "Elaborate rock-cut cave paintings utilizing the tempera technique on a mud-plaster base. They feature incredibly expressive figures, intricate jewelry, and lush backgrounds.",
    context: "Cave 17 contains some of the best-preserved murals at Ajanta. These paintings narrate the Jataka tales (past lives of the Buddha). They are a testament to the pinnacle of ancient Indian painting and profoundly influenced art across Asia.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Ajanta_cave_17%2C_frescoes_above_a_lintel.JPG"
  },
  chola: {
    title: "Chola Nataraja Bronze",
    period: "c. 12th Century CE (Chola Dynasty)",
    desc: "A magnificent bronze statue of Lord Shiva performing the cosmic dance of creation and destruction (Ananda Tandava), balanced within a flaming halo.",
    context: "Created during the cultural zenith of the Chola Empire in South India, this sculpture represents an extraordinary fusion of religious philosophy and artistic perfection.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Nataraja._Bronze_statue_from_12th_Century%2C_CE%2C_Tamil_Nadu.jpg"
  },
  mughal: {
    title: "Akbarnama Miniature",
    period: "Late 16th Century CE (Mughal Empire)",
    desc: "A highly detailed manuscript painting showcasing Abu'l-Fazl presenting the Akbarnama to Emperor Akbar. Characterized by vibrant mineral pigments and fine brushwork.",
    context: "Mughal miniatures blended indigenous Indian styles with Persian techniques. Under Emperor Akbar's patronage, a massive royal atelier was established to document the empire.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/AbulFazlPresentingAkbarnama.jpg"
  },
  madhubani: {
    title: "Traditional Mithila Art",
    period: "Continuous Folk Tradition (Bihar)",
    desc: "A vibrant folk painting created using natural dyes (from plants and minerals) applied with fingers, twigs, and matchsticks. Characterized by two-dimensional imagery.",
    context: "Historically painted by women on the freshly plastered mud walls of their homes in the Mithila region, these paintings invoke divine blessings for marriages and festivals.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Madhubani_painting.jpg"
  },
  warli: {
    title: "Warli Tribal Canvas",
    period: "Ancient Roots (Maharashtra)",
    desc: "An earthy, minimalist artwork depicting human figures, animals, and trees using basic geometric shapes painted in white rice paste on a red ochre background.",
    context: "Created by the Warli tribe, this art form avoids mythological or religious iconography, focusing entirely on social life, nature, and the harvest.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Warli_painting.jpg"
  }
};

const mapLocations = [
  {
    id: "ajanta",
    name: "Ajanta Caves",
    coords: [20.5519, 75.7033],
    info: "Buddhist rock-cut caves featuring ancient frescoes.",
    period: "c. 5th Century CE",
    desc: "Elaborate rock-cut cave paintings utilizing the tempera technique on a mud-plaster base.",
    context: "Cave 17 contains some of the best-preserved murals at Ajanta narrating the Jataka tales. It is a testament to the pinnacle of ancient Indian painting.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Ajanta_cave_17%2C_frescoes_above_a_lintel.JPG"
  },
  {
    id: "madhubani",
    name: "Madhubani",
    coords: [26.3496, 86.0792],
    info: "Birthplace of the vibrant Mithila folk painting tradition.",
    period: "Continuous Folk Tradition",
    desc: "A vibrant folk painting created using natural dyes applied with fingers, twigs, and matchsticks.",
    context: "Historically painted by women on freshly plastered mud walls to invoke divine blessings for marriages and festivals.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Madhubani_painting.jpg"
  },
  {
    id: "warli",
    name: "Warli Region",
    coords: [19.9010, 72.8130],
    info: "Home to the indigenous Warli tribe and their minimalist art.",
    period: "Ancient Roots",
    desc: "Minimalist artwork depicting social life using basic geometric shapes in white rice paste.",
    context: "The art avoids mythological iconography, focusing entirely on social life, nature, and the harvest circle.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Warli_painting.jpg"
  },
  {
    id: "thanjavur",
    name: "Thanjavur",
    coords: [10.7867, 79.1378],
    info: "Center of Chola bronzes and the iconic Tanjore painting style.",
    period: "16th Century CE",
    desc: "Characterized by rich, flat colors, glittering gold foils, and extensive gesso work.",
    context: "Originating under the Maratha court, it served as a devotional art form depicting Hindu deities in highly stylized, opulent forms.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Thanjavur_art_from_south_India.jpg/960px-Thanjavur_art_from_south_India.jpg"
  },
  {
    id: "jaipur",
    name: "Jaipur",
    coords: [26.9124, 75.7873],
    info: "Hub of Rajput miniature paintings.",
    period: "16th - 19th Century CE",
    desc: "Distinctive miniatures blending indigenous Hindu traditions with Persian elements.",
    context: "Rajput painting flourished in the royal courts of Rajasthan, focusing on the epics, Krishna legends, and courtly life.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Shahadin_001.jpg/960px-Shahadin_001.jpg"
  },
  {
    id: "kangra",
    name: "Kangra",
    coords: [32.0998, 76.2691],
    info: "The heart of Pahari painting.",
    period: "18th Century CE",
    desc: "Famous for its lyrical, delicate depictions of nature, feminine beauty, and romance.",
    context: "The Kangra style reached its zenith under Maharaja Sansar Chand, bringing a fresh, lyrical naturalism to Indian miniatures.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Krishna_and_Radha_looking_into_a_mirror._-_Google_Art_Project.jpg/960px-Krishna_and_Radha_looking_into_a_mirror._-_Google_Art_Project.jpg"
  },
  {
    id: "kalahasti",
    name: "Srikalahasti",
    coords: [13.7501, 79.7042],
    info: "Traditional center of pen-and-ink Kalamkari textile art.",
    period: "Ancient to Modern",
    desc: "Intricate, freehand drawing on cotton textiles using a bamboo pen (kalam) and natural dyes.",
    context: "Srikalahasti Kalamkari draws heavily on Hindu mythology, flourishing originally under the patronage of the Vijayanagara Empire.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Kalamkari_painting_of_Lord_Vishnu_on_serpent_Ananta.jpg/960px-Kalamkari_painting_of_Lord_Vishnu_on_serpent_Ananta.jpg"
  },
  {
    id: "puri",
    name: "Puri",
    coords: [19.8135, 85.8312],
    info: "Famous for Pattachitra scroll painting.",
    period: "12th Century CE",
    desc: "Traditional cloth-based scroll painting known for intricate details and mythological narratives.",
    context: "Pattachitra is closely linked with the cult of Shri Jagannath, serving originally as visual storytelling for pilgrims.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Odisha_Pattachitara_Depicting_Unconditional_Love_between_Radha_Krushna.jpg"
  },
  {
    id: "bhimbetka",
    name: "Bhimbetka",
    coords: [22.9366, 77.6163],
    info: "Prehistoric rock shelters with ancient cave paintings.",
    period: "c. 30,000 BCE",
    desc: "Some of the oldest known cave art in India, depicting animals, dances, and hunting scenes in earthy reds and whites.",
    context: "These shelters provide a continuous record of human life and artistic expression from the Paleolithic through the Mesolithic periods.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Rock_Shelter_8%2C_Bhimbetka_02.jpg/960px-Rock_Shelter_8%2C_Bhimbetka_02.jpg"
  },
  {
    id: "kochi",
    name: "Kochi",
    coords: [9.9312, 76.2673],
    info: "Center for spectacular Kerala mural paintings.",
    period: "9th - 12th Century CE",
    desc: "Highly stylized, vibrant murals adorning temple and palace walls using natural pigments in five distinct colors (Panchavarna).",
    context: "These murals depict Hindu mythology and legends, representing a highly developed classical tradition unique to Kerala.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Kris_mural7.jpg"
  },
  {
    id: "kishangarh",
    name: "Kishangarh",
    coords: [26.5721, 74.8727],
    info: "Birthplace of the Bani Thani miniature style.",
    period: "18th Century CE",
    desc: "A highly stylized school of Rajput painting known for its exaggerated facial features, arching eyebrows, and lotus-like eyes.",
    context: "Patronized by Raja Savant Singh, the style reached its peak with the iconic 'Bani Thani' painting, often called the Mona Lisa of India.",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/10/4_Radha_%28Bani_Thani%29%2C_Kishangarh%2C_ca._1750%2C_National_Museum_New_Delhi.jpg"
  },
  {
    id: "mysore",
    name: "Mysore",
    coords: [12.2958, 76.6394],
    info: "Home of the delicate Mysore painting style.",
    period: "14th Century CE",
    desc: "An important form of classical South Indian painting known for its elegance, muted colors, and intricate gesso work.",
    context: "Flourished under the patronage of the Wodeyars, these devotional paintings require incredible patience and focus on grace rather than bold contrast.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Mysore_Painting.jpg"
  },
  {
    id: "bishnupur",
    name: "Bishnupur",
    coords: [23.0692, 87.3177],
    info: "Renowned for elaborate terracotta temples.",
    period: "17th Century CE",
    desc: "Famous for exquisite terracotta art panels on temple walls depicting scenes from the Ramayana and Mahabharata.",
    context: "Under the Malla kings, a lack of stone led artisans to master terracotta, creating a completely unique architectural and sculptural style.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Bust_of_the_Virgin_MET_DP124049_%28cropped%29.jpg/960px-Bust_of_the_Virgin_MET_DP124049_%28cropped%29.jpg"
  },
  {
    id: "kutch",
    name: "Kutch",
    coords: [23.7337, 69.8597],
    info: "A vibrant hub for Rogan art and mirror-work.",
    period: "Ancient to Modern",
    desc: "A rich textile tradition including Rogan (castor oil-based painting on fabric) and incredibly dense embroidery with mirrored glass.",
    context: "The diverse communities of the Kutch desert use these vibrant textiles as a vital part of their identity, dowries, and daily life.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Prag_Mahal_Back_side_view%2C_Bhuj%2C_Gujarat%2C_India.jpg/960px-Prag_Mahal_Back_side_view%2C_Bhuj%2C_Gujarat%2C_India.jpg"
  }
];

// --- APP INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScrolling();
  buildCustomTimeline();
  initMap();
  initModal();
});

// --- NAVIGATION & SCROLLING ---

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Update active state in nav
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
      if(this.classList.contains('nav-btn')) {
        this.classList.add('active');
      }

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
      
      // Fix leaflet map size if scrolling to it
      if (targetId === '#map' && window.artMap) {
        setTimeout(() => window.artMap.invalidateSize(), 500);
      }
    });
  });
}

// --- CUSTOM TIMELINE LOGIC ---

function buildCustomTimeline() {
  const container = document.getElementById('custom-timeline');
  if (!container) return;

  const keys = Object.keys(artifactDetails);
  
  keys.forEach((key, index) => {
    const item = artifactDetails[key];
    const alignmentClass = index % 2 === 0 ? 'left' : 'right';
    
    const cardHTML = `
      <div class="timeline-card ${alignmentClass}">
        <div class="timeline-date-opposite">${item.period}</div>
        <div class="timeline-card-content glass-panel" data-artifact-id="${key}">
          <img src="${item.image}" alt="${item.title}" class="timeline-card-image">
          <div class="timeline-card-text">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML += cardHTML;
  });
}

// --- MODAL LOGIC ---

function initModal() {
  const modalOverlay = document.getElementById('artifact-modal');
  const closeBtn = document.getElementById('close-modal');

  // Close when clicking the close button
  closeBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  // Close when clicking outside the modal content
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  // Global event listener to catch clicks on dynamically injected artifact cards AND map popup buttons
  document.addEventListener('click', function(e) {
    // 1. Timeline Card Clicks
    const card = e.target.closest('.timeline-card-content');
    if (card) {
      const artifactId = card.getAttribute('data-artifact-id');
      window.openArtifactModal(artifactId, false);
      return;
    }
    
    // 2. Map Popup Button Clicks
    if (e.target.classList.contains('map-explore-btn')) {
      const mapId = e.target.getAttribute('data-map-id');
      window.openArtifactModal(mapId, true);
    }
  });
}

window.openArtifactModal = function(id, isMap = false) {
  let details = null;
  
  if (isMap) {
    details = mapLocations.find(loc => loc.id === id);
    if(details) details.title = details.name; // map uses 'name', timeline uses 'title'
  } else {
    details = artifactDetails[id];
  }
  
  if (!details) return;

  document.getElementById('modal-title').textContent = details.title;
  document.getElementById('modal-period').textContent = details.period;
  document.getElementById('modal-desc').textContent = details.desc;
  document.getElementById('modal-context').textContent = details.context;
  document.getElementById('modal-image').src = details.image;
  
  document.getElementById('artifact-modal').classList.add('active');
};

// --- MAP LOGIC ---

function initMap() {
  // Center roughly on India
  const map = L.map('leaflet-map').setView([22.5937, 78.9629], 5);
  window.artMap = map; // Store globally for resize fix

  // Standard OpenStreetMap tiles (100% free, no API key)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Custom icon style using inline CSS for simplicity
  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: var(--accent-saffron); width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  // Add markers with rich mini-cards
  mapLocations.forEach(loc => {
    const popupContent = `
      <div class="map-mini-card">
        <img src="${loc.image}" alt="${loc.name}" class="map-mini-img">
        <div class="map-mini-text">
          <h3>${loc.name}</h3>
          <p>${loc.info}</p>
          <button class="map-explore-btn" data-map-id="${loc.id}">Explore Art Form</button>
        </div>
      </div>
    `;
    
    L.marker(loc.coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent, { minWidth: 260, className: 'rich-popup' });
  });
}
