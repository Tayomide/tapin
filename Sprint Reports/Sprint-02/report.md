# Sprint-02 Report

## Introduction

Previously on Sprint-01, the project was at a conceptual phase. We had a flowchart of that outlined how the application would function from the perspective of the student user. We also had some conceptual UI for the site where the student would be interacting with.

Now in Sprint-02, the team has deployed the site where a student user will log in using their credentials. In Sprint-02, we reassigned our roles as follows:


Project Manager: Kevin Alexis Aguilar


Developers: Evelyn & Yawar


UI/UX Design: Jack


IT Operations: Tomari


## Site

The team decided to eliminate the admin login option, so now there's only employee and student logins. A student can log in by simply scanning their hawk ID. If they don't have it at their disposal, they can press the student login button to manually put in their information.


## Database

In this current iteration, Airtable was implemented to hold our data.


Database Name: ideashop_tapin

Table 1: students


This is where it keeps record of all students


| student_id  | name | email | created_at |
| ------------- | ------------- | ------------- | ------------- |
| H001  | Alice Johnson | alice@example.com | 2025-02-28 13:34:16 |
| H002  | Bob Smith | bob@example.com | 2025-02-28 13:34:16 |
| H003  | Charlie Brown | charlie@example.com | 2025-02-28 13:34:16 |
| H004  | David Lee | david@example.com | 2025-02-28 13:34:16 |
| H005  | Emily Davis | emily@example.com | 2025-02-28 13:34:16 |
| H006  | Frank Harris | frank@example.com | 2025-02-28 13:34:16 |


Table 2: tap_in_logs


This is where it keeps record of the times when a student attempted to log into the site.


| log_id  | student_id | tap_in_time |
| ------------- | ------------- | ------------- |
| 1  | H001  | alice@example.com | 2025-02-28 13:35:03 |
| 2  | H002  | bob@example.com | 2025-02-28 13:40:10 |
| 3  | H003  | alice@example.com | 2025-02-28 13:45:20 |
| 4  | H004  | bob@example.com | 2025-02-28 13:50:30 |
| 5  | H005  | alice@example.com | 2025-02-28 13:52:10 |

