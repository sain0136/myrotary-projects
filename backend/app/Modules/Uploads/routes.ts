import Route from "@ioc:Adonis/Core/Route";

Route.post("/uploads/test", "UploadsController.test");
Route.post("/uploads/delete", "UploadsController.delete");
Route.post("/uploadFiles", "UploadsController.uploadFiles");
