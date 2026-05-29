# StatLine

StatLine is a small personal Discord bot built to fetch and display Hypixel player statistics in a simple and readable way.

The bot is designed for use by myself and a few friends, allowing us to quickly view player stats on demand without needing to navigate in game menus. It currently focuses on BedWars stats, but may be expanded in the future.

## Features

* Fetch player stats using the Hypixel API
* Display BedWars statistics such as wins, losses, and FKDR
* Simple command-based usage through Discord
* Basic caching system to reduce unnecessary API requests
* Rate limit awareness to stay within API limits

## Usage

The bot responds to commands to retrieve player stats.

Example:

* `/stats <uuid>` → returns player statistics

All data is fetched only when a command is used.

## API Usage

This project uses the Hypixel API to retrieve player data. Requests are made on demand and responses are cached to reduce API usage.

The bot does not perform any continuous polling, automated tracking, or background data collection.

## Purpose

This project was created to learn how to work with external APIs and integrate them into a simple Discord-based tool. It is intended for small-scale personal use and is not a public service.


