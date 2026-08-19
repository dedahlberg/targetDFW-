export type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
};

export const stores: Store[] = [
  { id: '1339', name: 'Super Target #1339', address: '1600 West Arbrook Blvd', city: 'Arlington', state: 'TX' },
  { id: '1368', name: 'Super Target #1368', address: '1401 W Glade Rd', city: 'Euless', state: 'TX' },
  { id: '1395', name: 'Super Target #1395', address: '725 Hebron Parkway', city: 'Lewisville', state: 'TX' },
  { id: '1514', name: 'Super Target #1514', address: '8532 Davis Blvd', city: 'North Richland Hills', state: 'TX' },
  { id: '1517', name: 'Super Target #1517', address: '5959 Long Prairie Rd', city: 'Flower Mound', state: 'TX' },
  { id: '1536', name: 'Super Target #1536', address: '1801 Highway 287 N', city: 'Mansfield', state: 'TX' },
  { id: '1765', name: 'Super Target #1765', address: '8000 Denton Highway', city: 'Fort Worth', state: 'TX' },
  { id: '1766', name: 'Super Target #1766', address: '1400 Precinct Line Road', city: 'Hurst', state: 'TX' },
  { id: '1770', name: 'Super Target #1770', address: '5700 Overton Ridge Blvd', city: 'Fort Worth', state: 'TX' },
  { id: '1836', name: 'Super Target #1836', address: '739 N Highway 67', city: 'Cedar Hill', state: 'TX' },
  { id: '2042', name: 'Super Target #2042', address: '301 Carroll St', city: 'Fort Worth', state: 'TX' },
  { id: '2243', name: 'Super Target #2243', address: '5270 S State Highway 360', city: 'Grand Prairie', state: 'TX' },

  { id: '0758', name: 'Target #0758', address: '8550 East Fwy', city: 'Fort Worth', state: 'TX' },
  { id: '0876', name: 'Target #0876', address: '1101 Ira E Woods Ave', city: 'Grapevine', state: 'TX' },
  { id: '1116', name: 'Target #1116', address: '554 W Interstate 20', city: 'Grand Prairie', state: 'TX' },
  { id: '1531', name: 'Target #1531', address: '5401 Bosque Blvd', city: 'Waco', state: 'TX' },
  { id: '1922', name: 'Target #1922', address: '200 NW John Jones Dr', city: 'Burleson', state: 'TX' },
  { id: '1962', name: 'Target #1962', address: '1316 N Highway 77', city: 'Waxahachie', state: 'TX' },
  { id: '1981', name: 'Target #1981', address: '122 I-20', city: 'Weatherford', state: 'TX' },
  { id: '2008', name: 'Target #2008', address: '6604 Lake Worth Blvd', city: 'Fort Worth', state: 'TX' },
  { id: '2278', name: 'Target #2278', address: '3550 S General Bruce Dr', city: 'Temple', state: 'TX' },
  { id: '2334', name: 'Target #2334', address: '39739 Lyndon B Johnson Fwy', city: 'Dallas', state: 'TX' },
  { id: '2425', name: 'Target #2425', address: '751 Alta Mere Dr', city: 'Fort Worth', state: 'TX' },
  { id: '2754', name: 'Target #2754', address: '8917 Tehama Ridge Parkway', city: 'Fort Worth', state: 'TX' },
  { id: '2907', name: 'Target #2907', address: '655 W Illinois Ave', city: 'Dallas', state: 'TX' },
  { id: '2935', name: 'Target #2935', address: '5900 Retail Way', city: 'Fort Worth', state: 'TX' },
  { id: '2939', name: 'Target #2939', address: '11520 E US 80', city: 'Forney', state: 'TX' },

  { id: '1430', name: 'Super Target #1430', address: '601 South Plano Road', city: 'Richardson', state: 'TX' },
  { id: '1489', name: 'Super Target #1489', address: '5301 N Garland Ave', city: 'Garland', state: 'TX' },
  { id: '1763', name: 'Super Target #1763', address: '3201 Preston Rd', city: 'Frisco', state: 'TX' },
  { id: '1764', name: 'Super Target #1764', address: '2200 Dallas Pkwy', city: 'Plano', state: 'TX' },
  { id: '1775', name: 'Super Target #1775', address: '16731 Coit Rd', city: 'Dallas', state: 'TX' },
  { id: '1784', name: 'Super Target #1784', address: '6419 Skillman St', city: 'Dallas', state: 'TX' },
  { id: '2142', name: 'Super Target #2142', address: '8900 State Highway 121', city: 'McKinney', state: 'TX' },
  { id: '2145', name: 'Super Target #2145', address: '1801 S Loop 288', city: 'Denton', state: 'TX' },
  { id: '2234', name: 'Super Target #2234', address: '4701 Lakeview Pkwy', city: 'Rowlett', state: 'TX' },
  { id: '2335', name: 'Super Target #2335', address: '2025 N Central Expy', city: 'McKinney', state: 'TX' },
  { id: '2338', name: 'Super Target #2338', address: '4885 Eldorado Pkwy', city: 'Frisco', state: 'TX' },
  { id: '2516', name: 'Super Target #2516', address: '150 E Stacy Rd Ste 2400', city: 'Allen', state: 'TX' },
  { id: '2520', name: 'Super Target #2520', address: '4760 State Highway 121', city: 'The Colony', state: 'TX' },
  { id: '2572', name: 'Super Target #2572', address: '1629 N Town East Blvd', city: 'Mesquite', state: 'TX' },

  { id: '0013', name: 'Target #0013', address: '13131 Montfort Drive', city: 'Dallas', state: 'TX' },
  { id: '0055', name: 'Target #0055', address: '6464 E Northwest Hwy Ste 212', city: 'Dallas', state: 'TX' },
  { id: '0067', name: 'Target #0067', address: '120 W Parker Rd', city: 'Plano', state: 'TX' },
  { id: '0255', name: 'Target #0255', address: '3333 W Airport Fwy', city: 'Irving', state: 'TX' },
  { id: '0875', name: 'Target #0875', address: '2417 N Haskell Ave', city: 'Dallas', state: 'TX' },
  { id: '0947', name: 'Target #0947', address: '9440 Marsh Ln', city: 'Dallas', state: 'TX' },
  { id: '1032', name: 'Target #1032', address: '7845 N MacArthur Blvd', city: 'Irving', state: 'TX' },
  { id: '1065', name: 'Target #1065', address: '850 Steger Towne Rd', city: 'Rockwall', state: 'TX' },
  { id: '1231', name: 'Target #1231', address: '907 W McDermott Dr', city: 'Allen', state: 'TX' },
  { id: '1850', name: 'Target #1850', address: '3730 Belt Line Rd', city: 'Addison', state: 'TX' },
  { id: '1861', name: 'Target #1861', address: '4160 Town Center Rd', city: 'Sherman', state: 'TX' },
  { id: '2550', name: 'Target #2550', address: '3440 W FM 544', city: 'Wylie', state: 'TX' },
  { id: '2884', name: 'Target #2884', address: '401 Gates Pkwy', city: 'Prosper', state: 'TX' },
  { id: '2917', name: 'Target #2917', address: '2755 W University Dr Ste 1101', city: 'Denton', state: 'TX' },
  { id: '3292', name: 'Target #3292', address: '8335 Westchester Dr #200', city: 'Dallas', state: 'TX' },
  { id: '7500', name: 'Target #7500', address: '26550 E University Dr', city: 'Aubrey', state: 'TX' }
];
