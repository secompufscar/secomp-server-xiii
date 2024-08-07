import { UserDTO } from "../dtos/usersDtos"

declare global {
    namespace Express {
        export interface Request {
            user: Partial<User>
        }
    }
}