import { useEffect, useState } from "react";

export function useEmailVerification(email: string, enabled: boolean) {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!enabled || !email) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/check-verification?email=${email}`
        );
        const data = await response.json();
        if (data.verified) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error("Email verification polling failed:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [email, enabled]);

  return isVerified;
}
