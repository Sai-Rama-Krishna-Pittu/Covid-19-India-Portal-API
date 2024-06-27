# Covid-19 India Portal

This project implements a backend service for a Covid-19 tracking portal in India. The service provides APIs for managing and retrieving data related to states and districts, with authentication required for all operations. The backend is built using Node.js, Express, and SQLite.

## Database Schema

### State Table

| Column     | Type    |
| ---------- | ------- |
| state_id   | INTEGER |
| state_name | TEXT    |
| population | INTEGER |

### District Table

| Column        | Type    |
| ------------- | ------- |
| district_id   | INTEGER |
| district_name | TEXT    |
| state_id      | INTEGER |
| cases         | INTEGER |
| cured         | INTEGER |
| active        | INTEGER |
| deaths        | INTEGER |

### User Table

Contains user credentials for authentication.

## API Endpoints

### Authentication

#### Login

**Path:** `/login/`

**Method:** `POST`

**Request:**
```json
{
  "username": "christopher_phillips",
  "password": "christy@123"
}
```

**Responses:**
- **Invalid User**
  - **Status Code:** 400
  - **Body:** `Invalid user`
- **Invalid Password**
  - **Status Code:** 400
  - **Body:** `Invalid password`
- **Successful Login**
  - **Status Code:** 200
  - **Body:**
    ```json
    {
      "jwtToken": "ak2284ns8Di32......"
    }
    ```

### States

#### Get All States

**Path:** `/states/`

**Method:** `GET`

**Response:**
```json
[
  {
    "stateId": 1,
    "stateName": "Andaman and Nicobar Islands",
    "population": 380581
  },
  ...
]
```

#### Get State by ID

**Path:** `/states/:stateId/`

**Method:** `GET`

**Response:**
```json
{
  "stateId": 8,
  "stateName": "Delhi",
  "population": 16787941
}
```

### Districts

#### Create District

**Path:** `/districts/`

**Method:** `POST`

**Request:**
```json
{
  "districtName": "Bagalkot",
  "stateId": 3,
  "cases": 2323,
  "cured": 2000,
  "active": 315,
  "deaths": 8
}
```

**Response:**
```
District Successfully Added
```

#### Get District by ID

**Path:** `/districts/:districtId/`

**Method:** `GET`

**Response:**
```json
{
  "districtId": 322,
  "districtName": "Palakkad",
  "stateId": 17,
  "cases": 61558,
  "cured": 59276,
  "active": 2095,
  "deaths": 177
}
```

#### Delete District

**Path:** `/districts/:districtId/`

**Method:** `DELETE`

**Response:**
```
District Removed
```

#### Update District

**Path:** `/districts/:districtId/`

**Method:** `PUT`

**Request:**
```json
{
  "districtName": "Nadia",
  "stateId": 3,
  "cases": 9628,
  "cured": 6524,
  "active": 3000,
  "deaths": 104
}
```

**Response:**
```
District Details Updated
```

### State Statistics

#### Get State Statistics

**Path:** `/states/:stateId/stats/`

**Method:** `GET`

**Response:**
```json
{
  "totalCases": 724355,
  "totalCured": 615324,
  "totalActive": 99254,
  "totalDeaths": 9777
}
```

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd covid19-india-portal
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Usage

- Ensure you have the `covid19IndiaPortal.db` SQLite database set up with the `state`, `district`, and `user` tables.
- Use a tool like Postman to interact with the APIs.
- Make sure to include the JWT token in the `Authorization` header for all requests requiring authentication.

## Technologies Used

- Node.js
- Express.js
- SQLite

**Export the express instance using the default export syntax.**
**Use Common JS module syntax.**

## License

This project is licensed under the MIT License.
