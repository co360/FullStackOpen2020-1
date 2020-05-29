const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./config')
// const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blog_router = require('./controllers/blogs')
// const Blog = require('./models/blog')

const mongoUrl = `mongodb://${config.MONGO_URL}:${config.MONGO_PORT}/${config.MONGO_DB}`
const mongoose_opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}

mongoose.connect(mongoUrl, mongoose_opts)

app.use(cors())
app.use(express.json())
app.use(middleware.log_request)

app.use('/api/blogs', blog_router)

app.use(middleware.blackhole_endpoint)
app.use(middleware.error_handler)

module.exports = app