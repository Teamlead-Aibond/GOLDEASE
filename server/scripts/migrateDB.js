const { MongoClient } = require('mongodb')

const SOURCE_DB = 'digigold'
const TARGET_DB = 'goldease'
const MONGO_URL = 'mongodb://localhost:27017'

async function migrate() {
  const client = new MongoClient(MONGO_URL)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const sourceDb = client.db(SOURCE_DB)
    const targetDb = client.db(TARGET_DB)

    const collections = await sourceDb.listCollections().toArray()

    if (collections.length === 0) {
      console.log(`No collections found in "${SOURCE_DB}" database. Nothing to migrate.`)
      return
    }

    console.log(`Found ${collections.length} collections in "${SOURCE_DB}":`)
    console.log(collections.map(c => `  - ${c.name}`).join('\n'))
    console.log('')

    for (const col of collections) {
      const name = col.name
      const sourceCol = sourceDb.collection(name)
      const targetCol = targetDb.collection(name)

      const count = await sourceCol.countDocuments()

      if (count === 0) {
        console.log(`  ${name}: 0 documents (skipped)`)
        continue
      }

      const docs = await sourceCol.find({}).toArray()
      await targetCol.insertMany(docs)
      console.log(`  ${name}: ${count} documents copied`)
    }

    // Copy indexes
    for (const col of collections) {
      const name = col.name
      const sourceCol = sourceDb.collection(name)
      const targetCol = targetDb.collection(name)

      const indexes = await sourceCol.indexes()
      for (const idx of indexes) {
        if (idx.name === '_id_') continue
        try {
          const { key, ...options } = idx
          delete options.v
          delete options.ns
          await targetCol.createIndex(key, options)
        } catch (e) {
          // Index may already exist
        }
      }
    }

    console.log('\nMigration complete! All data copied from "digigold" to "goldease".')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  } finally {
    await client.close()
  }
}

migrate()
