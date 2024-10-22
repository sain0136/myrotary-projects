import Route from "@ioc:Adonis/Core/Route";

Route.post("webhooks/stripe", "StripesController.store");
Route.post("stripeRegistration", "StripesController.stripeRegistration");