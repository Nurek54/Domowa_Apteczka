<p align="right">
  <a href="README.md"><img src="https://img.shields.io/badge/English-active-4F46E5?style=flat-square" alt="English" /></a>
  <a href="README.pl.md"><img src="https://img.shields.io/badge/Polski-switch-64748B?style=flat-square" alt="Polski" /></a>
</p>

<a href="#see-it-in-action">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/banner-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="docs/banner-light.svg" />
    <img src="docs/banner-light.svg" alt="Domowa Apteczka: track every medicine at home, for the whole family" width="100%" />
  </picture>
</a>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7_(Rolldown)-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-12-DD2C00?style=flat-square&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/License-MIT-22C55E?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <a href="#see-it-in-action"><b>Demo</b></a> &nbsp;·&nbsp;
  <a href="#highlights"><b>Highlights</b></a> &nbsp;·&nbsp;
  <a href="#screenshots"><b>Screenshots</b></a> &nbsp;·&nbsp;
  <a href="#how-it-works"><b>How it works</b></a> &nbsp;·&nbsp;
  <a href="#data-model"><b>Data model</b></a> &nbsp;·&nbsp;
  <a href="#getting-started"><b>Getting started</b></a>
</p>

> [!NOTE]
> **An organizer, not medical advice.** The app keeps track of what you have at home and when to take it. It does not check doses or drug interactions; always follow your doctor's or pharmacist's instructions.

**Domowa Apteczka** (*home medicine cabinet*) is a single-page web app for keeping the medicines at home under control. Add what you have with dose, quantity, category and expiry date; the dashboard tells you at a glance what is **still valid**, what **expires within 30 days** and what is **already expired**. Turn a prescription into a **treatment plan** (weekdays, hours, start and optional end date) and see every dose laid out on a monthly calendar.

Medicine cabinets are usually shared, so the app has **families**: create a group, invite people with a short code or by e-mail, give them a role (**owner**, **admin**, **member**, **viewer**) and look into each other's medicines. Everything runs in the browser on top of **Firebase Authentication** (e-mail + Google) and **Cloud Firestore**; there is no custom backend to host.

<p align="center"><b>Keywords</b></p>

<table align="center">
  <tr>
    <td align="right" valign="middle"><sub><b>Frontend</b></sub></td>
    <td>
      <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
      <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
      <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
      <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
      <img src="https://img.shields.io/badge/React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router" />
      <img src="https://img.shields.io/badge/date--fns-770C56?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNOCAydjQiIC8%2BIDxwYXRoIGQ9Ik0xNiAydjQiIC8%2BIDxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iNCIgcng9IjIiIC8%2BIDxwYXRoIGQ9Ik0zIDEwaDE4IiAvPiA8cGF0aCBkPSJNOCAxNGguMDEiIC8%2BIDxwYXRoIGQ9Ik0xMiAxNGguMDEiIC8%2BIDxwYXRoIGQ9Ik0xNiAxNGguMDEiIC8%2BIDxwYXRoIGQ9Ik04IDE4aC4wMSIgLz4gPHBhdGggZD0iTTEyIDE4aC4wMSIgLz4gPHBhdGggZD0iTTE2IDE4aC4wMSIgLz4gPC9zdmc%2B" alt="date-fns" />
    </td>
  </tr>
  <tr>
    <td align="right" valign="middle"><sub><b>Backend&nbsp;/&nbsp;BaaS</b></sub></td>
    <td>
      <img src="https://img.shields.io/badge/Firebase-DD2C00?style=flat-square&logo=firebase&logoColor=white" alt="Firebase" />
      <img src="https://img.shields.io/badge/Cloud%20Firestore-FFA000?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8ZWxsaXBzZSBjeD0iMTIiIGN5PSI1IiByeD0iOSIgcnk9IjMiIC8%2BIDxwYXRoIGQ9Ik0zIDVWMTlBOSAzIDAgMCAwIDIxIDE5VjUiIC8%2BIDxwYXRoIGQ9Ik0zIDEyQTkgMyAwIDAgMCAyMSAxMiIgLz4gPC9zdmc%2B" alt="Cloud Firestore" />
      <img src="https://img.shields.io/badge/Firebase%20Auth-F57C00?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMi41ODYgMTcuNDE0QTIgMiAwIDAgMCAyIDE4LjgyOFYyMWExIDEgMCAwIDAgMSAxaDNhMSAxIDAgMCAwIDEtMXYtMWExIDEgMCAwIDEgMS0xaDFhMSAxIDAgMCAwIDEtMXYtMWExIDEgMCAwIDEgMS0xaC4xNzJhMiAyIDAgMCAwIDEuNDE0LS41ODZsLjgxNC0uODE0YTYuNSA2LjUgMCAxIDAtNC00eiIgLz4gPGNpcmNsZSBjeD0iMTYuNSIgY3k9IjcuNSIgcj0iLjUiIGZpbGw9ImN1cnJlbnRDb2xvciIgLz4gPC9zdmc%2B" alt="Firebase Auth" />
      <img src="https://img.shields.io/badge/Google%20OAuth-4285F4?style=flat-square&logo=google&logoColor=white" alt="Google OAuth" />
    </td>
  </tr>
  <tr>
    <td align="right" valign="middle"><sub><b>Concepts</b></sub></td>
    <td>
      <img src="https://img.shields.io/badge/Single--Page%20App-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHJ4PSIyIiAvPiA8cGF0aCBkPSJNMTAgNHY0IiAvPiA8cGF0aCBkPSJNMiA4aDIwIiAvPiA8cGF0aCBkPSJNNiA0djQiIC8%2BIDwvc3ZnPg%3D%3D" alt="Single-Page App" />
      <img src="https://img.shields.io/badge/NoSQL%20Data%20Modeling-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMi45NyAxMi45MkEyIDIgMCAwIDAgMiAxNC42M3YzLjI0YTIgMiAwIDAgMCAuOTcgMS43MWwzIDEuOGEyIDIgMCAwIDAgMi4wNiAwTDEyIDE5di01LjVsLTUtMy00LjAzIDIuNDJaIiAvPiA8cGF0aCBkPSJtNyAxNi41LTQuNzQtMi44NSIgLz4gPHBhdGggZD0ibTcgMTYuNSA1LTMiIC8%2BIDxwYXRoIGQ9Ik03IDE2LjV2NS4xNyIgLz4gPHBhdGggZD0iTTEyIDEzLjVWMTlsMy45NyAyLjM4YTIgMiAwIDAgMCAyLjA2IDBsMy0xLjhhMiAyIDAgMCAwIC45Ny0xLjcxdi0zLjI0YTIgMiAwIDAgMC0uOTctMS43MUwxNyAxMC41bC01IDNaIiAvPiA8cGF0aCBkPSJtMTcgMTYuNS01LTMiIC8%2BIDxwYXRoIGQ9Im0xNyAxNi41IDQuNzQtMi44NSIgLz4gPHBhdGggZD0iTTE3IDE2LjV2NS4xNyIgLz4gPHBhdGggZD0iTTcuOTcgNC40MkEyIDIgMCAwIDAgNyA2LjEzdjQuMzdsNSAzIDUtM1Y2LjEzYTIgMiAwIDAgMC0uOTctMS43MWwtMy0xLjhhMiAyIDAgMCAwLTIuMDYgMGwtMyAxLjhaIiAvPiA8cGF0aCBkPSJNMTIgOCA3LjI2IDUuMTUiIC8%2BIDxwYXRoIGQ9Im0xMiA4IDQuNzQtMi44NSIgLz4gPHBhdGggZD0iTTEyIDEzLjVWOCIgLz4gPC9zdmc%2B" alt="NoSQL Data Modeling" />
      <img src="https://img.shields.io/badge/Role--based%20Access-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8%2BIDxwYXRoIGQ9Im05IDEyIDIgMiA0LTQiIC8%2BIDwvc3ZnPg%3D%3D" alt="Role-based Access" />
      <img src="https://img.shields.io/badge/CRUD-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4gPHBhdGggZD0ibTE1IDUgNCA0IiAvPiA8L3N2Zz4%3D" alt="CRUD" />
      <img src="https://img.shields.io/badge/Calendar%20Scheduling-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMjEgNy41VjZhMiAyIDAgMCAwLTItMkg1YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgzLjUiIC8%2BIDxwYXRoIGQ9Ik0xNiAydjQiIC8%2BIDxwYXRoIGQ9Ik04IDJ2NCIgLz4gPHBhdGggZD0iTTMgMTBoNSIgLz4gPHBhdGggZD0iTTE3LjUgMTcuNSAxNiAxNi4zVjE0IiAvPiA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI2IiAvPiA8L3N2Zz4%3D" alt="Calendar Scheduling" />
    </td>
  </tr>
  <tr>
    <td align="right" valign="middle"><sub><b>Domain</b></sub></td>
    <td>
      <img src="https://img.shields.io/badge/Healthcare-BE123C?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIiAvPiA8cGF0aCBkPSJNMy4yMiAxMkg5LjVsLjUtMSAyIDQuNSAyLTcgMS41IDMuNWg1LjI3IiAvPiA8L3N2Zz4%3D" alt="Healthcare" />
      <img src="https://img.shields.io/badge/Medication%20Management-BE123C?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJtMTAuNSAyMC41IDEwLTEwYTQuOTUgNC45NSAwIDEgMC03LTdsLTEwIDEwYTQuOTUgNC45NSAwIDEgMCA3IDdaIiAvPiA8cGF0aCBkPSJtOC41IDguNSA3IDciIC8%2BIDwvc3ZnPg%3D%3D" alt="Medication Management" />
      <img src="https://img.shields.io/badge/Family%20Sharing-BE123C?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4gPGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiIC8%2BIDxwYXRoIGQ9Ik0yMiAyMXYtMmE0IDQgMCAwIDAtMy0zLjg3IiAvPiA8cGF0aCBkPSJNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1IiAvPiA8L3N2Zz4%3D" alt="Family Sharing" />
    </td>
  </tr>
  <tr>
    <td align="right" valign="middle"><sub><b>Tooling</b></sub></td>
    <td>
      <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint" />
      <img src="https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm" />
      <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git" />
    </td>
  </tr>
</table>

## See it in action

<p align="center">
  <img src="docs/demo.gif" alt="Demo: log in, filter medicines by expiry status, change a quantity, add a medicine, open the treatment calendar, change a family member's role and open their medicines" width="100%" />
</p>

<p align="center"><sub>Login → expiry tiles as filters → quantity +/− → new medicine → treatment calendar → family roles → a member's medicines.</sub></p>

## Highlights

<table>
  <tr>
    <td width="33%" valign="top">
      <img src="docs/icons/pill.svg" width="44" alt="" /><br />
      <b>Medicine inventory</b><br />
      <sub>Name, dose, quantity with unit (pcs / ml / mg), category, expiry date and notes. Quick <code>+</code> / <code>−</code> buttons update the stock straight from the list.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/hourglass.svg" width="44" alt="" /><br />
      <b>Expiry at a glance</b><br />
      <sub>Every card gets a badge: valid, <i>&lt; 30 days</i> or expired, with the exact number of days. Three counter tiles on top double as one-click filters.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/sliders-horizontal.svg" width="44" alt="" /><br />
      <b>Filter and sort</b><br />
      <sub>Filter by status and by 15 predefined categories (older free-text categories still show up); sort by expiry date, name, category or quantity, ascending or descending.</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <img src="docs/icons/calendar-days.svg" width="44" alt="" /><br />
      <b>Treatment plans</b><br />
      <sub>Link a plan to a medicine, pick weekdays and any number of intake hours, set a start and an optional end. Open-ended plans simply keep repeating.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/users.svg" width="44" alt="" /><br />
      <b>Families</b><br />
      <sub>Create a family, share a 6-character invite code (or add people by e-mail), rotate the code, rename or delete the group, leave it at any time.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/shield-check.svg" width="44" alt="" /><br />
      <b>Roles</b><br />
      <sub>Owner and admins manage members and can adjust their medicine stock; everyone else sees other members' medicines in read-only mode.</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <img src="docs/icons/log-in.svg" width="44" alt="" /><br />
      <b>E-mail or Google</b><br />
      <sub>Firebase Authentication with e-mail + password or a Google account; protected routes send signed-out users back to the login page.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/user-round.svg" width="44" alt="" /><br />
      <b>Profile</b><br />
      <sub>Edit name, date of birth (age is computed for you) and gender, or change the password without leaving the app.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/flame.svg" width="44" alt="" /><br />
      <b>No backend to run</b><br />
      <sub>A static React build talks directly to Firebase, so it can be hosted on any static hosting with an SPA fallback to <code>index.html</code> (e.g. Firebase Hosting, Netlify).</sub>
    </td>
  </tr>
</table>

## Screenshots

<p align="center">
  <img src="docs/hero.png" alt="The medicine dashboard and the treatment calendar side by side" width="100%" />
</p>

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/screenshots/02-filtered.png" alt="Medicines filtered to those expiring within 30 days" />
      <p align="center"><b>What runs out soon?</b><br /><sub>Clicking a tile filters the list; badges show how many days are left.</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/screenshots/03-addmed.png" alt="Add medicine form" />
      <p align="center"><b>Add a medicine</b><br /><sub>Dose, quantity and unit, one of 15 categories, expiry date and notes.</sub></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/screenshots/05-addplan.png" alt="Treatment plan form" />
      <p align="center"><b>Create a treatment plan</b><br /><sub>Weekdays, any number of hours, start and optional end date.</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/screenshots/06-family.png" alt="Family management" />
      <p align="center"><b>Family and roles</b><br /><sub>Invite code, roles per member and a shortcut to each member's medicines.</sub></p>
    </td>
  </tr>
</table>

<details>
<summary><b>More screens</b> (calendar, member's medicines, profile, editing, login)</summary>
<br />

| Treatment calendar | A family member's medicines |
|:---:|:---:|
| <img src="docs/screenshots/04-plans.png" alt="Treatment calendar" /> | <img src="docs/screenshots/07-member.png" alt="Family member's medicines" /> |
| **Profile and password** | **Edit a medicine** |
| <img src="docs/screenshots/08-profile.png" alt="Profile" /> | <img src="docs/screenshots/10-editmed.png" alt="Edit medicine" /> |
| **Dashboard** | **Login (e-mail or Google)** |
| <img src="docs/screenshots/01-dashboard.png" alt="Dashboard" /> | <img src="docs/screenshots/09-login.png" alt="Login" /> |

</details>

<sub>Screenshots and the demo come from the real frontend with sample data (date fixed to 9 October 2026) served by an in-memory stand-in for Firebase, so they are reproducible.</sub>

## How it works

### Expiry status

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/expiry-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="docs/expiry-light.svg" />
  <img src="docs/expiry-light.svg" alt="Animation: medicines placed on a timeline around today; zones expired, 30 days and valid; counters 5, 2 and 2" width="100%" />
</picture>

The status is not stored anywhere. Each medicine keeps only its expiry date (`YYYY-MM-DD`); on every render the dashboard counts whole days from local midnight and puts the medicine into one of three buckets. The same function drives the badges, the three counter tiles and the status filter, so they can never disagree.

```ts
const d = daysUntil(med.date);          // date parsed as local midnight, no timezone shift
const status = d < 0 ? "expired" : d <= 30 ? "soon" : "ok";
```

### Treatment plans on a calendar

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/calendar-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="docs/calendar-light.svg" />
  <img src="docs/calendar-light.svg" alt="Animation: three plans expand into dose chips on an October 2026 calendar" width="100%" />
</picture>

A plan stores **rules**, not individual doses: weekdays (`frequency`), intake times (`hours`), `start_date` and an optional `end_date`. The calendar walks the visible weeks (Monday first, including days from neighbouring months), keeps the days inside each plan's range whose weekday matches, adds one entry per hour and sorts each day by time. Clicking an entry opens the plan for editing.

### Families and roles

| Action | owner | admin | member | viewer |
|---|:---:|:---:|:---:|:---:|
| See other members' medicines | ✓ | ✓ | ✓ | ✓ |
| Change other members' quantities | ✓ | ✓ | | |
| Add members by e-mail, change roles, remove members | ✓ | ✓ | | |
| Rename the family, refresh the invite code | ✓ | ✓ | | |
| Delete the family | ✓ | | | |
| Join with a code, leave the family | ✓ | ✓ | ✓ | ✓ |

The creator becomes the owner and that role cannot be reassigned from the UI. People joining with a code start as `member`.

### Architecture

```mermaid
flowchart LR
    subgraph SPA["React 19 SPA · Vite"]
        R["React Router 7<br/>ProtectedRoute"]
        P["Pages<br/>MyMeds · AddMed · EditMed<br/>Plans · AddPlan · EditPlan<br/>Family · FamilyMemberMeds · Profile"]
        C["categories.ts<br/>15 categories"]
        D["date-fns<br/>calendar math"]
    end
    subgraph FB["Firebase"]
        A["Authentication<br/>e-mail + Google"]
        F[("Cloud Firestore<br/>users · medicines · medicines_sets<br/>plans · family")]
    end

    R --> P
    P --> C
    P --> D
    R -. onAuthStateChanged .-> A
    P -- "Firebase JS SDK" --> F
    P -- "sign in / sign up" --> A
```

### Adding a medicine

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant UI as AddMed page
    participant FS as Cloud Firestore

    U->>UI: name, dose, quantity, unit, category, expiry date, notes
    UI->>FS: addDoc("medicines", {...})
    FS-->>UI: new medicine id
    UI->>FS: query medicines_sets where owner == uid
    alt the user already has a set
        UI->>FS: updateDoc(set, medicines_id: arrayUnion(id))
    else first medicine
        UI->>FS: addDoc("medicines_sets", {owner, medicines_id: [id]})
    end
    UI-->>U: saved, the list and counters include it
```

## Data model

```mermaid
erDiagram
    USERS ||--o| MEDICINES_SETS : owns
    MEDICINES_SETS }o--o{ MEDICINES : "medicines_id"
    USERS ||--o{ PLANS : owns
    PLANS }o--|| MEDICINES : "medicine_id"
    FAMILY }o--o{ USERS : "users_id + roles"

    USERS {
        string uid
        string email
        string name
        string birth_date
        number age
        string gender
    }
    MEDICINES {
        string name
        string dose
        number quantity
        string unit
        string category
        string date
        string notes
    }
    MEDICINES_SETS {
        string owner
        string_array medicines_id
    }
    PLANS {
        string owner
        string name
        string medicine_id
        string_array frequency
        string_array hours
        string start_date
        string end_date
        string notes
    }
    FAMILY {
        string name
        string owner
        string_array users_id
        map roles
        string inviteCode
    }
```

<details>
<summary><b>All collections and fields</b></summary>

#### `users/{uid}`

| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth user id (also the document id) |
| `email` | string | E-mail, stored lowercase so members can be found by it |
| `name` | string | Display name |
| `birth_date` | string \| null | `YYYY-MM-DD` |
| `age` | number \| null | Computed from `birth_date` |
| `gender` | string | `male` / `female` / `other` |
| `createdAt` | timestamp | Registration time |

#### `medicines/{id}`

| Field | Type | Description |
|---|---|---|
| `name` | string | Medicine name |
| `dose` | string | Free text, e.g. `500 mg` |
| `quantity` | number | Current stock, never below 0 |
| `unit` | string | `pcs` / `ml` / `mg` |
| `category` | string | Category id, e.g. `pain`, `allergy` (see `src/constants/categories.ts`) |
| `date` | string | Expiry date `YYYY-MM-DD` |
| `notes` | string | Optional notes |

#### `medicines_sets/{id}`

| Field | Type | Description |
|---|---|---|
| `owner` | string | Owner's uid |
| `medicines_id` | string[] | Ids of the owner's medicines |
| `createdAt` | timestamp | Created on registration |

#### `plans/{id}`

| Field | Type | Description |
|---|---|---|
| `owner` | string | Owner's uid |
| `name` | string | Plan name |
| `medicine_id` | string | Linked medicine |
| `frequency` | string[] | Weekdays, e.g. `["monday", "thursday"]` |
| `hours` | string[] | Intake times `HH:MM` |
| `start_date` | string | `YYYY-MM-DD` |
| `end_date` | string | `YYYY-MM-DD`, empty string = open-ended |
| `notes` | string | Optional notes |

#### `family/{id}`

| Field | Type | Description |
|---|---|---|
| `name` | string | Family name |
| `owner` | string | Creator's uid |
| `users_id` | string[] | Member uids |
| `roles` | map uid → role | `owner` / `admin` / `member` / `viewer` |
| `inviteCode` | string | 6 characters, no look-alikes (`0/O`, `1/I`) |
| `createdAt`, `updatedAt` | timestamp | Server timestamps |

</details>

Medicines live in their own collection and a user's cabinet is a list of ids in `medicines_sets`. Reading another member's cabinet is therefore the same query with their uid, which is what the family view does.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript 5.9 |
| Routing | React Router 7 (`BrowserRouter`, protected routes) |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`) with a few component classes (`btn`, `card`, status pills) |
| Build | Vite 7 (`rolldown-vite`), `@vitejs/plugin-react` |
| Dates | date-fns 4 |
| Auth | Firebase Authentication (e-mail + password, Google popup) |
| Database | Cloud Firestore (Firebase JS SDK 12) |
| Linting | ESLint 9, typescript-eslint, react-hooks, react-refresh |

## Project Structure

```
Domowa_Apteczka/
├── docs/                      # README assets: animated SVGs, demo.gif, hero.png, screenshots/, icons/
├── public/
│   └── firebase-messaging-sw.js
├── src/
│   ├── components/
│   │   ├── DashboardLayout.tsx    # sidebar, page title, sign-out
│   │   └── ProtectedRoute.tsx     # redirects signed-out users to "/"
│   ├── constants/
│   │   └── categories.ts          # 15 categories (id, Polish label, emoji)
│   ├── lib/
│   │   └── firebase.ts            # Firebase app, auth, db, Google provider
│   ├── pages/
│   │   ├── Login.tsx · Register.tsx
│   │   ├── MyMeds.tsx             # dashboard: tiles, filters, sorting, cards
│   │   ├── AddMed.tsx · EditMed.tsx
│   │   ├── Plans.tsx              # monthly calendar
│   │   ├── AddPlan.tsx · EditPlan.tsx
│   │   ├── Family.tsx             # families, roles, invite codes
│   │   ├── FamilyMemberMeds.tsx   # another member's medicines
│   │   └── Profile.tsx            # profile and password
│   ├── types.ts
│   ├── App.tsx                    # routes
│   ├── main.tsx
│   └── index.css                  # Tailwind + component classes
├── index.html
├── package.json
├── vite.config.ts
├── eslint.config.js
├── LICENSE
├── README.md                      # English
└── README.pl.md                   # Polski
```

## Getting Started

### Prerequisites

- **Node.js 20.19+** (or 22.12+) and npm, as required by Vite 7
- A **Firebase project** with Authentication and Cloud Firestore enabled

### Install and run

```bash
git clone https://github.com/Nurek54/Domowa_Apteczka.git
cd Domowa_Apteczka
npm install
npm run dev
# http://localhost:5173
```

### Use your own Firebase project

1. Create a project in the [Firebase Console](https://console.firebase.google.com/) and add a **Web app**.
2. **Authentication → Sign-in method**: enable **Email/Password** and **Google**. Under *Settings → Authorized domains* make sure `localhost` (and your hosting domain) is listed.
3. **Firestore Database**: create a database. The collections from [Data model](#data-model) are created automatically on first use.
4. Paste your web app config into `firebaseConfig` in [`src/lib/firebase.ts`](src/lib/firebase.ts).

> [!TIP]
> Firebase web config values are identifiers, not secrets; access is controlled by Firestore Security Rules. Before sharing a deployment, write rules that mirror the role table above (see [Limitations](#limitations)).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Limitations

- **Permissions are checked in the UI.** Roles decide which buttons are enabled; real protection needs Firestore Security Rules that enforce the same rules on the server.
- **Member and viewer currently have the same rights.** Both see other members' medicines read-only; `viewer` is ready for stricter rules.
- **No reminders yet.** `public/firebase-messaging-sw.js` is prepared for Firebase Cloud Messaging, but push notifications for doses are not wired up.
- **Polish UI.** Labels and category names are in Polish.

## License

Released under the [MIT License](LICENSE).

## Contact

**Grzegorz Sienkiewicz**
✉️ gsienkiewicz03@gmail.com
🐙 GitHub: [@Nurek54](https://github.com/Nurek54)
