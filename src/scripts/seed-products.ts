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
  price: number; // Stored directly as double precision
  discount_price: number | null; // Stored directly as double precision, optional
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

// Updated getAnimalCategory: removed 'Other' fallback, defaults to 'Dogs'
const getAnimalCategory = (productName: string): string => {
  const lowerCaseName = productName.toLowerCase();
  if (lowerCaseName.includes('dog')) return 'Dogs';
  if (lowerCaseName.includes('cat')) return 'Cats';
  if (lowerCaseName.includes('bird')) return 'Birds';
  if (lowerCaseName.includes('fish')) return 'Fish';
  return 'Dogs'; // Default to 'Dogs' if no specific animal keyword is found
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

    let productsToInsert: ProductToInsert[] = records.map((row) => {
      const productId = uuidv4(); // Always generate a new UUID for the product ID
      const imageUrl = row.image_url ? row.image_url.split('~')[0] : 'https://via.placeholder.com/400';
      const basePrice = parseFloat(row.price) || 0;
      const description = row.description || row.about_item || row.name;
      const category = getAnimalCategory(row.name); // Use product name for categorization
      const stock = 100; // Hardcode stock to 100 for all products
      console.log(`Mapping product: ${row.name}, Stock: ${stock}, Category: ${category}`);

      return {
        id: productId, // Use the generated UUID
        name: row.name,
        category: category,
        price: basePrice, // Store directly
        discount_price: null, // No discount price in CSV
        description: description,
        image_url: imageUrl,
        stock: stock,
        url: row.url || null,
        asin: row.asin || null, // Keep original asin for reference
        currency: row.currency || 'INR',
        brand: row.brand || null,
        overview: row.overview ? JSON.parse(row.overview.replace(/\\'/g, "'")) : null,
        about_item: row.about_item || null,
        specifications: row.specifications ? JSON.parse(row.specifications.replace(/\\'/g, "'")) : null,
        uniq_id: row.uniq_id || null, // Keep original uniq_id for reference
        scraped_at: row.scraped_at || null,
      };
    });

    // Check if any 'Fish' products were found from CSV
    const hasFishProducts = productsToInsert.some(p => p.category === 'Fish');

    if (!hasFishProducts) {
      console.log('No fish products found in CSV. Adding sample fish products.');
      const sampleFishProducts: ProductToInsert[] = [
        {
          id: uuidv4(),
          name: 'Tropical Fish Food Flakes',
          category: 'Fish',
          price: 150.00,
          discount_price: null,
          description: 'High-quality flakes for all tropical fish. Enhances color and vitality.',
          image_url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          stock: 50,
          url: null, asin: null, currency: 'INR', brand: 'AquaLife', overview: null, about_item: null, specifications: null, uniq_id: null, scraped_at: null,
        },
        {
          id: uuidv4(),
          name: 'Aquarium Gravel Cleaner',
          category: 'Fish',
          price: 499.00,
          discount_price: null,
          description: 'Easy-to-use gravel cleaner for maintaining a pristine aquarium.',
          image_url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          stock: 30,
          url: null, asin: null, currency: 'INR', brand: 'CleanTank', overview: null, about_item: null, specifications: null, uniq_id: null, scraped_at: null,
        },
        {
          id: uuidv4(),
          name: 'Betta Fish Tank Decor',
          category: 'Fish',
          price: 299.00,
          discount_price: null,
          description: 'Safe and beautiful decor for betta fish tanks. Provides hiding spots.',
          image_url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          stock: 40,
          url: null, asin: null, currency: 'INR', brand: 'FishyDecor', overview: null, about_item: null, specifications: null, uniq_id: null, scraped_at: null,
        },
      ];
      productsToInsert = [...productsToInsert, ...sampleFishProducts];
    }

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

    // Explicitly update stock for all products to 100 after insertion
    console.log('Ensuring all products have stock set to 100...');
    const { error: updateStockError } = await supabase
      .from('products')
      .update({ stock: 100 })
      .neq('id', uuidv4()); // Update all rows

    if (updateStockError) {
      console.error('Error updating stock for all products:', updateStockError);
    } else {
      console.log('All products stock set to 100.');
    }

    console.log('Product seeding complete!');
  } catch (error: any) {
    console.error('Error during product seeding:', error.message);
  }
};

seedProducts();