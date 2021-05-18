const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const prod = process.env.NODE_ENV !== 'test';

const databaseName = pkg.name + (!prod ? '-test' : '');

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    ssl: prod,
    dialectOptions: prod
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
  }
);
module.exports = db;

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close());
}
