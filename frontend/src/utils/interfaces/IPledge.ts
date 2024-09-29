export interface IPledge {
  pledge_amount: number | string;
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  phone: string;
  district_number: string;
  club_name: string;
  user_id: number;
  project_id: number;
  pledge_id?: number;
}
