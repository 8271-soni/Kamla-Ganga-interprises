[README.md](https://github.com/user-attachments/files/33799635/README.md)
# Kamla Ganga Interprises Pvt. Ltd. — Company Website

A full production-ready website for an architecture, structural design and construction
consultancy — **CEO: Dolly Kumari**.

```
kamla-ganga/
├── frontend/     Static site (HTML5 / CSS3 / vanilla JS) — deploy anywhere
├── backend/      Node.js + Express + MongoDB REST API + Admin auth
└── README.md     (this file)
```

---

## 1. Frontend (the website itself)

**Stack:** plain HTML5, CSS3 and JavaScript (ES6+) — no build step required.

```
frontend/
├── index.html            Full one-page site: Home, About, Services, Software,
│                          2D/3D Design, Interior, Structural, Projects, Gallery,
│                          Cost Estimator, Client Requirement Form, Contact,
│                          Testimonials, FAQ, Footer
├── admin/index.html       Admin panel UI (login + dashboard mockup)
├── privacy-policy.html
├── terms.html
├── css/style.css          Design system (tokens, components, responsive rules)
├── js/script.js           All interactivity (nav, dark mode, reveal animation,
│                          tabs, filters, lightbox, testimonial slider, FAQ,
│                          cost estimator, form validation, search overlay)
├── robots.txt
└── sitemap.xml
```

### Run it locally
No build tools needed — it's static HTML/CSS/JS.
```bash
cd frontend
python3 -m http.server 5500
# open http://localhost:5500
```
Or just open `frontend/index.html` directly in a browser, or serve the folder with
VS Code's "Live Server" extension.

### Design system
- **Palette:** paper white, ink navy (`#0B1F3A`), near-black, brass gold (`#C9A227`) accent.
- **Type:** Fraunces (display serif), Manrope (body sans), JetBrains Mono (labels/data).
- **Signature motif:** a hand-drafted "blueprint" — hairline grids, corner registration
  marks and a self-drawing SVG elevation in the hero — tying the visual language back to
  architectural drafting.
- Fully responsive (desktop → tablet → mobile), dark mode toggle, scroll-reveal animation,
  and `prefers-reduced-motion` support baked in.

### Wiring the frontend to the backend
Forms currently submit locally (client-side validation + a demo success state) so the site
works standalone. To connect them to the real API, edit `js/script.js`:

```js
// inside the .js-validate submit handler, replace the console.log with:
const res = await fetch('http://localhost:5000/api/requirements', {
  method: 'POST',
  body: new FormData(form), // multipart — includes file uploads
});
```
Use `/api/contact` for the contact form and `/api/estimator/calculate` if you want the
estimator to use server-side (admin-editable) rates instead of the client-side defaults.

---

## 2. Backend (REST API)

**Stack:** Node.js, Express.js, MongoDB (Mongoose), JWT + bcrypt auth, Multer uploads,
express-validator, Nodemailer, Helmet, express-rate-limit, CORS.

```
backend/
├── server.js              App entry point
├── config/db.js            MongoDB connection
├── models/                 Mongoose schemas (User, Project, GalleryItem, Service,
│                            Testimonial, ClientRequirement, ContactMessage,
│                            EstimatorSetting, SiteInfo)
├── controllers/            Business logic per resource
├── routes/                 Express routers per resource
├── middleware/              auth.js (JWT), upload.js (Multer), errorHandler.js
├── utils/                  generateToken.js, sendEmail.js, seed.js
├── uploads/                 Uploaded plot images / drawings (served at /uploads)
└── .env.example             All required environment variables
```

### Install & run
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, SMTP_*, etc.
npm install
npm run seed               # creates the admin user + default services/settings
npm run dev                 # nodemon, http://localhost:5000
# or: npm start             # production
```

Requires a running MongoDB instance — either local (`mongodb://127.0.0.1:27017`) or a
free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended for deployment).

### API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Admin login → returns JWT |
| GET | `/api/auth/me` | ✔ | Current admin profile |
| POST | `/api/contact` | — | Submit contact form |
| GET | `/api/contact` | ✔ admin | List contact messages |
| PATCH | `/api/contact/:id/status` | ✔ admin | Update message status |
| POST | `/api/requirements` | — | Submit client requirement form (multipart, supports `plotImage` & `existingDrawing` files) |
| GET | `/api/requirements` | ✔ admin | List client enquiries |
| PATCH | `/api/requirements/:id/status` | ✔ admin | Update enquiry status |
| GET | `/api/projects?category=` | — | List projects (optional category filter) |
| GET | `/api/projects/:id` | — | Single project |
| POST | `/api/projects` | ✔ admin | Create project (multipart, `image` field) |
| PUT | `/api/projects/:id` | ✔ admin | Update project |
| DELETE | `/api/projects/:id` | ✔ admin | Delete project |
| GET | `/api/gallery?category=` | — | List gallery items |
| POST | `/api/gallery` | ✔ admin | Upload gallery item (multipart, `image` field) |
| DELETE | `/api/gallery/:id` | ✔ admin | Delete gallery item |
| GET | `/api/services` | — | List services |
| POST/PUT/DELETE | `/api/services` | ✔ admin | Manage services |
| GET | `/api/testimonials` | — | List approved testimonials |
| POST/PUT/DELETE | `/api/testimonials` | ✔ admin | Manage testimonials |
| GET | `/api/estimator/settings` | — | Current per-sq.ft rates |
| PUT | `/api/estimator/settings` | ✔ admin | Update rates |
| POST | `/api/estimator/calculate` | — | `{ plotSize, floors, quality }` → estimate |
| GET | `/api/site-info` | — | Public contact/company info |
| PUT | `/api/site-info` | ✔ admin | Update contact/company info |
| GET | `/api/dashboard/overview` | ✔ admin | KPI counts for admin dashboard |

All list responses: `{ success, count, data }`. Errors: `{ success: false, message }`.
Send the JWT from login as `Authorization: Bearer <token>` on protected routes.

### Security features included
- **Helmet** — secure HTTP headers
- **express-rate-limit** — 200 requests / 15 min per IP on all `/api` routes
- **CORS** — restricted to `CLIENT_URL` in production
- **bcrypt** — password hashing (configurable salt rounds)
- **JWT** — stateless admin auth, 7-day expiry by default
- **express-validator** — server-side validation on public form endpoints
- **Multer** file-type & size limits — JPG/PNG/WEBP/PDF only, 8MB default cap

---

## 3. Deployment

**Frontend:** any static host — Netlify, Vercel, GitHub Pages, or a plain Nginx/Apache
server. Just upload the contents of `frontend/`.

**Backend:**
1. Provision MongoDB Atlas (or any managed MongoDB) and copy the connection string into
   `MONGO_URI`.
2. Deploy `backend/` to Render, Railway, an EC2/VPS instance, or similar Node host.
3. Set all `.env` variables in your host's environment settings (never commit `.env`).
4. Run `npm run seed` once against the production database to create the admin account.
5. Point the frontend's `fetch()` calls (see §1) at your deployed API URL, and set
   `CLIENT_URL` in the backend `.env` to your deployed frontend URL for CORS.
6. Put a reverse proxy (Nginx) or your host's built-in HTTPS in front of the API in
   production; the API itself expects to sit behind TLS termination.

---

## 4. Admin Panel

`frontend/admin/index.html` is a self-contained login + dashboard UI. It currently runs in
demo mode (any credentials "log in" client-side). To make it live, point its login form at
`POST /api/auth/login`, store the returned JWT, and use it as the `Authorization` header on
the dashboard's `fetch()` calls to `/api/dashboard/overview`, `/api/requirements`, etc.

Default seeded admin credentials (change immediately after first login):
- Email: value of `ADMIN_EMAIL` in `.env`
- Password: value of `ADMIN_PASSWORD` in `.env`

---

## 5. Company Information (as configured on the site)

- **Company:** Kamla Ganga Interprises Pvt. Ltd.
- **CEO:** Dolly Kumari
- **Phone:** +91 97544 95131
- **Location:** Gaya, Bihar, India
