# Gym mates Server

This document provides an overview of the GymMates API, including its endpoints, request and response formats, and examples for common operations.

## Installation

To install the GymMates API, follow these steps:

1. Clone the repository:
	 ```bash
	 git clone
	 ````
2. Navigate to the project directory:
	 ```bash
	 cd gym-mates
	 ```
3. Install the dependencies:
	 ```bash
	 npm install
	 ```
4. Start the server:
	 ```bash
	 npm run dev
	 ```
5. The API will be available at `http://localhost:${PORT}/${API_PREFIX}`. Check .dev.env to set the PORT and API_PREFIX variables.

## Structure
The GymMates API is structured into several modules, each responsible for different functionalities:

- **Auth**: Handles user authentication and authorization.
- **Users**: Manages user profiles and related operations.
- **Crews**: Manages gym crews, including creation, updates, and member management
- **Workouts**: Manages workout routines and exercises.
- **Healthy**: Manages users healthy habits and nutrition.
- **Notifications**: Handles user notifications and alerts.
- **Journey**: Manages user journeys and progress tracking.

### Endpoints

Check the `types/generics/endpoints.model.ts` file for a complete list of endpoints and their descriptions.

### GraphQL

The GymMates API also supports GraphQL for more flexible queries and mutations. You can access the GraphQL endpoint at `http://localhost:${PORT}/${API_PREFIX}/graphql`.