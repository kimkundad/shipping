import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
  } from "react";
  import * as Notifications from "expo-notifications";
  import { Subscription } from "expo-modules-core";
  import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
  import { UserContext } from "../hooks/UserContext";
  
  interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
  }
  
  const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
  );
  
  export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
      throw new Error(
        "useNotification must be used within a NotificationProvider"
      );
    }
    return context;
  };
  
  interface NotificationProviderProps {
    children: ReactNode;
  }
  
  export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
  }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] =
      useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);
  
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync("defaultUserId") // ใส่ ID ชั่วคราวหรือโครงสร้างของคุณ
          .then((token) => setExpoPushToken(token))
          .catch((err) => setError(err));
      }, []);

    const { userProfile } = useContext(UserContext) || {};
  //  console.log("userProfile Noti:", userProfile);
    useEffect(() => {
       // console.log("userProfile:", userProfile);
      
        if (!userProfile) {
          console.warn("User profile not loaded yet.");
          return;
        }
        if (!userProfile.id) {
          console.warn("User profile does not have an ID.");
          return;
        }
      
        // ลงทะเบียน Push Notifications
        registerForPushNotificationsAsync(userProfile.id)
          .then((token) => setExpoPushToken(token))
          .catch((error) => setError(error));
      
        // เพิ่ม Listener สำหรับ Notifications
        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            console.log("🔔 Notification Received: ", notification);
            setNotification(notification);
          });
      
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("🔔 Notification Response: ", response);
          });
      
        // ทำความสะอาด Event Listeners
        return () => {
          if (notificationListener.current) {
            Notifications.removeNotificationSubscription(notificationListener.current);
          }
          if (responseListener.current) {
            Notifications.removeNotificationSubscription(responseListener.current);
          }
        };
      }, [userProfile]); // ใช้ userProfile เป็น Dependency
      
  
    return (
      <NotificationContext.Provider
        value={{ expoPushToken, notification, error }}
      >
        {children}
      </NotificationContext.Provider>
    );
  };