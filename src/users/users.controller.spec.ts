import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {

    fakeUsersService = {
      findOne: (id: number) => Promise.resolve({ id, email: 'asdf@asdf.com', password: 'asdf' } as User),
      find: (email: string) => Promise.resolve([{ id: 1, email, password: 'asdf' } as User]),
      // update : (id:number, attrs:Partial<User>) => Promise.resolve({id, email:'asdf'}),
      // remove : () => {}
    }

    fakeAuthService = {
      // signup: ()=>{},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  // Quick reminder here !!!, 
  // whenever we are testing methods inside of a controller, we don't get the ability to run or make any use of the surrounding decorator's.
  // So we do not have the ability to make sure that something comes out the query string, or to make sure
  // that this is tied to a get request.
  // We are testing just the method by itself without any decorators present.
  // If you want to test the decorator's, then we have to write out an end to end test, which you'll recall is a very different kind of test.

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers return a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com')
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('asdf@asdf.com')
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and return user', async () => {
    const session = {userId: -10}
    const user = await controller.signin(
      {email:'asdf@asdf.com', password: 'asdf'},
      session
      )
      expect(user.id).toEqual(1)
      expect(session.userId).toEqual(1)
    })

  
});
