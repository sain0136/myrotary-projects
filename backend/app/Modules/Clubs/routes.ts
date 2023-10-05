import Route from "@ioc:Adonis/Core/Route";

Route.resource("/clubs/", "ClubsController");
Route.post("clubs/clubsInDistrict", "ClubsController.clubsInDistrict");
