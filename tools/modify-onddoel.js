const fs = require('fs').promises;

const translations = [
  {
    from: `De leerlingen kunnen de delers van een natuurlijk getal (=100) vinden; zij kunnen van twee dergelijke getallen de (grootste) gemeenschappelijke deler(s) vinden.`,
    to:   `De leerlingen kunnen de delers van een natuurlijk getal (≤100) vinden; zij kunnen van twee dergelijke getallen de (grootste) gemeenschappelijke deler(s) vinden.`
  },
  {
    from: `De leerlingen kunnen de veelvouden van een natuurlijk getal (<20) vinden, zij kunnen van twee dergelijke getallen het (kleinste) gemeenschappelijk veelvoud vinden.`,
    to:   `De leerlingen kunnen de veelvouden van een natuurlijk getal (≤20) vinden, zij kunnen van twee dergelijke getallen het (kleinste) gemeenschappelijk veelvoud vinden.`
  },
  // {
  //   from: ``,
  //   to:   ``
  // },
];

(async function() {
  const file = '../schemes/onddoel.ttl'
  let data = await fs.readFile(file, 'utf8');
  for (const translation of translations) {
    data = data.replaceAll(translation.from, translation.to);
  }
  await fs.writeFile(file, data, 'utf8');
})();