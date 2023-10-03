import Route from "@ioc:Adonis/Core/Route";

Route.resource("/districts/", "DistrictsController");
Route.post("districts/getAllDistricts", "DistrictsController.getAllDistricts");
Route.post("districts/createDistrict", "DistrictsController.createDistrict");
Route.post("districts/updateDistrict", "DistrictsController.updateDistrict");
Route.post("districts/getById", "DistrictsController.getById");
Route.post("districts/deleteDistrict", "DistrictsController.deleteDistrict");
Route.post("/districts/admins", "DistrictsController.getDistrictAdmins");
