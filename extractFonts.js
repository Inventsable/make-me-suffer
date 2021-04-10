const fs = require("fs");
const path = require("path");

async function init() {
  const data = fs.readFileSync(
    `${path.resolve("./")}/src/assets/fontsheet.txt`,
    {
      encoding: "utf-8",
    }
  );
  let MATCHES = data.match(/url\(.*ttf\)/gm);
  let matchList = MATCHES.map((match) => {
    return match.replace(/^url\(/, "").replace(/\)$/, "");
  });
  fs.writeFileSync(
    `${path.resolve("./")}/fontSheet.json`,
    JSON.stringify(matchList)
  );
  console.log("DONE");
}

init();
