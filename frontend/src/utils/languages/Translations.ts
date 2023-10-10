export interface Translation {
  clubForm: {
    clubFormHeader: string;
    disableDsgLabel: string;
    disableDmLabel: string;
    disableGlobalLabel: string;
  };
  clubsView: {
    clubMembersLabel: string;
    clubsLabel: string;
    choseDistrictForClubs: string;
    noClubsInDistrict: string;
  };
  resultLabel: string;
  allLabel: string;
  nextButtonLabel: string;
  prevButtonLabel: string;
  baseClubLabel: string;
  baseSelectLabel: string;
  roleLabel: string;
  districtFormHeader: string;
  userFormHeader: string;
  deleteLabel: string;
  editLabel: string;
  actionsLabel: string;
  nameLabel: string;
  districtLabel: string;
  createLabel: string;
  yesLabel: string;
  confirmationDelete: string;
  succssDeleteToast: string;
  desciptionLabel: string;
  settingsLabel: string;
  sourceLabel: string;
  addLabel: string;
  cancelLabel: string;
  userForm: {
    districtSelectLabel: string;
    firstNameLabel: string;
    lastNameLabel: string;
  };
  districtForm: {
    districtNameLabel: string;
    govLabel: string;
    submissionStartDateLabel: string;
    submissionEndDateLabel: string;
    dmCapLabel: string;
    dsgCapLabel: string;
    reqMinLength: string;
    numbMustBeFraction: string;
    fractionRateLabel: string;
    fundingSourcesCalcLabel: string;
    fundingListText: string;
  };
  districtView: {
    distictTabLabel: string;
    adminsTabLabel: string;
  };
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
    clubForm: {
      clubFormHeader: "Club Form",
      disableDsgLabel: "Disable District Simplified Projects",
      disableDmLabel: "Disable District Matching Projects",
      disableGlobalLabel: "Disable Global Projects",
    },
    clubsView: {
      clubMembersLabel: "Club Members",
      clubsLabel: "Clubs",
      choseDistrictForClubs: "Select a District for Club Listings",
      noClubsInDistrict: "No Clubs in District",
    },
    resultLabel: "Results",
    allLabel: "All",
    nextButtonLabel: "Next",
    prevButtonLabel: "Previous",
    baseClubLabel: "Base Club",
    baseSelectLabel: "Select...",
    userForm: {
      districtSelectLabel: "Assign to District",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
    },
    userFormHeader: "User Form",
    roleLabel: "Role",
    yesLabel: "Yes",
    confirmationDelete: "Are you sure you want to delete ",
    succssDeleteToast: "Deleted Successfully",
    settingsLabel: "Settings",
    desciptionLabel: "Description",
    sourceLabel: "Source",
    addLabel: "Add",
    cancelLabel: "Cancel",
    districtForm: {
      districtNameLabel: "District Number",
      govLabel: "District Governer",
      submissionStartDateLabel:
        "District Matching and District Simplified Grant Submission Start Date",
      submissionEndDateLabel:
        "District Matching and District Simplified Grant Submission End Date",
      dsgCapLabel: "District Simplified Grant Cap for DDF Matching",
      dmCapLabel: "District Matching Grant Cap for DDF Matching",
      reqMinLength: "This field cant be zero",
      numbMustBeFraction: "Number must be a fraction",
      fractionRateLabel: "Set the fraction/rate to the USD to match funds",
      fundingSourcesCalcLabel:
        "Set the funding sources calculation for this district DDF limit",
      fundingListText:
        "Below is the list of funding sources that will used to calulate your districts DDF limit:",
    },
    districtFormHeader: "District Form",
    createLabel: "Create",
    deleteLabel: "Delete",
    editLabel: "Edit",
    actionsLabel: "Actions",
    nameLabel: "Name",
    districtLabel: "District",
    districtView: {
      distictTabLabel: "District",
      adminsTabLabel: "Admins",
    },
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
    clubForm: {
      clubFormHeader: "Club Form",
      disableDsgLabel: "Disable District Simplified Projects",
      disableDmLabel: "Disable District Matching Projects",
      disableGlobalLabel: "Disable Global Projects",
    },
    clubsView: {
      noClubsInDistrict: "Aucun club dans le district",
      clubMembersLabel: "Membres du club",
      clubsLabel: "Clubs",
      choseDistrictForClubs: "Choisissez un district pour la liste des clubs",
    },
    resultLabel: "Résultats",
    allLabel: "Tous",
    nextButtonLabel: "Suivant",
    prevButtonLabel: "Précédent",
    baseClubLabel: "Base Club",
    baseSelectLabel: "Sélectionner...",
    userForm: {
      districtSelectLabel: "Assigner au District",
      firstNameLabel: "Prénom",
      lastNameLabel: "Nom de Famillle",
    },
    userFormHeader: "User Form",
    roleLabel: "Role",
    yesLabel: "Oui",
    confirmationDelete: "Êtes-vous sûr de vouloir supprimer ",
    succssDeleteToast: "Suppression effectuée",
    districtFormHeader: "District Form",
    createLabel: "Créer",
    deleteLabel: "Supprimer",
    editLabel: "Modifier",
    actionsLabel: "Actions",
    nameLabel: "Nom",
    districtLabel: "District",
    desciptionLabel: "Description",
    settingsLabel: "Paramètres",
    sourceLabel: "Source",
    addLabel: "Add",
    cancelLabel: "Annuler",
    districtForm: {
      districtNameLabel: "Numeur du District",
      govLabel: "Gouverneur du District",
      submissionStartDateLabel:
        "Date de début de la soumission simplifiée pour le matching du District",
      submissionEndDateLabel:
        "Date de fin de la soumission simplifiée pour le matching du District",
      dsgCapLabel:
        "Cap de la soumission simplifiée pour le matching du District",
      dmCapLabel: "Cap de matching du District",
      reqMinLength: "Ce champ ne peut pas être nul",
      numbMustBeFraction: "Le nombre doit être une fraction",
      fractionRateLabel: "Définissez le taux de fraction pour le USD",
      fundingSourcesCalcLabel:
        "Définissez la calcul des sources de financement pour cette limite de DDF",
      fundingListText:
        "Voici la liste des sources de financement qui seront utilisées pour calculer votre limite de DDF:",
    },
    districtView: {
      distictTabLabel: "District",
      adminsTabLabel: "Admins",
    },
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
