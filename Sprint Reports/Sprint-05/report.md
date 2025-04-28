# Sprint-05 Project Manager Report

## Introduction of Teammates
- **Jack Jarjourah** – IT Operations
- **Tomiwa Ibrahim** – UI/UX Development
- **Evelyn Myers** – Developer 1
- **Kevin Aguilar** – Developer 2

## Clear Introduction and Summary of Project
We created a web-based check-in system for the Idea Shop that uses ID cards and facial recognition for secure access control. The system allows users to scan their Hawk ID to log in and tracks their check-in/check-out with photo verification. Our solution integrates a MySQL backend, facial recognition through a camera system, and an automated login/logout flow to support efficient and secure access.

## Demonstration of Project Management Tool and Explanation of 25 Point Items
https://3.basecamp.com/3649431/buckets/40911818/card_tables/8286111508
We used **Basecamp** as our project management tool during Sprint-05. At the start of the sprint, the team assigned **25 total story points**, with tasks individually estimated on a 1–5 point difficulty scale based on complexity and effort. Each task was assigned to a specific team member, with primary responsibility clearly marked.  
As Project Manager, I tracked task progress daily, verified updates through Basecamp and GitHub, and facilitated communication when blockers arose. Most tasks were successfully completed by the final week, ensuring we could demonstrate a functional application.

## Demonstrate Deployment of Full Working Application
Our application was deployed live to the production environment using **Packer** and **Terraform** automation tools. The infrastructure followed a three-tier model:  
- A **Load Balancer** at the front,
- Connected to **three web servers** handling user interactions,
- And a **single datastore** serving as the backend database.

This architecture ensured scalability, redundancy, and real-time access for all users.

## Demonstrate Login of User, Posting of a Question, and Answering of a Question
Our check-in system workflow allows a user to scan their Hawk ID card, which logs them into the application. A facial recognition snapshot is stored during check-in and automatically deleted at checkout. Kevin Aguilar implemented a timeout function that refreshes the login page after five seconds, preparing the system for the next user without manual intervention.  
Although our project’s main focus was on ID-based check-in rather than posting questions, our system successfully demonstrated the full login/logout cycle and real-time data capture.

## Report of Pen Test Results
A formal penetration test was not conducted during this sprint. No structured vulnerability scanning or external security audits were performed. Future recommendations would include scheduling a vulnerability scan using tools such as **Nmap** or **Nessus** to validate system defenses.

## Summary of User Testing Report
Limited user testing was conducted internally. We engaged with a few external students and classmates to test the ID scanning and login/logout flow. Feedback indicated that the scanning system was functional and intuitive, although full structured usability testing with detailed feedback was not completed. For a full launch, additional testing and documentation would be recommended.

## Clear Conclusion and Transition
In conclusion, the team successfully delivered a working prototype of the check-in system with ID card authentication and facial recognition. Despite the accelerated timeline, we managed to meet major technical milestones, deploy a three-tier cloud architecture, and integrate user functionality. Future improvements could focus on expanding penetration testing coverage and completing more comprehensive user testing.
