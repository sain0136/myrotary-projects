import Route from "@ioc:Adonis/Core/Route";

Route.resource("/assets/", "AssetsController");
Route.post("assets/update", "AssetsController.updateAssets");
