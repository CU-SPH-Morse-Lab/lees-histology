import fs from "fs";
import Papa from "papaparse";

const csvFile = fs.readFileSync("SlideMetadata.csv", "utf8");

const parsed = Papa.parse(csvFile, {
  header: true,
  skipEmptyLines: true
});

let errors = [];

const cleaned = parsed.data
    .filter((row, index) => {
    const rowNum = index + 1;
    if (!row.ID) {
      errors.push(`Row ${rowNum}: Missing ID`);
      return false;
    }
    if (!row.Title) {
      errors.push(`Row ${rowNum}: Missing Title`);
      return false;
    }
    if (!row.Active) {
      errors.push(`Row ${rowNum}: Missing Active flag`);
      return false;
    }
    return true;
  })
  .map(row => ({
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

if (errors.length > 0) {
  console.error("CSV VALIDATION ERRORS:");
  errors.forEach(e => console.error(e));
  process.exit(1);
}

fs.writeFileSync(
  "slides.json",
  JSON.stringify(cleaned, null, 2)
);

console.log("You have successfully generated slides.json!");
