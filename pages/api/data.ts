import fs from 'fs';
import path from 'path';

// Path to the JSON file
const dataFilePath = path.join(process.cwd(), 'data.json');
// Helper function to read the JSON file
const readDataFromFile = () => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
};

// Helper function to write data to the JSON file
const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Data written to file successfully');
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Log the incoming request data
    console.log('Incoming request body:', req.body);

    // Read the existing data from the JSON file
    const existingData = readDataFromFile();

    // Get the new data from the request body
    const { city, country, temperature, humidity, pm25, co2 } = req.body;

    // Create a new data entry with weather and air quality data
    const newEntry = { 
      city, 
      country, 
      temperature, 
      humidity, 
      pm25,    // Adding PM2.5 data
      co2,     // Adding CO2 data
      timestamp: new Date() 
    };

    // Append the new entry to the existing data
    existingData.push(newEntry);

    // Write the updated data back to the JSON file
    writeDataToFile(existingData);

    res.status(201).json({ message: 'Data stored successfully', data: newEntry });
  } else if (req.method === 'GET') {
    // Read and return the data from the JSON file
    const storedData = readDataFromFile();
    res.status(200).json({ data: storedData });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

