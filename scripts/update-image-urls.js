// Load environment variables from .env file
require('dotenv').config(); // Ensure you have a .env file in your project root

// Direct access to environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const LOCAL_API_DOMAIN = process.env.LOCAL_API_DOMAIN; // e.g. http://localhost:34321
const LOCAL_CLIENT_DOMAIN = process.env.LOCAL_CLIENT_DOMAIN; // e.g. http://localhost:3000
const PROD_DOMAIN = process.env.PROD_DOMAIN; // e.g. https://yourproject.supabase.co

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client with service role key
function getServiceSupabase() {
  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function updateImageUrls() {
  const supabase = getServiceSupabase();

  console.log('Starting image URL update process...');
  console.log(`Using Supabase URL: ${SUPABASE_URL}`);
  console.log('SUPABASE_URL:', SUPABASE_URL);
  console.log('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.slice(0, 8) + '...' : 'undefined');

  // Update menu background images
  const { data: menus, error: menusError } = await supabase
    .from('menus')
    .select('id, background_image_url');

  if (menusError) {
    console.error('Error fetching menus:', menusError);
    return;
  }

  console.log(`Found ${menus.length} menus to check for background images`);

  for (const menu of menus) {
    if (menu.background_image_url && menu.background_image_url.includes(LOCAL_API_DOMAIN)) {
      const newUrl = menu.background_image_url.replace(
        LOCAL_API_DOMAIN,
        PROD_DOMAIN
      );

      console.log(`Updating menu ${menu.id} background image:`);
      console.log(`  From: ${menu.background_image_url}`);
      console.log(`  To:   ${newUrl}`);

      const { error } = await supabase
        .from('menus')
        .update({ background_image_url: newUrl })
        .eq('id', menu.id);

      if (error) {
        console.error(`Error updating menu ${menu.id}:`, error);
      } else {
        console.log(`  ✓ Updated successfully`);
      }
    }
  }

  // Update menu logo images
  const { data: menusWithLogos, error: logosError } = await supabase
    .from('menus')
    .select('id, logo_image_url');

  if (logosError) {
    console.error('Error fetching menus for logos:', logosError);
    return;
  }

  console.log(`Found ${menusWithLogos.length} menus to check for logos`);

  for (const menu of menusWithLogos) {
    if (menu.logo_image_url && menu.logo_image_url.includes(LOCAL_API_DOMAIN)) {
      const newUrl = menu.logo_image_url.replace(
        LOCAL_API_DOMAIN,
        PROD_DOMAIN
      );

      console.log(`Updating menu ${menu.id} logo:`);
      console.log(`  From: ${menu.logo_image_url}`);
      console.log(`  To:   ${newUrl}`);

      const { error } = await supabase
        .from('menus')
        .update({ logo_image_url: newUrl })
        .eq('id', menu.id);

      if (error) {
        console.error(`Error updating menu logo ${menu.id}:`, error);
      } else {
        console.log(`  ✓ Updated successfully`);
      }
    }
  }

  // Update dish images
  const { data: dishes, error: dishesError } = await supabase
    .from('dishes')
    .select('id, picture_url');

  if (dishesError) {
    console.error('Error fetching dishes:', dishesError);
    return;
  }

  console.log(`Found ${dishes.length} dishes to check`);

  for (const dish of dishes) {
    if (dish.picture_url && dish.picture_url.includes(LOCAL_CLIENT_DOMAIN)) {
      const newUrl = dish.picture_url.replace(
        LOCAL_CLIENT_DOMAIN,
        PROD_DOMAIN
      );

      console.log(`Updating dish ${dish.id}:`);
      console.log(`  From: ${dish.picture_url}`);
      console.log(`  To:   ${newUrl}`);

      const { error } = await supabase
        .from('dishes')
        .update({ picture_url: newUrl })
        .eq('id', dish.id);

      if (error) {
        console.error(`Error updating dish ${dish.id}:`, error);
      } else {
        console.log(`  ✓ Updated successfully`);
      }
    }
  }

  console.log('Image URLs update process completed!');
}

updateImageUrls().catch(error => {
  console.error('Script failed with error:', error);
  process.exit(1);
});