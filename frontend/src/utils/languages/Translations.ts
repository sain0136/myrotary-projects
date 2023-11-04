export interface Translation {
  pledgeProcess: {
    bulletPoint1: string;
    bulletPoint2: string;
    bulletPoint3: string;
    bulletPoint4: string;
    pledgeProcessLabel: string;
    pledgeTodayLabel: string;
    pledgeFormFillFormLabel: string;
    pledgeFormInfoLabel: string;
    donateHeaderLabel: string;
    maxPledgeLabel: string;
    amountLabel: string;
    maxLimitLabel: string;
    minLimitLabel: string;
  };
  projectLabel: string;
  projectLabels: {
    raisedLabel: string;
    goalLabel: string;
    estimatedLabel: string;
    pledgeLabel: string;
    fullyFundedLabel: string;
  };
  listviewlabel: string;
  gridviewlabel: string;
  noResultsLabel: string;
  filterProjectsLabel: string;
  landingpageBannerText: string;
  projectNotFoundError: string;
  projectCodeLabel: string;
  statusLabel: string;
  landingPage: {
    searchTermsLabel: string;
    grantTypeLabel: string;
    yearLabel: string;
    searchButtonLabel: string;
    resetLabel: string;
    areaOfFocusLabel: string;
    regionLabel: string;
  };
  sendEmailLabel: string;
  landingFooter: {
    privacyPolicyLabel: string;
    termsOfUseLabel: string;
    legalHeaderLabel: string;
    followUsLabel: string;
  };
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
    noClubMembersInClub: string;
    creatNewClubMemberLabel: string;
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
    noAdminsInDistrict: string;
    choseAdminForDistrict: string;
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
    maxLength: string;
    numeric: string;
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
    pledgeProcess: {
      maxLimitLabel: "Cannot exceed the max pledge limit",
      bulletPoint1:
        "Registered Rotary members can log in as a Rotary member and make a pledge.",
      bulletPoint2:
        "If you are not a member, you can still make a pledge. Click make a pledge above.",
      bulletPoint3: "Fill out the pledge form and make your pledge.",
      bulletPoint4:
        "When the project is fully funded and approved, you will be contacted by the project owner to collect funds.",
      pledgeProcessLabel: "Our Pledge Process",
      pledgeTodayLabel: "Pledge Today",
      pledgeFormFillFormLabel:
        "Please fill out the form below to submit your secure pledge below. Have questions or need help? Contact us at",
      pledgeFormInfoLabel:
        "Rest assured, every pledge made through this form goes directly to facilitating the selected project. Your support is instrumental. With a seamless pledging process, we ensure that your contribution reaches the project you are passionate about, providing the much-needed support for its fruition. The transparency of this process allows you to see how your pledge is allocated, reinforcing the collective effort in driving meaningful change. Through your pledge, you become an integral part of a community dedicated to making a tangible impact, demonstrating how individual contributions collectively lead to significant advancements. When it's time to collect the pledged funds, the project owner will personally reach out to you, ensuring a direct and informed process.",
      donateHeaderLabel: "How much would you like to pledge?",
      maxPledgeLabel: "Maximum pledge amount",
      amountLabel: "Amount",
      minLimitLabel: "Your pledge cannot be less than 1 dollar",
    },
    projectLabel: "Project",
    projectLabels: {
      raisedLabel: "Raised",
      goalLabel: "Goal",
      estimatedLabel: "Estimated Completion Date",
      pledgeLabel: "Pledge Today",
      fullyFundedLabel: "Fully Funded",
    },
    projectCodeLabel: "Project Code",
    projectNotFoundError: "Project not found",
    listviewlabel: "List View",
    gridviewlabel: "Grid View",
    noResultsLabel: "No Results",
    statusLabel: "Status",
    filterProjectsLabel: "Filter Projects",
    landingPage: {
      searchTermsLabel: "Search Term",
      grantTypeLabel: "Grant Type",
      yearLabel: "Year",
      searchButtonLabel: "Search",
      resetLabel: "Reset",
      areaOfFocusLabel: "Area of Focus",
      regionLabel: "Region",
    },
    landingpageBannerText: "Our Projects",
    sendEmailLabel: "Send us an email",
    landingFooter: {
      privacyPolicyLabel: "Privacy Policy",
      termsOfUseLabel: "Terms & Conditions",
      legalHeaderLabel: "Legal",
      followUsLabel: "Follow Us",
    },
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
      noClubMembersInClub: "This club has no members",
      creatNewClubMemberLabel: "Create New Club Member",
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
      noAdminsInDistrict: "No Admins in District",
      choseAdminForDistrict: "Select an Admin for District Listing",
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
      maxLength: "Maximum length is {length} characters",
      numeric: "Only numbers are allowed",
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
    pledgeProcess: {
      maxLimitLabel: "Ne peut pas dépasser le plafond des promesses de dons",
      amountLabel: "Montant",
      donateHeaderLabel: "Quel est le montant de votre promesse de don ?",
      bulletPoint1:
        "Les membres Rotary enregistrés peuvent se connecter en tant que membre Rotary et faire un engagement.",
      bulletPoint2:
        "Si vous n'êtes pas membre, vous pouvez toujours faire un engagement. Cliquez sur Faire un engagement ci-dessus.",
      bulletPoint3:
        "Remplissez le formulaire d'engagement et effectuez votre engagement.",
      bulletPoint4:
        "Lorsque le projet est entièrement financé et approuvé, le propriétaire du projet vous contactera pour collecter les fonds.",
      pledgeProcessLabel: "Notre processus d'engagement",
      pledgeTodayLabel: "Pledge aujourd'hui",
      pledgeFormFillFormLabel:
        "Veuillez remplir le formulaire ci-dessous pour soumettre votre promesse de don sécurisée. Vous avez des questions ou besoin d'aide ? Contactez nous à l'adresse suivante",
      pledgeFormInfoLabel:
        "Soyez assuré que chaque promesse de don faite par le biais de ce formulaire est directement affectée à la réalisation du projet sélectionné. Votre soutien est essentiel. Grâce à une procédure d'engagement transparente, nous nous assurons que votre contribution atteint le projet qui vous passionne, en lui apportant le soutien nécessaire à sa réalisation. La transparence de ce processus vous permet de voir comment votre contribution est allouée, ce qui renforce l'effort collectif en faveur d'un changement significatif. Grâce à votre promesse de don, vous devenez partie intégrante d'une communauté qui se consacre à l'obtention d'un impact tangible, démontrant ainsi que les contributions individuelles conduisent collectivement à des avancées significatives. Lorsque le moment est venu de collecter les fonds promis, le propriétaire du projet vous contactera personnellement, garantissant ainsi un processus direct et informé.",
      maxPledgeLabel: "Montant maximum de l'engagement",
      minLimitLabel: "Votre engagement ne peut pas être inférieur à 1 dollar",
    },
    projectLabel: "Projet",
    projectLabels: {
      raisedLabel: "Donné",
      goalLabel: "Objectif",
      estimatedLabel: "Date de fin estimée",
      pledgeLabel: "Pledge",
      fullyFundedLabel: "Financement complet",
    },
    projectCodeLabel: "Code Projet",
    projectNotFoundError: "Projet introuvable",
    listviewlabel: "List View",
    gridviewlabel: "Grid View",
    noResultsLabel: "Aucun Résultat",
    statusLabel: "Statut",
    filterProjectsLabel: "Filtrer",
    landingPage: {
      searchTermsLabel: "Rechercher",
      grantTypeLabel: "Type de financement",
      yearLabel: "Année",
      searchButtonLabel: "Rechercher",
      resetLabel: "Réinitialiser",
      areaOfFocusLabel: "Zone de recherche",
      regionLabel: "Région",
    },
    landingpageBannerText: "Nos Projets",
    sendEmailLabel: "Envoyer un email",
    landingFooter: {
      privacyPolicyLabel: "Politique de confidentialité",
      termsOfUseLabel: "Conditions d'utilisation",
      legalHeaderLabel: "Mentions légales",
      followUsLabel: "Suivez-nous",
    },
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
      noClubMembersInClub: "Ce club n'a aucun membre",
      creatNewClubMemberLabel: "Creer un membre de club",
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
      noAdminsInDistrict: "Aucun administrateur dans le district",
      choseAdminForDistrict:
        "Sélectionnez un administrateur pour la liste des districts",
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
      maxLength: "La longueur maximale est de {longueur} caractères.",
      numeric: "Seuls les chiffres sont autorisés",
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
