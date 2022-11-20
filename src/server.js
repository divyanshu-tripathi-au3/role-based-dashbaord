const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const userRoutes = require('./routes/user');
const DashboardRoute = require('./routes/DashboardRoute')
const MonitorBotsRoute = require('./routes/MonitorBotsRoute')
const cors = require('cors')
const app = express();

// body-parser setup

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Route configuration

app.get('/', (req, res) => res.send('Welcome to Support Dashboard'))
app.use("/api/user", userRoutes);
app.use("/api/dashboard", DashboardRoute);
app.use("/api/monitorbots", MonitorBotsRoute);

app.listen(config.PORT, () => console.log(`Server is running at http://localhost:${config.PORT}`))