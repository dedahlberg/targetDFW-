import type { Store } from './stores';

export const FORT_WORTH_REGION_IDS = new Set([
  '1339','1368','1395','1514','1517','1536','1765','1766','1770','1836','2042','2243',
  '0758','0876','1116','1531','1922','1962','1981','2008','2278','2334','2425','2754','2907','2935','2939'
]);

export const DALLAS_REGION_IDS = new Set([
  '1430','1489','1763','1764','1775','1784','2142','2145','2234','2335','2338','2516','2520','2572',
  '0013','0055','0067','0255','0875','0947','1032','1065','1231','1850','1861','2550','2884','2917','3292','7500'
]);

export const AUSTIN_REGION_STORES: Store[] = [
  { id:'1797', name:'Super Target #1797', address:'10900 Lakeline Mall Dr', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'2288', name:'Super Target #2288', address:'9500 S IH 35 Ste G', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'2342', name:'Super Target #2342', address:'1101 C-Bar Ranch Trl Ste 2', city:'Cedar Park', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'2495', name:'Super Target #2495', address:'18700 Limestone Commercial Dr', city:'Pflugerville', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'0095', name:'Target #0095', address:'8601 Research Blvd', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'0096', name:'Target #0096', address:'2300 West Ben White Blvd', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'1061', name:'Target #1061', address:'5300 S Mo Pac Expy', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'1066', name:'Target #1066', address:'121 Louis Henna Blvd', city:'Round Rock', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'1542', name:'Target #1542', address:'5621 N Interstate 35', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'1812', name:'Target #1812', address:'3702 Ranch Road 620 S', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'1953', name:'Target #1953', address:'11220 Ranch Road 2222', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'1982', name:'Target #1982', address:'1021 W University Ave Ste B3', city:'Georgetown', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'2374', name:'Target #2374', address:'201 E Central Texas Expy', city:'Harker Heights', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'2409', name:'Target #2409', address:'10107 Research Blvd', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'2438', name:'Target #2438', address:'700 Barnes Dr', city:'San Marcos', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'2725', name:'Target #2725', address:'5188 Kyle Centre Dr', city:'Kyle', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'3250', name:'Target #3250', address:'2021 Guadalupe Street', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'3335', name:'Target #3335', address:'101 Concho St', city:'San Marcos', state:'TX', market:'Austin', timezone:'America/Chicago' },
  { id:'3342', name:'Target #3342', address:'901 E 5th St', city:'Austin', state:'TX', market:'Austin', timezone:'America/Chicago' }
];

export const SAN_ANTONIO_REGION_STORES: Store[] = [
  { id:'1354', name:'Super Target #1354', address:'18255 Blanco Rd', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'1523', name:'Super Target #1523', address:'4522 Fredericksburg Rd', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'1785', name:'Super Target #1785', address:'11311 Bandera Road', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'2239', name:'Super Target #2239', address:'22832 US Highway 281 N', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'2426', name:'Super Target #2426', address:'5355 W Loop 1604 N', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'2803', name:'Super Target #2803', address:'1223 Austin Hwy', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'0176', name:'Target #0176', address:'13700 San Pedro Ave', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'0771', name:'Target #0771', address:'2810 SW Military Drive', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'1204', name:'Target #1204', address:'8234 Agora Parkway', city:'Schertz', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'1852', name:'Target #1852', address:'3227 Southeast Military Dr', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'1979', name:'Target #1979', address:'8223 State Hwy 151', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'2187', name:'Target #2187', address:'17502 La Cantera Pkwy', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'2429', name:'Target #2429', address:'135 Creekside Way', city:'New Braunfels', state:'TX', market:'San Antonio', timezone:'America/Chicago' },
  { id:'2467', name:'Target #2467', address:'746 NW Loop 410', city:'San Antonio', state:'TX', market:'San Antonio', timezone:'America/Chicago' }
];

export const WEST_TEXAS_REGION_STORES: Store[] = [
  { id:'0083', name:'Target #0083', address:'7302 University Ave', city:'Lubbock', state:'TX', market:'West Texas', timezone:'America/Chicago' },
  { id:'0221', name:'Target #0221', address:'8201 W Interstate 40', city:'Amarillo', state:'TX', market:'West Texas', timezone:'America/Chicago' },
  { id:'0254', name:'Target #0254', address:'4235 Sunset Dr', city:'San Angelo', state:'TX', market:'West Texas', timezone:'America/Chicago' },
  { id:'0770', name:'Target #0770', address:'4001 N Midland Drive', city:'Midland', state:'TX', market:'West Texas', timezone:'America/Chicago' },
  { id:'1506', name:'Target #1506', address:'3909 E 42nd St', city:'Odessa', state:'TX', market:'West Texas', timezone:'America/Chicago' },
  { id:'2190', name:'Target #2190', address:'6064 Marsha Sharp Fwy', city:'Lubbock', state:'TX', market:'West Texas', timezone:'America/Chicago' }
];

export const EAST_TEXAS_REGION_STORES: Store[] = [
  { id:'1347', name:'Super Target #1347', address:'7110 Youree Dr', city:'Shreveport', state:'LA', market:'East Texas', timezone:'America/Chicago' },
  { id:'0167', name:'Target #0167', address:'2206 Memorial Dr', city:'Alexandria', state:'LA', market:'East Texas', timezone:'America/Chicago' },
  { id:'0775', name:'Target #0775', address:'7003 S Broadway Ave', city:'Tyler', state:'TX', market:'East Texas', timezone:'America/Chicago' },
  { id:'2273', name:'Target #2273', address:'2735 Beene Blvd', city:'Bossier City', state:'LA', market:'East Texas', timezone:'America/Chicago' },
  { id:'2283', name:'Target #2283', address:'3092 N Eastman Rd Ste 100', city:'Longview', state:'TX', market:'East Texas', timezone:'America/Chicago' }
];

export const SOUTH_TEXAS_REGION_STORES: Store[] = [
  { id:'0335', name:'Target #0335', address:'5425 S Padre Island Dr', city:'Corpus Christi', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'0801', name:'Target #0801', address:'7501 San Dario Ave', city:'Laredo', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'0802', name:'Target #0802', address:'1002 Dixieland Rd', city:'Harlingen', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'0824', name:'Target #0824', address:'708 E Expressway 83', city:'McAllen', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'0888', name:'Target #0888', address:'7608 NE Zac Lentz Pkwy', city:'Victoria', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'1490', name:'Target #1490', address:'7400 North 10th Street', city:'McAllen', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'2112', name:'Target #2112', address:'1910 Bob Bullock Loop', city:'Laredo', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'2152', name:'Target #2152', address:'301 Morrison Rd', city:'Brownsville', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'2224', name:'Target #2224', address:'3600 W Nolana Ave', city:'McAllen', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'2237', name:'Target #2237', address:'2427 E Expressway 83', city:'Mission', state:'TX', market:'South Texas', timezone:'America/Chicago' },
  { id:'2899', name:'Target #2899', address:'3022 US Highway 181', city:'Portland', state:'TX', market:'South Texas', timezone:'America/Chicago' }
];

export const EAST_HOUSTON_REGION_STORES: Store[] = [
  { id:'1336', name:'Super Target #1336', address:'8500 Main Street', city:'Houston', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'1377', name:'Super Target #1377', address:'255 Marina Bay Dr', city:'Kemah', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'1396', name:'Super Target #1396', address:'5757 Fairmont Parkway', city:'Pasadena', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'1459', name:'Super Target #1459', address:'3045 Silverlake Village Dr', city:'Pearland', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'1473', name:'Super Target #1473', address:'4313 Ambassador Caffery Pkwy', city:'Lafayette', state:'LA', market:'East Houston', timezone:'America/Chicago' },
  { id:'1837', name:'Super Target #1837', address:'1801 W Bay Area Blvd', city:'Webster', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'2320', name:'Super Target #2320', address:'1801 Gulf Fwy', city:'Dickinson', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'2389', name:'Super Target #2389', address:'6931 FM 1960 Rd E', city:'Humble', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'0158', name:'Target #0158', address:'5850 Eastex Fwy', city:'Beaumont', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'0882', name:'Target #0882', address:'202 Highway 332 W', city:'Lake Jackson', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'0887', name:'Target #0887', address:'4510 Garth Rd', city:'Baytown', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'1399', name:'Target #1399', address:'1720 W Prien Lake Rd', city:'Lake Charles', state:'LA', market:'East Houston', timezone:'America/Chicago' },
  { id:'1535', name:'Target #1535', address:'6128 Broadway St', city:'Galveston', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'1877', name:'Target #1877', address:'3100 Highway 365 Ste 90', city:'Port Arthur', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'2093', name:'Target #2093', address:'2580 Shearn St', city:'Houston', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'2377', name:'Target #2377', address:'3225 Louisiana Ave', city:'Lafayette', state:'LA', market:'East Houston', timezone:'America/Chicago' },
  { id:'2494', name:'Target #2494', address:'8503 S Sam Houston Pkwy E', city:'Houston', state:'TX', market:'East Houston', timezone:'America/Chicago' },
  { id:'3375', name:'Target #3375', address:'2075 Westheimer Road', city:'Houston', state:'TX', market:'East Houston', timezone:'America/Chicago' }
];

export const WEST_HOUSTON_REGION_STORES: Store[] = [
  { id:'1359', name:'Super Target #1359', address:'6000 Highway 6', city:'Missouri City', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1457', name:'Super Target #1457', address:'20777 US-59', city:'Humble', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1458', name:'Super Target #1458', address:'19511 Interstate 45', city:'Spring', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1786', name:'Super Target #1786', address:'16300 Southwest Fwy', city:'Sugar Land', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1908', name:'Super Target #1908', address:'23710 Westheimer Pkwy', city:'Katy', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2419', name:'Super Target #2419', address:'2700 Eldridge Pkwy', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'0075', name:'Target #0075', address:'10801 Westheimer Rd', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'0684', name:'Target #0684', address:'1100 Lake Woodlands Dr', city:'Spring', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'0800', name:'Target #0800', address:'2100 Texas Ave S', city:'College Station', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'0858', name:'Target #0858', address:'13250 Northwest Fwy', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'0907', name:'Target #0907', address:'19955 Katy Fwy', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'0955', name:'Target #0955', address:'4323 San Felipe St', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'0993', name:'Target #0993', address:'6955 Highway 6 N', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1115', name:'Target #1115', address:'503 Interstate 45 N', city:'Conroe', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1124', name:'Target #1124', address:'21515 Tomball Pkwy', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1435', name:'Target #1435', address:'984 Gessner Rd', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1894', name:'Target #1894', address:'25901 Highway 290', city:'Cypress', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1904', name:'Target #1904', address:'14302 FM 2920 Rd', city:'Tomball', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'1975', name:'Target #1975', address:'300 Meyerland Plaza Mall', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2066', name:'Target #2066', address:'6801 FM 1960 Rd W', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2139', name:'Target #2139', address:'8605 Westheimer Rd', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2144', name:'Target #2144', address:'12701 FM 1960 W', city:'Houston', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2205', name:'Target #2205', address:'23912 Commercial Drive', city:'Rosenberg', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2356', name:'Target #2356', address:'32858 FM 2978 Rd', city:'Magnolia', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2428', name:'Target #2428', address:'3061 Wildflower Dr', city:'Bryan', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2533', name:'Target #2533', address:'259 Interstate 45 S', city:'Huntsville', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2865', name:'Target #2865', address:'6635 N Grand Parkway W', city:'Spring', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2868', name:'Target #2868', address:'10241 West Grand Parkway South', city:'Richmond', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2882', name:'Target #2882', address:'22165 FM 529', city:'Katy', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2889', name:'Target #2889', address:'21836 Market Place Dr', city:'New Caney', state:'TX', market:'West Houston', timezone:'America/Chicago' },
  { id:'2911', name:'Target #2911', address:'12565 Arc Ln', city:'Stafford', state:'TX', market:'West Houston', timezone:'America/Chicago' }
];

export const AUSTIN_REGION_IDS = new Set(AUSTIN_REGION_STORES.map((s) => s.id));
export const SAN_ANTONIO_REGION_IDS = new Set(SAN_ANTONIO_REGION_STORES.map((s) => s.id));
export const WEST_TEXAS_REGION_IDS = new Set(WEST_TEXAS_REGION_STORES.map((s) => s.id));
export const EAST_TEXAS_REGION_IDS = new Set(EAST_TEXAS_REGION_STORES.map((s) => s.id));
export const SOUTH_TEXAS_REGION_IDS = new Set(SOUTH_TEXAS_REGION_STORES.map((s) => s.id));
export const EAST_HOUSTON_REGION_IDS = new Set(EAST_HOUSTON_REGION_STORES.map((s) => s.id));
export const WEST_HOUSTON_REGION_IDS = new Set(WEST_HOUSTON_REGION_STORES.map((s) => s.id));

export const ADDITIONAL_REGION_STORES: Store[] = [
  ...AUSTIN_REGION_STORES,
  ...SAN_ANTONIO_REGION_STORES,
  ...WEST_TEXAS_REGION_STORES,
  ...EAST_TEXAS_REGION_STORES,
  ...SOUTH_TEXAS_REGION_STORES,
  ...EAST_HOUSTON_REGION_STORES,
  ...WEST_HOUSTON_REGION_STORES,
];
