const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Set up sharding
    const setupSharding = async () => {
      try {
        // Access the admin database to enable sharding
        const adminDb = mongoose.connection.db.admin();

        // Enable sharding on the database (replace 'yourDatabaseName' with the actual name of your database)
        const enableShardingResult = await adminDb.command({ enableSharding: 'yourDatabaseName' });
        console.log('Sharding enabled:', enableShardingResult);

        // Shard the 'transactions' collection based on 'userId'
        const shardCollectionResult = await adminDb.command({
          shardCollection: 'yourDatabaseName.transactions', // Full collection name
          key: { userId: 1 } // Shard key; ensure it’s indexed in the schema
        });
        console.log('Collection sharded:', shardCollectionResult);
      } catch (error) {
        console.error('Error setting up sharding:', error);
      }
    };

    // Call the sharding setup function after a successful connection
    await setupSharding();

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
