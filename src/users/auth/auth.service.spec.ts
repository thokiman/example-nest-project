import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { User } from '../users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;


  //It's now for every test we write inside this file, we're going to first create the fake service, create our testing module and get an instance of these service.
  beforeEach(async () => {

    const users: User[] = []


    // 1. create a fake copy of the users service
    // (mock intelligent)
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email == email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999999), email, password } as User
        users.push(user)
        return Promise.resolve(user)
      }
    }


    // (manually get hash)
    // fakeUsersService = {
    //   find: () => Promise.resolve([]), // So we have to return a `promise` from find and create `promise` to resolve is a little helper function that creates a `promise` and then immediately resolves it with a given value in this case : [] empty array. 
    //   create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
    // }

    // 2. creating a module 
    // override We've then got the idea that we're kind of going to override the actual dependency of user service with FakeUsersService, fake object.
    const module = await Test.createTestingModule({
      providers: [
        // list of things we want to register in our testing DI container
        // So once we add these providers in or this list of classes, the DI container can then figure out how to create any instance we want.
        // Whenever we create an instance of one of those classes, the DI container will create instances of all the dependencies of that class as well.
        // So essentially the list of providers is a list of classes we want registered inside the dye container.
        AuthService,
        // So the first line right here is going to behave very similarly to how other classes we've taken a look out before are going to behave.
        // AuthService is going to tell the DI container that at some point in time we are going to want to create an instance of the service.
        // The DI container is going to take a look at that class and understand all that class's dependencies
        // when it looks at the service. Its going to understand by looking at that constructor argument that one of the dependencies of this class is the UsersService.
        // So that is business as usual. With the first entry in the provider's array.
        {
          // Where things get really interesting is the second element inside that array.
          // So this is an object that is going to slightly trick or kind of reroute the DI system is going to change
          // how different classes or different things get resolved whenever we ask for a copy of specifically the AuthService.

          // (list of all the other rules it has inside the container)
          provide: UsersService, // (this is rule to create instance at DI container !!!) The property name of `provide` means if anyone asks for UsersService.
          useValue: fakeUsersService // (this is rule to create instance at DI container !!!) So if anyone asks for UsersService, give them the `value` FakeUsersService .

          // This object, we can really kind of read it in plain English
          // , it says  `if anyone asks for a copy of the UsersService, then give them the value FakeUsersService`.
          // So that is what that object means.
        }
      ],
    }).compile()

    // 3. getting copy of AuthService 
    service = module.get(AuthService)
    //                          ^ So then we can start to think about what happens inside of DI container when we ask the container to
    //                          create an instance of AuthService.

    // Here's what goes on behind the scenes.
    // When we ask for a copy of the AuthService, the container is going to go find the AuthService and figure out
    // all the dependencies of that class.
    // So naturally at `first, oh, OK. to create a instance of the AuthService, I first need an instance of the UsersService.`
    // So the container then says, `how do I create a copy of the UsersService?` And it's going to take a look at a list of all the other rules it has inside the container.
    // There's going to find this rule right here, and that rule says `if anyone asks for the UsersService, if anyone asks for that thing, then just give them {find:()=>(), create:(email,password)=>{}} object, the object we created that has a find and create method on it.`

  })


  // Usually whenever we set up a testing suite, each `it` statement is going to try to test one aspect of our code inside this test.
  it('can create an instance of auth service', async () => {

    expect(service).toBeDefined()

  })

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf')

    expect(user.password).not.toEqual('asdf')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if user signs up with email that is in use', async () => {
    // (refactor)
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {

    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    // (refactor)
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
    //   ]);

    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });

  it('return a user if correct password is provided', async () => {
    // (manually get hash)
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { email: 'asdf@asdf.com', password: '2660e27b92c44abe.e0d3a9e67155472b9264c92d7e1f6b31db7082153824fd3b140e9a552de8d8f5' } as User,
    //   ]);
    //   const user = await service.signin('asdf@asdf.com','mypassword')
    //   expect(user).toBeDefined()

    // const user = await service.signup('asdf@asdf.com', 'mypassword')
    // console.log(user)

    // (mock intelligen)
    await service.signup('asdf@asdf.com', 'mypassword')
    const user = await service.signin('asdf@asdf.com', 'mypassword')

    expect(user).toBeDefined()

  })


})

