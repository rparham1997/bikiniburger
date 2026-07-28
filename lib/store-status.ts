const TIME_ZONE = "America/New_York";

type StoreDay = {
  day: string;
  openHour: number;
  closeHour: number;
};

const STORE_HOURS: StoreDay[] = [
  { day: "Sunday", openHour: 12, closeHour: 22 },
  { day: "Monday", openHour: 11, closeHour: 23 },
  { day: "Tuesday", openHour: 11, closeHour: 23 },
  { day: "Wednesday", openHour: 11, closeHour: 23 },
  { day: "Thursday", openHour: 11, closeHour: 23 },
  { day: "Friday", openHour: 11, closeHour: 23 },
  { day: "Saturday", openHour: 11, closeHour: 23 }
];

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  weekday: "long",
  hour: "numeric",
  minute: "numeric",
  hour12: false
});

const displayTime = (hour: number) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour} ${suffix}`;
};

const getEasternDayAndMinutes = (date = new Date()) => {
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value || "Monday";
  const hour = Number(parts.find((part) => part.type === "hour")?.value || "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value || "0");

  return { weekday, minutes: hour * 60 + minute };
};

export const getStoreStatus = (date = new Date()) => {
  const isPaused = process.env.ORDERING_PAUSED === "true";
  const isPickupEnabled = process.env.PICKUP_ENABLED !== "false";
  const isDeliveryEnabled = process.env.DELIVERY_ENABLED !== "false";
  const pauseMessage =
    process.env.ORDERING_PAUSED_MESSAGE ||
    "Online ordering is paused right now. Please call the shop or use a delivery app.";
  const { weekday, minutes } = getEasternDayAndMinutes(date);
  const today = STORE_HOURS.find((day) => day.day === weekday) || STORE_HOURS[1];
  const openMinutes = today.openHour * 60;
  const closeMinutes = today.closeHour * 60;
  const isOpenByHours = minutes >= openMinutes && minutes < closeMinutes;
  const nextMessage = `${today.day} hours: ${displayTime(today.openHour)}-${displayTime(today.closeHour)}.`;

  if (isPaused) {
    return {
      isAcceptingOrders: false,
      isOpenByHours,
      isPaused: true,
      isPickupEnabled,
      isDeliveryEnabled,
      status: "paused",
      message: pauseMessage,
      hoursSummary: "Mon-Sat 11 AM-11 PM; Sun 12 PM-10 PM",
      todayHours: nextMessage
    };
  }

  if (!isOpenByHours) {
    return {
      isAcceptingOrders: false,
      isOpenByHours,
      isPaused: false,
      isPickupEnabled,
      isDeliveryEnabled,
      status: "closed",
      message: `Online ordering is closed right now. ${nextMessage}`,
      hoursSummary: "Mon-Sat 11 AM-11 PM; Sun 12 PM-10 PM",
      todayHours: nextMessage
    };
  }

  return {
    isAcceptingOrders: true,
    isOpenByHours,
    isPaused: false,
    isPickupEnabled,
    isDeliveryEnabled,
    status: "open",
    message: `Online ordering is open. ${nextMessage}`,
    hoursSummary: "Mon-Sat 11 AM-11 PM; Sun 12 PM-10 PM",
    todayHours: nextMessage
  };
};
