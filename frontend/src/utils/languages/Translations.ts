export interface Translation {
  welcome: string;
  goodbye: string;
  english: string;
  french: string;
  toastError: string;
  toastSuccess: string;
  toastWarning: string;
  toastInfo: string;
  notfoundText: string;
  home: string;
  contactUs: string;
  opps: string;
  email: string;
  password: string;
  adminLoginForm: {
    welcome: string;
    signIn: string;
    subHeading: string;
    successfulLogin: string;
  };
  formErorrText: {
    required: string;
    emailFormat: string;
    minLength: string;
  };
  adminDash: {
    footerCopyright: string;
    welcomeH1: string;
    welcomeH2: string;
    profile: string;
    headerDashboard: string;
    districtLabel: string;
    clubLabel: string;
    settingsLabel: string;
  };
}

export const translations: Record<string, Translation> = {
  en: {
    welcome: "Welcome!",
    goodbye: "Goodbye!",
    english: "English",
    french: "French",
    toastError: "Error occurred",
    toastSuccess: "Operation successful",
    toastWarning: "Warning",
    toastInfo: "Information",
    notfoundText: "The page you are looking for couldn’t be found",
    home: "Home",
    contactUs: "Contact Us",
    opps: "Opps!",
    email: "Email",
    password: "Password",
    adminLoginForm: {
      welcome: "Welcome Back",
      signIn: "Sign In",
      subHeading: "Rotary Administration awaits you",
      successfulLogin: "Access Granted. Welcome Back Peter Labelle!",
    },
    formErorrText: {
      required: "This field is required",
      emailFormat: "Please enter a valid email",
      minLength: "Minimum length is 6 characters",
    },
    adminDash: {
      footerCopyright: "Copyright ©",
      welcomeH1: "Welcome to the Admin Dashboard",
      welcomeH2:
        "Use this dashboard to manage the MyRotaryProjects web application",
      profile: "Profile",
      headerDashboard: "Admin Dashboard",
      districtLabel: "Districts",
      clubLabel: "Clubs",
      settingsLabel: "Settings",
    },
  },
  fr: {
    welcome: "Bienvenue!",
    goodbye: "Au revoir!",
    english: "Anglais",
    french: "Français",
    toastError: "Une erreur s'est produite",
    toastSuccess: "Opération réussie",
    toastWarning: "Avertissement",
    toastInfo: "Information",
    notfoundText: "La page que vous cherchez n'a pas pu être trouvée",
    home: "Accueil",
    contactUs: "Contactez-nous",
    opps: "Opps!",
    email: "Email",
    password: "Mot de passe",
    adminLoginForm: {
      welcome: "Bienvenue de nouveau",
      signIn: "Se connecter",
      subHeading: "Administration du Rotary vous attend",
      successfulLogin: "Accès autorisé. Bienvenue de nouveau Peter Labelle!",
    },
    formErorrText: {
      required: "Ce champ est obligatoire",
      emailFormat: "Veuillez entrer un email valide",
      minLength: "La longueur minimale est de 6 caractères",
    },
    adminDash: {
      footerCopyright: "Copyright ©",
      welcomeH1: "Bienvenue sur le tableau de bord",
      welcomeH2:
        "Utilisez ce tableau de bord pour gérer l'application MyRotaryProjects",
      profile: "Profil",
      headerDashboard: "Tableau de bord",
      districtLabel: "Districts",
      clubLabel: "Club",
      settingsLabel: "Paramètres",
    },
  },
};
