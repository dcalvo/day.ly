# Day.ly

Authors: David Calvo, Connor Devlin, Marc Helou, Brennan Hughes

HopHacks @ Johns Hopkins University

# About
Day.ly is a website created to help university students navigate their online assignments easily and efficiently. It serves as a one-stop hub for all of their upcoming due-dates, deadlines, discussions, and chats. As a weekly planner that automatically populates itself, it is designed to gather information from the variety of services that the JHU community uses on a daily basis. It can gather assignment information (including a title, a due date/time, and the course information) from Blackboard and Gradescope, while delivering message notifications from GroupMe. It is easily extensible to other websites, but we chose those 3 as a proof-of-concept for the Hopkins community. 

# Program Details
Using Node.js and the Puppeteer library, our minimum-viable website scrapes Blackboard, Gradescope, and GroupMe to consolidate all student assignments into one beautiful, simple, and centralized calendar with a monthly and weekly view. It serves as a proof-of-concept that one website can be used as a launchpad and automated agenda for all of a student's classes and assignments-- a solution that fixes a problem many students have faced in the online modality.

Now, it is easier than ever to manage and organize a full online workload from one place.

# End-User
The user must log in to each of their specific class websites just once- after that, the calendar updates the list of assignments at the press of a button.

# Future Plans
Our goal is to extend this website to every online learning space used by Hopkins professors to relay due dates and other information to their students. We also want to extend the messenging apps to services such as Slack and Discord which students frequently use to coordinate with their peers. Our vision is that this will become a website that all students can use to make learning in the online modality (and beyond!) easier.