# Sequence Diagram Index

| Field | Value |
|-------|-------|
| Document | Sequence diagram index |
| Ruleset | [Ruleset.md](Ruleset.md) |
| Use case inventory | [UseCaseCatalog.md](../../RequirementAnalysis/UCSpec/UseCaseCatalog.md) |
| Version | 0.1 |
| Status | Draft |
| Last updated | 2026-11-14 |

This index tracks the primary sequence diagram for each v1 use case. Every use case in the catalog has exactly one primary diagram. Supplemental diagrams, if any, are listed immediately below their primary diagram. Exception supplements use the `-X` diagram ID suffix and `-Exceptions` filename suffix; phased supplements use `-Part2`, `-Part3`, and so on.

Status values are `Planned`, `Draft`, `In Review`, `Approved`, and `Deprecated`. File paths are relative to `ArchitecturalDesign/SequenceDiagram/`.

## 1. Guest / Common

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-COM-01 | Browse Problems | `GuestCommon/SD-UC-COM-01-BrowseProblems.md` | Draft | 2026-11-14 |
| SD-UC-COM-02 | Search Problems | `GuestCommon/SD-UC-COM-02-SearchProblems.md` | Draft | 2026-11-14 |
| SD-UC-COM-03 | View Problem Details | `GuestCommon/SD-UC-COM-03-ViewProblemDetails.md` | Draft | 2026-11-14 |
| SD-UC-COM-04 | View Leaderboard | `GuestCommon/SD-UC-COM-04-ViewLeaderboard.md` | Draft | 2026-11-14 |
| SD-UC-G-01 | Register Account | `GuestCommon/SD-UC-G-01-RegisterAccount.md` | Draft | 2026-11-14 |
| SD-UC-G-02 | Log In | `GuestCommon/SD-UC-G-02-Login.md` | Draft | 2026-11-14 |

## 2. User - Account

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-U-A-01 | Log Out | `User/AccountAuthentication/SD-UC-U-A-01-LogOut.md` | Draft | 2026-11-14 |
| SD-UC-U-A-02 | View Account Information | `User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md` | Draft | 2026-11-14 |
| SD-UC-U-A-03 | Update Account Information | `User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md` | Draft | 2026-11-14 |
| SD-UC-U-A-04 | Change Password | `User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md` | Draft | 2026-11-14 |
| SD-UC-U-A-04-X | Change Password - Exceptions | `User/AccountAuthentication/SD-UC-U-A-04-ChangePassword-Exceptions.md` | Draft | 2026-11-14 |

## 3. User - Practice

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-U-P-01 | Write Solution | `User/ProblemPractice/SD-UC-U-P-01-WriteSolution.md` | Draft | 2026-11-14 |
| SD-UC-U-P-02 | Select Programming Language | `User/ProblemPractice/SD-UC-U-P-02-SelectProgrammingLanguage.md` | Draft | 2026-11-14 |
| SD-UC-U-P-03 | Submit Solution | `User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md` | Draft | 2026-11-14 |
| SD-UC-U-P-03-X | Submit Solution - Exceptions | `User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md` | Draft | 2026-11-14 |

## 4. User - Submissions

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-U-S-01 | View Submission Status | `User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md` | Draft | 2026-11-14 |
| SD-UC-U-S-01-X | View Submission Status - Exceptions | `User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-U-S-02 | View Submission Result | `User/SubmissionHistory/SD-UC-U-S-02-ViewSubmissionResult.md` | Draft | 2026-11-14 |
| SD-UC-U-S-02-X | View Submission Result - Exceptions | `User/SubmissionHistory/SD-UC-U-S-02-ViewSubmissionResult-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-U-S-03 | View Submission History | `User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md` | Draft | 2026-11-14 |
| SD-UC-U-S-04 | View Submission Details | `User/SubmissionHistory/SD-UC-U-S-04-ViewSubmissionDetails.md` | Draft | 2026-11-14 |
| SD-UC-U-S-04-X | View Submission Details - Exceptions | `User/SubmissionHistory/SD-UC-U-S-04-ViewSubmissionDetails-Exceptions.md` | Draft | 2026-11-14 |

## 5. User - Progress

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-U-ST-01 | View Own Statistics | `User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md` | Draft | 2026-11-14 |

## 6. Administrator - Problems

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-AD-P-01 | Create Problem | `Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md` | Draft | 2026-11-14 |
| SD-UC-AD-P-02 | Update Problem | `Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md` | Draft | 2026-11-14 |
| SD-UC-AD-P-02-X | Update Problem - Exceptions | `Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-AD-P-03 | Delete / Deactivate Problem | `Administrator/ProblemManagement/SD-UC-AD-P-03-DeleteProblem.md` | Draft | 2026-11-14 |
| SD-UC-AD-P-04 | Manage Problem Publication | `Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md` | Draft | 2026-11-14 |
| SD-UC-AD-P-04-X | Manage Problem Publication - Exceptions | `Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication-Exceptions.md` | Draft | 2026-11-14 |

## 7. Administrator - Test Cases

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-AD-T-01 | Create Test Case | `Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-01-X | Create Test Case - Exceptions | `Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-02 | Update Test Case | `Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-02-X | Update Test Case - Exceptions | `Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-03 | Delete Test Case | `Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-03-X | Delete Test Case - Exceptions | `Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-04 | Manage Test Case Type | `Administrator/TestCaseManagement/SD-UC-AD-T-04-ManageTestCaseType.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-04-X | Manage Test Case Type - Exceptions | `Administrator/TestCaseManagement/SD-UC-AD-T-04-ManageTestCaseType-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-05 | Reorder Test Cases | `Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases.md` | Draft | 2026-11-14 |
| SD-UC-AD-T-05-X | Reorder Test Cases - Exceptions | `Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases-Exceptions.md` | Draft | 2026-11-14 |

## 8. Administrator - Users

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-AD-U-01 | View User List | `Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md` | Draft | 2026-11-14 |
| SD-UC-AD-U-01-X | View User List - Exceptions | `Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-AD-U-02 | View User Details | `Administrator/UserManagement/SD-UC-AD-U-02-ViewUserDetails.md` | Draft | 2026-11-14 |
| SD-UC-AD-U-03 | Manage User Status | `Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md` | Draft | 2026-11-14 |
| SD-UC-AD-U-03-X | Manage User Status - Exceptions | `Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus-Exceptions.md` | Draft | 2026-11-14 |

## 9. Administrator - Submissions

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-AD-S-01 | View Any Submission | `Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md` | Draft | 2026-11-14 |
| SD-UC-AD-S-01-X | View Any Submission - Exceptions | `Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission-Exceptions.md` | Draft | 2026-11-14 |

## 10. Judge Worker

| Diagram ID | Use case | File | Status | Last updated |
|------------|----------|------|--------|--------------|
| SD-UC-SYS-J-01 | Process Submission | `System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md` | Draft | 2026-11-14 |
| SD-UC-SYS-J-01-X | Process Submission - Exceptions | `System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md` | Draft | 2026-11-14 |
| SD-UC-SYS-J-02 | Recover Pending Submission | `System/Judge/SD-UC-SYS-J-02-RecoverPendingSubmission.md` | Draft | 2026-11-14 |
