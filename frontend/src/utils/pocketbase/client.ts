import PocketBase, { AuthModel } from "pocketbase";
import { cookies } from "next/headers";

export const pb = new PocketBase("http://127.0.0.1:8090");

export function isAuthenticated(): boolean {
	const cookieStore = cookies();
	const authCookie = cookieStore.get("pb_auth");
	if (!authCookie) {
		return false;
	}

	pb.authStore.loadFromCookie(authCookie?.value || "");
	return pb.authStore.isValid;
}

export function getUser(): AuthModel | undefined {
	const cookieStore = cookies();
	const authCookie = cookieStore.get("pb_auth");
	if (!authCookie) {
		return undefined;
	}

	pb.authStore.loadFromCookie(authCookie?.value || "");
	if (!pb.authStore.isValid) {
		return undefined;
	}

	return pb.authStore.model;
}

export function setAuthCookie(pb: PocketBase): void {
	cookies().set("pb_auth", pb.authStore.exportToCookie());
}
