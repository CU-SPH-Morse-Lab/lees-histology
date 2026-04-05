import fs from "fs";
import Papa from "papaparse";

const csvFile = fs.readFileSync("SlideMetadata.csv", "utf8");

const parsed = Papa.parse(csvFile, {
  header: true,
  skipEmptyLines: true
});

const cleaned = parsed.data.map(row => ({
  ID: row.ID,
  Title: row.Title,
  Description: row.Description,

  metadata: {
    Owner: row.Owner,
    Month: row.Month,
    Day: Number(row.Day),
    Year: Number(row.Year),
    Tissue: row.Tissue,
    System: row.System,
    Stain: row.Stain,
    Magnification: row.Magnification,
    tags: row.Tags ? row.Tags.split(",").map(t => t.trim()) : []
  },

  media: {
    Image_URL: row.Image_URL,
    Thumb_URL: row.Thumb_URL,
    DZI_URL: row.DZI_URL
  },

  Active: row.Active === "TRUE"
}));

fs.writeFileSync(
  "slides.json",
  JSON.stringify(cleaned, null, 2)
);

console.log("You have successfully generated slides.json!");