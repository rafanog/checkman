# Checkman

You can use this program to check for *dead links* within a given url and a specified section of it.

## Install dependencies

```bash
cd folder
npm install
```

## Configuration
Open the `.env` file on a text editor, modify the `SCRAPED_SECTION` parameter to the section you want the program to scrape.

## Execute the program
You need to specify the *url* that you want to check and execute it through the node command, E.G:

```bash
node checkman URL_TO_CHECK
```