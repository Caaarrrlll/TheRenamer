# Status

[![Node.js CI](https://github.com/Caaarrrlll/TheRenamer/actions/workflows/node.js.yml/badge.svg)](https://github.com/Caaarrrlll/TheRenamer/actions/workflows/node.js.yml)

# RenamerJS

## The First Rendition of this app

The goal of this app is to make an easy to use program that you can drag and drop any series that will then be auto renamed into a specified format.
In the earlier versions the app wil default to
`Some Series Name.s01e01.Some Episode title.fileExtension`
with the initial format looking something like

-   `some.series.name.s01e01.1080p.bluray.x264-some.encoder.body.details.fileExtension`
-   `some.series.name.1x01.1080p.bluray.x264-some.encoder.body.details.fileExtension`

The idea for this app comes from initially using an app that had exactly this functionality called TheRenamer [theRenamer](http://www.therenamer.com/) this however does not function anymore due to changes in the api it was using.
The plan as of now is to use the same api as the original app TheTVDB api [theTVDB](https://api.thetvdb.com/swagger).

## The problem

The TVDB upgraded their API multiple versions and became a pay to use for the API, hence the previous version of the app became unusable.

## The Current Goal

Use a new api [tvMaze](https://www.tvmaze.com/api) to accomplish the same thing.

Currently can convert

-   [x] `some.series.name.s01e01.1080p.bluray.x264-some.encoder.body.details.fileExtension`
-   [ ] `some.series.name.1x01.1080p.bluray.x264-some.encoder.body.details.fileExtension`
-   [ ] `some.series.name.01.1080p.bluray.x264-some.encoder.body.details.fileExtension`
-   [ ] `some.series.name.001.1080p.bluray.x264-some.encoder.body.details.fileExtension`
