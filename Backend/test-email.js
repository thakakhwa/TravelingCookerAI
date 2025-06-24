import dotenv from 'dotenv';
import { sendVerificationEmail } from './utils/email/emailService.js';

// Load environment variables
dotenv.config();

async function testEmail() {
  console.log('🧪 Testing email configuration...\n');
  
  // Check environment variables
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('📧 EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ Email credentials missing!');
    console.log('Add EMAIL_USER and EMAIL_PASSWORD to your .env file');
    process.exit(1);
  }
  
  try {
    const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
    const testUsername = 'Test User';
    const testCode = '123456';
    
    console.log(`\n📤 Sending test email to: ${testEmail}`);
    await sendVerificationEmail(testEmail, testUsername, testCode);
    console.log('✅ Email sent successfully!');
    console.log('📬 Check your inbox for the verification email');
    
  } catch (error) {
    console.error('\n❌ Email test failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Tips to fix authentication errors:');
      console.log('1. Make sure 2-Factor Authentication is enabled on Gmail');
      console.log('2. Use an App Password (not your regular password)');
      console.log('3. Generate App Password: Gmail Settings → Security → App passwords');
    }
  }
  
  process.exit(0);
}

testEmail(); 