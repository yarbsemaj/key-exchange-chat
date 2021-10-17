import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';


export const alerts = writable([]);

export const addAlert = (text) => {
    alerts.update(currentAlerts => {
        let id = uuidv4();
        return [...currentAlerts, { text, id }]
    })
}

export const hideAlert = (index) => {
    alerts.update(currentAlerts => {
        return currentAlerts.filter(alert => alert.id !== index)
    })
}