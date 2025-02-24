# Teebay Technical Documentation

## Overview

Teebay is a fullstack application designed to allow users to seamlessly rent, buy, and sell products across various categories like electronics, furniture, and more. The application is built with modern technologies, ensuring scalability, maintainability, and a smooth user experience.

## Tech Stack

- **Backend:**

  - **Node.js (v22)**
  - **Express.js**
  - **GraphQL (Apollo Server)**
  - **Prisma (ORM for PostgreSQL)**
  - **PostgreSQL (Database)**
  - **Zod (Schema validation)**
  - **Dataloader (for GraphQL)**

- **Frontend:**
  - **TypeScript**
  - **Vite (for fast bundling)**
  - **React (v18)**
  - **Tailwind CSS**
  - **Headless UI (for accessible UI components)**

## Preliminary features

Here I built the login and signup features. This part has jwt secret token and hashed password features. That jwt token is used for every subsequent request. The signup form is validated both on the frontend and backend.

## Implementation Documentation

The multi page create product form was built using Zustand to store the user inputs across page renders. Zod was used for input validation. Approprite business logics were implemented for all CRUD operations. For example: an already bought product can not be deleted.

At the start up of the backend application the categories are seeded to the database via a startup job.

More details are available in the backend architecture part.

## Buy/Sell/Rent Product

For buying the business logic is simple. If the product is available and the user himself is not the owner the product is bought.

For renting, a lot of business logic is involved. Whether startDate and endDate makes sense. Whether the product is available for rent. A bought product can not be borrowed. All these logics are implemnted in the backend. And when an user makes a bad request the user is notified.

## Backend Architecture

The backend is built using TypeScript with the following general flow for handling requests:

1. **GraphQL Request Handling**:

   - When a client sends a GraphQL request, it is intercepted by a GraphQL resolver.
   - The resolver validates the payload using a **Zod schema**.
   - Upon successful validation, a service class is created and executed based on the request.
   - The service class may instantiate and call a **Dataloader** or **Repository class method** to retrieve the necessary data.
   - Dataloaders always call repository methods to fetch data, ensuring optimized database queries and preventing over-fetching.

2. **Zod Validation**:

   - Zod is used extensively for both server-side and client-side validation. For example, when processing user inputs, Zod ensures that the incoming data meets the expected format before passing it to the resolver.

   - This validation logic is applied in the backend when processing user data such as signup and create product forms.

## Frontend Architecture

The frontend leverages TypeScript, React, and Tailwind CSS for a streamlined and responsive UI. Here’s how the frontend works:

1. **Form Validation**:

   - Forms are validated using **Zod schemas** on the frontend as well.
   - If there are validation errors, the request is not sent to the backend until the user corrects the input.
   - **Example**: A signup form checks that all fields, including password and confirm password, meet the specified criteria (e.g., length, match).

2. **Apollo Client**:
   - After successful validation, the frontend sends the request to the backend using **Apollo Client**.
   - The result of the GraphQL request is then displayed to the user on the frontend.
   - Apollo Client handles caching, state management, and network requests seamlessly, ensuring that the user interface stays responsive and up-to-date.

## Development Practices

Throughout the development of Teebay, I frequently utilized language models like **ChatGPT** and **Claude** to assist with tasks and code generation. The LLMs were provided with specific instructions on what to do and which technologies to use.

For example, I asked ChatGPT to help complete a Zod schema for password validation. The model responded with a valid schema, ensuring the password contained a number and was at least six characters long.

## Conclusion

Teebay combines modern technologies such as GraphQL, Prisma, and Zod to create a seamless and scalable fullstack application. The app is designed to be highly maintainable, with clear separation of concerns between the frontend and backend, and optimized for a fast and responsive user experience.
