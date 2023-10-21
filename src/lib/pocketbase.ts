import PocketBase from "pocketbase";

const client = new PocketBase("https://brave-rain.pockethost.io");
client.autoCancellation(false);

export const isUserValid = client.authStore.isValid;
export const userData = client.authStore.model;

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return await client.collection("users").authWithPassword(username, password);
};

export const getAllMails = async () => {
  return await client.collection("mails").getList(1, 50, {
    filter: `creator='${userData?.id}'`,
    sort: "-created",
    expand: "approver",
  });
};

export const createMail = async (data: any) => {
  return await client.collection("mails").create(data);
};

export const signout = () => {
  client.authStore.clear();
};
