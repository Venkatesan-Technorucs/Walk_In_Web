import { useState } from "react";
import { useInterval } from "primereact/hooks";

export default function CountdownTimer({ duration, active, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useInterval(
    () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    },
    active && timeLeft > 0 ? 1000 : null,
    active
  );

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatted =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return <div className='flex gap-1 justify-center items-center font-medium text-lg xs:text-xl sm:text-2xl'>
    <i className={`pi pi-clock text-lg xs:text-xl sm:text-2xl ${timeLeft <= 30 ? 'text-red-600' : ''}`}></i>
    <p className={`${timeLeft <= 30 ? 'text-red-600' : ''}`}>{formatted}</p>
  </div>;
}
