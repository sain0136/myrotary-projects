import type { IContact } from "../interfaces/IContact";

export default class Contact implements IContact {
    firstname = "";
    lastname = "";
    user_city = "";
    user_province = "";
    user_country = "";
    phone = "";
    email = "";
    query = "";

    constructor() {}
}