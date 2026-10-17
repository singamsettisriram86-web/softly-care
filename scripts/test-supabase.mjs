import { createClient } from '@supabase/supabase-js';

const url = 'https://tvhfborktuqtavuxaied.supabase.co';
const key = 'sb_publishable_VOuxUDTGV-Pq8FASL9L4Bw_-0C292Pv';

const client = createClient(url, key);

async function test() {
  try {
    const { data, error } = await client.from('families').select('*').limit(1);
    console.log('Result:', { data, error });
  } catch (e) {
    console.error('Exception:', e);
  }
}

test();
