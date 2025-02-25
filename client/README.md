# Frontend Folder Structure and Guidelines

This document outlines the structure and best practices for managing the frontend files in this project. The goal is to maintain a clean, scalable, and organized codebase.

---

## Project Structure

The frontend folder (`/client`) will contain all files related to the client-side of the application. For each new route (path), you should create a corresponding folder with the required files. The basic structure looks like this:

```
/client
├── index.html  # Main entry point for the application
├── about/      # Folder for the "About" page
│   └── index.html
├── contact/    # Folder for the "Contact" page
│   └── index.html
└── assets/     # Shared static files (e.g., images, CSS, JS)
```

---

## Guidelines for Adding New Paths

1. **Create a Folder for Each Path**  
   For every new route in your application, create a folder under `/client` with the name of the path.  
   Example: For the `/about` route, create `/client/about/`.

2. **Add an `index.html` File**  
   Each folder must include an `index.html` file that serves as the entry point for the route.  
   Example:
   ```plaintext
   /client/about/index.html
   ```

3. **Organize Static Assets**  
   Shared static files like images, stylesheets, and scripts should be stored in the `/client/assets/` folder. Use subfolders for different types of assets.  
   Example:
   ```
   /client/assets
   ├── css/
   ├── images/
   └── js/
   ```

---

## Example

To create a new "Portfolio" page (`/portfolio`):
1. Create the folder:
   ```
   /client/portfolio/
   ```
2. Add an `index.html` file:
   ```
   /client/portfolio/index.html
   ```
3. If the page needs specific assets (e.g., styles or scripts):
   - Place them in `/client/assets/` with an appropriate folder structure.
   - Reference them in the `index.html` file using relative paths.

   Example `index.html` file:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Portfolio</title>
       <link rel="stylesheet" href="../assets/css/styles.css">
   </head>
   <body>
       <h1>Portfolio</h1>
       <p>Welcome to the portfolio page!</p>
       <script src="../assets/js/script.js"></script>
   </body>
   </html>
   ```

---

## Running the Frontend

To view the application:
1. cd to the client folder `cd client`
2. Run `npm install`
3. Run `npm run dev`
4. Open the route on console in your web browser

---

## Best Practices

- **Consistent Naming**: Use lowercase, hyphen-separated names for folders (e.g., `my-page/`).
- **Minimal Nesting**: Avoid deeply nested folder structures for simplicity.
- **Shared Components**: Place reusable components (e.g., headers, footers) in the `/client/assets/` folder or a dedicated `/client/components/` folder.

---

## Contact

For questions or issues, reach out to [your_email@example.com].