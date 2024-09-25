import {
  grantType,
  grantTypeFr,
  projectStatus,
} from "@/utils/types/commonTypes";

export default class ResourceList {
  constructor() {}
  // static districtRolesList = [
  //   "District Admin",
  //   "District Grants Chair",
  //   "District Foundations Chair",
  //   "District International Chair",
  //   "District Stewardship",
  // ];

  static measurableList: Array<string> = [
    "Surveys",
    "Questionnaires",
    "Observations",
    "Tests of Knowledge",
    "Interviews",
    "Focus Groups",
    "Video/Media",
    "Documents/Materials Collections",
  ];

  static sidebarIcons = {
    homeIcon: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor"
    class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack" 
    d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/></svg>
    `,
    superAdmins: `<svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" 
    class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack"
    d="m448 362.7l-117.3-21.3C320 320 320 310.7 320 298.7c10.7-10.7 32-21.3 32-32c10.7-32 10.7-53.3 10.7-53.3c5.5-8 21.3-21.3 
    21.3-42.7s-21.3-42.7-21.3-53.3C362.7 32 319.2 0 256 0c-60.5 0-106.7 32-106.7 117.3c0 10.7-21.3 32-21.3 53.3s15.2 35.4 21.3 
    42.7c0 0 0 21.3 10.7 53.3c0 10.7 21.3 21.3 32 32c0 10.7 0 21.3-10.7 42.7L64 362.7C21.3 373.3 0 448 0 512h512c0-64-21.3-138.7-64-149.3z"/>
    </svg>`,
    myProfileIcon: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor"
    class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack"
     fill-rule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z"
     clip-rule="evenodd"/>
    `,
    districtIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor"
    class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack"
    d="M19 15h-2v-2h2m0 6h-2v-2h2M13 7h-2V5h2m0 6h-2V9h2m0 6h-2v-2h2m0 6h-2v-2h2m-6-6H5V9h2m0 6H5v-2h2m0 6H5v-2h2m8-6V5l-3-3l-3 3v2H3v14h18V11h-6Z"/>
    </svg>`,
    clubIcon: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15"><path fill="currentColor"
      class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack"
      d="M7.724.053a.5.5 0 0 0-.448 0l-6 3l.448.894L7.5 1.06l5.776 2.888l.448-.894l-6-3ZM14 6h1V5H0v1h1v8H0v1h4V8h5v7h6v-1h-1V6Z"/><path fill="currentColor"
    `,
    clubMembers: `<svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24"
    class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack"
    viewBox="0 0 32 32"><path fill="currentColor" d="M21.066 20.667c1.227-.682 1.068-3.31-.354-5.874c-.61-1.104-1.36-1.998-2.11-2.623a5.229 5.229 0 0 1-3.1 1.03a5.23 5.23 0 0 1-3.105-1.03c-.75.625-1.498 1.52-2.11 2.623c-1.423 2.563-1.58 5.192-.35 5.874c.548.312 1.126.078 1.722-.496a10.51 10.51 0 0 0-.167 1.874c0 2.938 1.14 5.312 2.543 5.312c.846 0 1.265-.865 1.466-2.188c.2 1.314.62 2.188 1.46 2.188c1.397 0 2.546-2.375 2.546-5.312c0-.66-.062-1.29-.168-1.873c.6.575 1.176.813 1.726.497zM15.5 12.2a4.279 4.279 0 1 0-.003-8.557A4.279 4.279 0 0 0 15.5 12.2zm8.594 2.714a3.514 3.514 0 0 0 0-7.025a3.513 3.513 0 1 0 .001 7.027zm4.28 2.13c-.502-.908-1.116-1.642-1.732-2.155a4.3 4.3 0 0 1-2.546.845c-.756 0-1.46-.207-2.076-.55c.496 1.093.803 2.2.86 3.19c.094 1.516-.38 2.64-1.328 3.165a2.017 2.017 0 0 1-.653.224c-.057.392-.096.8-.096 1.23c0 2.413.935 4.362 2.088 4.362c.694 0 1.04-.71 1.204-1.796c.163 1.08.508 1.796 1.2 1.796c1.145 0 2.09-1.95 2.09-4.36c0-.543-.053-1.06-.14-1.54c.492.473.966.668 1.418.408c1.007-.56.877-2.718-.29-4.82zm-21.468-2.13a3.512 3.512 0 1 0-3.514-3.512a3.515 3.515 0 0 0 3.514 3.514zm2.535 6.622c-1.592-.885-1.738-3.524-.456-6.354a4.242 4.242 0 0 1-2.078.553c-.956 0-1.832-.32-2.55-.846c-.615.512-1.228 1.246-1.732 2.153c-1.167 2.104-1.295 4.262-.287 4.82c.45.258.925.065 1.414-.406a8.83 8.83 0 0 0-.135 1.538c0 2.412.935 4.36 2.088 4.36c.694 0 1.04-.71 1.204-1.795c.165 1.08.51 1.796 1.2 1.796c1.147 0 2.09-1.95 2.09-4.36c0-.433-.04-.842-.097-1.234a2.02 2.02 0 0 1-.66-.226z"/></svg>`,
    clubAdminViewIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack"
    viewBox="0 0 256 256"><path fill="currentColor" d="M239.73 208H224V96a16 16 0 0 0-16-16h-44a4 4 0 0 0-4 4v124h-16V32.41a16.43 16.43 0 0 0-6.16-13a16 16 0 0 0-18.72-.69L39.12 72A16 16 0 0 0 32 85.34V208H16.27A8.18 8.18 0 0 0 8 215.47a8 8 0 0 0 8 8.53h224a8 8 0 0 0 8-8.53a8.18 8.18 0 0 0-8.27-7.47ZM76 184a8 8 0 0 1-8.53 8a8.18 8.18 0 0 1-7.47-8.28v-15.45a8.19 8.19 0 0 1 7.47-8.27a8 8 0 0 1 8.53 8Zm0-56a8 8 0 0 1-8.53 8a8.19 8.19 0 0 1-7.47-8.28v-15.45a8.19 8.19 0 0 1 7.47-8.27a8 8 0 0 1 8.53 8Zm40 56a8 8 0 0 1-8.53 8a8.18 8.18 0 0 1-7.47-8.26v-15.47a8.19 8.19 0 0 1 7.47-8.26a8 8 0 0 1 8.53 8Zm0-56a8 8 0 0 1-8.53 8a8.19 8.19 0 0 1-7.47-8.26v-15.47a8.19 8.19 0 0 1 7.47-8.26a8 8 0 0 1 8.53 8Z"/></svg>`,
    myProjects: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack"
    " viewBox="0 0 20 20"><path fill="currentColor" d="M5 2a2 2 0 0 0-2 2h-.5a.5.5 0 0 0 0 1H3v3h-.5a.5.5 0 0 0 0 1H3v3h-.5a.5.5 0 0 0 0 1H3a2 2 0 0 0 2 2h1.354L14 5.896V4a2 2 0 0 0-2-2H5Zm1.5 4h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1Zm10.173-1.73c.45-.537 1.324-.219 1.324.482V16a2 2 0 0 1-2 2H6.751a.75.75 0 0 1-.574-1.233L16.673 4.27Zm-1.672 9.985l.002-2.645a.25.25 0 0 0-.441-.161l-2.64 3.145a.25.25 0 0 0 .192.41h2.137a.75.75 0 0 0 .75-.75Z"/></svg>`,
    approvals: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack"
     viewBox="0 0 32 32"><path fill="currentColor" d="m22 27.18l-2.59-2.59L18 26l4 4l8-8l-1.41-1.41L22 27.18z"/><path fill="currentColor" d="M25 5h-3V4a2.006 2.006 0 0 0-2-2h-8a2.006 2.006 0 0 0-2 2v1H7a2.006 2.006 0 0 0-2 2v21a2.006 2.006 0 0 0 2 2h9v-2H7V7h3v3h12V7h3v11h2V7a2.006 2.006 0 0 0-2-2Zm-5 3h-8V4h8Z"/></svg>
    `,
   prospectUsersIcon: `
    <svg width="34px" height="34px"  class="iconify-icon text-gray-500 transition duration-75 group-hover:text-nearBlack" viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M4,2 C5.65685425,2 7,3.34314575 7,5 C7,5.67575081 6.7765771,6.2993184 6.39957171,6.80086239 C7.37120562,7.52882672 8,8.69098363 8,10 L8,14 L0,14 L0,10 C0,8.69098363 0.628794382,7.52882672 1.60081401,6.79909841 C1.2234229,6.2993184 1,5.67575081 1,5 C1,3.34314575 2.34314575,2 4,2 Z M4,8 C2.89543475,8 2,8.89543475 2,10 L2,12 L6,12 L6,10 C6,8.89543475 5.10456525,8 4,8 Z M14.2928932,3.29289322 C14.6834175,2.90236893 15.3165825,2.90236893 15.7071068,3.29289322 C16.0976311,3.68341751 16.0976311,4.31658249 15.7071068,4.70710678 L12.7071068,7.70710678 C12.3165825,8.09763107 11.6834175,8.09763107 11.2928932,7.70710678 L9.79289322,6.20710678 C9.40236893,5.81658249 9.40236893,5.18341751 9.79289322,4.79289322 C10.1834175,4.40236893 10.8165825,4.40236893 11.2071068,4.79289322 L12,5.58578644 L14.2928932,3.29289322 Z M4,4 C3.44771525,4 3,4.44771525 3,5 C3,5.55228475 3.44771525,6 4,6 C4.55228475,6 5,5.55228475 5,5 C5,4.44771525 4.55228475,4 4,4 Z"/>
    </svg>`,
    notificationIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -15 512 512" fill="#FFA500">
    <path d="M479.548,265.753c-2.408-6.276-2.408-13.224,0-19.522l19.468-51.108c4.6-12.065,0.162-25.666-10.63-32.714 l-45.797-29.904c-5.635-3.682-9.719-9.317-11.471-15.801l-14.296-52.799c-3.366-12.443-14.96-20.865-27.828-20.224l-54.636,2.732 c-6.715,0.324-13.324-1.814-18.564-6.036L273.2,6.073c-10.035-8.097-24.361-8.097-34.404,0l-42.594,34.304 c-5.241,4.222-11.848,6.36-18.572,6.036l-54.629-2.732c-12.868-0.64-24.462,7.781-27.827,20.224l-14.288,52.799 c-1.76,6.484-5.843,12.119-11.478,15.801L23.61,162.408c-10.791,7.048-15.222,20.664-10.629,32.714l19.476,51.116 c2.401,6.291,2.401,13.238,0,19.521l-19.476,51.116c-4.593,12.042-0.162,25.666,10.629,32.714l45.798,29.912 c5.635,3.666,9.718,9.286,11.478,15.785l14.288,52.799c3.366,12.451,14.96,20.865,27.827,20.224l54.629-2.717 c6.724-0.348,13.331,1.806,18.572,6.021l42.594,34.319c10.043,8.09,24.369,8.09,34.396,0l42.602-34.319 c5.234-4.214,11.849-6.368,18.564-6.021l54.636,2.717c12.868,0.641,24.462-7.773,27.828-20.224l14.296-52.799 c1.752-6.499,5.836-12.119,11.471-15.785l45.797-29.912c10.792-7.048,15.23-20.672,10.622-32.714L479.548,265.753z M288.778,369.127c0,10.451-8.476,18.943-18.927,18.943h-27.704c-10.452,0-18.935-8.492-18.935-18.943v-28.916 c0-10.452,8.483-18.943,18.935-18.943h27.704c10.451,0,18.927,8.491,18.927,18.943V369.127z M288.778,268.948 c0,10.452-8.476,18.928-18.927,18.928h-27.704c-10.452,0-18.935-8.476-18.935-18.928V142.879c0-10.467,8.483-18.943,18.935-18.943 h27.704c10.451,0,18.927,8.476,18.927,18.943V268.948z"></path>
</svg>
`
  };

  static statusList = Object.values(projectStatus);

  static grantTypeList = Object.values(grantType);

  static projectTypeMap = {
    [grantType.CLUBPROJECT]: {
      en: "Club Project",
      fr: "Projet Simplifié de Club",
    },
    [grantType.DISTRICTSIMPLIFIEDPROJECT]: {
      en: "District Simplified Project",
      fr: "Projet Simplifié de District",
    },
    [grantType.DISTRICTMATCHINGPROJECT]: {
      en: "District Matching Project",
      fr: "Projet Matching Simplifié de District",
    },
    [grantType.GLOBALPROJECT]: {
      en: "Global Project",
      fr: "Projet Simplifié Glob",
    },
  };

  static areaOfFocusList = [
    "Peace Conflict Prevention",
    "Disease Prevention And Treatment",
    "Water And Sanitation",
    "Maternal And Child Health",
    "Basic Education And Literacy",
    "Economic And Community Development",
    "Environment",
  ];

  static searchTermConversionMap() {
    const searchTermConversionMap: Map<string, string> = new Map();
    searchTermConversionMap.set(
      "Peace Conflict Prevention",
      "Peace_Conflict_Prevention"
    );
    searchTermConversionMap.set(
      "Disease Prevention And Treatment",
      "Disease_Prevention_And_Treatment"
    );
    searchTermConversionMap.set("Water And Sanitation", "Water_And_Sanitation");
    searchTermConversionMap.set(
      "Maternal And Child Health",
      "Maternal_And_Child_Health"
    );
    searchTermConversionMap.set(
      "Basic Education And Literacy",
      "Basic_Education_And_Literacy"
    );
    searchTermConversionMap.set(
      "Economic And Community Development",
      "Economic_And_Community_Development"
    );
    searchTermConversionMap.set("Environment", "Environment");
    return searchTermConversionMap;
  }

  static areaOfFocusMap: Record<string, { en: string; fr: string }> = {
    "Peace Conflict Prevention": {
      en: "Peace Conflict Prevention",
      fr: "Prevention de conflit de paix",
    },
    "Disease Prevention And Treatment": {
      en: "Disease Prevention And Treatment",
      fr: "Prevention et Traitement des Maladies",
    },
    "Water And Sanitation": {
      en: "Water And Sanitation",
      fr: "Eau et Sanitation",
    },
    "Maternal And Child Health": {
      en: "Maternal And Child Health",
      fr: "Sante Maternelle et Enfant",
    },
    "Basic Education And Literacy": {
      en: "Basic Education And Literacy",
      fr: "Education de Base et Literatisme",
    },
    "Economic And Community Development": {
      en: "Economic And Community Development",
      fr: "Economie et Developpement Communal",
    },
    Environment: {
      en: "Environment",
      fr: "Environnement",
    },
  };

  static focusAreaDetailsMap() {
    const focusAreaDetailsMap: Map<
      string,
      {
        en: string;
        fr: string;
        imgLink?: string;
      }
    > = new Map();
    focusAreaDetailsMap.set("Peace_Conflict_Prevention", {
      en: "Peace Conflict Prevention",
      fr: "Prevention de conflit de paix",
      imgLink: "/1-Peace-and-Conflict.png",
    });
    focusAreaDetailsMap.set("Disease_Prevention_And_Treatment", {
      en: "Disease Prevention And Treatment",
      fr: "Prevention et Traitement des Maladies",
      imgLink: "/2-Disease_Prevention.png",
    });
    focusAreaDetailsMap.set("Water_And_Sanitation", {
      en: "Water And Sanitation",
      fr: "Eau et Sanitation",
      imgLink: "/3-Water_and_Sanitation.png",
    });
    focusAreaDetailsMap.set("Maternal_And_Child_Health", {
      en: "Maternal And Child Health",
      fr: "Sante Maternelle et Enfant",
      imgLink: "/4-Maternal_and_Child_Health.png",
    });
    focusAreaDetailsMap.set("Basic_Education_And_Literacy", {
      en: "Basic Education And Literacy",
      fr: "Education de Base et Literatisme",
      imgLink: "/5-Basic_Education_and_Literacy.png",
    });
    focusAreaDetailsMap.set("Economic_And_Community_Development", {
      en: "Economic And Community Development",
      fr: "Economie et Developpement Communal",
      imgLink: "/6-Economic_and_Community.png",
    });
    focusAreaDetailsMap.set("Environment", {
      en: "Environment",
      fr: "Environnement",
      imgLink: "/7-Environment.png",
    });
    return focusAreaDetailsMap;
  }

  static areaFocusImages: Array<string> = [
    "/1-Peace-and-Conflict.png",
    "/2-Disease_Prevention.png",
    "/3-Water_and_Sanitation.png",
    "/4-Maternal_and_Child_Health.png",
    "/5-Basic_Education_and_Literacy.png",
    "/6-Economic_and_Community.png",
    "/7-Environment.png",
  ];

  static regionList = [
    "Africa",
    "Central America",
    "North America",
    "South America",
    "Asia",
    "South East Asia",
    "Eastern Europe",
    "Western Europe",
    "Middle East",
  ];

  static regionMap = {
    Africa: {
      en: "Africa",
      fr: "Afrique",
    },
    "Central America": {
      en: "Central America",
      fr: "Amerique Centrale",
    },
    "North America": {
      en: "North America",
      fr: "Amerique du Nord",
    },
    "South America": {
      en: "South America",
      fr: "Amerique du Sud",
    },
    Asia: {
      en: "Asia",
      fr: "Asie",
    },
    "South East Asia": {
      en: "South East Asia",
      fr: "Asie du Sud-Est",
    },
    "Eastern Europe": {
      en: "Eastern Europe",
      fr: "Europe Orientale",
    },
    "Western Europe": {
      en: "Western Europe",
      fr: "Europe Occidentale",
    },
    "Middle East": {
      en: "Middle East",
      fr: "Moyen-Orient",
    },
  };

  static clubRolesList = ["Club Admin", "Standard Member", "Guest"];

  static canadaProvinceList = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon Territory",
  ];

  static usaStatesList = [
    "Alaska",
    "Alabama",
    "Arkansas",
    "American Samoa",
    "Arizona",
    "California",
    "Colorado",
    "Connecticut",
    "District of Columbia",
    "Delaware",
    "Florida",
    "Georgia",
    "Guam",
    "Hawaii",
    "Iowa",
    "Idaho",
    "Illinois",
    "Indiana",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Massachusetts",
    "Maryland",
    "Maine",
    "Michigan",
    "Minnesota",
    "Missouri",
    "Mississippi",
    "Montana",
    "North Carolina",
    "North Dakota",
    "Nebraska",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "Nevada",
    "New York",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Puerto Rico",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Virginia",
    "Virgin Islands",
    "Vermont",
    "Washington",
    "Wisconsin",
    "West Virginia",
    "Wyoming",
  ];

  static countryList: Array<string> = [
    "Canada",
    "United States",
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas (the)",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory (the)",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Cayman Islands (the)",
    "Central African Republic (the)",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands (the)",
    "Colombia",
    "Comoros (the)",
    "Congo (the Democratic Republic of the)",
    "Congo (the)",
    "Cook Islands (the)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic (the)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands (the) [Malvinas]",
    "Faroe Islands (the)",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories (the)",
    "Gabon",
    "Gambia (the)",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See (the)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic (the)",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands (the)",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (the Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands (the)",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger (the)",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands (the)",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines (the)",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation (the)",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan (the)",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands (the)",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates (the)",
    "United Kingdom of Great Britain and Northern Ireland (the)",
    "United States Minor Outlying Islands (the)",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands",
  ];

  static districtSimplifiedCriteria: Record<"en" | "fr", Array<string>> = {
    en: [
      "	Projects should be short-term with the expectation of completion within the year the grant is received.",
      "	Priority will be given to local community projects and to International projects that are ineligible for TRF Matching Grants.",
      "	The project supported by this grant must respect the wishes, traditions and culture of the receiving community.",
      "	The project must promote the active and personal participation of Rotarians from all clubs involved in its implementation.",
      "	Project funds must not directly benefit a Rotarian, his/her spouse, a living Rotarian’s lineal descendant or ancestor or his/her spouse or an employee of a club, district or other Rotary entity or of Rotary International.",
      "	Project funds may not be used for salaries, travel or administrative overhead costs.",
      "	Project funds may not be used to reimburse applicants for projects already initiated or completed.",
      "	Project funds may not be used to purchase land or construct substantial buildings.",
      "	Project funds may not be used to fund a Rotary club’s on-going projects, but may be used to replicate successful projects that will benefit additional communities.",
      "	Projects must be sponsored by a Rotary club and/or district and publicly identified as such.",
      "	The stewardship of the DSG grant funds shall conform to the District Memorandum of Understanding.",
      "	The sponsor club shall appoint two Rotarians who will provide oversight and management of the project funds and who will serve as contacts for the District 7040 Rotary Foundation Committee.",
      "	Projects must adhere to Rotary’s seven areas of focus",
    ],
    fr: [
      "	Le projet doit être court terme avec l'attente de complétion dans l'année où le mandat est reçu.",
      "	La priorité sera attribuée aux projets locaux et aux projets internationaux qui ne sont pas inscrits dans les mandats TRF Matching.",
      "	Le projet soutenu par ce mandat doit respecter les souhaits, traditions et culture de la communauté recevante.",
      "	Le projet doit promouvoir la participation active et personnelle des Rotarians de tous les clubs implantés.",
      "	Le fonds projet doit ne pas beneficier de un Rotarian, sa conjointe, son descendant le plus vivant, son ascendant ou son conjoint ou de l'un de ses employés ou de Rotary International.",
      "	Le fonds projet ne peut pas être utilisé pour des salaires, des frais de déplacement ou des frais d'administration.",
      "	Le fonds projet ne peut pas être utilisé pour rembourser les demandeurs des projets déjà initiés ou accomplis.",
      "	Le fonds projet ne peut pas être utilisé pour acheter un terrain ou construire des bâtiments.",
      "	Le fonds projet ne peut pas être utilisé pour financer des projets en cours de club ou pour reproduire des projets réussis qui seront bénéficiés d'autres communautés.",
      "	Le projet doit être sponsorisé par un club Rotary et/ou un district et doit être identifié comme tel.",
      "	L'accompagnement du DSG des fonds projet doit se conformer au mandat de Rotary.",
      "	L'accompagnement du club Rotary doit attribuer deux Rotarians qui fourniraient l'oversight et la gestion des fonds projet et qui seront des contacts pour le comité Rotary 7040.",
      "	Le projet doit respecter les cinq zones de focus Rotary.",
    ],
  };

  static districtMatchingCriteria: Record<"en" | "fr", Array<string>> = {
    en: [
      "	Priority will be given to International projects that are ineligible for TRF Global Grants.",
      "	Projects must be short-term with the expectation of completion within the year the grant is received.",
      " The project supported by this grant must respect the wishes, traditions and culture of the receiving community.",
      " The project must promote the active and personal participation of Rotarians from all clubs involved in its implementation.",
      " Project funds must not directly benefit a Rotarian, his/her spouse, a living Rotarian’s lineal descendant or ancestor or his/her spouse or an employee of a club, district or other Rotary entity or of Rotary International.",
      " Project funds may not be used for salaries, travel or administrative overhead costs.",
      " Project funds may not be used to reimburse applicants for projects already initiated or completed.",
      " Project funds may not be used to purchase land or construct substantial buildings.",
      " Project funds may not be used to fund a Rotary club’s on-going projects, but may be used to replicate successful projects that will benefit additional communities.",
      " Projects must be sponsored by a Rotary club and/or district and publicly identified as such.",
      " The stewardship of the Matching Grant funds shall conform to District Memorandum of Understanding.",
      " The sponsor club shall appoint two Rotarians who will provide oversight and management of the project funds and who will serve as contacts for the District 7040 Rotary Foundation Committee.",
      " Projects must adhere to Rotary’s six areas of focus.",
      " Participating clubs/districts must be certified.",
    ],
    fr: [
      "	La priorité sera attribuée aux projets internationaux qui ne sont pas inscrits dans les mandats TRF Matching.",
      "	Le projet doit être court terme avec l'attente de complétion dans l'année où le mandat est reçu.",
      "	Le projet soutenu par ce mandat doit respecter les souhaits, traditions et culture de la communauté recevante.",
      "	Le projet doit promouvoir la participation active et personnelle des Rotarians de tous les clubs implantés.",
      "	Le fonds projet ne peut pas être utilisé pour des salaires, des frais de déplacement ou des frais d'administration.",
      "	Le fonds projet ne peut pas être utilisé pour rembourser les demandeurs des projets déjà initiés ou accomplis.",
      "	Le fonds projet ne peut pas être utilisé pour acheter un terrain ou construire des bâtiments.",
      "	Le fonds projet ne peut pas être utilisé pour financer des, projets en cours de club ou pour reproduire des projets réussis qui seront bénéficiés d'autres communautés.",
      "	Le projet doit être sponsorisé par un club Rotary et/ou un district et doit être identifié comme tel.",
      "	L'accompagnement du DSG des fonds projet doit se conformer au mandat de Rotary.",
      "	L'accompagnement du club Rotary doit attribuer deux Rotarians qui fourniraient l'oversight et la gestion des fonds projet et qui seront des contacts pour le comité Rotary 7040.",
      "	Le projet doit respecter les cinq zones de focus Rotary.",
    ],
  };
}
