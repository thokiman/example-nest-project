import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// If you open that file up, you're going to notice that the structure of this fi le looks very similar to the unit test files we already put together.
// OK, so with an end to end test, we are attempting to make sure that a wide swap or essentially a lot of different pieces of our application are working together and working as expected.

// So rather than trying to call one single method and make sure that that method does the right thing,
// we're going to instead create an entire copy or an entire instance of our application.
// We're then going to assign that instance to listen to traffic on some random port on your computer.
// Then inside of our test, we're going to make requests to that very temporary server that is listening to traffic.
// We can make one request. We can make five. We can make as many requests that running application as we want by writing out some code inside of our test.

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  it('/ (GET)', () => {
    return request(app.getHttpServer()) // this test is always going to be us attempting to make a request app to our http server. -> we're first forming up a request.
      .get('/') // then going to chain on some different method calls that are going to customize that request -> And making a get method request to the root route
      .expect(200) // then eventually make an expectation around the response that comes back. -> and then expecting that we get back a status code of 200,
      .expect('Hello World!'); // then eventually make an expectation around the response that comes back. -> and in the body of the response, there should be a string of hello world.
  });
  
});
