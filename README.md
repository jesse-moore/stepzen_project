<br />
<p align="center">
  <h1 align="center">Running Club Event Creator</h1>
  <p align="center">
    A single page application that dynamically creates event pages from an Airtable base.
    <br />
    <br />
    <a href="https://stepzen-project.web.app/">View Demo</a> · <a href="https://airtable.com/shrLa6iAlMxDJWecu">Airtable Base</a>

</p>

## Technologies
[![Javascript][javascript-badge]][javascript-url]
[![React][react-badge]][react-url]
[![GraphQL][graphql-badge]][graphql-url]
[![Stepzen][stepzen-badge]][stepzen-url]
[![Mapbox][mapbox-badge]][mapbox-url]

## Project Specifications
* Dynamically creates Event pages using data from multiple tables in an Airtable base.
* Stepzen combines multiple REST queries into one client side GraphQL query.
* Converts the race name into a readable url slug.
* Parses long text (markdown) into html.
* Parses user provided gpx file route into an interactive map.
* Parses user provided latitude and longitude points into respective markers.

Main Page displaying events from the events table
![Main Page](/images/main_page.png)

Events Table
![Events Table](/images/events_table.png)

Event Page
![Events Page](/images/event_page.png)

Races Table
![Races Table](/images/races_table.png)

Markers Table
![Markers Table](/images/marker_table.png)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[javascript-badge]: https://img.shields.io/badge/JavaScript-222222?style=flat-square&logo=javascript&logoColor=F7DF1E
[react-url]: https://reactjs.org/
[react-badge]: https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB
[graphql-url]: https://graphql.org/
[graphql-badge]: https://img.shields.io/badge/GraphQL-222222?style=flat-square&logo=graphql&logoColor=E10098
[stepzen-url]: https://stepzen.com/
[stepzen-badge]: https://img.shields.io/badge/Stepzen-blue
[mapbox-url]: https://www.mapbox.com/
[mapbox-badge]: https://img.shields.io/badge/Mapbox-000000?style=flat-square&logo=mapbox&logoColor=FFFFFF