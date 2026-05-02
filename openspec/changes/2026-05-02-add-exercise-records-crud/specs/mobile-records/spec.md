# Mobile Records Specification

## Purpose

Define the exercise records CRUD experience in the Fitness AI mobile app.

## Requirements

### Requirement: Exercise catalog fetch
The app SHALL fetch available exercises from the backend for use in filters and forms.

#### Scenario: Exercises load successfully
- **WHEN** the records page mounts
- **THEN** the app fetches GET /api/exercise/exercises
- **AND** populates the action filter dropdown and form picker

### Requirement: Record list with filters
The app SHALL display the user's training records with exercise and date range filters.

#### Scenario: Records load with default filters
- **WHEN** the user navigates to the records tab
- **THEN** the app fetches GET /api/exercise/records with no filters
- **AND** displays records sorted by newest first

#### Scenario: Filter by exercise
- **WHEN** the user selects an exercise from the filter
- **THEN** the records list automatically refreshes to show only that exercise's records

#### Scenario: Filter by date range
- **WHEN** the user selects start and end dates
- **THEN** the records list automatically refreshes to show records in that range

#### Scenario: No records
- **WHEN** the API returns an empty list
- **THEN** the page shows a friendly empty state message

### Requirement: Create record
The app SHALL allow creating a new exercise record via a modal form.

#### Scenario: Create record success
- **WHEN** the user fills in all required fields and submits
- **THEN** the record is created and the list refreshes

#### Scenario: Form validation
- **WHEN** the user submits with invalid values
- **THEN** inline validation errors are shown (zod messages)

### Requirement: Edit record
The app SHALL support editing existing records.

#### Scenario: Edit with pre-filled values
- **WHEN** the user taps the edit button on a record
- **THEN** a modal opens with the current record values pre-filled

### Requirement: Delete record
The app SHALL support deleting records with confirmation.

#### Scenario: Delete with confirmation
- **WHEN** the user taps delete and confirms in the alert
- **THEN** the record is deleted and the list refreshes
