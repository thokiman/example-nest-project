import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto'; 
import { promisify } from 'util';

// FOLLOW THE COURSE CODE, DON'T ADD TYPE TO VARIABLE UNNECESSARY BECAUSE IT WILL MAKE GENERATED HASH DIFFERENT BETWEEN SIGN IN AND SIGN UP

// crypto -> is a part of node standard library to password
// randomBytes -> this is for generating salt by giving us random string and number also letter
// scrypt -> is a actual hashing function, this is gonna do heavy lifting the actual hashing of input password -> async in nature then we gonna use promise
// promisify -> this is another package from note standard libs -> promisfy take a function that make use of callback and give us back the exact same function but instead make use of promise -> we use promisfiy to  make our scrypt little bit callable so we can make promise rather than callback

// 1. the same string password is gonna always return the same hash output
// 2. different string password is gonna always return the different hash output
// 3. hashing process can't be undone or reversed to figure out the input 
//  -> ex : 
//          input pass : "mypass go" to hash and then output hash : "477.."
//          input pass : "477..." to hash process and then output hash : "ab2c..." (can't be unreversed !!!)
//          (You can't decode the original string "mypass" through hash process again instead do hash again from the orginal input "mypass" and check at db that has same if the hash of "mypass" is same!!!)

const scrypt = promisify(_scrypt) // only goal rename it is inside of promisify -> we are going to reference promise good base version of scrypt as very callable as scrypt      
// Buffer return 010101...
// toString('hex') return abdci101...
@Injectable()
export class AuthService {

    constructor(
        private usersService:UsersService
    ){}

    async signup(email:string, password:string){
        // 1. see if this email is already in use, if it is, return an error -> see if email in use
        const users = await this.usersService.find(email)
        if (users.length) {
            throw new BadRequestException('email in use')
        }
        // 2. encrypt the user passwords -> hash user password
        // 2.1 generate salt 
        const salt = randomBytes(8).toString('hex')
        
        // 2.2 hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer
        
        // 2.3 Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex'); 

        // 3. store the new user record -> create a new user and save it
        const user = await this.usersService.create(email, result)
        
        // 4. send back a cookie that contains the user's id -> return the user
        return user
    } 

    async signin(email:string, password:string){
        // 1. find the user with the particular email 
        const [user] = await this.usersService.find(email)
        if (!user) {
            throw new NotFoundException('user not found')
        }
        // 2. compare the password -> inside password format at database : salt.hash
        const [salt, storedHash] = user.password.split('.')
        const hash = (await scrypt(password, salt,32)) as Buffer
        
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password')
        } 

        return user
    }

}

