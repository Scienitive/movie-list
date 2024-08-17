class DatabaseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DatabaseError";
	}
}

class NotAuthenticatedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotAuthenticated";
	}
}
