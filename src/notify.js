import React from 'react';
import {Platform} from 'react-native';

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotification.configure({
    onRegister: function (token) {},
    onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
        PushNotification.cancelAllLocalNotifications();
    },
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
});

const notify = (title, message) => {
    if (Platform.os === 'ios') {
        PushNotificationIOS.presentLocalNotification({
            alertTitle: `Olá ${this.state.user.name}!`,
            alertBody: 'Tem uma nova viagem à sua espera',
        });

        PushNotification.localNotification({
            title,
            message,
            largeIcon: 'drawable/icon',
            smallIcon: 'drawable/icon',
        });
        console.log('notificação IOS');
    } else {
        PushNotification.localNotification({
            title,
            message,
            largeIcon: 'drawable/icon',
            smallIcon: 'drawable/icon',
        });
    }
};

export default notify;