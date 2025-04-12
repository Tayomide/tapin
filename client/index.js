const https = require("https")
const fs = require('fs')
const express = require('express')
const path = require('path')
const axios = require('axios')
const cookieParser = require("cookie-parser");
const uap = require('ua-parser-js');
const req = require("express/lib/request")
require('dotenv').config()
const app = express()
// TODO: Make this an env
const PORT = process.env.PORT || 3000
const CLIENT_ID = process.env.OAUTH_CLIENT_ID
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI
const FQDN = process.env.BACKEND_HOST


// Note: Nginx handles static assets in production
// Serve static assets under /assets
// if(process.env.NODE_ENV !== 'production')
app.use('/assets', express.static(path.join(__dirname, 'assets')))


app.use(cookieParser())

const sessionIsValid = async (session_token) => {
  // Example implementation: Check if session_token exists in cookies
  const result = await axios(`${FQDN}/is_logged_in`, {
    headers: {
      "Authorization": `Bearer ${session_token}`
    }
  })
  .then(res => res.data)
  .catch(err => err.response?.data)
  return !!result?.is_logged_in
}

const loginExceptions = new Set(["/login", "/auth/google", "/auth/callback"])

// Dynamic middleware to serve HTML files based on route structure
app.use(async (req, res, next) => {
  if(!loginExceptions.has(req.path)){
    if(!req.cookies?.session_token){
      return res.redirect("/login")
    }
    // Check if session is valid
    const sessionStatus = await sessionIsValid(req.cookies.session_token)
    if (!sessionStatus) {
      return res.redirect("/login")
    }
  }
  
  const filePath = path.join(__dirname, req.path, 'index.html')
  res.sendFile(filePath, (err) => {
    if (err) {
      next() // Move to the next middleware if the file isn't found
    }
  })
})
app.use(express.json())

// 1️⃣ Redirect to Google OAuth
app.get("/auth/google", (req, res) => {
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email&access_type=offline&prompt=consent`)
})

// 2️⃣ Handle Google OAuth Callback
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query

  const ua = uap(req.headers['user-agent']);


  if (!code) return res.status(400).json({ error: "No authorization code provided" })

  const deviceName = `${ua.browser.name} ${ua.os.name} ${ua.os.version} ${ua.cpu.architecture}`

  const session_response = await axios.get(FQDN + `/create-session/?code=${encodeURIComponent(code)}&device_name=${encodeURIComponent(deviceName)}`)
    .then(res => {
      return res.data
    })
    .catch(err => {
      console.log(err)
      return err.response?.data
    })

  if(session_response?.session_token){
    // Set cookies
    res.cookie("session_token", session_response.session_token, { httpOnly: true, sameSite: 'Strict', secure: true })
    res.send(`
      <script>
        window.location.href = "/training_complete"
      </script>
    `)

  }else{
    // Redirect to a page that says something like could not log in(try logging
    // in again or something like that)
    // Maybe use ejs to add the error messsage while redirecting? 
    res.send(`
      <script>
        window.location.href = "/"
      </script>
    `)
  }
})

app.post("/api", async (req, res) => {

  console.log(req.cookies)

  const result = await axios(FQDN, {
    headers: {
      "Authorization": `Bearer ${req.cookies?.session_token}`
    }
  })
  .then(res => res.data)
  .catch(err => err.response?.data)
  console.log(result)
  res.json({
    ...result,
    "message": "Arrest me but make it sexy"
  })
})

app.get("/api/sessions", async (req, res) => {
  const result = await axios(`${FQDN}/sessions`, {
    headers: {
      "Authorization": `Bearer ${req.cookies?.session_token}`
    }
  })
  .then(res => res.data)
  .catch(err => err.response?.data)
  console.log(result)
  const sessions = result?.sessions ?? []

  return res.json({
    "sessions": sessions
  })
})

app.delete("/api/session", async (req, res) => {
  console.log(req.body)
  const session_id = req.body?.session_id

  // TODO: Work on adding error and error_message
  if(!session_id)return res.json({
    "error": "No session id provided"
  })

  const result = await axios(`${FQDN}/session`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${req.cookies?.session_token}`,
      "Content-Type": "application/json"
    },
    data: {
      session_id: session_id
    }
  })
  .then(res => res.data)
  .catch(err => err.response?.data)
  console.log(result)

  if(!result.deleted){
    return res.json({
      "error": `Could not delete session with session id: ${session_id}`
    })
  }

  return res.json({
    "message": `Session with session id: ${session_id} has been deleted`,
    "deleted": true
  })

})

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send('Page not found')
})

ssl_folder = '/workspace/ssl'

if (fs.existsSync("/workspace/ssl") && fs.lstatSync("/workspace/ssl").isDirectory()) {
  const options = {
    key: fs.readFileSync('/workspace/ssl/devcontainer.key'),
    cert: fs.readFileSync('/workspace/ssl/devcontainer.crt'),
  }
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`)
  })
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}
