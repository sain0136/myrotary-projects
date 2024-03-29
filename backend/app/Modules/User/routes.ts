import Route from "@ioc:Adonis/Core/Route";

Route.resource("/user/", "UsersController");
Route.post("user/authenticate/", "UsersController.authenticateUser");
Route.post("user/email/", "UsersController.emailIsUnique");
Route.post("user/logout/", "UsersController.logout");
Route.post("user/create/", "UsersController.createUser");
Route.post("user/update/", "UsersController.updateUser");
Route.post("user/getuser/", "UsersController.getUser");
Route.post("user/delete/", "UsersController.deleteUser");
