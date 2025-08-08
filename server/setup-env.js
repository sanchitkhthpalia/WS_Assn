const fs = require('fs');
const path = require('path');

const envContent = `JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Passw0rd!
ADMIN_NAME=Admin User
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created successfully!');
  console.log('📁 Location:', envPath);
} catch (error) {
  console.error('❌ Error creating environment file:', error.message);
  console.log('📝 Please create a .env file manually in the server directory with the following content:');
  console.log('\n' + envContent);
}
