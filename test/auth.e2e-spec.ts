import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

// If you open that file up, you're going to notice that the structure of this fi le looks very similar to the unit test files we already put together.
// OK, so with an end to end test, we are attempting to make sure that a wide swap or essentially a lot of different pieces of our application are working together and working as expected.

// So rather than trying to call one single method and make sure that that method does the right thing,
// we're going to instead create an entire copy or an entire instance of our application.
// We're then going to assign that instance to listen to traffic on some random port on your computer.
// Then inside of our test, we're going to make requests to that very temporary server that is listening to traffic.
// We can make one request. We can make five. We can make as many requests that running application as we want by writing out some code inside of our test.

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {

    // So during testing, we completely skip over the main doctor's file, no code inside the main.ts file is executed in any way.
    // Instead, our end to end test is importing the AppModule directly and then creating an app out of the AppModule.
    // We can see that very easily back inside of our before each statement.
    // So if you go back over to your code editor.

    // Here is the test file.
    // I'm going to go to the before each.
    // So right here is where we make use of the AppModule, we then create a nest application out of that
    // AppModule and then eventually tell that application to start up and start listening for traffic.
    // So during testing, we completely skip over the main.ts file and the configuration inside there that sets
    // up cookie session and the validation pipe.
    // So at present during testing, we have no concept of sessions and we have no concept of validating incoming
    // requests through the validation pipe just because that stuff does not get set up.

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = '122dbdb@akl.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'random112nfdnj' })
      .expect(201)
      .then((res: any) => {
        const { id, email } = res.body
        expect(id).toBeDefined()
        expect(email).toEqual(email)
      })
  });

  // (after applying env file for testing purpose)
  // So rather than writing out all this database deleting logic inside of every single before each, we're going to instead define a global before each.
  // So this will be one single before each statement that is going to run before every single test in every file of our end to end test suite.

  // {
  //   "moduleFileExtensions": ["js", "json", "ts"],
  //   "rootDir": ".",
  //   "testEnvironment": "node",
  //   "testRegex": ".e2e-spec.ts$",
  //   "transform": {
  //     "^.+\\.(t|j)s$": "ts-jest"
  //   },
  //   "setupFilesAfterEnv":["<rootDir>/setup.ts"] <- add this single line of code <- This defines a file that's going to be executed after all of our tests, or I should say, right before all of our tests are just about to be executed. So we are going to place this global before each inside the setup file.
  //                              ^The <rootDir> right here is pretty much a reference to our test directory. That's what the root dir is.
  // }

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'asdf@asdf.com'

    // Now, here's the gotcha whenever we sign up to the application, as you and I well know, because we
    // put together the authentication system. This request is going to respond with a cookie.
    // And that cookie is what is going to prove that we are signed in when we make a follow up request or application.
    // The library we are using to actually make the request is referred to as `superagent`, that's the name
    // of the library we're using here and that's in this request object that we're dealing with.
    // Unfortunately, `superagent` by default does not handle cookies for us.
    // So that means that when we get a cookie back from making this request, we need to temporarily store
    // that cookie inside this test right here and then send that cookie, along with our follow up request
    // to figure out who is currently logged in or who is currently making that request.

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201)
    
    const cookie = res.get('Set-Cookie')

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      
    expect(body.email).toEqual(email)
  })
  
});


