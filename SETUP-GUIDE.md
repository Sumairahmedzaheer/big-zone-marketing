# Bigzone Marketing: website and admin panel guide

This guide covers three things:

1. Trying the admin panel right now in demo mode
2. Putting the website online with your own login (about 20 to 30 minutes, one time)
3. Using the admin panel day to day

---

## 1. Try it now (demo mode)

1. Unzip `bigzone-website.zip` and open the `bigzone-website` folder.
2. Double-click `index.html` to see the website.
3. Open `admin.html` (or click any page and add `/admin.html` to the address) to see the admin panel.
4. Log in with the demo account:
   - **Email:** `admin@bigzonemarketing.com`
   - **Password:** `demo1234`

In demo mode everything works, but your changes are saved **only in that browser**. Other people won't see them. The demo login stops working once you connect your database in step 2.

---

## 2. Put the website online

You need two free accounts:

- **Supabase** stores your listings, posts and photos, and handles your admin login.
- **Netlify** or **Vercel** hosts the website files.

### Step A. Create your Supabase database

1. Go to **supabase.com** and sign up (you can use your Google account).
2. Click **New project**. Name it `bigzone`, choose a strong database password and save it somewhere safe. For the region, pick **Singapore** or **Mumbai** because they're closest to Pakistan. Click **Create**, then wait about 2 minutes.
3. In the left menu, open **SQL Editor** and click **New query**.
4. Open `supabase/setup.sql` from the website folder in Notepad. Find the line that says `CHANGE ME` and replace `admin@bigzonemarketing.com` with **the email you will log in with**.
5. Copy the whole file, paste it into the SQL Editor and click **Run**. You should see "Success. No rows returned".

### Step B. Create your admin login

1. In Supabase, open **Authentication → Users** and click **Add user → Create new user**.
2. Enter the **same email** you put in `setup.sql` and choose a password. Tick **Auto Confirm User**, then click **Create user**.
3. Recommended: open **Authentication → Sign In / Providers** and turn **off** "Allow new users to sign up". Only you can then create logins.

> Only emails listed in the `admins` table can change anything, even if someone else manages to create an account.

### Step C. Connect the website to Supabase

1. In Supabase, open **Project Settings → API** (on newer dashboards this is **Project Settings → Data API** and **API Keys**).
2. Copy the **Project URL** and the **anon public** key.
3. Open `js/config.js` from the website folder in Notepad and paste them between the quotes:

```js
window.BIGZONE_CONFIG = {
  supabaseUrl: "https://abcdefgh.supabase.co",
  supabaseAnonKey: "eyJhbGciOi...your long anon key...",
};
```

4. Save the file. The anon key is safe to publish because the database security rules protect your data. **Never** paste the `service_role` key here.

If you are updating an existing Supabase database for Karachi area categories and project prices, open `supabase/setup.sql` in SQL Editor and run the updated script once. It adds missing columns without deleting existing listings or projects.

### Step D. Put the website online

**Option 1: Netlify (easiest, drag and drop)**

1. Go to **app.netlify.com/drop** and sign up.
2. Drag the whole `bigzone-website` folder onto the page.
3. You get a link like `https://bigzone-xyz.netlify.app` right away. Your site is live.
4. To update the files later, open your site in Netlify, go to **Deploys** and drag the folder in again. You don't need to do this for new listings or posts, because those come from the admin panel.

**Option 2: Vercel**

1. Sign up at **vercel.com** with a GitHub account.
2. Upload the `bigzone-website` folder to a new GitHub repository, then in Vercel choose **Add New → Project** and import that repository. You don't need any build settings.

### Step E. Use your own domain (bigzonemarketing.com)

In Netlify (**Domain management**) or Vercel (**Settings → Domains**), add `bigzonemarketing.com` and `www.bigzonemarketing.com`. Then follow the instructions shown there to update the DNS records at the company you bought the domain from.

Next, go back to Supabase **Authentication → URL Configuration** and set **Site URL** to `https://www.bigzonemarketing.com`. This makes password reset emails link back to your site.

---

## 3. Using the admin panel

**Admin login link:** `https://www.bigzonemarketing.com/admin` (or `/admin.html`).
Log in with the email and password you created in Step B. If you forget your password, type your email and click **Forgot password?**, and Supabase will email you a reset link.

### Dashboard
Shows how many listings, projects and posts you have, with quick **Add** buttons.

### Listings (properties)
- Click **＋ Add listing** and fill in the title, Sale or Rent, type, price, city, area, size, bedrooms and bathrooms.
- **Price** is the full amount in rupees, for example `58000000`. The panel shows "= PKR 5.8 Crore" under the box so you can check it. For rentals, enter the monthly rent.
- **Photos:** click **Upload photos** and select one or more pictures from your phone or computer. The first photo is the cover. Click ★ on another photo to make it the cover, or × to remove it. You can also paste an image link.
- **Video link:** paste a YouTube or Facebook video link to show a "Watch video tour" button.
- **Featured:** tick this to show the listing first on the home page.
- **Status:**
  - *Published* shows the listing on the website.
  - *Draft* hides it while you're still working on it.
  - *Sold / Rented* keeps it visible with a red "Sold" label. It doesn't appear on the home page.
- In the list, use **Edit**, **Publish/Unpublish**, **View** (opens it on the website) and **Delete**.

### Projects
Add housing societies or commercial projects with a cover photo, location, highlights (one per line) and an optional link to a brochure or video. Visitors can tap **Get Payment Plan** to send you a WhatsApp message.

### Posts (News & Updates)
Add news, booking announcements and tips with a photo, short summary, full text and an optional button link (for example, to a Facebook post). Leave an empty line between paragraphs. Any web address in the text becomes a clickable link automatically.

### Settings
Change your phone number, WhatsApp number, email, office address, office hours, social media links, the home page headline and About text, and the numbers shown on the home page. Upload the owner's portrait in **Owner photo**. Changes appear on the website right away.

Listings can be assigned a Karachi area category, and the area field also accepts a custom locality. Projects support an optional starting price and cover photo.

### Adding another admin
1. In Supabase **Authentication → Users**, add the new person's email and password.
2. In Supabase **Table Editor → admins**, click **Insert row** and enter the same email.

To remove an admin, delete their row from `admins`.

---

## Good to know

- **Photos:** phone photos are fine. The free Supabase plan includes 1 GB of photo storage, which is roughly 2,000 to 4,000 photos.
- **Free plan pause:** Supabase may pause a free project after about a week with no activity at all. A site with regular visitors stays active. If it ever pauses, log in to supabase.com and click **Restore**.
- **Enquiries** from the contact form and the property pages open WhatsApp with the message already filled in, so nothing is lost in an email inbox.
- **Changing the design or pages** means editing the files and uploading the folder again (Step D). **Listings, projects, posts and contact details** can all be changed from the admin panel without touching files.
