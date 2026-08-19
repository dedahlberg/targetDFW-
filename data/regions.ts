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

export const AUSTIN_REGION_IDS = new Set(AUSTIN_REGION_STORES.map((s) => s.id));
