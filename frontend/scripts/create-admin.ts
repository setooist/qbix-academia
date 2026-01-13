import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  const adminEmail = 'admin@qbixacademia.com';
  const adminPassword = 'QbixAdmin2024!';
  const adminName = 'System Administrator';

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: adminName,
        },
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });

        if (signInError) {
          return;
        }

        await updateAdminRole(signInData.user.id);
        return;
      }
      throw authError;
    }

    if (authData.user) {
      await updateAdminRole(authData.user.id);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

async function updateAdminRole(userId: string) {
  const { error } = await supabase.rpc('promote_to_admin', {
    user_id: userId
  });

  if (error) {
    console.error('Error promoting to admin:', error.message);
  }
}
createAdminUser();