# Mobile App Shell Specification

## Purpose

Define the navigation shell and dashboard experience for the Fitness AI mobile app.

## Requirements

### Requirement: Bottom tab navigation for authenticated users
The app SHALL present a bottom tab navigator with three tabs after successful login.

#### Scenario: User logs in
- **WHEN** the user completes login successfully
- **THEN** the app transitions from the auth stack to the bottom tab navigator
- **AND** the bottom tabs show Dashboard, Records, and Profile

#### Scenario: User logs out
- **WHEN** the user taps the logout button on the Profile tab
- **THEN** the access token is removed from secure storage
- **AND** the app returns to the login screen

### Requirement: Dashboard with live stats
The Dashboard tab SHALL fetch and display training statistics from the backend API.

#### Scenario: Dashboard loads successfully
- **WHEN** the user navigates to the Dashboard tab
- **THEN** the page fetches `/api/stats/summary` and `/api/stats/weekly`
- **AND** displays summary metrics (total sessions, total reps, average score, best score)
- **AND** displays the last 7 days of daily session counts

#### Scenario: Dashboard with no data
- **WHEN** the API returns zero sessions for a new user
- **THEN** the page displays the metric cards with zero values
- **AND** the trend list is empty with a friendly message

#### Scenario: Dashboard error
- **WHEN** the API request fails
- **THEN** the page displays an error message with the reason
