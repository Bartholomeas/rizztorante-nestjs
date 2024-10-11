import { NotificationDevice } from "./enums/notification-device.enum";

export const getDeviceType = (userAgent: string): NotificationDevice => {
  const lowerCaseUA = userAgent.toLowerCase();

  if (
    lowerCaseUA.includes("iphone") ||
    lowerCaseUA.includes("ipad") ||
    lowerCaseUA.includes("ipod")
  ) {
    return NotificationDevice.IOS;
  } else if (lowerCaseUA.includes("android")) {
    return NotificationDevice.ANDROID;
  } else NotificationDevice.WEB;
};
