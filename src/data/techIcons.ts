export interface TechIcon {
  icon: string;
  label: string;
}

export const techIcons: TechIcon[] = [
  // Programming Languages
  { icon: "simple-icons:javascript", label: "JavaScript" },
  { icon: "simple-icons:typescript", label: "TypeScript" },
  { icon: "simple-icons:python", label: "Python" },
  { icon: "simple-icons:go", label: "Go" },
  { icon: "simple-icons:php", label: "PHP" },

  // Web Frameworks & Libraries
  { icon: "simple-icons:react", label: "React" },
  { icon: "simple-icons:vuedotjs", label: "Vue.js" },
  { icon: "simple-icons:nextdotjs", label: "Next.js" },
  { icon: "simple-icons:remix", label: "Remix" },
  { icon: "simple-icons:astro", label: "Astro" },
  { icon: "simple-icons:express", label: "Express" },
  { icon: "simple-icons:fastify", label: "Fastify" },
  { icon: "simple-icons:fastapi", label: "FastAPI" },
  { icon: "simple-icons:flask", label: "Flask" },
  { icon: "simple-icons:django", label: "Django" },

  // CSS & Styling
  { icon: "simple-icons:tailwindcss", label: "Tailwind CSS" },
  { icon: "simple-icons:bootstrap", label: "Bootstrap" },
  { icon: "simple-icons:sass", label: "Sass" },
  { icon: "simple-icons:less", label: "Less" },
  { icon: "simple-icons:stylus", label: "Stylus" },
  { icon: "simple-icons:postcss", label: "PostCSS" },
  { icon: "simple-icons:styledcomponents", label: "Styled Components" },
  { icon: "simple-icons:mui", label: "Material-UI" },
  { icon: "simple-icons:chakraui", label: "Chakra UI" },
  { icon: "simple-icons:antdesign", label: "Ant Design" },
  { icon: "simple-icons:bulma", label: "Bulma" },
  { icon: "simple-icons:semanticuireact", label: "Semantic UI React" },

  // Build Tools & Bundlers
  { icon: "simple-icons:vite", label: "Vite" },
  { icon: "simple-icons:webpack", label: "Webpack" },
  { icon: "simple-icons:turborepo", label: "Turborepo" },
  { icon: "simple-icons:nx", label: "Nx" },
  { icon: "simple-icons:babel", label: "Babel" },
  { icon: "simple-icons:eslint", label: "ESLint" },
  { icon: "simple-icons:prettier", label: "Prettier" },

  // Runtime & Platforms
  { icon: "simple-icons:nodedotjs", label: "Node.js" },
  { icon: "simple-icons:deno", label: "Deno" },
  { icon: "simple-icons:bun", label: "Bun" },

  // Databases
  { icon: "simple-icons:mongodb", label: "MongoDB" },
  { icon: "simple-icons:postgresql", label: "PostgreSQL" },
  { icon: "simple-icons:mysql", label: "MySQL" },
  { icon: "simple-icons:sqlite", label: "SQLite" },
  { icon: "simple-icons:redis", label: "Redis" },
  { icon: "simple-icons:elasticsearch", label: "Elasticsearch" },
  { icon: "simple-icons:firebase", label: "Firebase" },
  { icon: "simple-icons:supabase", label: "Supabase" },
  { icon: "simple-icons:prisma", label: "Prisma" },
  { icon: "simple-icons:drizzle", label: "Drizzle" },
  { icon: "simple-icons:neo4j", label: "Neo4j" },
  { icon: "simple-icons:cockroachlabs", label: "CockroachDB" },

  // Cloud & Infrastructure
  { icon: "simple-icons:amazonaws", label: "AWS" },
  { icon: "simple-icons:googlecloud", label: "Google Cloud" },
  { icon: "simple-icons:vercel", label: "Vercel" },
  { icon: "simple-icons:netlify", label: "Netlify" },
  { icon: "simple-icons:cloudflare", label: "Cloudflare" },
  { icon: "simple-icons:digitalocean", label: "DigitalOcean" },
  { icon: "simple-icons:heroku", label: "Heroku" },
  { icon: "simple-icons:render", label: "Render" },
  { icon: "simple-icons:docker", label: "Docker" },
  { icon: "simple-icons:kubernetes", label: "Kubernetes" },
  { icon: "simple-icons:githubactions", label: "GitHub Actions" },

  // Version Control
  { icon: "simple-icons:git", label: "Git" },
  { icon: "simple-icons:github", label: "GitHub" },

  // Testing
  { icon: "simple-icons:jest", label: "Jest" },
  { icon: "simple-icons:vitest", label: "Vitest" },
  { icon: "simple-icons:cypress", label: "Cypress" },
  { icon: "simple-icons:selenium", label: "Selenium" },
  { icon: "simple-icons:mocha", label: "Mocha" },
  { icon: "simple-icons:puppeteer", label: "Puppeteer" },

  // Design Tools
  { icon: "simple-icons:figma", label: "Figma" },
  { icon: "simple-icons:adobexd", label: "Adobe XD" },
  { icon: "simple-icons:sketch", label: "Sketch" },
  { icon: "simple-icons:canva", label: "Canva" },

  // CMS & Content
  { icon: "simple-icons:wordpress", label: "WordPress" },
  { icon: "simple-icons:contentful", label: "Contentful" },
  { icon: "simple-icons:sanity", label: "Sanity" },
  { icon: "simple-icons:strapi", label: "Strapi" },

  // Desktop
  { icon: "simple-icons:electron", label: "Electron" },

  // API & Backend
  { icon: "simple-icons:graphql", label: "GraphQL" },
  { icon: "simple-icons:postman", label: "Postman" },
  { icon: "simple-icons:swagger", label: "Swagger" },

  // Real-time & WebSockets
  { icon: "simple-icons:socketdotio", label: "Socket.io" },

  // Authentication & Security
  { icon: "simple-icons:auth0", label: "Auth0" },
  { icon: "simple-icons:passport", label: "Passport" },

  // Monitoring & Analytics
  { icon: "simple-icons:sentry", label: "Sentry" },

  // Payment
  { icon: "simple-icons:stripe", label: "Stripe" },

  // Documentation
  { icon: "simple-icons:readthedocs", label: "Read the Docs" },
  { icon: "simple-icons:docusaurus", label: "Docusaurus" },

  // Package Managers
  { icon: "simple-icons:npm", label: "npm" },
  { icon: "simple-icons:yarn", label: "Yarn" },
  { icon: "simple-icons:pnpm", label: "pnpm" },

  // HTML & Markup
  { icon: "simple-icons:html5", label: "HTML5" },
  { icon: "simple-icons:css3", label: "CSS3" },
  { icon: "simple-icons:markdown", label: "Markdown" },
  { icon: "simple-icons:pug", label: "Pug" },

  // Operating Systems
  { icon: "simple-icons:linux", label: "Linux" },
  { icon: "simple-icons:apple", label: "macOS" },
  { icon: "simple-icons:ubuntu", label: "Ubuntu" },
  { icon: "simple-icons:debian", label: "Debian" },

  // Other Popular Tools & Services
  { icon: "simple-icons:amazon", label: "Amazon" },
  { icon: "simple-icons:shopify", label: "Shopify" },
  { icon: "simple-icons:woo", label: "WooCommerce" },
];
