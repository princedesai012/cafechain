# ☕ CafeChain — Cafe Module Documentation (Polished)

## 📍 Overview

The **Cafe Module** is the central hub for our partner cafes, providing all the tools necessary for seamless integration into the CafeChain ecosystem. This module empowers cafe owners to manage their presence, engage with loyal customers, and drive growth.

Key functions include a streamlined onboarding process, secure customer point redemptions, powerful promotional tools, and access to actionable analytics.

---

## 🚀 Onboarding: From Registration to Dashboard

The journey for a new cafe is designed to be simple and secure.

1.  **Initial Registration**: A cafe owner signs up using their phone number and creates a password.
2.  **Profile Setup**: Upon first login, the owner is directed to a dedicated setup page. Here, they must fill in essential details like cafe name, location, and upload initial photos. This step is mandatory before accessing the main dashboard.
3.  **Admin Verification**: Once the profile is submitted, it enters a **pending verification** state. The CafeChain admin team reviews the submission and, within 24 hours, approves the cafe.
4.  **Activation**: After approval, the cafe becomes **Active**. It will now appear in the user app, and the owner gains full access to the Cafe Dashboard and all its features.

---

## 🖥️ The Cafe Dashboard: Your Control Center

The dashboard is the cafe owner's primary interface for managing all operations.

### **Key Features**

* **Analytics At-a-Glance**: The top of the dashboard features key performance indicators (KPIs) in clear, easy-to-read cards:
    * Today’s Customer Visits
    * Points Redeemed Today
    * Active Users This Week
    * Your Cafe's Leaderboard Rank

* **Secure Point Redemption**: A simple, three-step process to redeem a customer's points:
    1.  Enter the customer's phone number and the total bill amount.
    2.  Enter the number of points the customer wishes to redeem.
    3.  An OTP is sent to the **customer's registered email**, which they provide to you. Enter the OTP to securely complete the transaction.

* **Events & Promotions Hub**:
    * **Sliding Showcase**: On the dashboard homepage, a dynamic slider showcases currently active events and promotions.
    * **Manage Events**: A "View All" button leads to a full-screen view of all past and upcoming events.
    * **Create New Events**: An "Add Event" icon allows cafes to easily create new promotions, complete with titles, offers, and a direct **WhatsApp integration** link (e.g., `wa.me/...`) for customer inquiries.

* **Paid Advertising**:
    * To boost visibility, cafes can run paid ads on the CafeChain platform.
    * To initiate an ad campaign, owners can contact our support team directly via a dedicated WhatsApp link in this section.

* **Profile & Gallery Management**:
    * Easily update core cafe information like location, branding, and contact details.
    * Upload multiple high-quality images to your cafe's gallery to attract more customers.

* **Customizable Reward Policies**:
    * Take control of your loyalty program. This section allows you to define how customers can redeem points at your cafe, offering flexibility beyond simple cashback.
    * **Examples**: Set a policy for "100 points = 1 Free Coffee" or "500 points = 50% off on the next bill."

* **Live Activity Log**:
    * View a real-time feed of all recent transactions, including point redemptions and verified OTPs.
    * Filter the log by **Today**, **This Week**, or **This Month** to track activity over time.

---

## Proposed API Endpoints (Technical Reference)

Here is a list of potential API endpoints that could power the features described above.

### **Authentication & Onboarding**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/cafe/register` | Initial registration with phone and password. |
| `POST` | `/api/cafe/login` | Log in and receive a JWT. |
| `POST` | `/api/cafe/verify-email-otp` | Second-factor authentication for sensitive actions. |
| `PUT` | `/api/cafe/setup-profile` | For the mandatory initial profile submission after registration. |
| `GET` | `/api/cafe/me` | Fetches the profile of the currently logged-in cafe. |

### **Profile & Media Management**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `PUT` | `/api/cafe/profile` | Update cafe info, location, branding, etc. |
| `POST` | `/api/cafe/gallery` | Upload one or more photos to the cafe gallery. |
| `DELETE` | `/api/cafe/gallery/:photoId` | Remove a specific photo from the gallery. |
| `PUT` | `/api/cafe/status` | Toggle the cafe's operational status (e.g., Open/Closed). |

### **Rewards & Redemption**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/cafe/redemption/initiate` | Generates and sends an OTP to the user's email. |
| `POST` | `/api/cafe/redemption/verify` | Verifies the OTP to complete the point redemption. |
| `PUT` | `/api/cafe/rewards/policy` | Create or update custom reward rules (e.g., redeem for items). |

### **Events & Promotions**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/cafe/events` | Create a new event or promotion with WhatsApp CTA. |
| `GET` | `/api/cafe/events` | Fetch all upcoming and past events for the cafe. |
| `PUT` | `/api/cafe/events/:eventId` | Update details of an existing event. |
| `GET` | `/api/cafe/ads/showcase` | Fetches the active ads/events for the dashboard slider. |

### **Analytics & Customer Data**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cafe/analytics/summary` | Retrieves the stats for the main dashboard cards. |
| `GET` | `/api/cafe/analytics/activity-log` | Gets the recent transaction history with date filters. |
| `GET` | `/api/cafe/leaderboard` | Fetches the leaderboard of customers for this specific cafe. |

---

## 🛡️ Security Measures

* **Multi-Factor Login**: Cafe login is secured with a password (JWT) and a one-time password (OTP) sent to the owner's registered email for critical actions.
* **Customer-Verified Redemption**: Points can only be deducted after the customer verifies the transaction via an OTP sent to their email.
* **Rate Limiting**: API endpoints for redemption are rate-limited to prevent fraudulent activity or spam.
* **Mandatory Admin Approval**: No cafe can go live on the platform without manual verification by a CafeChain administrator, ensuring the legitimacy of all partners.