const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();
const supabase = createClient(
  'https://pwlbowhzyxqvihiygnlh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bGJvd2h6eXhxdmloaXlnbmxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE3ODk5NywiZXhwIjoyMDg0NzU0OTk3fQ.Eo_TEFo247ZQrrW4pHlYIpmdEXTzPVWIuGw5T_BPug4'
);

async function createProfiles() {
  try {
    console.log('Fetching all users from Supabase Auth...');
    
    // Get all users from Supabase auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    
    console.log(`Found ${users.length} users in auth`);
    
    for (const user of users) {
      console.log(`\nProcessing user: ${user.email} (${user.id})`);
      
      // Check if profile exists
      const existingProfile = await prisma.profiles.findUnique({
        where: { id: user.id }
      });
      
      if (existingProfile) {
        console.log('  ✓ Profile already exists');
        continue;
      }
      
      // Create profile
      const profile = await prisma.profiles.create({
        data: {
          id: user.id,
          updatedAt: new Date(),
          username: user.email?.split('@')[0] || 'user',
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
          email: user.email || '',
        }
      });
      
      console.log('  ✓ Profile created:', profile);
    }
    
    console.log('\n✅ All profiles created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createProfiles();
