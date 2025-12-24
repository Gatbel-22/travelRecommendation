let travelData = null;

fetch("travel_recommendation_api.json")
  .then((res) => res.json())
  .then((data) => {
    travelData = data;
  })
  .catch((err) => console.error(err));

function executeSearch() {
  const keyword = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  if (!keyword || !travelData) return;

  let results = [];

  // CATEGORY SEARCH
  if (keyword.includes("beach")) {
    results = travelData.beaches;
  } else if (keyword.includes("temple")) {
    results = travelData.temples;
  } else {
    // COUNTRY OR CITY SEARCH
    travelData.countries.forEach((country) => {
      // Match country name
      if (country.name.toLowerCase().includes(keyword)) {
        results.push(...country.cities);
      }

      // Match city name
      country.cities.forEach((city) => {
        if (city.name.toLowerCase().includes(keyword)) {
          results.push(city);
        }
      });
    });
  }

  displayResults(results);
}

function displayResults(items) {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p style='color:white;'>No results found.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "recommend-card";

    const imagesHtml = item.images
      ? item.images
          .map((url) => `<img src="${url}" alt="${item.name}" />`)
          .join("")
      : `<img src="${item.imageUrl}" alt="${item.name}" />`;

    card.innerHTML = `
      ${imagesHtml}
      <div class="recommend-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="visit-btn">Visit</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function resetSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("resultsContainer").innerHTML = "";
}
