# YOKO Clothing Store — starter prototype

A mobile-first React/Vite storefront inspired by the supplied mobile shopping UI template.

## Included in this prototype
- YOKO clothing storefront, product cards, search, category filters, sorting
- Product detail drawer with size selection and quantity
- Wishlist and shopping bag
- Demo checkout with shop pickup / home delivery and cash-on-delivery / pay-at-pickup options
- Demo order confirmation
- Demo owner dashboard to add products, update stock, delete products, and view orders
- Responsive layout for mobile and desktop

## Run locally
1. Install Node.js on a computer or open a cloud development environment that supports Node.js.
2. Upload/extract this folder into your workspace.
3. Run `npm install`
4. Run `npm run dev`
5. Open the preview URL shown by Vite.

## Important before launching for real customers
This is a **front-end prototype**, not a production-ready store. Product data, cart, wishlist, and demo orders live only in browser memory and reset on refresh. The owner sign-in is deliberately a demo and is **not secure**. Do not publish the demo admin as a real private dashboard.

To launch securely, connect:
- Supabase database and Row Level Security for products, variants, inventory, profiles and orders
- Supabase Auth and server-verified owner-role checks for the admin dashboard
- Server-side order creation and stock validation
- A payment provider such as Razorpay/Cashfree for online payments; never collect or store card details yourself
- Real delivery/pickup settings, privacy policy, return policy and contact information

Replace the sample Unsplash product photos with your own product photography and update the contact email before launch.
