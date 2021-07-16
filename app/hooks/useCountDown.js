import { useEffect, useState } from "react";

export default function useCountDown(startSeconds) {
  const [timeLeft, setTimeLeft] = useState(startSeconds);

  useEffect(() => {
    if (!timeLeft) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return timeLeft;
}
