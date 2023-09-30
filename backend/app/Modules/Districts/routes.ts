import Route from "@ioc:Adonis/Core/Route";

Route.resource("/districts/", "DistrictsController");
Route.post("districts/getAllDistricts", "DistrictsController.getAllDistricts");
