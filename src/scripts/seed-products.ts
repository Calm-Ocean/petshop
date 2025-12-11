import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Load environment variables
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for direct database access

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is missing. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface CsvRow {
  url: string;
  asin: string;
  name: string;
  price: string;
  currency: string;
  brand: string;
  image_url: string;
  overview: string;
  about_item: string;
  availability: string;
  description: string;
  specifications: string;
  category: string;
  uniq_id: string;
  scraped_at: string;
}

interface ProductToInsert {
  id: string;
  name: string;
  category: string;
  price: number;
  discount_price: number | null;
  description: string;
  image_url: string | null;
  stock: number;
  url: string | null;
  asin: string | null;
  currency: string | null;
  brand: string | null;
  overview: any | null;
  about_item: string | null;
  specifications: any | null;
  uniq_id: string | null;
  scraped_at: string | null;
}

const getAnimalCategory = (fullCategory: string): string => {
  if (!fullCategory) return 'Other';
  const parts = fullCategory.split('|').map(p => p.trim());
  if (parts.includes('Cats')) return 'Cats';
  if (parts.includes('Dogs')) return 'Dogs';
  if (parts.includes('Birds')) return 'Birds';
  if (parts.includes('Small Animals')) return 'Small Animals';
  if (parts.includes('Fish')) return 'Fish'; // Assuming 'Fish' might appear directly
  return 'Other';
};

const parseStock = (availabilityString: string): number => {
  if (!availabilityString) return 50; // Default stock
  availabilityString = availabilityString.toLowerCase();

  if (availabilityString.includes('in stock')) {
    const match = availabilityString.match(/only (\d+) left in stock/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 100; // High stock for general "in stock"
  }
  if (availabilityString.includes('currently unavailable')) {
    return 0;
  }
  if (availabilityString.includes('dispatched in')) {
    return 50; // Assume reasonable stock for items that dispatch
  }
  return 50; // Default if no specific pattern matched
};

const seedProducts = async () => {
  try {
    // Read the CSV file
    const csvFilePath = path.resolve(__dirname, '../../kartik.csv');
    const fileContent = readFileSync(csvFilePath, { encoding: 'utf-8' });

    // Parse the CSV content
    const records: CsvRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} records in CSV.`);

    // Clear existing products
    console.log('Deleting existing products...');
    const { error: deleteError } = await supabase.from('products').delete().neq('id', uuidv4()); // Delete all rows
    if (deleteError) {
      console.error('Error deleting existing products:', deleteError);
      return;
    }
    console.log('Existing products deleted.');

    const productsToInsert: ProductToInsert[] = records.map((row) => {
      const productId = row.asin || row.uniq_id || uuidv4();
      const imageUrl = row.image_url ? row.image_url.split('~')[0] : 'https://via.placeholder.com/400';
      const price = parseFloat(row.price) || 0;
      const description = row.description || row.about_item || row.name;
      const category = getAnimalCategory(row.category);
      const stock = parseStock(row.availability);

      return {
        id: productId,
        name: row.name,
        category: category,
        price: price,
        discount_price: null, // No discount price in CSV
        description: description,
        image_url: imageUrl,
        stock: stock,
        url: row.url || null,
        asin: row.asin || null,
        currency: row.currency || 'INR',
        brand: row.brand || null,
        overview: row.overview ? JSON.parse(row.overview.replace(/\\'/g, "'")) : null, // Handle single quotes and empty
        about_item: row.about_item || null,
        specifications: row.specifications ? JSON.parse(row.specifications.replace(/\\'/g, "'")) : null, // Handle single quotes and empty
        uniq_id: row.uniq_id || null,
        scraped_at: row.scraped_at || null,
      };
    });

    // Insert products in batches to avoid hitting Supabase rate limits or payload size limits
    const batchSize = 100;
    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToInsert.length / batchSize)}...`);
      const { error: insertError } = await supabase.from('products').insert(batch);
      if (insertError) {
        console.error(`Error inserting batch starting at index ${i}:`, insertError);
        // Continue to next batch or break, depending on desired error handling
      }
    }

    console.log('Product seeding complete!');
  } catch (error: any) {
    console.error('Error during product seeding:', error.message);
  }
};

seedProducts();