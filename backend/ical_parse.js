const ICAL = require("ical.js");
const { writeToFile } = require("./writeFile.js");

async function ical_parse(icalData) {
  // get iCal from BlackBoard
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
  writeToFile(assignments, 'blackboard.txt');
}

exports.ical_parse = ical_parse;
