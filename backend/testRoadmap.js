require('dotenv').config();
const { generateRoadmap } = require('./controllers/hrController');

async function test() {
  try {
    const resumeText = "Experienced software engineer with 5 years in Node.js and React. Built a scalable e-commerce platform and a modern chat application.";
    console.log("Generating roadmap for resume...");
    const result = await generateRoadmap(resumeText);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
