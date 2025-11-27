/**
 * ISO-3166 Country Data
 * 
 * Provides ISO-3166-1 alpha-2 and alpha-3 country codes with country names
 * for use in dropdown components. Ensures dropdown-only selection (no free text).
 * 
 * Reference: ISO 3166-1 standard
 */

export interface Country {
  code: string; // ISO-3166-1 alpha-2 code (e.g., "AE", "US")
  code3: string; // ISO-3166-1 alpha-3 code (e.g., "ARE", "USA")
  name: string; // Official country name
}

/**
 * Complete list of ISO-3166-1 countries
 * Sorted alphabetically by country name
 */
export const COUNTRIES: Country[] = [
  { code: "AF", code3: "AFG", name: "Afghanistan" },
  { code: "AX", code3: "ALA", name: "Åland Islands" },
  { code: "AL", code3: "ALB", name: "Albania" },
  { code: "DZ", code3: "DZA", name: "Algeria" },
  { code: "AS", code3: "ASM", name: "American Samoa" },
  { code: "AD", code3: "AND", name: "Andorra" },
  { code: "AO", code3: "AGO", name: "Angola" },
  { code: "AI", code3: "AIA", name: "Anguilla" },
  { code: "AQ", code3: "ATA", name: "Antarctica" },
  { code: "AG", code3: "ATG", name: "Antigua and Barbuda" },
  { code: "AR", code3: "ARG", name: "Argentina" },
  { code: "AM", code3: "ARM", name: "Armenia" },
  { code: "AW", code3: "ABW", name: "Aruba" },
  { code: "AU", code3: "AUS", name: "Australia" },
  { code: "AT", code3: "AUT", name: "Austria" },
  { code: "AZ", code3: "AZE", name: "Azerbaijan" },
  { code: "BS", code3: "BHS", name: "Bahamas" },
  { code: "BH", code3: "BHR", name: "Bahrain" },
  { code: "BD", code3: "BGD", name: "Bangladesh" },
  { code: "BB", code3: "BRB", name: "Barbados" },
  { code: "BY", code3: "BLR", name: "Belarus" },
  { code: "BE", code3: "BEL", name: "Belgium" },
  { code: "BZ", code3: "BLZ", name: "Belize" },
  { code: "BJ", code3: "BEN", name: "Benin" },
  { code: "BM", code3: "BMU", name: "Bermuda" },
  { code: "BT", code3: "BTN", name: "Bhutan" },
  { code: "BO", code3: "BOL", name: "Bolivia" },
  { code: "BQ", code3: "BES", name: "Bonaire, Sint Eustatius and Saba" },
  { code: "BA", code3: "BIH", name: "Bosnia and Herzegovina" },
  { code: "BW", code3: "BWA", name: "Botswana" },
  { code: "BV", code3: "BVT", name: "Bouvet Island" },
  { code: "BR", code3: "BRA", name: "Brazil" },
  { code: "IO", code3: "IOT", name: "British Indian Ocean Territory" },
  { code: "BN", code3: "BRN", name: "Brunei Darussalam" },
  { code: "BG", code3: "BGR", name: "Bulgaria" },
  { code: "BF", code3: "BFA", name: "Burkina Faso" },
  { code: "BI", code3: "BDI", name: "Burundi" },
  { code: "CV", code3: "CPV", name: "Cabo Verde" },
  { code: "KH", code3: "KHM", name: "Cambodia" },
  { code: "CM", code3: "CMR", name: "Cameroon" },
  { code: "CA", code3: "CAN", name: "Canada" },
  { code: "KY", code3: "CYM", name: "Cayman Islands" },
  { code: "CF", code3: "CAF", name: "Central African Republic" },
  { code: "TD", code3: "TCD", name: "Chad" },
  { code: "CL", code3: "CHL", name: "Chile" },
  { code: "CN", code3: "CHN", name: "China" },
  { code: "CX", code3: "CXR", name: "Christmas Island" },
  { code: "CC", code3: "CCK", name: "Cocos (Keeling) Islands" },
  { code: "CO", code3: "COL", name: "Colombia" },
  { code: "KM", code3: "COM", name: "Comoros" },
  { code: "CG", code3: "COG", name: "Congo" },
  { code: "CD", code3: "COD", name: "Congo, Democratic Republic of the" },
  { code: "CK", code3: "COK", name: "Cook Islands" },
  { code: "CR", code3: "CRI", name: "Costa Rica" },
  { code: "CI", code3: "CIV", name: "Côte d'Ivoire" },
  { code: "HR", code3: "HRV", name: "Croatia" },
  { code: "CU", code3: "CUB", name: "Cuba" },
  { code: "CW", code3: "CUW", name: "Curaçao" },
  { code: "CY", code3: "CYP", name: "Cyprus" },
  { code: "CZ", code3: "CZE", name: "Czechia" },
  { code: "DK", code3: "DNK", name: "Denmark" },
  { code: "DJ", code3: "DJI", name: "Djibouti" },
  { code: "DM", code3: "DMA", name: "Dominica" },
  { code: "DO", code3: "DOM", name: "Dominican Republic" },
  { code: "EC", code3: "ECU", name: "Ecuador" },
  { code: "EG", code3: "EGY", name: "Egypt" },
  { code: "SV", code3: "SLV", name: "El Salvador" },
  { code: "GQ", code3: "GNQ", name: "Equatorial Guinea" },
  { code: "ER", code3: "ERI", name: "Eritrea" },
  { code: "EE", code3: "EST", name: "Estonia" },
  { code: "SZ", code3: "SWZ", name: "Eswatini" },
  { code: "ET", code3: "ETH", name: "Ethiopia" },
  { code: "FK", code3: "FLK", name: "Falkland Islands (Malvinas)" },
  { code: "FO", code3: "FRO", name: "Faroe Islands" },
  { code: "FJ", code3: "FJI", name: "Fiji" },
  { code: "FI", code3: "FIN", name: "Finland" },
  { code: "FR", code3: "FRA", name: "France" },
  { code: "GF", code3: "GUF", name: "French Guiana" },
  { code: "PF", code3: "PYF", name: "French Polynesia" },
  { code: "TF", code3: "ATF", name: "French Southern Territories" },
  { code: "GA", code3: "GAB", name: "Gabon" },
  { code: "GM", code3: "GMB", name: "Gambia" },
  { code: "GE", code3: "GEO", name: "Georgia" },
  { code: "DE", code3: "DEU", name: "Germany" },
  { code: "GH", code3: "GHA", name: "Ghana" },
  { code: "GI", code3: "GIB", name: "Gibraltar" },
  { code: "GR", code3: "GRC", name: "Greece" },
  { code: "GL", code3: "GRL", name: "Greenland" },
  { code: "GD", code3: "GRD", name: "Grenada" },
  { code: "GP", code3: "GLP", name: "Guadeloupe" },
  { code: "GU", code3: "GUM", name: "Guam" },
  { code: "GT", code3: "GTM", name: "Guatemala" },
  { code: "GG", code3: "GGY", name: "Guernsey" },
  { code: "GN", code3: "GIN", name: "Guinea" },
  { code: "GW", code3: "GNB", name: "Guinea-Bissau" },
  { code: "GY", code3: "GUY", name: "Guyana" },
  { code: "HT", code3: "HTI", name: "Haiti" },
  { code: "HM", code3: "HMD", name: "Heard Island and McDonald Islands" },
  { code: "VA", code3: "VAT", name: "Holy See" },
  { code: "HN", code3: "HND", name: "Honduras" },
  { code: "HK", code3: "HKG", name: "Hong Kong" },
  { code: "HU", code3: "HUN", name: "Hungary" },
  { code: "IS", code3: "ISL", name: "Iceland" },
  { code: "IN", code3: "IND", name: "India" },
  { code: "ID", code3: "IDN", name: "Indonesia" },
  { code: "IR", code3: "IRN", name: "Iran (Islamic Republic of)" },
  { code: "IQ", code3: "IRQ", name: "Iraq" },
  { code: "IE", code3: "IRL", name: "Ireland" },
  { code: "IM", code3: "IMN", name: "Isle of Man" },
  { code: "IL", code3: "ISR", name: "Israel" },
  { code: "IT", code3: "ITA", name: "Italy" },
  { code: "JM", code3: "JAM", name: "Jamaica" },
  { code: "JP", code3: "JPN", name: "Japan" },
  { code: "JE", code3: "JEY", name: "Jersey" },
  { code: "JO", code3: "JOR", name: "Jordan" },
  { code: "KZ", code3: "KAZ", name: "Kazakhstan" },
  { code: "KE", code3: "KEN", name: "Kenya" },
  { code: "KI", code3: "KIR", name: "Kiribati" },
  { code: "KP", code3: "PRK", name: "Korea (Democratic People's Republic of)" },
  { code: "KR", code3: "KOR", name: "Korea, Republic of" },
  { code: "KW", code3: "KWT", name: "Kuwait" },
  { code: "KG", code3: "KGZ", name: "Kyrgyzstan" },
  { code: "LA", code3: "LAO", name: "Lao People's Democratic Republic" },
  { code: "LV", code3: "LVA", name: "Latvia" },
  { code: "LB", code3: "LBN", name: "Lebanon" },
  { code: "LS", code3: "LSO", name: "Lesotho" },
  { code: "LR", code3: "LBR", name: "Liberia" },
  { code: "LY", code3: "LBY", name: "Libya" },
  { code: "LI", code3: "LIE", name: "Liechtenstein" },
  { code: "LT", code3: "LTU", name: "Lithuania" },
  { code: "LU", code3: "LUX", name: "Luxembourg" },
  { code: "MO", code3: "MAC", name: "Macao" },
  { code: "MG", code3: "MDG", name: "Madagascar" },
  { code: "MW", code3: "MWI", name: "Malawi" },
  { code: "MY", code3: "MYS", name: "Malaysia" },
  { code: "MV", code3: "MDV", name: "Maldives" },
  { code: "ML", code3: "MLI", name: "Mali" },
  { code: "MT", code3: "MLT", name: "Malta" },
  { code: "MH", code3: "MHL", name: "Marshall Islands" },
  { code: "MQ", code3: "MTQ", name: "Martinique" },
  { code: "MR", code3: "MRT", name: "Mauritania" },
  { code: "MU", code3: "MUS", name: "Mauritius" },
  { code: "YT", code3: "MYT", name: "Mayotte" },
  { code: "MX", code3: "MEX", name: "Mexico" },
  { code: "FM", code3: "FSM", name: "Micronesia (Federated States of)" },
  { code: "MD", code3: "MDA", name: "Moldova, Republic of" },
  { code: "MC", code3: "MCO", name: "Monaco" },
  { code: "MN", code3: "MNG", name: "Mongolia" },
  { code: "ME", code3: "MNE", name: "Montenegro" },
  { code: "MS", code3: "MSR", name: "Montserrat" },
  { code: "MA", code3: "MAR", name: "Morocco" },
  { code: "MZ", code3: "MOZ", name: "Mozambique" },
  { code: "MM", code3: "MMR", name: "Myanmar" },
  { code: "NA", code3: "NAM", name: "Namibia" },
  { code: "NR", code3: "NRU", name: "Nauru" },
  { code: "NP", code3: "NPL", name: "Nepal" },
  { code: "NL", code3: "NLD", name: "Netherlands" },
  { code: "NC", code3: "NCL", name: "New Caledonia" },
  { code: "NZ", code3: "NZL", name: "New Zealand" },
  { code: "NI", code3: "NIC", name: "Nicaragua" },
  { code: "NE", code3: "NER", name: "Niger" },
  { code: "NG", code3: "NGA", name: "Nigeria" },
  { code: "NU", code3: "NIU", name: "Niue" },
  { code: "NF", code3: "NFK", name: "Norfolk Island" },
  { code: "MK", code3: "MKD", name: "North Macedonia" },
  { code: "MP", code3: "MNP", name: "Northern Mariana Islands" },
  { code: "NO", code3: "NOR", name: "Norway" },
  { code: "OM", code3: "OMN", name: "Oman" },
  { code: "PK", code3: "PAK", name: "Pakistan" },
  { code: "PW", code3: "PLW", name: "Palau" },
  { code: "PS", code3: "PSE", name: "Palestine, State of" },
  { code: "PA", code3: "PAN", name: "Panama" },
  { code: "PG", code3: "PNG", name: "Papua New Guinea" },
  { code: "PY", code3: "PRY", name: "Paraguay" },
  { code: "PE", code3: "PER", name: "Peru" },
  { code: "PH", code3: "PHL", name: "Philippines" },
  { code: "PN", code3: "PCN", name: "Pitcairn" },
  { code: "PL", code3: "POL", name: "Poland" },
  { code: "PT", code3: "PRT", name: "Portugal" },
  { code: "PR", code3: "PRI", name: "Puerto Rico" },
  { code: "QA", code3: "QAT", name: "Qatar" },
  { code: "RE", code3: "REU", name: "Réunion" },
  { code: "RO", code3: "ROU", name: "Romania" },
  { code: "RU", code3: "RUS", name: "Russian Federation" },
  { code: "RW", code3: "RWA", name: "Rwanda" },
  { code: "BL", code3: "BLM", name: "Saint Barthélemy" },
  { code: "SH", code3: "SHN", name: "Saint Helena, Ascension and Tristan da Cunha" },
  { code: "KN", code3: "KNA", name: "Saint Kitts and Nevis" },
  { code: "LC", code3: "LCA", name: "Saint Lucia" },
  { code: "MF", code3: "MAF", name: "Saint Martin (French part)" },
  { code: "PM", code3: "SPM", name: "Saint Pierre and Miquelon" },
  { code: "VC", code3: "VCT", name: "Saint Vincent and the Grenadines" },
  { code: "WS", code3: "WSM", name: "Samoa" },
  { code: "SM", code3: "SMR", name: "San Marino" },
  { code: "ST", code3: "STP", name: "Sao Tome and Principe" },
  { code: "SA", code3: "SAU", name: "Saudi Arabia" },
  { code: "SN", code3: "SEN", name: "Senegal" },
  { code: "RS", code3: "SRB", name: "Serbia" },
  { code: "SC", code3: "SYC", name: "Seychelles" },
  { code: "SL", code3: "SLE", name: "Sierra Leone" },
  { code: "SG", code3: "SGP", name: "Singapore" },
  { code: "SX", code3: "SXM", name: "Sint Maarten (Dutch part)" },
  { code: "SK", code3: "SVK", name: "Slovakia" },
  { code: "SI", code3: "SVN", name: "Slovenia" },
  { code: "SB", code3: "SLB", name: "Solomon Islands" },
  { code: "SO", code3: "SOM", name: "Somalia" },
  { code: "ZA", code3: "ZAF", name: "South Africa" },
  { code: "GS", code3: "SGS", name: "South Georgia and the South Sandwich Islands" },
  { code: "SS", code3: "SSD", name: "South Sudan" },
  { code: "ES", code3: "ESP", name: "Spain" },
  { code: "LK", code3: "LKA", name: "Sri Lanka" },
  { code: "SD", code3: "SDN", name: "Sudan" },
  { code: "SR", code3: "SUR", name: "Suriname" },
  { code: "SJ", code3: "SJM", name: "Svalbard and Jan Mayen" },
  { code: "SE", code3: "SWE", name: "Sweden" },
  { code: "CH", code3: "CHE", name: "Switzerland" },
  { code: "SY", code3: "SYR", name: "Syrian Arab Republic" },
  { code: "TW", code3: "TWN", name: "Taiwan, Province of China" },
  { code: "TJ", code3: "TJK", name: "Tajikistan" },
  { code: "TZ", code3: "TZA", name: "Tanzania, United Republic of" },
  { code: "TH", code3: "THA", name: "Thailand" },
  { code: "TL", code3: "TLS", name: "Timor-Leste" },
  { code: "TG", code3: "TGO", name: "Togo" },
  { code: "TK", code3: "TKL", name: "Tokelau" },
  { code: "TO", code3: "TON", name: "Tonga" },
  { code: "TT", code3: "TTO", name: "Trinidad and Tobago" },
  { code: "TN", code3: "TUN", name: "Tunisia" },
  { code: "TR", code3: "TUR", name: "Turkey" },
  { code: "TM", code3: "TKM", name: "Turkmenistan" },
  { code: "TC", code3: "TCA", name: "Turks and Caicos Islands" },
  { code: "TV", code3: "TUV", name: "Tuvalu" },
  { code: "UG", code3: "UGA", name: "Uganda" },
  { code: "UA", code3: "UKR", name: "Ukraine" },
  { code: "AE", code3: "ARE", name: "United Arab Emirates" },
  { code: "GB", code3: "GBR", name: "United Kingdom of Great Britain and Northern Ireland" },
  { code: "US", code3: "USA", name: "United States of America" },
  { code: "UM", code3: "UMI", name: "United States Minor Outlying Islands" },
  { code: "UY", code3: "URY", name: "Uruguay" },
  { code: "UZ", code3: "UZB", name: "Uzbekistan" },
  { code: "VU", code3: "VUT", name: "Vanuatu" },
  { code: "VE", code3: "VEN", name: "Venezuela (Bolivarian Republic of)" },
  { code: "VN", code3: "VNM", name: "Viet Nam" },
  { code: "VG", code3: "VGB", name: "Virgin Islands (British)" },
  { code: "VI", code3: "VIR", name: "Virgin Islands (U.S.)" },
  { code: "WF", code3: "WLF", name: "Wallis and Futuna" },
  { code: "EH", code3: "ESH", name: "Western Sahara" },
  { code: "YE", code3: "YEM", name: "Yemen" },
  { code: "ZM", code3: "ZMB", name: "Zambia" },
  { code: "ZW", code3: "ZWE", name: "Zimbabwe" },
];

/**
 * Get country by ISO-3166-1 alpha-2 code
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(country => country.code === code.toUpperCase());
}

/**
 * Get country by ISO-3166-1 alpha-3 code
 */
export function getCountryByCode3(code3: string): Country | undefined {
  return COUNTRIES.find(country => country.code3 === code3.toUpperCase());
}

/**
 * Get country by name (case-insensitive)
 */
export function getCountryByName(name: string): Country | undefined {
  return COUNTRIES.find(country => 
    country.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Search countries by name (case-insensitive partial match)
 */
export function searchCountries(query: string): Country[] {
  if (!query || query.trim().length === 0) {
    return COUNTRIES;
  }
  
  const lowerQuery = query.toLowerCase().trim();
  return COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(lowerQuery) ||
    country.code.toLowerCase().includes(lowerQuery) ||
    country.code3.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Validate if a country code is valid ISO-3166-1 alpha-2
 */
export function isValidCountryCode(code: string): boolean {
  return COUNTRIES.some(country => country.code === code.toUpperCase());
}

/**
 * Validate if a country name matches ISO-3166 standard
 */
export function isValidCountryName(name: string): boolean {
  return COUNTRIES.some(country => 
    country.name.toLowerCase() === name.toLowerCase()
  );
}

