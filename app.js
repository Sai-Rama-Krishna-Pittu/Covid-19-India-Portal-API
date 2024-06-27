const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const app = express()
const jwt = require('jsonwebtoken')
const dbpath = path.join(__dirname, 'covid19IndiaPortal.db')
let db = null
app.use(express.json())

const initializeDataBaseAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running...')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
  }
}

initializeDataBaseAndServer()

// auth middleware
const authenticateUser = (request, response, next) => {
  const authTokenBody = request.headers['authorization']
  
  if (authTokenBody !== undefined) {
    const authToken = authTokenBody.split(' ')[1]
    const verifyToken = jwt.verify(
      authToken,
      'sairamakrishna',
      (error, payload) => {
        if (error) {
          response.status(401)
          response.send('Invalid JWT Token')
        } else {
          console.log(request.body)
          next()
        }
      },
    )
  } else {
    response.status(401)
    response.send('Invalid JWT Token')
  }
}

//API 0
app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const getUserDetailsQuery = `
  select *
  from
    user
  where
    username = '${username}'; `
  const userdetails = await db.get(getUserDetailsQuery)
  if (userdetails !== undefined) {
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userdetails.password,
    )
    if (isPasswordCorrect) {
      const payload = {username: username}
      const jwtToken = jwt.sign(payload, 'sairamakrishna')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  } else {
    response.status(400)
    response.send('Invalid user')
  }
})

//API 1
app.get('/states/', authenticateUser, async (request, response) => {
  const getStateDetailsQuery = `
    SELECT
      state_id as stateId,
      state_name as stateName,
      population
    FROM
        state;`
  const stateList = await db.all(getStateDetailsQuery)
  response.send(stateList)
})

//API 2
app.get('/states/:stateId/', authenticateUser, async (request, response) => {
  const {stateId} = request.params
  const getStateByIdQuery = `
  SELECT 
    state_id as stateId,
    state_name as stateName,
    population
  FROM
    state
  WHERE
    state_id = ${stateId};`

  const stateDetails = await db.get(getStateByIdQuery)
  response.send(stateDetails)
})

//API 3
app.post('/districts/', authenticateUser, async (request, response) => {
  const {bodyDetails} = request.body
  const {districtName, stateId, cases, cured, active, deaths} = request.body
  const postDistrictQuery = `
  INSERT 
    INTO district (district_name, state_id, cases, cured, active, deaths)
  VALUES
    (
      '${districtName}', ${stateId}, ${cases}, ${cured}, ${active}, ${deaths}
    ) ;`

  const dbResponse = await db.run(postDistrictQuery)
  console.log(dbResponse.lastId)
  response.send('District Successfully Added')
})

//API 4
app.get(
  '/districts/:districtId/',
  authenticateUser,
  async (request, response) => {
    const {districtId} = request.params
    const getDestrictDetailsByIdQuery = `
  SELECT
    district_id as districtId,
    district_name as districtName,
    state_id as stateId,
    cases,
    cured,
    active,
    deaths
  FROM
    district
  WHERE
    district_id = ${districtId}; `
    const districtDetails = await db.get(getDestrictDetailsByIdQuery)
    response.send(districtDetails)
  },
)

//API 5
app.delete(
  '/districts/:districtId',
  authenticateUser,
  async (request, response) => {
    const {districtId} = request.params
    const deleteDistrictQuery = `
  DELETE FROM
    district
  WHERE
    district_id = ${districtId}; `
    await db.run(deleteDistrictQuery)
    response.send('District Removed')
  },
)

//API 6
app.put(
  '/districts/:districtId',
  authenticateUser,
  async (request, response) => {
    const {districtId} = request.params
    const {districtName, stateId, cases, cured, active, deaths} = request.body
    const updateDistrictDetailsQuery = `
  UPDATE 
    district
  SET 
    district_name = '${districtName}',
    state_id = ${stateId},
    cases = ${cases},
    cured = ${cured},
    active = ${active},
    deaths = ${deaths}
  WHERE
    district_id = ${districtId}`
    await db.run(updateDistrictDetailsQuery)
    response.send('District Details Updated')
  },
)

//API 7
app.get(
  '/states/:stateId/stats/',
  authenticateUser,
  async (request, response) => {
    const {stateId} = request.params
    const statsByStateIdQuery = `
  SELECT
    SUM(cases) as totalCases,
    SUM(cured) as totalCured,
    SUM(active) as totalActive,
    SUM(deaths) as totalDeaths
  FROM
    district
  WHERE
    state_id = ${stateId}; `
    const statsOfState = await db.all(statsByStateIdQuery)
    response.send(statsOfState[0])
  },
)

//API 8
app.get(
  '/districts/:districtId/details/',
  authenticateUser,
  async (request, response) => {
    const {districtId} = request.params
    const getdistrictStateQuery = `
  SELECT 
    state.state_name as stateName
  FROM district
    INNER JOIN state ON district.state_id = state.state_id
  WHERE
    district_id = ${districtId} ;`
    const stateName = await db.get(getdistrictStateQuery)
    response.send(stateName)
  },
)

module.exports = app
