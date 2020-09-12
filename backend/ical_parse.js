const ICAL = require("ical.js");
const { blackboard_scrape } = require("./blackboard_scrape");

(async () => {
  // get iCal from BlackBoard
  const icalData = await blackboard_scrape();
  const jcalData = await ICAL.parse(icalData);

  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");
  let assignments = [];
  vevents.forEach((vevent) => {
    const assignment = vevent.getFirstPropertyValue("summary");
    const dueDateObject = vevent.getFirstPropertyValue("dtend").toJSON();
    assignments.push({
      assignment: assignment,
      class: null,
      dueDate: {
        month: dueDateObject.month,
        day: dueDateObject.day,
        hour: dueDateObject.hour,
        minute: dueDateObject.minute,
      },
      origin: "BlackBoard",
    });
  });
  console.log(assignments);
})().catch(console.error.bind());
