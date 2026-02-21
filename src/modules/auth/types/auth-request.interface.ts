export class AuthenticatedUser {
    id: string;
    email: string;
    role: string;
}

// Extend the standard Express Request
export interface RequestWithUser extends Request {
    user: AuthenticatedUser;
}