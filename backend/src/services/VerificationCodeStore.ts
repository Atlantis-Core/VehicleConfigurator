interface VerificationEntry {
  code: string;
  expires: Date;
}

// In-memory verification code store
class VerificationCodeStore {
  private codes: Map<string, VerificationEntry> = new Map();

  // Store a verification code for an email
  storeCode(email: string, code: string, expiryMinutes: number = 15): void {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + expiryMinutes);

    this.codes.set(email, {
      code,
      expires,
    });
  }

  // Verify a code for an email
  verifyCode(email: string, code: string): boolean {
    const entry = this.codes.get(email);

    // No entry found
    if (!entry) return false;

    // Check expiration
    if (new Date() > entry.expires) {
      this.codes.delete(email);
      return false;
    }

    // Check code
    const isValid = entry.code === code;

    // If valid, remove the used code
    if (isValid) {
      this.codes.delete(email);
    }

    return isValid;
  }

  // Clean expired codes periodically
  cleanExpiredCodes(): void {
    const now = new Date();
    for (const [email, entry] of this.codes.entries()) {
      if (now > entry.expires) {
        this.codes.delete(email);
      }
    }
  }
}

// Create a singleton instance
export const verificationStore = new VerificationCodeStore();

// Start a cleanup interval (run every 15 minutes)
setInterval(() => {
  verificationStore.cleanExpiredCodes();
}, 15 * 60 * 1000);
