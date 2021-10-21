import expect from 'ceylon';
import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response
import Request = httpclient.Request

class Todo {
  completed: boolean
  id: number
  title: string
  userId: number
}

(async () => {
  // Get a new client
  const client = httpclient.newHttpClient()
  // Build the request
  const request = new Request('https://jsonplaceholder.typicode.com/todos/1')
  // Execute the request and get the response body as a "Todo" object
  const todo = await client.execute<Todo>(request)
  expect(todo)
    .toExist()
    .toBeA('object')
  expect(todo.userId)
    .toBe(1)
})()
