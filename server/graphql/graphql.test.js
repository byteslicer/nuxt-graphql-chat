import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import gql from 'graphql-tag';

import db from '@/server/db';
import graphql from './index';

jest.mock('~/server/jwt', () => ({}));

it('should fetch messages', async (done) => {
  const server = new ApolloServer({
    ...graphql,
    context: () => ({ user: { id: 1, email: 'a@a.a' } }),
  });

  const { query /* , mutate */ } = createTestClient(server);

  const res = await query({
    query: gql`{
      messages {
        id
        user {
          id
          name
        }
        content
        createdAt
     }
   }`,
  });

  expect(res.errors).not.toBeDefined();
  expect(res.data.messages).toBeDefined();
  done();
});

afterAll((done) => {
  db.destroy(done);
});
