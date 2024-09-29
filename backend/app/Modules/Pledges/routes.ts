import Route from "@ioc:Adonis/Core/Route";

Route.post("/pledge/store", "PledgesController.storePledge");
Route.post("/pledge/deletePledge", "PledgesController.deletePledge");
Route.post(
  "/pledge/getPledgesByProject",
  "PledgesController.getPledgesByProject"
);
