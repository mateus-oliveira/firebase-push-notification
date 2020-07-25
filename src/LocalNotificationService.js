import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

class LocalNotificationService {
    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log(token);
            },
            onNotification: function (notification) {
                if (!notification?.data) {
                    return;
                }
                notification.userInteraction = true;
                onOpenNotification(
                    Platform.OS === 'ios'
                        ? notification.data.item
                        : notification.data,
                );

                if (Platform.OS === 'ios') {
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    };

    unregister = () => PushNotification.unregister();

    showNotification = (id, title, message, data = {}, options = {}) => {
        PushNotification.localNotification({
            ...this.buildAndroidNotification(id, title, message, data, options),
            ...this.buildIOSNotificatoin(id, title, message, data, options),
            title: title || '',
            message: message || '',
            playSound: options.playSound || false,
            soundName: options.soundName || 'default',
            userInteraction: false,
        });
    };

    buildAndroidNotification = (
        id,
        title,
        message,
        data = {},
        options = {},
    ) => {
        return {
            id,
            autoCancel: true,
            largeIcon: options.largeIcon || 'ic_launcher',
            smallIcon: options.smallIcon || 'ic_notification',
            bigText: message || '',
            subText: title || '',
            vibrate: true,
            vibration: 300,
            priority: 'high',
            importance: 'higt',
            data,
        };
    };

    buildIOSNotificatoin = (id, title, message, data = {}, options = {}) => {
        return {
            alertAction: options.alertAction || 'view',
            category: options.category || '',
            userInfo: {
                id,
                item: data,
            },
        };
    };

    cancelAllLocalNotifications = () => {
        Platform.OS === 'ios'
            ? PushNotificationIOS.removeAllDeliveredNotifications()
            : PushNotification.cancelAllLocalNotifications();
    };

    removeDeliveredNotificationByID = (notificationId) =>
        PushNotification.cancelLocalNotifications({
            id: `${notificationId}`,
        });
}

const localNotificationService = new LocalNotificationService();
export default localNotificationService;
