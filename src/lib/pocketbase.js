import PocketBase from 'pocketbase';
const url = `${import.meta.env.VITE_POCKETBASE}`;
const client = new PocketBase('https://brave-rain.pockethost.io');
client.autoCancellation(false);
export const isUserValid = client.authStore.isValid;
export async function getTasks() {
    return await client.collection("tasks").getFullList();
}
export async function toggleTask(id, title, completed) {
    const data = { title: title, completed: !completed, user: client.authStore.model.id }
    await client.collection('tasks').update(id, data);
}
export async function login(username, password) {
    await client.collection('users').authWithPassword(username, password);
    window.location.reload();
}
export function signout() {
    client.authStore.clear();
    window.location.reload();
}
export async function signup(username, password) {
    const data = {
        username: username,
        password: password,
        passwordConfirm: password,
    }
    await client.collection('users').create(data);
}