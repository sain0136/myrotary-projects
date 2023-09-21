import Route from "@ioc:Adonis/Core/Route";

Route.resource("/user/", "UsersController");
Route.post("user/authenticate/", "UsersController.authenticateUser");
Route.post("user/email/", "UsersController.emailIsUnique");
Route.post("user/logout/", "UsersController.logout");
