# FeedForward 🌱
> **"Share More. Waste Less. Feed Forward."**

FeedForward is a modern, full-stack MERN (MongoDB, Express, React, Node.js) web application engineered to eliminate food waste. It connects restaurants, banquet halls, event organizers, and individual donors with orphanages, old-age homes, and charitable organizations through a verified, real-time volunteer courier network.

---

## 🌟 Key Capabilities & User Roles

FeedForward implements four distinct roles, each equipped with dedicated dashboards, custom permissions, and reactive workflows:

| Role | Primary Functions |
| :--- | :--- |
| **🍲 Donor** | List surplus food batches, specify servings & expiration deadlines, manage active donations, view assigned NGOs & couriers, review donation history. |
| **🚴 Volunteer** | Browse NGO food requests awaiting pickup, claim deliveries (with atomic race-condition safety), update transit status (`Picked Up` ➔ `Delivered`), view completed routes. |
| **🏢 NGO / Charity** | Browse available food listings with multi-faceted filtering (Vegetarian, Non-Veg, Vegan, Servings, City), request donations, track courier arrival, confirm food receipt to complete delivery cycle. |
| **👑 Admin** | Platform-wide monitoring, user management (activate/deactivate accounts), view all donations & deliveries, real-time analytics with Recharts (monthly rescued meals, category splits, lifecycle distribution). |

---

## 🔄 End-to-End Donation Lifecycle

```
[ Available ] ──(NGO Requests)──> [ Requested ] ──(Volunteer Claims)──> [ Assigned ]
                                                                             │
[ Completed ] <──(NGO Confirms Receipt)── [ Delivered ] <──(Volunteer Transit)── [ Picked Up ]
```

1. **Donation Creation**: Donor posts surplus food with quantity, preparation timestamp, pickup deadline, and instructions.
2. **NGO Request**: An authenticated NGO reviews available food and submits a request. A linked delivery record is generated.
3. **Volunteer Assignment**: A courier accepts the delivery. Atomic MongoDB updates ensure only one volunteer claims each package.
4. **Pickup & Transit**: The volunteer picks up the package from the donor and marks it as `Picked Up`.
5. **Delivery**: The volunteer transports the items to the NGO and marks it as `Delivered`.
6. **Confirmation**: The recipient organization inspects the food and clicks **Confirm Food Receipt**, successfully completing the loop.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 with Vite
  - Tailwind CSS with customized sustainability theme
  - React Router DOM v6
  - Axios with HTTP-only Cookie & Bearer token support
  - Lucide React icons
  - Recharts for dynamic charts
  - React Hot Toast for micro-feedback
  - Google Font: *Plus Jakarta Sans*
- **Backend**:
  - Node.js & Express.js
  - MongoDB Atlas with Mongoose schemas & indexes
  - JWT Authentication (stored in HTTP-only cookies + Bearer token header fallback)
  - bcryptjs password hashing
  - CORS with credential support
  - Cookie Parser & Dotenv

---

## 📁 Project Structure

```
mern/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, Sidebar, Cards, Badges, Modals, Skeletons)
│   │   ├── context/            # AuthContext (login, register, logout, profile)
│   │   ├── dashboards/         # DonorDashboard, VolunteerDashboard, NGODashboard, AdminDashboard
│   │   ├── pages/              # Home, BrowseFood, DonationDetails, Login, Register, NotFound
│   │   ├── services/           # Axios instance with interceptors
│   │   ├── App.jsx             # Route definitions & guards
│   │   ├── main.jsx            # Entry point & toast provider
│   │   └── index.css           # Tailwind base & custom styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (Mongoose connection)
│   ├── controllers/            # auth, donation, delivery, admin, stats
│   ├── middleware/             # authMiddleware, errorMiddleware
│   ├── models/                 # User.js, Donation.js, Delivery.js
│   ├── routes/                 # auth, donation, delivery, request, admin, stats
│   ├── scripts/                # seed.js (realistic demo data), createAdmin.js
│   ├── server.js               # Express application entrypoint
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or newer recommended, tested on v24)
- **npm** (v9 or newer)
- **MongoDB Atlas** connection string or local MongoDB instance

---

### 2. Environment Variables Configuration

#### Backend Configuration (`server/.env`)
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/feedforward?retryWrites=true&w=majority
JWT_SECRET=feedforward_super_secure_jwt_secret_key_2026_xyz
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend Configuration (`client/.env`)
Create `client/.env` (or copy from `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Installation Commands

In two separate terminal windows or sequentially:

#### Setup Server:
```bash
cd server
npm install
```

#### Setup Client:
```bash
cd client
npm install
```

---

### 4. Database Seeding

To populate the database with realistic sample users, multi-category food donations, and active deliveries:

```bash
cd server
npm run seed
```

> **Manual Admin Provisioning:**
> You can also create or promote an admin account via CLI:
> ```bash
> cd server
> npm run create-admin
> ```

---

### 5. Running the Application

#### Start the Backend Server:
```bash
cd server
npm run dev
# Server will run at http://localhost:5000
```

#### Start the Frontend Client:
```bash
cd client
npm run dev
# Frontend will run at http://localhost:5173
```

---

## 🔑 Demo Login Credentials

The seed script creates ready-to-test accounts for every role with pre-populated activity:

| Role | Email | Password | Organization / Notes |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@feedforward.org` | `Admin@12345` | FeedForward Platform Admin |
| **🍲 Donor** | `donor@greenbites.com` | `Donor@12345` | Green Bites Catering Co. |
| **🏢 NGO** | `care@hopeorphanage.org` | `Ngo@12345` | Hope Children Orphanage |
| **🚴 Volunteer** | `alex@volunteer.org` | `Volunteer@12345` | Community Courier Hero |

*(Tip: The Login page features quick 1-click autofill buttons to switch between accounts instantly during testing and demonstrations!)*

---

## ☁️ Connecting to MongoDB Atlas

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. Under **Database Access**, create a database user with Read/Write privileges.
3. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere).
4. Click **Connect** ➔ **Drivers** (Node.js) and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/feedforward?retryWrites=true&w=majority
   ```
5. Paste this string into `server/.env` as `MONGO_URI`.
6. Run `npm run seed` to initialize your Atlas cluster with complete sample data!

---

## 📡 Core API Endpoints

- **Auth**:
  - `POST /api/auth/register` - Create account with role-specific fields
  - `POST /api/auth/login` - Authenticate & set HTTP-only cookie
  - `POST /api/auth/logout` - Clear cookie
  - `GET /api/auth/me` - Retrieve current session user
  - `PUT /api/auth/profile` - Update profile & address details
- **Donations**:
  - `POST /api/donations` - Create new surplus donation (Donor only)
  - `GET /api/donations` - Public & NGO browse with filters (`status`, `category`, `city`, `minQuantity`, `search`)
  - `GET /api/donations/my` - Donor's active & historical listings
  - `GET /api/donations/:id` - Detailed view of single donation
  - `PUT /api/donations/:id` - Edit available donation
  - `DELETE /api/donations/:id` - Cancel available donation
  - `POST /api/donations/:id/request` - NGO requests available food
- **NGO Requests & Confirmation**:
  - `GET /api/requests/my` - NGO's requested & received foods
  - `PUT /api/requests/:id/cancel` - Cancel request prior to volunteer pickup
  - `PUT /api/deliveries/:id/confirm` - NGO confirms food receipt
- **Volunteer Logistics**:
  - `GET /api/deliveries/available` - Unassigned pickups requested by NGOs
  - `GET /api/deliveries/my` - Active runs & completed delivery history
  - `PUT /api/deliveries/:id/accept` - Claim pickup (atomic lock)
  - `PUT /api/deliveries/:id/pickup` - Mark as Picked Up
  - `PUT /api/deliveries/:id/deliver` - Mark as Delivered
- **Admin Control**:
  - `GET /api/admin/stats` - Platform metrics & Recharts analytics data
  - `GET /api/admin/users` - Directory with role filter & search
  - `PUT /api/admin/users/:id/status` - Activate or deactivate user
  - `GET /api/admin/donations` - Global donations monitor
  - `GET /api/admin/deliveries` - Global deliveries monitor
- **Public & Health**:
  - `GET /api/stats` - Public live metrics counter for landing page
  - `GET /api/health` - Health check & MongoDB state

---

## 📄 License
This project is open-source under the MIT License.
