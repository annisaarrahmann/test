import PocketBase from "pocketbase";

const client = new PocketBase("https://brave-rain.pockethost.io");
client.autoCancellation(false);

export const isUserValid = client.authStore.isValid;

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return await client.collection("users").authWithPassword(username, password);
}

export function signout() {
  client.authStore.clear();
}
