<p align="right">
  <a href="README.md"><img src="https://img.shields.io/badge/English-switch-64748B?style=flat-square" alt="English" /></a>
  <a href="README.pl.md"><img src="https://img.shields.io/badge/Polski-aktywny-4F46E5?style=flat-square" alt="Polski" /></a>
</p>

<a href="#demo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/banner-pl-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="docs/banner-pl-light.svg" />
    <img src="docs/banner-pl-light.svg" alt="Domowa Apteczka: wszystkie domowe leki w jednym miejscu, dla całej rodziny" width="100%" />
  </picture>
</a>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7_(Rolldown)-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-12-DD2C00?style=flat-square&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Licencja-MIT-22C55E?style=flat-square" alt="Licencja MIT" />
</p>

<p align="center">
  <a href="#demo"><b>Demo</b></a> &nbsp;·&nbsp;
  <a href="#najważniejsze-funkcje"><b>Funkcje</b></a> &nbsp;·&nbsp;
  <a href="#zrzuty-ekranu"><b>Zrzuty ekranu</b></a> &nbsp;·&nbsp;
  <a href="#jak-to-działa"><b>Jak to działa</b></a> &nbsp;·&nbsp;
  <a href="#model-danych"><b>Model danych</b></a> &nbsp;·&nbsp;
  <a href="#uruchomienie"><b>Uruchomienie</b></a>
</p>

> [!NOTE]
> **Organizer, nie porada medyczna.** Aplikacja pilnuje, co masz w domu i kiedy to przyjąć. Nie sprawdza dawek ani interakcji leków; zawsze stosuj się do zaleceń lekarza lub farmaceuty.

**Domowa Apteczka** to aplikacja webowa (SPA), która pomaga zapanować nad lekami w domu. Dodajesz to, co masz, z dawką, ilością, kategorią i datą ważności, a panel od razu pokazuje, co jest **w terminie**, co **traci ważność w ciągu 30 dni** i co jest **już po terminie**. Zalecenie lekarza zamieniasz w **plan leczenia** (dni tygodnia, godziny, data startu i opcjonalnie końca) i widzisz każdą dawkę w kalendarzu miesięcznym.

Apteczka jest zwykle wspólna, dlatego aplikacja ma **rodziny**: tworzysz grupę, zapraszasz bliskich krótkim kodem albo po e-mailu, nadajesz role (**owner**, **admin**, **member**, **viewer**) i możecie zaglądać sobie nawzajem do leków. Wszystko działa w przeglądarce na **Firebase Authentication** (e-mail + Google) i **Cloud Firestore**; nie ma własnego backendu do utrzymywania.

<p align="center"><b>Słowa kluczowe</b></p>

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
    <td align="right" valign="middle"><sub><b>Koncepcje</b></sub></td>
    <td>
      <img src="https://img.shields.io/badge/Aplikacja%20SPA-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHJ4PSIyIiAvPiA8cGF0aCBkPSJNMTAgNHY0IiAvPiA8cGF0aCBkPSJNMiA4aDIwIiAvPiA8cGF0aCBkPSJNNiA0djQiIC8%2BIDwvc3ZnPg%3D%3D" alt="Aplikacja SPA" />
      <img src="https://img.shields.io/badge/Modelowanie%20NoSQL-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMi45NyAxMi45MkEyIDIgMCAwIDAgMiAxNC42M3YzLjI0YTIgMiAwIDAgMCAuOTcgMS43MWwzIDEuOGEyIDIgMCAwIDAgMi4wNiAwTDEyIDE5di01LjVsLTUtMy00LjAzIDIuNDJaIiAvPiA8cGF0aCBkPSJtNyAxNi41LTQuNzQtMi44NSIgLz4gPHBhdGggZD0ibTcgMTYuNSA1LTMiIC8%2BIDxwYXRoIGQ9Ik03IDE2LjV2NS4xNyIgLz4gPHBhdGggZD0iTTEyIDEzLjVWMTlsMy45NyAyLjM4YTIgMiAwIDAgMCAyLjA2IDBsMy0xLjhhMiAyIDAgMCAwIC45Ny0xLjcxdi0zLjI0YTIgMiAwIDAgMC0uOTctMS43MUwxNyAxMC41bC01IDNaIiAvPiA8cGF0aCBkPSJtMTcgMTYuNS01LTMiIC8%2BIDxwYXRoIGQ9Im0xNyAxNi41IDQuNzQtMi44NSIgLz4gPHBhdGggZD0iTTE3IDE2LjV2NS4xNyIgLz4gPHBhdGggZD0iTTcuOTcgNC40MkEyIDIgMCAwIDAgNyA2LjEzdjQuMzdsNSAzIDUtM1Y2LjEzYTIgMiAwIDAgMC0uOTctMS43MWwtMy0xLjhhMiAyIDAgMCAwLTIuMDYgMGwtMyAxLjhaIiAvPiA8cGF0aCBkPSJNMTIgOCA3LjI2IDUuMTUiIC8%2BIDxwYXRoIGQ9Im0xMiA4IDQuNzQtMi44NSIgLz4gPHBhdGggZD0iTTEyIDEzLjVWOCIgLz4gPC9zdmc%2B" alt="Modelowanie NoSQL" />
      <img src="https://img.shields.io/badge/Role%20i%20uprawnienia-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8%2BIDxwYXRoIGQ9Im05IDEyIDIgMiA0LTQiIC8%2BIDwvc3ZnPg%3D%3D" alt="Role i uprawnienia" />
      <img src="https://img.shields.io/badge/CRUD-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4gPHBhdGggZD0ibTE1IDUgNCA0IiAvPiA8L3N2Zz4%3D" alt="CRUD" />
      <img src="https://img.shields.io/badge/Harmonogramy-334155?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMjEgNy41VjZhMiAyIDAgMCAwLTItMkg1YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgzLjUiIC8%2BIDxwYXRoIGQ9Ik0xNiAydjQiIC8%2BIDxwYXRoIGQ9Ik04IDJ2NCIgLz4gPHBhdGggZD0iTTMgMTBoNSIgLz4gPHBhdGggZD0iTTE3LjUgMTcuNSAxNiAxNi4zVjE0IiAvPiA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI2IiAvPiA8L3N2Zz4%3D" alt="Harmonogramy" />
    </td>
  </tr>
  <tr>
    <td align="right" valign="middle"><sub><b>Dziedzina</b></sub></td>
    <td>
      <img src="https://img.shields.io/badge/Ochrona%20zdrowia-BE123C?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIiAvPiA8cGF0aCBkPSJNMy4yMiAxMkg5LjVsLjUtMSAyIDQuNSAyLTcgMS41IDMuNWg1LjI3IiAvPiA8L3N2Zz4%3D" alt="Ochrona zdrowia" />
      <img src="https://img.shields.io/badge/Zarz%C4%85dzanie%20lekami-BE123C?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJtMTAuNSAyMC41IDEwLTEwYTQuOTUgNC45NSAwIDEgMC03LTdsLTEwIDEwYTQuOTUgNC45NSAwIDEgMCA3IDdaIiAvPiA8cGF0aCBkPSJtOC41IDguNSA3IDciIC8%2BIDwvc3ZnPg%3D%3D" alt="Zarządzanie lekami" />
      <img src="https://img.shields.io/badge/Wsp%C3%B3%C5%82dzielenie%20w%20rodzinie-BE123C?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgPiA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4gPGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiIC8%2BIDxwYXRoIGQ9Ik0yMiAyMXYtMmE0IDQgMCAwIDAtMy0zLjg3IiAvPiA8cGF0aCBkPSJNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1IiAvPiA8L3N2Zz4%3D" alt="Współdzielenie w rodzinie" />
    </td>
  </tr>
  <tr>
    <td align="right" valign="middle"><sub><b>Narzędzia</b></sub></td>
    <td>
      <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint" />
      <img src="https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm" />
      <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git" />
    </td>
  </tr>
</table>

## Demo

<p align="center">
  <img src="docs/demo.gif" alt="Demo: logowanie, filtrowanie leków po statusie ważności, zmiana ilości, dodanie leku, kalendarz planów, zmiana roli członka rodziny i podgląd jego leków" width="100%" />
</p>

<p align="center"><sub>Logowanie → kafelki ważności jako filtry → ilość +/− → nowy lek → kalendarz planów → role w rodzinie → leki członka rodziny.</sub></p>

## Najważniejsze funkcje

<table>
  <tr>
    <td width="33%" valign="top">
      <img src="docs/icons/pill.svg" width="44" alt="" /><br />
      <b>Ewidencja leków</b><br />
      <sub>Nazwa, dawka, ilość z jednostką (szt / ml / mg), kategoria, data ważności i uwagi. Przyciski <code>+</code> / <code>−</code> zmieniają stan prosto z listy.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/hourglass.svg" width="44" alt="" /><br />
      <b>Terminy na pierwszy rzut oka</b><br />
      <sub>Każda karta ma plakietkę: w terminie, <i>&lt; 30 dni</i> albo po terminie, z dokładną liczbą dni. Trzy kafelki z licznikami działają też jako filtry.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/sliders-horizontal.svg" width="44" alt="" /><br />
      <b>Filtrowanie i sortowanie</b><br />
      <sub>Filtr po statusie i 15 predefiniowanych kategoriach (stare kategorie wpisane ręcznie też się pojawiają); sortowanie po dacie ważności, nazwie, kategorii lub ilości, rosnąco albo malejąco.</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <img src="docs/icons/calendar-days.svg" width="44" alt="" /><br />
      <b>Plany leczenia</b><br />
      <sub>Plan powiązany z lekiem: dni tygodnia, dowolna liczba godzin przyjęcia, data startu i opcjonalnie końca. Plan bez daty końca po prostu się powtarza.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/users.svg" width="44" alt="" /><br />
      <b>Rodziny</b><br />
      <sub>Tworzenie rodziny, 6-znakowy kod zaproszenia (albo dodanie po e-mailu), odświeżanie kodu, zmiana nazwy, usunięcie grupy i opuszczenie jej w każdej chwili.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/shield-check.svg" width="44" alt="" /><br />
      <b>Role</b><br />
      <sub>Owner i admini zarządzają członkami i mogą zmieniać stan ich leków; pozostali widzą leki innych członków w trybie tylko do odczytu.</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <img src="docs/icons/log-in.svg" width="44" alt="" /><br />
      <b>E-mail lub Google</b><br />
      <sub>Firebase Authentication: e-mail + hasło albo konto Google; chronione ścieżki odsyłają niezalogowanych na stronę logowania.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/user-round.svg" width="44" alt="" /><br />
      <b>Profil</b><br />
      <sub>Edycja imienia, daty urodzenia (wiek liczy się sam) i płci oraz zmiana hasła bez wychodzenia z aplikacji.</sub>
    </td>
    <td width="33%" valign="top">
      <img src="docs/icons/flame.svg" width="44" alt="" /><br />
      <b>Bez własnego backendu</b><br />
      <sub>Statyczny build Reacta rozmawia bezpośrednio z Firebase, więc wystarczy dowolny hosting statyczny z przekierowaniem SPA na <code>index.html</code> (np. Firebase Hosting, Netlify).</sub>
    </td>
  </tr>
</table>

## Zrzuty ekranu

<p align="center">
  <img src="docs/hero.png" alt="Panel leków i kalendarz planów obok siebie" width="100%" />
</p>

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/screenshots/02-filtered.png" alt="Leki tracące ważność w ciągu 30 dni" />
      <p align="center"><b>Co się zaraz przeterminuje?</b><br /><sub>Kliknięcie kafelka filtruje listę; plakietki pokazują, ile dni zostało.</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/screenshots/03-addmed.png" alt="Formularz dodawania leku" />
      <p align="center"><b>Dodawanie leku</b><br /><sub>Dawka, ilość i jednostka, jedna z 15 kategorii, data ważności i uwagi.</sub></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/screenshots/05-addplan.png" alt="Formularz planu leczenia" />
      <p align="center"><b>Nowy plan leczenia</b><br /><sub>Dni tygodnia, dowolna liczba godzin, start i opcjonalny koniec.</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/screenshots/06-family.png" alt="Zarządzanie rodziną" />
      <p align="center"><b>Rodzina i role</b><br /><sub>Kod zaproszenia, rola każdego członka i skrót do jego leków.</sub></p>
    </td>
  </tr>
</table>

<details>
<summary><b>Więcej ekranów</b> (kalendarz, leki członka rodziny, profil, edycja, logowanie)</summary>
<br />

| Kalendarz planów | Leki członka rodziny |
|:---:|:---:|
| <img src="docs/screenshots/04-plans.png" alt="Kalendarz planów" /> | <img src="docs/screenshots/07-member.png" alt="Leki członka rodziny" /> |
| **Profil i hasło** | **Edycja leku** |
| <img src="docs/screenshots/08-profile.png" alt="Profil" /> | <img src="docs/screenshots/10-editmed.png" alt="Edycja leku" /> |
| **Panel główny** | **Logowanie (e-mail lub Google)** |
| <img src="docs/screenshots/01-dashboard.png" alt="Panel główny" /> | <img src="docs/screenshots/09-login.png" alt="Logowanie" /> |

</details>

<sub>Zrzuty i demo pochodzą z prawdziwego frontendu z przykładowymi danymi (data ustawiona na 9 października 2026), które serwuje zastępcza, działająca w pamięci warstwa zamiast Firebase, dzięki czemu da się je odtworzyć.</sub>

## Jak to działa

### Status ważności

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/expiry-pl-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="docs/expiry-pl-light.svg" />
  <img src="docs/expiry-pl-light.svg" alt="Animacja: leki na osi czasu wokół dzisiejszej daty; strefy po terminie, 30 dni i w terminie; liczniki 5, 2 i 2" width="100%" />
</picture>

Status nie jest nigdzie zapisywany. Lek przechowuje tylko datę ważności (`YYYY-MM-DD`); przy każdym renderze panel liczy pełne dni od lokalnej północy i przypisuje lek do jednej z trzech grup. Ta sama funkcja steruje plakietkami, kafelkami z licznikami i filtrem statusu, więc nigdy się nie rozjadą.

```ts
const d = daysUntil(med.date);          // data liczona od lokalnej północy, bez przesunięć strefy
const status = d < 0 ? "expired" : d <= 30 ? "soon" : "ok";
```

### Plany leczenia w kalendarzu

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/calendar-pl-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="docs/calendar-pl-light.svg" />
  <img src="docs/calendar-pl-light.svg" alt="Animacja: trzy plany rozwijają się w dawki w kalendarzu na październik 2026" width="100%" />
</picture>

Plan przechowuje **reguły**, a nie pojedyncze dawki: dni tygodnia (`frequency`), godziny (`hours`), `start_date` i opcjonalnie `end_date`. Kalendarz przechodzi po widocznych tygodniach (od poniedziałku, razem z dniami sąsiednich miesięcy), zostawia dni z zakresu planu o pasującym dniu tygodnia, dodaje wpis dla każdej godziny i sortuje dzień po czasie. Kliknięcie wpisu otwiera edycję planu.

### Rodziny i role

| Akcja | owner | admin | member | viewer |
|---|:---:|:---:|:---:|:---:|
| Podgląd leków innych członków | ✓ | ✓ | ✓ | ✓ |
| Zmiana ilości leków innych członków | ✓ | ✓ | | |
| Dodawanie po e-mailu, zmiana ról, usuwanie członków | ✓ | ✓ | | |
| Zmiana nazwy rodziny, odświeżenie kodu | ✓ | ✓ | | |
| Usunięcie rodziny | ✓ | | | |
| Dołączenie kodem, opuszczenie rodziny | ✓ | ✓ | ✓ | ✓ |

Twórca rodziny zostaje ownerem i tej roli nie da się przenieść z poziomu UI. Osoby dołączające kodem zaczynają jako `member`.

### Architektura

```mermaid
flowchart LR
    subgraph SPA["React 19 SPA · Vite"]
        R["React Router 7<br/>ProtectedRoute"]
        P["Strony<br/>MyMeds · AddMed · EditMed<br/>Plans · AddPlan · EditPlan<br/>Family · FamilyMemberMeds · Profile"]
        C["categories.ts<br/>15 kategorii"]
        D["date-fns<br/>obliczenia kalendarza"]
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
    P -- "logowanie / rejestracja" --> A
```

### Dodanie leku

```mermaid
sequenceDiagram
    autonumber
    actor U as Użytkownik
    participant UI as Strona AddMed
    participant FS as Cloud Firestore

    U->>UI: nazwa, dawka, ilość, jednostka, kategoria, data ważności, uwagi
    UI->>FS: addDoc("medicines", {...})
    FS-->>UI: id nowego leku
    UI->>FS: query medicines_sets where owner == uid
    alt użytkownik ma już zestaw
        UI->>FS: updateDoc(set, medicines_id: arrayUnion(id))
    else pierwszy lek
        UI->>FS: addDoc("medicines_sets", {owner, medicines_id: [id]})
    end
    UI-->>U: zapisane, lista i liczniki już go uwzględniają
```

## Model danych

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
<summary><b>Wszystkie kolekcje i pola</b></summary>

#### `users/{uid}`

| Pole | Typ | Opis |
|---|---|---|
| `uid` | string | ID użytkownika Firebase Auth (też ID dokumentu) |
| `email` | string | E-mail zapisany małymi literami, żeby dało się po nim znaleźć członka |
| `name` | string | Wyświetlana nazwa |
| `birth_date` | string \| null | `YYYY-MM-DD` |
| `age` | number \| null | Wyliczany z `birth_date` |
| `gender` | string | `male` / `female` / `other` |
| `createdAt` | timestamp | Data rejestracji |

#### `medicines/{id}`

| Pole | Typ | Opis |
|---|---|---|
| `name` | string | Nazwa leku |
| `dose` | string | Dowolny tekst, np. `500 mg` |
| `quantity` | number | Aktualny stan, nigdy poniżej 0 |
| `unit` | string | `pcs` / `ml` / `mg` |
| `category` | string | ID kategorii, np. `pain`, `allergy` (zob. `src/constants/categories.ts`) |
| `date` | string | Data ważności `YYYY-MM-DD` |
| `notes` | string | Opcjonalne uwagi |

#### `medicines_sets/{id}`

| Pole | Typ | Opis |
|---|---|---|
| `owner` | string | UID właściciela |
| `medicines_id` | string[] | ID leków właściciela |
| `createdAt` | timestamp | Tworzony przy rejestracji |

#### `plans/{id}`

| Pole | Typ | Opis |
|---|---|---|
| `owner` | string | UID właściciela |
| `name` | string | Nazwa planu |
| `medicine_id` | string | Powiązany lek |
| `frequency` | string[] | Dni tygodnia, np. `["monday", "thursday"]` |
| `hours` | string[] | Godziny przyjęcia `HH:MM` |
| `start_date` | string | `YYYY-MM-DD` |
| `end_date` | string | `YYYY-MM-DD`, pusty napis = plan bez końca |
| `notes` | string | Opcjonalne uwagi |

#### `family/{id}`

| Pole | Typ | Opis |
|---|---|---|
| `name` | string | Nazwa rodziny |
| `owner` | string | UID twórcy |
| `users_id` | string[] | UID członków |
| `roles` | mapa uid → rola | `owner` / `admin` / `member` / `viewer` |
| `inviteCode` | string | 6 znaków, bez mylących par (`0/O`, `1/I`) |
| `createdAt`, `updatedAt` | timestamp | Znaczniki czasu serwera |

</details>

Leki leżą we własnej kolekcji, a apteczka użytkownika to lista ID w `medicines_sets`. Podgląd apteczki innego członka to więc to samo zapytanie z jego UID, i dokładnie tak działa widok rodziny.

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| UI | React 19, TypeScript 5.9 |
| Routing | React Router 7 (`BrowserRouter`, chronione ścieżki) |
| Style | Tailwind CSS 4 (`@tailwindcss/postcss`) plus kilka klas komponentów (`btn`, `card`, plakietki statusu) |
| Build | Vite 7 (`rolldown-vite`), `@vitejs/plugin-react` |
| Daty | date-fns 4 |
| Logowanie | Firebase Authentication (e-mail + hasło, popup Google) |
| Baza danych | Cloud Firestore (Firebase JS SDK 12) |
| Linting | ESLint 9, typescript-eslint, react-hooks, react-refresh |

## Struktura projektu

```
Domowa_Apteczka/
├── docs/                      # grafiki do README: animowane SVG, demo.gif, hero.png, screenshots/, icons/
├── public/
│   └── firebase-messaging-sw.js
├── src/
│   ├── components/
│   │   ├── DashboardLayout.tsx    # sidebar, tytuł strony, wylogowanie
│   │   └── ProtectedRoute.tsx     # przekierowuje niezalogowanych na "/"
│   ├── constants/
│   │   └── categories.ts          # 15 kategorii (id, etykieta PL, emoji)
│   ├── lib/
│   │   └── firebase.ts            # aplikacja Firebase, auth, db, provider Google
│   ├── pages/
│   │   ├── Login.tsx · Register.tsx
│   │   ├── MyMeds.tsx             # panel: kafelki, filtry, sortowanie, karty
│   │   ├── AddMed.tsx · EditMed.tsx
│   │   ├── Plans.tsx              # kalendarz miesięczny
│   │   ├── AddPlan.tsx · EditPlan.tsx
│   │   ├── Family.tsx             # rodziny, role, kody zaproszeń
│   │   ├── FamilyMemberMeds.tsx   # leki innego członka
│   │   └── Profile.tsx            # profil i hasło
│   ├── types.ts
│   ├── App.tsx                    # routing
│   ├── main.tsx
│   └── index.css                  # Tailwind + klasy komponentów
├── index.html
├── package.json
├── vite.config.ts
├── eslint.config.js
├── LICENSE
├── README.md                      # English
└── README.pl.md                   # Polski
```

## Uruchomienie

### Wymagania

- **Node.js 20.19+** (lub 22.12+) i npm, tego wymaga Vite 7
- **Projekt Firebase** z włączonym Authentication i Cloud Firestore

### Instalacja i start

```bash
git clone https://github.com/Nurek54/Domowa_Apteczka.git
cd Domowa_Apteczka
npm install
npm run dev
# http://localhost:5173
```

### Własny projekt Firebase

1. Utwórz projekt w [Firebase Console](https://console.firebase.google.com/) i dodaj **aplikację Web**.
2. **Authentication → Sign-in method**: włącz **Email/Password** i **Google**. W *Settings → Authorized domains* sprawdź, czy jest `localhost` (i domena hostingu).
3. **Firestore Database**: utwórz bazę. Kolekcje z sekcji [Model danych](#model-danych) powstaną same przy pierwszym użyciu.
4. Wklej konfigurację aplikacji Web do `firebaseConfig` w [`src/lib/firebase.ts`](src/lib/firebase.ts).

> [!TIP]
> Wartości konfiguracji Firebase dla aplikacji Web to identyfikatory, a nie sekrety; dostęp kontrolują reguły bezpieczeństwa Firestore. Zanim udostępnisz wdrożenie, napisz reguły odpowiadające tabeli ról powyżej (zob. [Ograniczenia](#ograniczenia)).

### Skrypty

| Komenda | Co robi |
|---|---|
| `npm run dev` | Serwer deweloperski z hot reload |
| `npm run build` | Sprawdzenie typów (`tsc -b`) i build produkcyjny do `dist/` |
| `npm run preview` | Lokalny podgląd buildu produkcyjnego |
| `npm run lint` | ESLint |

## Ograniczenia

- **Uprawnienia są sprawdzane w UI.** Role decydują, które przyciski są aktywne; prawdziwa ochrona wymaga reguł Firestore Security Rules, które wymuszą to samo po stronie serwera.
- **Member i viewer mają na razie te same prawa.** Obaj widzą leki innych członków tylko do odczytu; `viewer` jest przygotowany pod ostrzejsze reguły.
- **Brak przypomnień.** `public/firebase-messaging-sw.js` jest przygotowany pod Firebase Cloud Messaging, ale powiadomienia o dawkach nie są jeszcze podpięte.
- **Interfejs po polsku.** Etykiety i nazwy kategorii są w języku polskim.

## Licencja

Projekt udostępniony na [licencji MIT](LICENSE).

## Kontakt

**Grzegorz Sienkiewicz**
✉️ gsienkiewicz03@gmail.com
🐙 GitHub: [@Nurek54](https://github.com/Nurek54)
