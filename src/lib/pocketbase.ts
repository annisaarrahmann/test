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

export const getAllMailsCount = async () => {
  return await client.collection("mails").getList(1, 50);
};

export const getAllMails = async () => {
  return await client.collection("mails").getList(1, 50, {
    filter: `creator='${userData?.id}'`,
    sort: "-created",
    expand: "approver",
  });
};

export const getAllPendingMails = async () => {
  return await client.collection("mails").getList(1, 50, {
    filter: `approver='${userData?.id}' && status='pending'`,
    sort: "-created",
    expand: "approver",
  });
};

export const createMail = async (data: any) => {
  return await client.collection("mails").create(data);
};

export const updateMail = async (data: any) => {
  return await client.collection("mails").update(data.id, data);
};

export const signout = () => {
  client.authStore.clear();
};

export const getURL = (record: any, data: any) => {
  return client.files.getUrl(record, data);
};
