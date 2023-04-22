import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../users.entity";

//So this is going to update or add in additional property to an existing interface,
declare global { 
    namespace Express { // go and find the express library,
        interface Request { //  find the interface called request inside there
            currentUser?: User // we're going to add in one more property to that interface. -> `?` We're going to say that in request object might have. So it's an optional a current user property.
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(
        private usersService: UsersService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.session || {}
        if (userId) {
            const user = await this.usersService.findOne(userId)
            
            req.currentUser = user
        }

        next()
    }
}