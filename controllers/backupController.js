// backupController.js
const { exec } = require('child_process');
const path = require('path');

exports.backupDatabase = async (req, res) => {
  try {
    const backupPath = path.join(__dirname, '../backup', Date.now().toString());
    exec(`mongodump --db yourDatabaseName --out ${backupPath}`, (error) => {
      if (error) throw error;
      res.json({ message: 'Backup successful', path: backupPath });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.restoreDatabase = async (req, res) => {
  try {
    const { backupPath } = req.body;  // Provide path as payload
    exec(`mongorestore --db yourDatabaseName ${backupPath}`, (error) => {
      if (error) throw error;
      res.json({ message: 'Restore successful' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
