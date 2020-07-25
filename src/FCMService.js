import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class FCMService {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister);
        this.createNotificationListeners(
            onRegister,
            onNotification,
            onOpenNotification,
        );
    };

    registerAppWithFCM = async () => {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForremoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    };

    checkPermission = (onRegister) => {
        messaging()
            .hasPermission()
            .then((enabled) => {
                enabled
                    ? this.getToken(onRegister)
                    : this.requestPermission(onRegister);
            })
            .catch((error) =>
                console.log('[FCMService] Permission rejected', error),
            );
    };

    getToken = (onRegister) => {
        messaging()
            .getToken()
            .then((fcmToken) => {
                fcmToken
                    ? onRegister(fcmToken)
                    : console.log(
                          '[FCMService] User does not have a device token',
                      );
            })
            .catch((error) =>
                console.log('[FCMService] getToken rejected ', error),
            );
    };

    requestPermission = (onRegister) => {
        messaging()
            .requestPermission()
            .then(() => {
                this.getToken(onRegister);
            })
            .catch((error) =>
                console.log('[FCMService] Request Permission rejected ', error),
            );
    };

    deleteToken = () => {
        console.log('[FCMService] deleteToken ');
        messaging()
            .deleteToken()
            .catch((error) =>
                console.log('[FCMService] Delete token error ', error),
            );
    };

    createNotificationListeners = (
        onRegister,
        onNotification,
        onOpenNotification,
    ) => {
        // background
        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
                '[FCMService] onNotificationOpenedApp Notification caused app to open ',
                remoteMessage,
            );
            if (remoteMessage) {
                const notification = remoteMessage.notification;
                onOpenNotification(notification);
            }
        });

        // from quit state
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                console.log(
                    '[FCMService] getInitialNotification Notification caused app to open ',
                    remoteMessage,
                );
                if (remoteMessage) {
                    const notification = remoteMessage.notification;
                    onOpenNotification(notification);
                }
            });

        // foreground state messages
        this.messaeListener = messaging().onMessage(async (remoteMessage) => {
            if (remoteMessage) {
                let notification =
                    Platform.OS === 'ios'
                        ? remoteMessage.data.notification
                        : remoteMessage.notification;
                onNotification(notification);
            }
        });

        // Triggered when have new token
        messaging().onTokenRefresh((fcmToken) => {
            console.log('[FCMService] New token refresh: ', fcmToken);
            onRegister(fcmToken);
        });
    };

    unRegister = () => this.messaeListener();
}

const fcmService = new FCMService();

export default fcmService;
