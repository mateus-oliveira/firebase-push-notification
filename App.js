import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import fcmService from './src/FCMService';
import localNotificationService from './src/LocalNotificationService';

export default function App() {
    useEffect(() => {
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);
        localNotificationService.configure(onOpenNotification);

        function onRegister(token) {
            console.log('onRegister', token);
        }

        function onNotification(notify) {
            console.log('onNotification', notify);
            const options = {
                soundName: 'default',
                playSound: true,
            };
            localNotificationService.showNotification(
                0,
                notify.title,
                notify.body,
                notify,
                options,
            );
        }

        function onOpenNotification(notify) {
            console.log('onOpenNotification', notify);
            alert('open notification', notify);
        }

        return () => {
            console.log('App unRegister');
            fcmService.unRegister();
            localNotificationService.unregister();
        };
    });

    return (
        <View style={styles.container}>
            <Text>Firebase Notification</Text>
            <Button
                title="Pressione-me"
                onPress={() =>
                    localNotificationService.cancelAllLocalNotifications()
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
