// Import the exported functions
import { searchImages } from './nasaApi.js';

console.log("main loaded");

async function runTest() {
    try {
        const data = await searchImages('nebula');
        console.log('--- NASA API Result ---');
        console.log(`Total Items Found: ${data.collection?.metadata?.total_hits || 0}`);
        console.log('First Item Title:', data.collection?.items?.[0]?.data?.[0]?.title);
        console.log('Full Data Object:', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Execute the test
runTest();


