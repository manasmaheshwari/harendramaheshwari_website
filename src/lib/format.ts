export const PHONE = "+91 94147 96426";
export const WHATSAPP_URL = "https://wa.me/919414796426";
export const EMAIL = "hr_maheshwari@rediffmail.com";
export const ADDRESS =
  "INVESTMENT POINT, 4/149, Pani Ki Tanki, Vidhyadhar Nagar Marg, Sector 4, Jaipur, Rajasthan 302039";
export const MAPS_URL =
  "https://www.google.com/maps/dir//INVESTMENT+POINT,+PANI+KI+TANKI,+4%2F149,+NAER,+Vidhyadhar+Nagar+Marg,+Sector+4,+Jaipur,+Rajasthan+302039/@26.886144,75.7727232,11z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x396db35627c04c59:0x441b7ed56fdbea8a!2m2!1d75.786738!2d26.9548168";

export function fmtINR(n: number, opts: { compact?: boolean } = {}) {
  if (!isFinite(n)) return "₹0";
  const abs = Math.abs(n);
  if (opts.compact) {
    if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
    if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
  }
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function fmtNum(n: number) {
  return Math.round(n).toLocaleString("en-IN");
}
