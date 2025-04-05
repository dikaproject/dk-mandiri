export const formatToIDR = (value: string | number): string => {
  // Convert to number and handle invalid inputs
  const num = Number(value);
  if (isNaN(num)) return '0';
  
  // Convert to string with thousand separators
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Convert formatted IDR back to number string
export const unformatFromIDR = (value: string): string => {
  return value.replace(/\./g, '');
};

// Format berat dengan konversi lebih lengkap
export const formatWeight = (weightInGrams: number | string): string => {
  const weight = typeof weightInGrams === 'string' ? parseFloat(weightInGrams) : weightInGrams;
  if (isNaN(weight)) return '0 g';
  
  if (weight >= 1000000) { // 1.000.000 gram = 1 ton
    const ton = weight / 1000000;
    return `${ton % 1 === 0 ? ton : ton.toFixed(2)} ton`;
  } else if (weight >= 100000) { // 100.000 gram = 1 kwintal
    const kwintal = weight / 100000;
    return `${kwintal % 1 === 0 ? kwintal : kwintal.toFixed(2)} kwintal`;
  } else if (weight >= 1000) { // 1.000 gram = 1 kg
    const kg = weight / 1000;
    return `${kg % 1 === 0 ? kg : kg.toFixed(1)} kg`;
  } else {
    return `${weight} g`;
  }
};

// Mengubah string format berat kembali ke number (gram)
export const unformatWeight = (formattedWeight: string): number => {
  if (!formattedWeight) return 0;
  
  const trimmed = formattedWeight.trim();
  if (trimmed.endsWith('ton')) {
    const ton = parseFloat(trimmed.replace('ton', '').trim());
    return isNaN(ton) ? 0 : ton * 1000000;
  } else if (trimmed.endsWith('kwintal')) {
    const kwintal = parseFloat(trimmed.replace('kwintal', '').trim());
    return isNaN(kwintal) ? 0 : kwintal * 100000;
  } else if (trimmed.endsWith('kg')) {
    const kg = parseFloat(trimmed.replace('kg', '').trim());
    return isNaN(kg) ? 0 : kg * 1000;
  } else if (trimmed.endsWith('g')) {
    const g = parseFloat(trimmed.replace('g', '').trim());
    return isNaN(g) ? 0 : g;
  } else {
    const num = parseFloat(trimmed);
    return isNaN(num) ? 0 : num;
  }
};