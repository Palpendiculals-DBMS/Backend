const uuid = require("uuid");

console.log(uuid.v4());

const id = uuid.v4().replace(/-/g, "");
console.log(id);
