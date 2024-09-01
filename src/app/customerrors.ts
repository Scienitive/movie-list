export class DatabaseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DatabaseError";
	}
}

export class NotAuthenticatedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotAuthenticated";
	}
}

export class TypeValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "TypeValidation";
	}
}

export class WrongLoginError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "WrongLogin";
	}
}

export class EmailAlreadyExistsError extends Error {
	constructor(message: string = "Email is already in use.") {
		super(message);
		this.name = "EmailAlreadyExists";
		this.cause = "101";
	}
}

export class UsernameAlreadyExistsError extends Error {
	constructor(message: string = "Username is already in use.") {
		super(message);
		this.name = "UsernameAlreadyExists";
	}
}
