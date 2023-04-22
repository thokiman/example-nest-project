var dbConfig = {
    synchronize:false,
    migrations: ['migrations/*.js'],
    cli: {
        migrationsDir : 'migrations'
    }
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js'],
        })
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun:true,
            keepConnectionAlive: true,
        })
        break;
    case 'production':
        Object.assign(dbConfig, {
            type:'postgresm',
            url: process.env.DATABASE_URL,
            migrationsRun:true,
            entities: ['**/*.js'],
            ssl: {
                rejectUnauhorized:false
            }
        })
    default:
        throw new Error('unknown environment')
};

module.exports = dbConfig;