const otpStore = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;

export const createOtp = (type, email, payload = {}) => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const key = `${type}:${email}`;

  otpStore.set(key, {
    otp,
    payload,
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  return otp;
};

export const verifyOtp = (type, email, otp) => {
  const key = `${type}:${email}`;
  const record = otpStore.get(key);

  if (!record) {
    return { ok: false, message: "OTP not found or expired" };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return { ok: false, message: "OTP expired. Please request a new OTP" };
  }

  if (record.otp !== String(otp)) {
    return { ok: false, message: "Invalid OTP" };
  }

  otpStore.delete(key);
  return { ok: true, payload: record.payload };
};
