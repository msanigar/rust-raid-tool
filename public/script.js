const data = {
  structures: {
    WoodenWall: {
      hp: 250,
      satchel: 200,
      c4: 550,
      rocket: 350,
      explo556: 14,
    },
    StoneWall: {
      hp: 500,
      satchel: 100,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
    SheetMetalWall: {
      hp: 1000,
      satchel: 115,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
    ArmouredWall: {
      hp: 2000,
      satchel: 115,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
    WoodenDoor: {
      hp: 200,
      satchel: 200,
      c4: 550,
      rocket: 350,
      explo556: 7,
    },
    SheetMetalDoor: {
      hp: 250,
      satchel: 115,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
    GarageDoor: {
      hp: 600,
      satchel: 115,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
    ArmouredDoor: {
      hp: 800,
      satchel: 115,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
    LadderHatch: {
      hp: 250,
      satchel: 115,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
    HighExternalWoodenWall: {
      hp: 600,
      satchel: 115,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
    HighExternalStoneWall: {
      hp: 500,
      satchel: 115,
      c4: 275,
      rocket: 175,
      explo556: 7,
    },
  },
  explosives: {
    C4: { sulfur: 2200, gunpowder: 1000, metalFragments: 200 },
    Rocket: { sulfur: 1400, gunpowder: 1000, metalFragments: 100 },
    Satchel: { sulfur: 480, gunpowder: 240, rope: 1 },
    Explo556: { sulfur: 50, gunpowder: 25, metalFragments: 10 },
  },
};

function switchTab(tab) {
  document
    .querySelectorAll(".container")
    .forEach((container) => container.classList.add("hidden"));
  document
    .querySelectorAll(".segmented-control button")
    .forEach((button) => button.classList.remove("active"));
  document.getElementById(tab).classList.remove("hidden");
  document
    .querySelector(`.segmented-control button[onclick="switchTab('${tab}')"]`)
    .classList.add("active");
}

function populateRaidCosts() {
  const tableBody = document.getElementById("raidCostsTable");
  tableBody.innerHTML = "";

  Object.keys(data.structures).forEach((structure) => {
    const stats = data.structures[structure];
    const row = `
          <tr>
            <td>${structure
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str)}</td>
            <td>${stats.hp}</td>
            <td>${Math.ceil(stats.hp / stats.satchel)}</td>
            <td>${Math.ceil(stats.hp / stats.c4)}</td>
            <td>${Math.ceil(stats.hp / stats.rocket)}</td>
            <td>${Math.ceil(stats.hp / stats.explo556)}</td>
          </tr>
        `;
    tableBody.innerHTML += row;
  });
}

function generateTotalResultsTable(totals) {
  let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Explosive</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
    `;

  Object.keys(totals).forEach((explosive) => {
    tableHTML += `
        <tr>
          <td>${explosive}</td>
          <td>${totals[explosive]}</td>
        </tr>
      `;
  });

  tableHTML += `
        </tbody>
      </table>
    `;

  return tableHTML;
}

function generateIndividualResultsTable(data) {
  let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Explosive</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
    `;

  Object.keys(data).forEach((structure) => {
    Object.keys(data[structure]).forEach((explosive) => {
      tableHTML += `
          <tr>
            <td>${explosive}</td>
            <td>${data[structure][explosive]}</td>
          </tr>
        `;
    });
  });

  tableHTML += `
        </tbody>
      </table>
    `;

  return tableHTML;
}

function calculateFromBase() {
  const results = {};
  const totals = {};
  let inputCount = 0;

  Object.keys(data.structures).forEach((structure) => {
    const input = document.getElementById(structure);
    if (input && input.value) {
      const count = parseInt(input.value, 10);
      results[structure] = {};
      inputCount++;

      Object.keys(data.structures[structure]).forEach((explosive) => {
        if (explosive !== "hp") {
          const damagePerExplosive = data.structures[structure][explosive];
          const explosivesNeededPerStructure = Math.ceil(
            data.structures[structure].hp / damagePerExplosive
          );

          const totalExplosivesNeeded = explosivesNeededPerStructure * count;

          results[structure][explosive] = totalExplosivesNeeded;
          totals[explosive] = (totals[explosive] || 0) + totalExplosivesNeeded;
        }
      });
    }
  });

  const resultsDiv = document.getElementById("resultsBase");

  if (inputCount > 1) {
    resultsDiv.innerHTML = generateTotalResultsTable(totals);
  } else if (inputCount === 1) {
    resultsDiv.innerHTML = generateIndividualResultsTable(results);
  } else {
    resultsDiv.innerHTML = "<p>No input provided. Please enter values.</p>";
  }
}

function generateSulfurResultsTable(results) {
  let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Explosive</th>
            <th>Count</th>
            <th>Sulfur</th>
            <th>Gunpowder</th>
            <th>Metal Fragments</th>
            <th>Rope</th>
          </tr>
        </thead>
        <tbody>
    `;

  Object.keys(results).forEach((explosive) => {
    const result = results[explosive];
    tableHTML += `
        <tr>
          <td>${explosive}</td>
          <td>${result.count}</td>
          <td>${result.sulfur}</td>
          <td>${result.gunpowder}</td>
          <td>${result.metalFragments || 0}</td>
          <td>${result.rope || 0}</td>
        </tr>
      `;
  });

  tableHTML += `
        </tbody>
      </table>
    `;

  return tableHTML;
}
function calculateFromSulfur() {
  const sulfurInput = document.getElementById("sulfurInput").value;
  const sulfur = parseInt(sulfurInput, 10);

  if (!sulfur || isNaN(sulfur) || sulfur <= 0) {
    document.getElementById("resultsSulfur").innerHTML =
      "<p>Please enter a valid sulfur amount.</p>";
    return;
  }

  const results = {};
  Object.keys(data.explosives).forEach((explosive) => {
    const gunpowderPerExplosive = data.explosives[explosive].gunpowder;
    const directSulfur = data.explosives[explosive].sulfur;
    const totalSulfurPerExplosive = directSulfur;

    const craftable = Math.floor(sulfur / totalSulfurPerExplosive);

    results[explosive] = {
      count: craftable,
      sulfur: craftable * totalSulfurPerExplosive,
      gunpowder: craftable * gunpowderPerExplosive,
      metalFragments:
        (data.explosives[explosive].metalFragments || 0) * craftable,
      rope: (data.explosives[explosive].rope || 0) * craftable,
    };
  });

  const resultsDiv = document.getElementById("resultsSulfur");
  resultsDiv.innerHTML = generateSulfurResultsTable(results);
}

document.addEventListener("DOMContentLoaded", populateRaidCosts);
