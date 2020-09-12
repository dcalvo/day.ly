const ICAL = require("ical.js");
const { blackboard_scrape } = require("./blackboard_scrape");

// do stuff in an async function
(async () => {
  // you can also use the async lib to download and parse iCal from the web
  const icalData = await blackboard_scrape();
  const jcalData = await ICAL.parse(icalData);
  console.log(jcalData);
  const comp = new ICAL.Component(jcalData);
  const vevent = comp.getFirstSubcomponent("vevent");
  const summary = vevent.getFirstPropertyValue("summary");
  console.log(summary);
})().catch(console.error.bind());
