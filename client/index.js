const https = require("https")
const fs = require('fs')
const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()
// TODO: Make this an env
const PORT = process.env.PORT || 3000
const CLIENT_ID = process.env.OAUTH_CLIENT_ID
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI
const FQDN = process.env.FQDN

// Note: Nginx handles static assets in production
// Serve static assets under /assets
// if(process.env.NODE_ENV !== 'production')
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// Dynamic middleware to serve HTML files based on route structure
app.use((req, res, next) => {
  const filePath = path.join(__dirname, req.path, 'index.html')
  res.sendFile(filePath, (err) => {
    if (err) {
      next() // Move to the next middleware if the file isn't found
    }
  })
})

// 1️⃣ Redirect to Google OAuth
app.get("/auth/google", (req, res) => {
  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email&access_type=offline&prompt=consent`
  res.redirect(googleAuthURL)
})

// 2️⃣ Handle Google OAuth Callback
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query

  if (!code) return res.status(400).json({ error: "No authorization code provided" })

  const result = await fetch(`${FQDN}`)
  const response = result.json()
  console.log(response)

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },

      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      }) 
    }).then(res => res.json())
    
    const { access_token, expires_in, id_token, refresh_token} = tokenResponse
    console.log(tokenResponse)

    res.send(`
      <script>
        localStorage.setItem("access_token", "${access_token}")
        localStorage.setItem("id_token", "${id_token}")
        window.location.href = "/training_complete"
      </script>
    `)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to exchange token" })
  }
})

// Default route for root index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
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
