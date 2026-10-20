# Bigzone Marketing website

A static website with a browser-based admin panel. There's no build step: upload the folder to any static host.

- **How to log in, go live and use the admin panel:** see `SETUP-GUIDE.md`.
- **Database setup:** run `supabase/setup.sql` in Supabase.
- **Connection keys:** `js/config.js`. Leave them empty to use demo mode.

## Pages
| Page | What it is |
|---|---|
| `index.html` | Home: search, featured listings, cities, services, projects, about, news, contact |
| `properties.html` | All properties with search, filters and sorting |
| `property.html?id=…` | Property details with photo gallery and WhatsApp enquiry |
| `blog.html`, `post.html?id=…` | News and updates |
| `admin.html` (or `/admin`) | Admin panel for listings, projects, posts and settings |

## Code
- `js/store.js` is the data layer. It uses Supabase when `js/config.js` has keys, otherwise demo data saved in the browser.
- `js/layout.js` holds the shared header, footer and cards. `js/home.js`, `properties.js`, `property.js`, `blog.js` and `post.js` are the page scripts.
- `js/admin.js` and `css/admin.css` are the admin panel.
- `js/vendor/supabase.js` is the Supabase client (v2.45.4), included in the folder so it doesn't depend on a CDN.
- The `images/*.svg` files are placeholder pictures. Real photos are uploaded through the admin panel.
