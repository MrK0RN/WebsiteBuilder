# Deployment Guide for PlasticDB

This guide covers deploying the plastic materials database application to your own hosting infrastructure.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Web server (Nginx/Apache) or Node.js hosting
- SSL certificate for HTTPS

## Environment Variables

Create a `.env` file in your production environment:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/plasticdb
PGHOST=localhost
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=plasticdb

# Application Configuration
NODE_ENV=production
PORT=3000

# Session Configuration (generate a secure random string)
SESSION_SECRET=your-super-secure-session-secret-here

# Optional: Authentication (if enabling Replit Auth)
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id
REPLIT_DOMAINS=yourdomain.com
```

## Database Setup

1. **Create PostgreSQL Database:**
```sql
CREATE DATABASE plasticdb;
CREATE USER plasticdb_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE plasticdb TO plasticdb_user;
```

2. **Run Database Migrations:**
```bash
npm install
npm run db:push
```

3. **Insert Sample Data:**
The application includes sample materials data that will be automatically available.

## Production Build

1. **Install Dependencies:**
```bash
npm install --production
```

2. **Build Frontend:**
```bash
npm run build
```

## Deployment Options

### Option 1: Traditional VPS/Dedicated Server

1. **Upload Files:**
   - Upload all project files to your server
   - Ensure proper file permissions

2. **Install Dependencies:**
```bash
npm install --production
```

3. **Start Application:**
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server/index.ts --name plasticdb

# Or using systemd
sudo systemctl enable plasticdb
sudo systemctl start plasticdb
```

4. **Nginx Configuration:**
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Docker Deployment

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Create docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/plasticdb
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: plasticdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. **Deploy:**
```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Vercel/Netlify (Frontend + Serverless)
- Deploy frontend as static files
- Use serverless functions for API

#### Heroku
```bash
git init
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git add .
git commit -m "Initial deployment"
git push heroku main
```

#### DigitalOcean App Platform
- Connect your Git repository
- Configure build and run commands
- Add PostgreSQL database

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use secure session secrets
   - Rotate database passwords regularly

2. **Database Security:**
   - Use connection pooling
   - Enable SSL for database connections
   - Regular backups

3. **Application Security:**
   - Keep dependencies updated
   - Use HTTPS only
   - Implement rate limiting

## Performance Optimization

1. **Database Indexing:**
```sql
CREATE INDEX idx_materials_type ON materials(material_type);
CREATE INDEX idx_materials_manufacturer ON materials(manufacturer);
CREATE INDEX idx_materials_tensile ON materials(tensile_strength);
```

2. **Caching:**
   - Implement Redis for session storage
   - Add CDN for static assets
   - Enable gzip compression

3. **Monitoring:**
   - Set up application monitoring
   - Database performance monitoring
   - Error tracking

## Maintenance

1. **Regular Updates:**
   - Update Node.js dependencies
   - Monitor security vulnerabilities
   - Database maintenance

2. **Backups:**
   - Automated database backups
   - Application file backups
   - Recovery testing

## Troubleshooting

Common issues and solutions:

- **Database Connection:** Check connection string and credentials
- **Port Conflicts:** Ensure port 3000 is available or change PORT env var
- **Build Errors:** Clear node_modules and reinstall dependencies
- **Performance:** Check database queries and add indexes as needed

## Support

For technical support or questions about deployment, refer to the application documentation or contact your system administrator.