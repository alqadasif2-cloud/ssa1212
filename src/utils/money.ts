export function normalizeArabicDigits(str: string): string {
  const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let result = str;
  for (let i = 0; i <= 9; i++) {
    result = result.replaceAll(arabic[i], String(i));
  }
  return result;
}

export function parseCapitalToCents(rawInput: string): { valid: boolean; cents?: number; error?: string } {
  const trimmed = normalizeArabicDigits(rawInput.trim().replace('$', '').replace('،', ','));
  if (!trimmed) {
    return { valid: false, error: 'يرجى إدخال قيمة صحيحة.' };
  }
  const normalized = trimmed.replace(',', '.');
  const num = parseFloat(normalized);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'يجب أن تكون القيمة أكبر من صفر.' };
  }
  return { valid: true, cents: Math.round(num * 100) };
}

export function parseToCents(rawInput: string): { valid: boolean; cents?: number; error?: string } {
  const trimmed = normalizeArabicDigits(rawInput.trim().replace('$', '').replace('،', ','));
  if (!trimmed) {
    return { valid: false, error: 'يرجى إدخال نتيجة الصفقة.' };
  }
  const normalized = trimmed.replace(',', '.');
  const num = parseFloat(normalized);
  if (isNaN(num)) {
    return { valid: false, error: 'يرجى إدخال رقم صحيح.' };
  }
  if (Math.abs(num) < 0.001) {
    return { valid: false, error: 'لا يمكن أن تكون نتيجة الصفقة صفراً.' };
  }
  return { valid: true, cents: Math.round(num * 100) };
}

export function formatMoney(cents?: number | null, showSign: boolean = false): string {
  if (cents === undefined || cents === null) return '$0.00';
  const isNegative = cents < 0;
  const isPositive = cents > 0;
  const absCents = Math.abs(cents);
  const dollars = Math.floor(absCents / 100);
  const remainder = absCents % 100;
  const formattedDollars = dollars.toLocaleString('en-US');
  const formattedNumber = `$${formattedDollars}.${remainder.toString().padStart(2, '0')}`;

  if (isNegative) return `-${formattedNumber}`;
  if (isPositive && showSign) return `+${formattedNumber}`;
  return formattedNumber;
}

export function calculateProgress(currentCents: number, targetCents: number): number {
  if (targetCents <= 0 || currentCents <= 0) return 0;
  const pct = (currentCents / targetCents) * 100;
  return Math.min(100, Math.max(0, parseFloat(pct.toFixed(1))));
}
