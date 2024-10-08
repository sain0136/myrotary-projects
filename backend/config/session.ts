/**
 * Config source: https://git.io/JeYHp
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from "@ioc:Adonis/Core/Env";
import Application from "@ioc:Adonis/Core/Application";
import { sessionConfig } from "@adonisjs/session/build/config";

export default sessionConfig({
  /*
  |--------------------------------------------------------------------------
  | Enable/Disable sessions
  |--------------------------------------------------------------------------
  |
  | Setting the following property to "false" will disable the session for the
  | entire application
  |
  */
  enabled: false,

  /*
  |--------------------------------------------------------------------------
  | Driver
  |--------------------------------------------------------------------------
  |
  | The session driver to use. You can choose between one of the following
  | drivers.
  |
  | - cookie (Uses signed cookies to store session values)
  | - file (Uses filesystem to store session values)
  | - redis (Uses redis. Make sure to install "@adonisjs/redis" as well)
  |
  | Note: Switching drivers will make existing sessions invalid.
  |
  */
  driver: Env.get("SESSION_DRIVER"),

  /*
  |--------------------------------------------------------------------------
  | Cookie name
  |--------------------------------------------------------------------------
  |
  | The name of the cookie that will hold the session id.
  |
  */
  cookieName: "rotary-projects",

  /*
  |--------------------------------------------------------------------------
  | Clear session when browser closes
  |--------------------------------------------------------------------------
  |
  | Whether or not you want to destroy the session when browser closes. Setting
  | this value to `true` will ignore the `age`.
  |
  */
  clearWithBrowser: false,

  /*
  |--------------------------------------------------------------------------
  | Session age
  |--------------------------------------------------------------------------
  |
  | The duration for which session stays active after no activity. A new HTTP
  | request to the server is considered as activity.
  |
  | The value can be a number in milliseconds or a string that must be valid
  | as per https://npmjs.org/package/ms package.
  |
  | Example: `2 days`, `2.5 hrs`, `1y`, `5s` and so on.
  | This is the age that matters for how long sessions are kept active.
  */
  age: "2.5 hrs",

  /*
  |--------------------------------------------------------------------------
  | Cookie values
  |--------------------------------------------------------------------------
  |
  | The cookie settings are used to setup the session id cookie and also the
  | driver will use the same values.
  |
  */

  // Remember, these settings are not recommended for a production environment due to security concerns. Always revert to more secure settings when deploying your application.

  /*Note:
   In a development environment, 
  it's generally acceptable to use SameSite:
  'strict' over HTTP for testing purposes. 
   Just be aware that this is not a secure configuration 
   for production, especially for 
   sensitive data or authentication cookies.
   Use firefox browser it allows more than chrome for development

  Here's what you need to know:

  First-Party Context: With SameSite: 'strict', cookies
  will only be sent in a first-party context, meaning 
  they are only sent when the domain in the browser matches 
  the domain setting the cookie.

  HTTP Support: Yes, SameSite: 'strict' will 
  work over HTTP in a development environment.
  However, it's crucial to switch to HTTPS for 
  production to ensure security. 
  */

  cookie: {
    path: "/", //Setting it to '/' means that the cookie will be sent for all paths on your domain. If you set it to '/admin', the cookie will only be sent when the requested URL starts with /admin.
    httpOnly: true,
    sameSite: false,
    secure: false,
    // sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
    // secure: process.env.NODE_ENV === "production",
    maxAge: "2.5 hrs",
  },

  /*
  |--------------------------------------------------------------------------
  | Configuration for the file driver
  |--------------------------------------------------------------------------
  |
  | The file driver needs absolute path to the directory in which sessions
  | must be stored.
  |
  */
  file: {
    location: Application.tmpPath("sessions"),
  },

  /*
  |--------------------------------------------------------------------------
  | Redis driver
  |--------------------------------------------------------------------------
  |
  | The redis connection you want session driver to use. The same connection
  | must be defined inside `config/redis.ts` file as well.
  |
  */
  redisConnection: "local",
});
