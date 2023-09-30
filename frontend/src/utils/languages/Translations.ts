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
  webmasterLabel: string;
  cityLabel: string;
  countryLabel: string;
  adminLabel: string;
  districtLabel: string;
  clubLabel: string;
  postalCodeLabel: string;
  aboutLabel: string;
  stateOrProvinceLabel: string;
  addressLabel: string;
  footerLabel: string;
  saveLabel: string;
  profileImageUploadLabel: string;
  adminLoginForm: {
    welcome: string;
    signIn: string;
    subHeading: string;
    successfulLogin: string;
  };
  phone: string;
  configFormLabels: {
    adminFullNam: string;
  };
  formErorrText: {
    required: string;
    emailFormat: string;
    minLength: string;
    noFilesUpload: string;
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
    logoTabLabel: string;
    configTabLabel: string;
    uploadFileH1Header: string;
    myProfileLabel: string;
  };
  uploadFileLabel: string;
  submit: string;
  logoutLabel: string;
  sessionTimeoutHeader: string;
  fileUploadLabelFormats: string;
  myRotaryProjectsLabel: string;
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
    phone: "Phone",
    webmasterLabel: "Web Admin",
    cityLabel: "City",
    countryLabel: "Country",
    adminLabel: "Admin",
    districtLabel: "District",
    clubLabel: "Club",
    postalCodeLabel: "Postal Code",
    aboutLabel: "About",
    stateOrProvinceLabel: "State/Province",
    addressLabel: "Address",
    footerLabel: "Footer",
    saveLabel: "Save",
    profileImageUploadLabel: "Upload Profile Image",
    configFormLabels: {
      adminFullNam: "Web Admin Full Name",
    },
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
      noFilesUpload: "Please upload file/files",
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
      logoTabLabel: "Logo",
      configTabLabel: "Configure Rotary",
      uploadFileH1Header: "Change Rotary Logo",
      myProfileLabel: "My Profile",
    },
    uploadFileLabel: "Upload File",
    submit: "Submit",
    logoutLabel: "Logout",
    sessionTimeoutHeader: "Session Timeout",
    fileUploadLabelFormats: "PNG, JPG or GIF (MAX. 10 GB).",
    myRotaryProjectsLabel: "MyRotaryProjects",
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
    phone: "Numéro de téléphone",
    webmasterLabel: "Web Admin",
    cityLabel: "Ville",
    countryLabel: "Pays",
    adminLabel: "Admin",
    districtLabel: "District",
    clubLabel: "Club",
    postalCodeLabel: "Code postal",
    aboutLabel: "À propos",
    stateOrProvinceLabel: "Etat/Province",
    addressLabel: "Adresse",
    footerLabel: "Footer",
    saveLabel: "Enregistrer",
    profileImageUploadLabel: "Télécharger le fichier de profil",
    configFormLabels: {
      adminFullNam: "Nom complet du Web Admin",
    },
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
      noFilesUpload: "Veuillez télécharger des fichiers",
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
      logoTabLabel: "Logo",
      configTabLabel: "Configurer le Rotary",
      uploadFileH1Header: "Changer le logo du Rotary",
      myProfileLabel: "Mon profil",
    },
    uploadFileLabel: "Télécharger le fichier",
    submit: "Soumettre",
    logoutLabel: "Se déconnecter",
    sessionTimeoutHeader: "Délai de session",
    fileUploadLabelFormats: "PNG, JPG ou GIF (MAX. 10 GB).",
    myRotaryProjectsLabel: "MyRotaryProjects",
  },
};
