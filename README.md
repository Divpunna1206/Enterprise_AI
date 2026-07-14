
  # Design Product Experience

  This is a code bundle for Design Product Experience. The original project is available at https://www.figma.com/design/fjRQjUP2nWXogWl9FItFYf/Design-Product-Experience.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Ports and API configuration

  The frontend Vite app runs on `http://localhost:3000`.

  The backend API runs on `http://localhost:4000` and serves versioned routes from `http://localhost:4000/api/v1`.

  Set `VITE_API_BASE_URL=http://localhost:4000/api/v1` in the frontend `.env`.

  ## Local Super Admin Signup

  To enable the controlled first Super Admin signup flow locally, set these flags before starting the apps.

  Backend `.env`:

  ```env
  SUPER_ADMIN_SIGNUP_ENABLED=true
  ALLOW_ADDITIONAL_SUPER_ADMIN_SIGNUP=false
  ```

  Frontend `.env`:

  ```env
  VITE_SUPER_ADMIN_SIGNUP_ENABLED=true
  ```

  Then restart both applications.

  The signup page will be available at `/super-admin/signup`, and the login page will show the `Create platform administrator` entry point only when the frontend flag is enabled.

  After creating the first Super Admin, change both signup-enabled flags back to `false` and restart both applications again:

  Backend `.env`:

  ```env
  SUPER_ADMIN_SIGNUP_ENABLED=false
  ALLOW_ADDITIONAL_SUPER_ADMIN_SIGNUP=false
  ```

  Frontend `.env`:

  ```env
  VITE_SUPER_ADMIN_SIGNUP_ENABLED=false
  ```
  
