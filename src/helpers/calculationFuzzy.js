const fuzzyInference = (persentaseABC, persediaan) => {
  // Define constants
  const ABC_THRESHOLD_LOW = 2;
  const ABC_THRESHOLD_MEDIUM = 4;
  const ABC_THRESHOLD_HIGH = 6;

  const STOCK_THRESHOLD_LOW = 40;
  const STOCK_THRESHOLD_MEDIUM = 80;
  const STOCK_THRESHOLD_HIGH = 120;

  const OUTPUT_SEDIKIT = 30;
  const OUTPUT_CUKUP = 60;
  const OUTPUT_BANYAK = 90;

  // Membership functions for "Persentase ABC"
  const rendahABC = x =>
    x <= ABC_THRESHOLD_LOW
      ? 1
      : x <= ABC_THRESHOLD_MEDIUM
        ? (ABC_THRESHOLD_MEDIUM - x) / (ABC_THRESHOLD_MEDIUM - ABC_THRESHOLD_LOW)
        : 0;
  const sedangABC = x =>
    x <= ABC_THRESHOLD_LOW
      ? 0
      : x <= ABC_THRESHOLD_MEDIUM
        ? (x - ABC_THRESHOLD_LOW) / (ABC_THRESHOLD_MEDIUM - ABC_THRESHOLD_LOW)
        : x <= ABC_THRESHOLD_HIGH
          ? (ABC_THRESHOLD_HIGH - x) / (ABC_THRESHOLD_HIGH - ABC_THRESHOLD_MEDIUM)
          : 0;
  const tinggiABC = x =>
    x <= ABC_THRESHOLD_MEDIUM
      ? 0
      : x <= ABC_THRESHOLD_HIGH
        ? (x - ABC_THRESHOLD_MEDIUM) / (ABC_THRESHOLD_HIGH - ABC_THRESHOLD_MEDIUM)
        : 1;

  // Membership functions for "Persediaan"
  const sedikitPersediaan = x =>
    x <= STOCK_THRESHOLD_LOW
      ? 1
      : x <= STOCK_THRESHOLD_MEDIUM
        ? (STOCK_THRESHOLD_MEDIUM - x) / (STOCK_THRESHOLD_MEDIUM - STOCK_THRESHOLD_LOW)
        : 0;
  const cukupPersediaan = x =>
    x <= STOCK_THRESHOLD_LOW
      ? 0
      : x <= STOCK_THRESHOLD_MEDIUM
        ? (x - STOCK_THRESHOLD_LOW) / (STOCK_THRESHOLD_MEDIUM - STOCK_THRESHOLD_LOW)
        : x <= STOCK_THRESHOLD_HIGH
          ? (STOCK_THRESHOLD_HIGH - x) / (STOCK_THRESHOLD_HIGH - STOCK_THRESHOLD_MEDIUM)
          : 0;
  const banyakPersediaan = x =>
    x <= STOCK_THRESHOLD_MEDIUM
      ? 0
      : x <= STOCK_THRESHOLD_HIGH
        ? (x - STOCK_THRESHOLD_MEDIUM) / (STOCK_THRESHOLD_HIGH - STOCK_THRESHOLD_MEDIUM)
        : 1;

  // Fuzzification
  const fuzzyABC = [
    { name: 'rendah', value: rendahABC(persentaseABC) },
    { name: 'sedang', value: sedangABC(persentaseABC) },
    { name: 'tinggi', value: tinggiABC(persentaseABC) },
  ];

  const fuzzyPersediaan = [
    { name: 'sedikit', value: sedikitPersediaan(persediaan) },
    { name: 'cukup', value: cukupPersediaan(persediaan) },
    { name: 'banyak', value: banyakPersediaan(persediaan) },
  ];

  // Rule Evaluation
  const rules = [
    { if: ['rendah', 'sedikit'], then: 'Sedikit' },
    { if: ['rendah', 'cukup'], then: 'Sedikit' },
    { if: ['rendah', 'banyak'], then: 'Sedikit' },
    { if: ['sedang', 'sedikit'], then: 'Banyak' },
    { if: ['sedang', 'cukup'], then: 'Cukup' },
    { if: ['sedang', 'banyak'], then: 'Sedikit' },
    { if: ['tinggi', 'sedikit'], then: 'Banyak' },
    { if: ['tinggi', 'cukup'], then: 'Cukup' },
    { if: ['tinggi', 'banyak'], then: 'Sedikit' },
  ];

  const ruleResults = rules.map(rule => {
    const abcValue = fuzzyABC.find(f => f.name === rule.if[0]).value;
    const persediaanValue = fuzzyPersediaan.find(f => f.name === rule.if[1]).value;
    return { output: rule.then, value: Math.min(abcValue, persediaanValue) };
  });

  // Aggregation
  const aggregated = {
    Sedikit: Math.max(...ruleResults.filter(r => r.output === 'Sedikit').map(r => r.value)),
    Cukup: Math.max(...ruleResults.filter(r => r.output === 'Cukup').map(r => r.value)),
    Banyak: Math.max(...ruleResults.filter(r => r.output === 'Banyak').map(r => r.value)),
  };

  // Defuzzification
  const titikTengah = {
    Sedikit: OUTPUT_SEDIKIT,
    Cukup: OUTPUT_CUKUP,
    Banyak: OUTPUT_BANYAK,
  };

  const z =
    (aggregated.Sedikit * titikTengah.Sedikit +
      aggregated.Cukup * titikTengah.Cukup +
      aggregated.Banyak * titikTengah.Banyak) /
    (aggregated.Sedikit + aggregated.Cukup + aggregated.Banyak);

  return {
    z: Math.round(z),
    aggregated,
    fuzzyABC,
    fuzzyPersediaan,
    ruleResults: ruleResults.map((r, i) => ({
      ...r,
      ...rules[i],
    })),
    titikTengah,
  };
};

module.exports = { fuzzyInference };
