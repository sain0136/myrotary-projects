import Route from "@ioc:Adonis/Core/Route";

Route.resource("/clubs/", "ClubsController");
Route.post("clubs/clubsInDistrict", "ClubsController.clubsInDistrict");
Route.post("clubs/getById", "ClubsController.getById");
Route.post("clubs/createClub", "ClubsController.createClub");
Route.post("clubs/updateClub", "ClubsController.updateClub");
Route.post("clubs/deleteClub", "ClubsController.deleteClub");
Route.post("clubs/getClubUsers", "ClubsController.getClubUsers");
