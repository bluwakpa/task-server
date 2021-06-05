module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // DATABASE_URL: process.env.DATABASE_URL || 'postgresql://bluwakpa@localhost:5432/task',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://dkwyjeqhcmnwov:f04d8247f9a98f1ca0a89aa7aa9ecd37f0ca5170ba06cede34b0d08b58291958@ec2-54-159-175-113.compute-1.amazonaws.com:5432/d6ctlfh0jsfv2c',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/task-test'
  }