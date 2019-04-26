import express from 'express'
import axios from 'axios'

const router = express.Router()

const app = express()

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.post("/course", (req, res) => {
  console.log("Course:", req.body.data)
  res.status(200).json({
    message: "Success!"
  })
})

router.get("/courses", async (req, res) => {

  const response = {
    courses: [],
    lessons: []
  }

  let [courses, lessons] = await Promise.all([
    axios.get('/courses.json'),
    axios.get('/lessons.json')
  ])

  // Convert firebase objects into array data
  for (const key in courses.data) {
    response.courses.push(courses.data[key])
  }

  for (const key in lessons.data) {
    response.lessons.push(lessons.data[key])
  }

  res.status(200).json(response)
})

router.post("/lessons", (req, res) => {
  console.log("Lessons:", req.body.data)
  res.status(200).json({
    message: "Success!"
  })
})

router.post("/user-state", (req, res) => {
  console.log("User State", req.body.data)
  res.status(200).json({
    message: "Success!"
  })
})

export default {
  path: '/api',
  handler: router
}