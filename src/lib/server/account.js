import { Account, Client } from "node-appwrite";
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

export function createServerAccount(headers) {
  const client = new Client()
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
    .setProject(PUBLIC_APPWRITE_PROJECT_ID);

  const cookieHeader = headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(new RegExp(`a_session_${PUBLIC_APPWRITE_PROJECT_ID}=([^;]+)`));
  if (sessionMatch) {
    client.setSession(sessionMatch[1]);
  }

  return new Account(client);
}