import { verifyToken } from "npm:@clerk/backend";

const x = verifyToken("fake-token", { secretKey: "fake-key" });
console.log(x);
