# Hyperlocal Governance and Municipal StreetFix Management System

## Complete Project Requirements (Java Full Stack)

### Project Vision

Develop a modern civic issue management platform that connects citizens, municipal officers, field workers, and administrators. The system enables quick reporting, tracking, assignment, resolution, and monitoring of municipal issues while improving transparency and accountability.

---
### Project Objective

The main objective of this project is to provide a digital platform that enables citizens to report civic and municipal issues directly to local authorities. The system helps municipal officers manage complaints efficiently, track issue resolution progress, and improve transparency between citizens and government departments.

### Problem Statement

Many municipal issues such as road damage, garbage overflow, water leakage, drainage blockage, and streetlight failures are often reported manually. This process causes delays, lack of transparency, and inefficient communication between citizens and municipal authorities.

A centralized digital system is required to simplify issue reporting, complaint tracking, assignment management, and resolution monitoring.

### Proposed Solution

The Hyperlocal Governance and Municipal StreetFix Management System provides:

Online complaint registration
Real-time complaint tracking
Officer and worker assignment
Status updates
Citizen feedback collection
Administrative monitoring
Analytics and reporting dashboard

The platform creates a direct connection between citizens and municipal departments, ensuring faster issue resolution.

# Technology Stack

## Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* JWT Authentication
* Maven
* REST API

## Frontend

* React.js
* HTML5
* CSS3
* Bootstrap
* JavaScript
* Axios

## Database

* MySQL

## Tools

* IntelliJ IDEA
* Postman
* Git
* GitHub

---

# User Roles

## Citizen

* Register
* Login
* Report issue
* Upload photos
* Add location
* Track complaint
* Receive notifications
* View complaint history
* Submit feedback
* View nearby reported issues
* Follow complaint updates

## Municipal Officer

* Login
* View assigned complaints
* Assign field workers
* Update complaint progress
* Upload completion proof
* Resolve complaints
* View performance metrics

## Field Worker

* View assigned tasks
* Accept task
* Update work progress
* Upload before/after images
* Mark task completed

## Administrator

* Manage users
* Manage officers
* Manage workers
* Manage categories
* View analytics
* Generate reports
* Monitor activities
* Configure system settings

---

# Core Features

## Authentication Module

* User Registration
* Login
* Logout
* Forgot Password
* Reset Password
* JWT Security
* Role-Based Access Control

## Complaint Management Module

* Create Complaint
* Update Complaint
* Delete Complaint
* View Complaint Details
* Upload Multiple Images
* Geo Location Capture
* Status Tracking
* Complaint Timeline

## Assignment Module

* Officer Assignment
* Worker Assignment
* Priority Assignment
* Escalation Management

## Notification Module

* Email Notification
* SMS Notification
* In-App Notification

## Feedback Module

* Rating System
* Citizen Comments
* Service Review

## Dashboard Module

* Complaint Statistics
* Resolution Statistics
* Officer Performance
* Worker Performance
* Monthly Reports

---

# Advanced Features

## Smart Priority Engine

Automatically assign:

* High
* Medium
* Low

Based on:

* Severity
* Category
* Complaint Frequency
* Public Impact

---

## Duplicate Complaint Detection

Detect similar complaints using:

* Location
* Category
* Description

---

## Complaint Heatmap

Display issue density on map.

---

## Ward-Level Analytics

Show:

* Total Complaints
* Resolved Complaints
* Pending Complaints
* Average Resolution Time

---

## Public Transparency Portal

Citizens can view:

* Open Issues
* Resolved Issues
* Department Performance

---

## Complaint Escalation System

If unresolved:

* 3 Days → Officer Reminder
* 7 Days → Department Head
* 15 Days → Administrator Alert

---

## Leaderboard System

Track:

* Best Officers
* Best Workers
* Fastest Resolution Teams

---

## AI-Based Future Enhancements

* Complaint Categorization
* Severity Prediction
* Chatbot Assistance
* Resolution Recommendation

---

# Complaint Lifecycle

Citizen Creates Complaint

↓

Pending

↓

Assigned

↓

Accepted

↓

In Progress

↓

Resolved

↓

Citizen Verification

↓

Feedback Submitted

↓

Closed

---

# Database Design

## users

* id
* name
* email
* password
* role
* phone
* address
* created_at

## complaints

* id
* title
* description
* category
* priority
* status
* latitude
* longitude
* image_url
* created_at
* updated_at
* citizen_id

## officers

* id
* user_id
* department

## workers

* id
* user_id
* specialization

## assignments

* id
* complaint_id
* officer_id
* worker_id
* assigned_date

## feedback

* id
* complaint_id
* rating
* comments

## notifications

* id
* user_id
* message
* status

## audit_logs

* id
* action
* user_id
* timestamp

---

# REST API Design

## Authentication APIs

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/forgot-password

POST /api/auth/reset-password

---

## Complaint APIs

GET /api/complaints

POST /api/complaints

GET /api/complaints/{id}

PUT /api/complaints/{id}

DELETE /api/complaints/{id}

GET /api/complaints/status/{status}

GET /api/complaints/category/{category}

---

## Assignment APIs

POST /api/assignments

GET /api/assignments

PUT /api/assignments/{id}

---

## Feedback APIs

POST /api/feedback

GET /api/feedback

---

## Dashboard APIs

GET /api/dashboard/admin

GET /api/dashboard/officer

GET /api/dashboard/citizen

---

# User Stories

### Citizen

As a citizen, I want to register an account so that I can report municipal issues.

As a citizen, I want to upload issue photos so that officers can understand the problem.

As a citizen, I want to track complaint status so that I know the progress.

As a citizen, I want to provide feedback so that service quality can improve.

---

### Officer

As an officer, I want to assign complaints to workers so that issues are resolved quickly.

As an officer, I want to monitor complaint progress so that work is completed on time.

---

### Worker

As a worker, I want to view assigned tasks so that I can perform field operations.

As a worker, I want to upload completion images so that work proof is available.

---

### Admin

As an admin, I want to monitor all system activities so that governance remains transparent.

---

# Test Cases

# Test Cases

| Test Case ID | Module          | Test Scenario                       | Expected Result                      |
| ------------ | --------------- | ----------------------------------- | ------------------------------------ |
| TC001        | Registration    | Register with valid details         | Account created successfully         |
| TC002        | Registration    | Register with existing email        | Email already exists error           |
| TC003        | Login           | Login with valid credentials        | Login successful                     |
| TC004        | Login           | Login with invalid credentials      | Authentication failed                |
| TC005        | Forgot Password | Submit registered email             | Password reset link sent             |
| TC006        | Complaint       | Create complaint with valid details | Complaint created successfully       |
| TC007        | Complaint       | Create complaint without title      | Validation error                     |
| TC008        | Complaint       | Upload complaint image              | Image uploaded successfully          |
| TC009        | Complaint       | View complaint details              | Complaint information displayed      |
| TC010        | Complaint       | Search complaint by category        | Matching complaints displayed        |
| TC011        | Complaint       | Filter complaint by status          | Correct complaints displayed         |
| TC012        | Assignment      | Assign complaint to officer         | Assignment successful                |
| TC013        | Assignment      | Assign complaint to worker          | Worker assigned successfully         |
| TC014        | Officer         | Update complaint status             | Status updated successfully          |
| TC015        | Officer         | Mark complaint as resolved          | Complaint resolved                   |
| TC016        | Worker          | Update task progress                | Progress updated                     |
| TC017        | Worker          | Upload completion image             | Image uploaded successfully          |
| TC018        | Feedback        | Submit rating and feedback          | Feedback saved                       |
| TC019        | Feedback        | Submit feedback without rating      | Validation error                     |
| TC020        | Dashboard       | View dashboard statistics           | Statistics loaded correctly          |
| TC021        | Notification    | Generate complaint notification     | Notification sent                    |
| TC022        | User Management | Admin creates officer account       | Officer account created              |
| TC023        | User Management | Admin disables user account         | User account disabled                |
| TC024        | Security        | Access protected API without token  | Access denied                        |
| TC025        | Security        | Access admin page with citizen role | Unauthorized access blocked          |
| TC026        | Security        | JWT token validation                | Token verified successfully          |
| TC027        | Database        | Save complaint record               | Data stored successfully             |
| TC028        | Database        | Retrieve complaint history          | History displayed correctly          |
| TC029        | Analytics       | Generate monthly report             | Report generated                     |
| TC030        | System          | Concurrent complaint submission     | System handles requests successfully |

## Unit Testing

* Service Layer Testing
* Repository Layer Testing
* Controller Layer Testing
* Security Layer Testing

## Integration Testing

* Frontend to Backend Communication
* API Integration Testing
* Database Integration Testing
* Authentication Flow Testing

## User Acceptance Testing (UAT)

* Citizen Complaint Submission
* Complaint Tracking
* Officer Assignment
* Worker Completion
* Feedback Submission
* Admin Monitoring

## Performance Testing

* Login Response Time
* Complaint Creation Response Time
* Dashboard Loading Time
* Concurrent User Handling

## Security Testing

* JWT Authentication Testing
* Authorization Testing
* SQL Injection Prevention
* Cross-Site Scripting (XSS) Prevention
* Input Validation Testing


## Authentication Test Cases

### TC001

Register with valid details

Expected Result:
Account created successfully

### TC002

Register with existing email

Expected Result:
Email already exists

### TC003

Login with valid credentials

Expected Result:
Login successful

### TC004

Login with invalid credentials

Expected Result:
Authentication failed

---

## Complaint Test Cases

### TC005

Create complaint with valid data

Expected Result:
Complaint created

### TC006

Submit complaint without title

Expected Result:
Validation error

### TC007

Upload complaint image

Expected Result:
Image uploaded successfully

### TC008

Track complaint status

Expected Result:
Correct status displayed

---

## Assignment Test Cases

### TC009

Assign complaint to worker

Expected Result:
Assignment successful

### TC010

Update complaint status

Expected Result:
Status updated

---

## Feedback Test Cases

### TC011

Submit feedback

Expected Result:
Feedback saved

### TC012

Submit feedback without rating

Expected Result:
Validation error

---

# Non Functional Requirements

* Secure Authentication
* Responsive Design
* Mobile Friendly
* Fast API Response
* Data Integrity
* Scalability
* Maintainability
* Reliability
* Availability

---

# Future Scope
# Enterprise Features Roadmap

## Project

**AI-Powered Smart Municipal Governance & StreetFix Management System**

---

# Objective

Upgrade the existing StreetFix project into an enterprise-level Smart Municipal Governance platform without rewriting the current project.

**Important Principles**

* Do not rewrite the project.
* Do not remove existing functionality.
* Extend the existing architecture.
* Keep all existing APIs working.
* Implement new features in phases.
* Test every feature before moving to the next phase.

---

# Phase 1 – Smart Governance

## 1. Smart SLA Management

### Description

Define SLA (Service Level Agreement) for every complaint category.

### Features

* SLA Timer
* Due Date
* Remaining Time
* Expired Status
* SLA Configuration
* Officer Deadline

---

## 2. Automatic Complaint Escalation

### Workflow

Citizen

↓

Municipal Officer

↓

Ward Supervisor

↓

Zonal Officer

↓

Municipal Commissioner

↓

Super Admin

### Features

* Auto Escalation
* Manual Escalation
* Escalation Logs
* Escalation History
* Escalation Reason
* Escalation Dashboard

---

## 3. Reminder System

### Features

* Reminder Before SLA
* Reminder After SLA
* Officer Reminder
* Supervisor Reminder
* Email Reminder
* Notification Reminder

---

## 4. Critical Alert System

Generate alerts when:

* Complaint exceeds SLA
* Multiple escalations occur
* Emergency complaint remains pending

---

## 5. Complaint Timeline

Display complete complaint history.

Example:

Submitted

↓

Verified

↓

Assigned

↓

Accepted

↓

In Progress

↓

Resolved

↓

Citizen Verification

↓

Closed

---

# Phase 2 – Smart Complaint Management

## AI Complaint Categorization

Automatically classify complaints into:

* Garbage
* Street Light
* Road Damage
* Water Leakage
* Drainage
* Sewage
* Illegal Dumping
* Tree Maintenance
* Public Property Damage
* Other

---

## AI Priority Detection

Priority Levels

* Critical
* High
* Medium
* Low

---

## Duplicate Complaint Detection

Detect duplicate complaints using:

* Location
* Category
* Similar Description

Allow citizens to support existing complaints.

---

## Community Verification

Nearby citizens can

* Confirm Complaint
* Support Complaint
* Increase Priority

---

## Voice Complaint

Citizen can register complaints using voice input.

---

## Emergency Complaint Mode

Emergency complaints receive

* Highest Priority
* Immediate Assignment
* Faster Escalation
* Critical Alerts

---

# Phase 3 – Smart City Features

## Google Maps

* Complaint Location
* Live Map
* Nearby Complaints
* Route Navigation

---

## Heat Map

Display complaint hotspots.

---

## QR Code Complaint System

Each municipal asset contains a QR code.

Scanning the QR code opens the complaint page.

---

## Asset Management

Manage

* Roads
* Street Lights
* Drainage
* Parks
* Dustbins
* Water Pipelines

Store

* Asset ID
* Asset Type
* QR Code
* GPS Location
* Maintenance History
* Status

---

# Phase 4 – Analytics

## Officer Dashboard

* Assigned Complaints
* Completed Complaints
* Pending Complaints
* Average Resolution Time
* SLA Compliance
* Citizen Rating

---

## Ward Dashboard

* Total Complaints
* Pending
* Resolved
* Resolution Rate
* Average Time

---

## Department Dashboard

* Performance
* Pending Cases
* Monthly Statistics

---

## Budget Management

Track

* Estimated Cost
* Actual Cost
* Monthly Budget
* Department Budget

---

## Analytics Dashboard

Generate

* Complaint Analytics
* Category Analytics
* Area Analytics
* Officer Analytics
* Monthly Reports
* Yearly Reports

---

## AI Dashboard

Display

* Complaint Trend Prediction
* Hotspot Prediction
* Workload Prediction
* Department Recommendation
* Officer Recommendation

---

# Phase 5 – Citizen Experience

## Before & After Verification

Officer uploads

* Before Images
* After Images
* Completion Notes

Citizen verifies the completed work.

---

## Citizen Feedback

* 5-Star Rating
* Comments
* Satisfaction Score

---

## Notification System

Support

* In-App Notifications
* Email Notifications
* Escalation Alerts
* Reminder Alerts
* Resolution Alerts

---

## Public Transparency Portal

Display

* Public Complaint Statistics
* Ward Performance
* Resolution Rate
* Monthly Reports

---

# User Roles

* Citizen
* Municipal Officer
* Ward Supervisor
* Zonal Officer
* Department Head
* Municipal Commissioner
* Super Admin

---

# Development Rules

* Preserve all existing functionality.
* Do not rewrite the project.
* Do not delete existing code.
* Use clean architecture.
* Implement features phase by phase.
* Test each phase before proceeding.
* Commit and push to GitHub after every completed phase.
* Maintain backward compatibility with existing APIs and database wherever possible.

---

# Expected Outcome

The project evolves from a standard municipal complaint system into an enterprise-grade Smart Municipal Governance Platform with intelligent automation, dashboards, analytics, and scalable architecture while preserving the existing codebase.
# Additional User Stories for Enterprise Features

## Epic: Smart Governance

### US-01 – Smart SLA Management

**As a Municipal Administrator,**
I want to define SLA rules for each complaint category,
so that complaints are resolved within the expected time.

---

### US-02 – Automatic Escalation

**As a Municipal Commissioner,**
I want unresolved complaints to be automatically escalated through the authority hierarchy,
so that no complaint remains unattended.

---

### US-03 – Reminder Notifications

**As a Municipal Officer,**
I want to receive reminders before the SLA expires,
so that I can complete the assigned work on time.

---

### US-04 – Critical Alert System

**As a Commissioner,**
I want to receive critical alerts for overdue or emergency complaints,
so that immediate action can be taken.

---

### US-05 – Complaint Timeline

**As a Citizen,**
I want to view the complete history of my complaint,
so that I can track every stage of the resolution process.

---

# Epic: Smart Complaint Management

### US-06 – AI Complaint Categorization

**As a Citizen,**
I want the system to automatically identify the complaint category,
so that my complaint reaches the correct department faster.

---

### US-07 – AI Priority Detection

**As a Municipal Officer,**
I want complaints to be automatically prioritised,
so that urgent issues are handled first.

---

### US-08 – Duplicate Complaint Detection

**As a Citizen,**
I want the system to detect duplicate complaints,
so that multiple reports for the same issue are avoided.

---

### US-09 – Community Verification

**As a Citizen,**
I want to support and verify nearby complaints,
so that important public issues receive higher priority.

---

### US-10 – Emergency Complaint

**As a Citizen,**
I want emergency complaints to receive immediate attention,
so that dangerous situations are resolved quickly.

---

# Epic: Smart City Features

### US-11 – Google Maps Integration

**As a Citizen,**
I want to select the complaint location using a map,
so that officers can easily find the exact location.

---

### US-12 – Heat Map

**As a Commissioner,**
I want to view complaint hotspots on a heat map,
so that high-risk areas can be identified.

---

### US-13 – QR Code Complaint

**As a Citizen,**
I want to scan a QR code on municipal assets,
so that I can report issues instantly.

---

### US-14 – Asset Management

**As a Department Head,**
I want to manage municipal assets and their maintenance history,
so that maintenance activities are properly tracked.

---

# Epic: Analytics & Monitoring

### US-15 – Officer Performance Dashboard

**As a Ward Supervisor,**
I want to monitor officer performance,
so that work can be distributed fairly and efficiently.

---

### US-16 – Ward Performance Dashboard

**As a Commissioner,**
I want to compare ward performance,
so that low-performing wards can be improved.

---

### US-17 – Budget Management

**As a Finance Officer,**
I want to monitor estimated and actual project costs,
so that municipal budgets are managed effectively.

---

### US-18 – Analytics Dashboard

**As a Municipal Administrator,**
I want detailed reports and analytics,
so that data-driven decisions can be made.

---

# Epic: Citizen Experience

### US-19 – Before & After Verification

**As a Citizen,**
I want to view before-and-after photos of completed work,
so that I can verify the quality of the resolution.

---

### US-20 – Citizen Feedback

**As a Citizen,**
I want to rate completed work and provide feedback,
so that the municipality can improve its services.

---

### US-21 – Smart Notifications

**As a User,**
I want to receive notifications for every important complaint update,
so that I always know the current status of my complaint.

---

### US-22 – Public Transparency Portal

**As a Citizen,**
I want to view public complaint statistics and municipal performance,
so that government services remain transparent and accountable.

* Mobile App
* AI Chatbot
* Voice Complaint Registration
* WhatsApp Complaint Integration
* GIS Integration
* Smart City Dashboard
* IoT Sensor Integration
* Predictive Analytics

---

# Deliverables

* Source Code
* Database Script
* API Documentation
* UI Wireframes
* Test Cases
* Project Report
* User Manual
* Deployment Guide
* PPT Presentation
* Architecture Diagram

---

# Expected Outcome

The platform should reduce complaint resolution time, improve citizen satisfaction, increase transparency, and provide efficient municipal governance through a centralized digital management system.
