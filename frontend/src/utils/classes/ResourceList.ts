import { grantType, projectStatus } from "@/utils/types/commonTypes";

export default class ResourceList {
  constructor() {}
  static districtRolesList = [
    "District Admin",
    "District Grants Chair",
    "District Foundations Chair",
    "District International Chair",
  ];

  static sidebarIcons = {
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
  };

  static statusList = Object.values(projectStatus);

  static grantTypeList = Object.values(grantType);

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

  static reverseTermConversionMap() {
    const reverseTermConversionMap: Map<string, string> = new Map();
    reverseTermConversionMap.set(
      "Peace_Conflict_Prevention",
      "Peace Conflict Prevention"
    );
    reverseTermConversionMap.set(
      "Disease_Prevention_And_Treatment",
      "Disease Prevention And Treatment"
    );
    reverseTermConversionMap.set(
      "Water_And_Sanitation",
      "Water And Sanitation"
    );
    reverseTermConversionMap.set(
      "Maternal_And_Child_Health",
      "Maternal And Child Health"
    );
    reverseTermConversionMap.set(
      "Basic_Education_And_Literacy",
      "Basic Education And Literacy"
    );
    reverseTermConversionMap.set(
      "Economic_And_Community_Development",
      "Economic And Community Development"
    );
    reverseTermConversionMap.set("Environment", "Environment");
    return reverseTermConversionMap;
  }

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
}
