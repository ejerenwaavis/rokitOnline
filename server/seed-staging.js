const mongoose = require('mongoose');
require('dotenv').config();

const prodUri = process.env.MONGODB_URI;
const stagingUrl = new URL(prodUri);
stagingUrl.pathname = '/rokitmedia_v4_staging';
const stagingUri = stagingUrl.toString();

async function run() {
  console.log('Connecting to production DB (source)...');
  const prodConn = await mongoose.createConnection(prodUri).asPromise();
  console.log(`Connected to prod DB: ${prodConn.name}`);

  console.log('Connecting to staging DB (destination)...');
  const stagingConn = await mongoose.createConnection(stagingUri).asPromise();
  console.log(`Connected to staging DB: ${stagingConn.name}`);

  const collectionsToCopy = [
    'services',
    'portfolios',
    'projects',
    'tutorials',
    'clients',
    'mediabatchsessions',
  ];

  for (const colName of collectionsToCopy) {
    const docs = await prodConn.collection(colName).find({}).toArray();
    console.log(`Copying ${docs.length} documents from ${colName}...`);
    if (docs.length > 0) {
      await stagingConn.collection(colName).deleteMany({});
      await stagingConn.collection(colName).insertMany(docs);
    }
  }

  // Copy admin users so developers can log into admin on staging
  const admins = await prodConn.collection('users').find({ role: 'admin' }).toArray();
  console.log(`Copying ${admins.length} admin users to staging...`);
  if (admins.length > 0) {
    await stagingConn.collection('users').deleteMany({});
    await stagingConn.collection('users').insertMany(admins);
  }

  console.log('\nStaging DB successfully seeded and isolated!');
  await prodConn.close();
  await stagingConn.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
